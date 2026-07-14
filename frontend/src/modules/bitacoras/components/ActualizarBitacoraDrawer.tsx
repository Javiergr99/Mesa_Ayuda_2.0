import ActualizarBitacoraDrawerShell from "./ActualizarBitacoraDrawerShell";
import ActualizarBitacoraFilesSection from "./ActualizarBitacoraFilesSection";
import ActualizarBitacoraFormSections from "./ActualizarBitacoraFormSections";
import useActualizarBitacoraDrawer from "./useActualizarBitacoraDrawer";

import type {
  ActualizarBitacoraDrawerProps,
} from "./actualizarBitacoraDrawer.types";

export default function ActualizarBitacoraDrawer(
  props: ActualizarBitacoraDrawerProps,
) {
  const {
    bitacora,
    loading,
    error,
    onClose,
  } = props;

  const drawer = useActualizarBitacoraDrawer(props);

  if (!bitacora && !loading && !error) {
    return null;
  }

  return (
    <ActualizarBitacoraDrawerShell
      bitacora={bitacora}
      loading={loading}
      error={error}
      saving={drawer.saving}
      onClose={onClose}
      onSave={drawer.handleSave}
    >
      <ActualizarBitacoraFormSections
        form={drawer.form}
        onChange={drawer.changeField}
      />

      <ActualizarBitacoraFilesSection
        existingFiles={drawer.existingFiles}
        loadingFiles={drawer.loadingFiles}
        deletingFileId={drawer.deletingFileId}
        anexos={drawer.anexos}
        msgFile={drawer.msgFile}
        onDeleteExistingFile={
          drawer.handleDeleteExistingFile
        }
        onAddAnexos={drawer.addAnexos}
        onRemoveAnexo={drawer.removeAnexo}
        onMsgFileChange={drawer.setMsgFile}
      />
    </ActualizarBitacoraDrawerShell>
  );
}
