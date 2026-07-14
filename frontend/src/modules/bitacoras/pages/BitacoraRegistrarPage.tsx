import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Info, Mail, Paperclip } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { createBitacora } from "../../../services/bitacoras.service";
import {
  getEstados,
  getTiposCaso,
  getPersonasAtendio,
  getEstatusBitacora,
  getTiposRegistro,
} from "../../../services/catalogos.service";

import PageHeader from "../../../components/ui/PageHeader";
import CardSection from "../../../components/ui/CardSection";
import TextField from "../../../components/ui/TextField";
import TextAreaField from "../../../components/ui/TextAreaField";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import SelectField from "../../../components/ui/SelectField";
import ComboSelectField from "../../../components/ui/ComboSelectField";
import DateField from "../../../components/ui/DateField";
import TimeField from "../../../components/ui/TimeField";
import FileChips from "../../../components/ui/FileChips";

type BitacoraForm = {
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  correo: string;
  telefono: string;
  estado: string;
  instancia: string;
  fecha: string;
  hora: string;
  tipo_caso: string;
  atendido_por: string;
  observaciones: string;
  estatus: string;
  tipo_registro: string;
};

const INITIAL_FORM: BitacoraForm = {
  nombre: "",
  primer_apellido: "",
  segundo_apellido: "",
  correo: "",
  telefono: "",
  estado: "",
  instancia: "",
  fecha: "",
  hora: "",
  tipo_caso: "",
  atendido_por: "",
  observaciones: "",
  estatus: "",
  tipo_registro: "",
};

export default function BitacoraRegistrarPage() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [okMsg, setOkMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [triedSubmit, setTriedSubmit] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [emailFile, setEmailFile] = useState<File | null>(null);

  const [estados, setEstados] = useState<string[]>([]);
  const [tiposCaso, setTiposCaso] = useState<string[]>([]);
  const [personasAtiende, setPersonasAtiende] = useState<string[]>([]);
  const [estatusOpts, setEstatusOpts] = useState<string[]>([]);
  const [tiposRegistro, setTiposRegistro] = useState<string[]>([]);

  const [form, setForm] = useState<BitacoraForm>(INITIAL_FORM);
  const [showConfirm, setShowConfirm] = useState(false);

  const required = useMemo(
    () =>
      [
        "nombre",
        "estado",
        "fecha",
        "hora",
        "tipo_caso",
        "atendido_por",
        "estatus",
        "tipo_registro",
      ] as const,
    []
  );

  const atendidoPorOptions = useMemo(
    () =>
      [...personasAtiende].sort((a, b) =>
        a.localeCompare(b, "es", { sensitivity: "base" })
      ),
    [personasAtiende]
  );

  const formIsDirty = useMemo(() => {
    const anyValue = Object.values(form).some((v) => v.trim().length > 0);
    return anyValue || files.length > 0 || !!emailFile;
  }, [form, files, emailFile]);

  useEffect(() => {
    async function loadCatalogos() {
      try {
        const [
          estadosRes,
          tiposCasoRes,
          personasRes,
          estatusRes,
          tiposRegRes,
        ] = await Promise.all([
          getEstados(),
          getTiposCaso(),
          getPersonasAtendio(),
          getEstatusBitacora(),
          getTiposRegistro(),
        ]);

        setEstados(estadosRes.map((e: any) => e.nombre));
        setTiposCaso(tiposCasoRes.map((e: any) => e.nombre));
        setPersonasAtiende(
          personasRes.map((e: any) => e.nombre_completo ?? e.nombre)
        );
        setEstatusOpts(estatusRes.map((e: any) => e.nombre));
        setTiposRegistro(tiposRegRes.map((e: any) => e.nombre));
      } catch (error) {
        console.error("Error cargando catálogos", error);
        setErrMsg(
          "No se pudieron cargar los catálogos. Intenta de nuevo."
        );
      }
    }

    loadCatalogos();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowConfirm(false);
    }

    document.addEventListener("keydown", onKey);

    if (showConfirm) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = prev;
      };
    }

    return () => document.removeEventListener("keydown", onKey);
  }, [showConfirm]);

  function safeNavigateHome() {
    navigate("/app", { replace: false });
  }

  function onChange<K extends keyof BitacoraForm>(key: K, value: BitacoraForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    const missing = required.filter((key) => !form[key]?.trim());

    if (missing.length > 0) {
      setErrMsg(`Revisa campos requeridos: ${missing.join(", ")}`);
      setOkMsg("");
      return false;
    }

    setErrMsg("");
    return true;
  }

  function onSelectFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prev) => [...prev, ...list]);
    e.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function onSelectEmail(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setEmailFile(file);
    e.target.value = "";
  }

  function onCancelClick() {
    if (formIsDirty) {
      setShowConfirm(true);
      return;
    }
    safeNavigateHome();
  }

  function confirmLeave() {
    setShowConfirm(false);
    safeNavigateHome();
  }

  function onSaveDraftClick() {
    setOkMsg("Borrador guardado (preview).");
    setErrMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) {
      setTriedSubmit(true);
      return;
    }

    setTriedSubmit(false);
    setSaving(true);
    setOkMsg("");
    setErrMsg("");

    try {
      const payload = {
        nombre: form.nombre.trim(),
        primer_apellido: form.primer_apellido.trim() || null,
        segundo_apellido: form.segundo_apellido.trim() || null,
        correo: form.correo.trim() || null,
        telefono: form.telefono.trim() || null,
        estado: form.estado,
        instancia: form.instancia.trim() || null,
        fecha: form.fecha,
        hora: form.hora,
        tipo_caso: form.tipo_caso,
        atendido_por: form.atendido_por,
        observaciones: form.observaciones.trim() || null,
        estatus: form.estatus,
        tipo_registro: form.tipo_registro,
      };

      const res = await createBitacora(payload);

      setOkMsg(`Bitácora registrada correctamente. Folio: ${res.folio}`);
      setErrMsg("");
      setForm(INITIAL_FORM);
      setFiles([]);
      setEmailFile(null);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      console.error(error);
      const detail =
        error?.response?.data?.detail ||
        error?.message ||
        "Ocurrió un error al guardar la bitácora.";
      setErrMsg(detail);
      setOkMsg("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-slate-800">
      <PageHeader
        breadcrumb="Bitácora › Registrar"
        title="Registrar atención"
      />

      <form onSubmit={onSubmit} className="mx-auto max-w-[1200px] px-6 pb-28">
        {okMsg && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-5 w-5" />
            <div>{okMsg}</div>
          </div>
        )}

        {errMsg && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
            <AlertCircle className="mt-0.5 h-5 w-5" />
            <div>{errMsg}</div>
          </div>
        )}

        <CardSection title="Datos de la persona">
          <div className="grid grid-cols-12 gap-4">
            <TextField
              label="Nombre *"
              value={form.nombre}
              onChange={(v) => onChange("nombre", v)}
              className="col-span-12 md:col-span-4"
              placeholder="Nombre"
            />
            <TextField
              label="Primer apellido"
              value={form.primer_apellido}
              onChange={(v) => onChange("primer_apellido", v)}
              className="col-span-12 md:col-span-4"
              placeholder="Primer apellido"
            />
            <TextField
              label="Segundo apellido"
              value={form.segundo_apellido}
              onChange={(v) => onChange("segundo_apellido", v)}
              className="col-span-12 md:col-span-4"
              placeholder="Segundo apellido"
            />
            <TextField
              label="Correo"
              type="email"
              value={form.correo}
              onChange={(v) => onChange("correo", v)}
              className="col-span-12 md:col-span-6"
              placeholder="correo@dominio"
              icon={<Mail className="h-4 w-4 text-slate-400" />}
            />
            <TextField
              label="Teléfono"
              value={form.telefono}
              onChange={(v) => onChange("telefono", v)}
              className="col-span-12 md:col-span-6"
              placeholder="+52 ___ ___ ____"
            />
          </div>
        </CardSection>

        <CardSection title="Ubicación / Institución">
          <div className="grid grid-cols-12 gap-4">
            <SelectField
              label="Estado *"
              value={form.estado}
              onChange={(v) => onChange("estado", v)}
              options={estados}
              className="col-span-12 md:col-span-6"
              placeholder="Selecciona…"
              error={triedSubmit && !form.estado}
            />
            <TextField
              label="Instancia"
              value={form.instancia}
              onChange={(v) => onChange("instancia", v)}
              className="col-span-12 md:col-span-6"
              placeholder="Dependencia / área"
            />
          </div>
        </CardSection>

        <CardSection title="Detalles del caso">
          <div className="grid grid-cols-12 gap-4">
            <DateField
              label="Fecha *"
              value={form.fecha}
              onChange={(v) => onChange("fecha", v)}
              className="col-span-12 md:col-span-3"
              placeholder="dd/mm/aaaa"
              error={triedSubmit && !form.fecha}
            />
            <TimeField
              label="Hora *"
              value={form.hora}
              onChange={(v) => onChange("hora", v)}
              className="col-span-12 md:col-span-3"
              placeholder="hh:mm"
              error={triedSubmit && !form.hora}
            />
            <SelectField
              label="Tipo de caso *"
              value={form.tipo_caso}
              onChange={(v) => onChange("tipo_caso", v)}
              options={tiposCaso}
              className="col-span-12 md:col-span-3"
              placeholder="Selecciona…"
              error={triedSubmit && !form.tipo_caso}
            />
            <ComboSelectField
              label="Atendido por *"
              value={form.atendido_por}
              onChange={(v) => onChange("atendido_por", v)}
              options={atendidoPorOptions}
              className="col-span-12 md:col-span-3"
              placeholder="Busca o selecciona…"
              error={triedSubmit && !form.atendido_por}
            />
            <TextAreaField
              label="Observaciones"
              value={form.observaciones}
              onChange={(v) => onChange("observaciones", v)}
              className="col-span-12"
              placeholder="Notas de la atención…"
              maxLength={1500}
            />
          </div>
        </CardSection>

        <CardSection title="Metadatos">
          <div className="grid grid-cols-12 gap-4">
            <SelectField
              label="Estatus *"
              value={form.estatus}
              onChange={(v) => onChange("estatus", v)}
              options={estatusOpts}
              className="col-span-12 md:col-span-6"
              placeholder="Selecciona…"
              error={triedSubmit && !form.estatus}
            />
            <SelectField
              label="Tipo de registro *"
              value={form.tipo_registro}
              onChange={(v) => onChange("tipo_registro", v)}
              options={tiposRegistro}
              className="col-span-12 md:col-span-6"
              placeholder="Selecciona…"
              error={triedSubmit && !form.tipo_registro}
            />
          </div>
        </CardSection>

        <CardSection title="Archivos">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <label className="mb-1 block text-[13px] text-slate-600">
                Anexos (.pdf, .docx, .xlsx, .csv, .jpg, .png)
              </label>
              <div className="flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 hover:bg-slate-50">
                  <Paperclip className="h-4 w-4 text-slate-500" />
                  <span className="text-[14px]">Elegir archivos</span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={onSelectFiles}
                  />
                </label>
                <span className="text-[12px] text-slate-500">
                  Hasta 10MB por archivo
                </span>
              </div>

              <FileChips
                items={files.map((f, i) => ({ id: i, name: f.name }))}
                onRemove={(id) => removeFile(Number(id))}
              />
            </div>

            <div className="col-span-12">
              <label className="mb-1 block text-[13px] text-slate-600">
                Correo (.MSG)
              </label>
              <div className="flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 hover:bg-slate-50">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span className="text-[14px]">Subir .MSG</span>
                  <input
                    type="file"
                    accept=".msg"
                    className="hidden"
                    onChange={onSelectEmail}
                  />
                </label>
                <span className="text-[12px] text-slate-500">Máx 15MB</span>
              </div>

              <FileChips
                items={emailFile ? [{ id: 0, name: emailFile.name }] : []}
                onRemove={() => setEmailFile(null)}
                icon="mail"
              />
            </div>
          </div>
        </CardSection>

        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200/80 bg-white/90 shadow-[0_-4px_12px_rgba(2,6,23,0.06)] backdrop-blur supports-[backdrop-filter]:bg-white/75">
          <div className="mx-auto flex max-w-[1200px] items-center justify-end gap-3 px-6 py-3">
            <button
              type="button"
              onClick={onCancelClick}
              disabled={showConfirm}
              className="rounded-xl px-3 py-2 text-[14px] text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onSaveDraftClick}
              disabled={showConfirm}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[14px] shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Guardar borrador
            </button>
            <button
              type="submit"
              disabled={saving || showConfirm}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-[14px] text-white shadow-md transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-60"
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={showConfirm}
        title="¿Salir sin guardar?"
        message="Los cambios no guardados se perderán."
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmLeave}
        cancelText="Seguir editando"
        confirmText="Salir sin guardar"
        confirmVariant="danger"
      />

      <div className="mx-auto flex max-w-[1200px] items-start gap-2 px-6 py-8 text-sm text-slate-500">
        <Info className="mt-1 h-4 w-4" />
        <p>
          Este formulario ya envía la información de la bitácora al backend de
          Mesa de Ayuda 2.0 y usa catálogos desde la base de datos.
        </p>
      </div>
    </div>
  );
}