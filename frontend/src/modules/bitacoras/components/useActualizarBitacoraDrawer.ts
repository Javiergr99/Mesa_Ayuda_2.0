import { useEffect, useState } from "react";

import {
  INITIAL_ACTUALIZAR_BITACORA_FORM,
  REGISTRO_CODE_TO_LABEL,
  createFormFromBitacora,
  nullIfEmpty,
} from "./actualizarBitacoraDrawer.constants";

import type {
  ActualizarBitacoraDrawerProps,
  ActualizarBitacoraForm,
  ArchivoBitacoraItem,
  EstatusBitacora,
  RegistroLabel,
} from "./actualizarBitacoraDrawer.types";

function getErrorMessage(
  error: unknown,
  fallbackMessage: string,
) {
  if (typeof error !== "object" || error === null) {
    return fallbackMessage;
  }

  const candidate = error as {
    message?: string;
    response?: {
      data?: {
        detail?: string;
      };
    };
  };

  return (
    candidate.response?.data?.detail ||
    candidate.message ||
    fallbackMessage
  );
}

export default function useActualizarBitacoraDrawer({
  bitacora,
  onClose,
  onUpdated,
  listBitacoraFiles,
  uploadBitacoraFiles,
  deleteBitacoraFile,
  updateBitacora,
}: ActualizarBitacoraDrawerProps) {
  const [form, setForm] =
    useState<ActualizarBitacoraForm>(
      INITIAL_ACTUALIZAR_BITACORA_FORM,
    );

  const [existingFiles, setExistingFiles] = useState<
    ArchivoBitacoraItem[]
  >([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [deletingFileId, setDeletingFileId] =
    useState<number | null>(null);
  const [anexos, setAnexos] = useState<File[]>([]);
  const [msgFile, setMsgFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!bitacora) {
      return;
    }

    const currentBitacora = bitacora;

    setForm(createFormFromBitacora(currentBitacora));
    setExistingFiles([]);
    setAnexos([]);
    setMsgFile(null);

    let active = true;

    async function loadFiles() {
      setLoadingFiles(true);

      try {
        const files = await listBitacoraFiles(
          currentBitacora.id,
        );

        if (active) {
          setExistingFiles(files || []);
        }
      } catch (loadError) {
        console.error(
          "Error cargando archivos de bitácora",
          loadError,
        );
      } finally {
        if (active) {
          setLoadingFiles(false);
        }
      }
    }

    void loadFiles();

    return () => {
      active = false;
    };
  }, [bitacora, listBitacoraFiles]);

  function changeField<
    K extends keyof ActualizarBitacoraForm,
  >(
    key: K,
    value: ActualizarBitacoraForm[K],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  }

  function addAnexos(selectedFiles: File[]) {
    setAnexos((currentFiles) => [
      ...currentFiles,
      ...selectedFiles,
    ]);
  }

  function removeAnexo(targetFile: File) {
    setAnexos((currentFiles) =>
      currentFiles.filter(
        (file) => file !== targetFile,
      ),
    );
  }

  async function handleDeleteExistingFile(
    fileId: number,
  ) {
    if (!bitacora) {
      return;
    }

    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este archivo? Esta acción no se puede deshacer.",
    );

    if (!confirmed) {
      return;
    }

    setDeletingFileId(fileId);

    try {
      await deleteBitacoraFile(bitacora.id, fileId);

      setExistingFiles((currentFiles) =>
        currentFiles.filter(
          (file) => file.id !== fileId,
        ),
      );
    } catch (deleteError) {
      console.error(deleteError);

      window.alert(
        getErrorMessage(
          deleteError,
          "No se pudo eliminar el archivo. Inténtalo de nuevo.",
        ),
      );
    } finally {
      setDeletingFileId(null);
    }
  }

  async function handleSave() {
    if (!bitacora || saving) {
      return;
    }

    setSaving(true);

    try {
      const registroLabel =
        REGISTRO_CODE_TO_LABEL[form.registro] ??
        (bitacora.tipo_registro as RegistroLabel);

      const payload = {
        nombre: form.nombre,
        primer_apellido: nullIfEmpty(
          form.primer_apellido,
        ),
        segundo_apellido: nullIfEmpty(
          form.segundo_apellido,
        ),
        correo: nullIfEmpty(form.correo),
        telefono: nullIfEmpty(form.telefono),
        estado: form.estado,
        instancia: nullIfEmpty(form.instancia),
        fecha: form.fecha || bitacora.fecha,
        hora:
          form.hora ||
          (bitacora.hora || "").slice(0, 5),
        tipo_caso:
          form.tipo || bitacora.tipo_caso,
        atendido_por:
          form.atendido_por ||
          bitacora.atendido_por,
        observaciones: nullIfEmpty(
          form.observaciones,
        ),
        estatus:
          form.estatus ||
          (bitacora.estatus as EstatusBitacora),
        tipo_registro: registroLabel,
      };

      const updated = await updateBitacora(
        bitacora.id,
        payload,
      );

      if (anexos.length > 0 || msgFile) {
        const formData = new FormData();

        anexos.forEach((file) => {
          formData.append("files", file);
        });

        if (msgFile) {
          formData.append("files", msgFile);
        }

        await uploadBitacoraFiles(
          bitacora.id,
          formData,
        );
      }

      onUpdated?.(updated);
      onClose();
    } catch (saveError) {
      console.error(saveError);

      window.alert(
        getErrorMessage(
          saveError,
          "No se pudieron guardar los cambios de la bitácora.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  return {
    form,
    existingFiles,
    loadingFiles,
    deletingFileId,
    anexos,
    msgFile,
    saving,
    changeField,
    addAnexos,
    removeAnexo,
    setMsgFile,
    handleDeleteExistingFile,
    handleSave,
  };
}
