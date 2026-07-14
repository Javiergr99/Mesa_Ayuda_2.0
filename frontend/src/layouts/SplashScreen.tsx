export default function SplashScreen() {
  return (
    <div className="grid h-screen place-content-center bg-slate-50 text-slate-600">
      <div className="animate-pulse text-center">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-transparent" />
        <div className="text-sm">Validando sesión…</div>
      </div>
    </div>
  );
}