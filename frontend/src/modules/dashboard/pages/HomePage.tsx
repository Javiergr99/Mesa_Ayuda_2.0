export default function HomePage() {
  return (
    <section className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
      {["Go Live", "Recorded video", "Group the product", "See Statistics"].map(
        (title) => (
          <button
            key={title}
            type="button"
            className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="h-8 w-8 rounded-md bg-slate-200" />
            <div className="mt-3 font-semibold text-slate-800">{title}</div>
            <div className="text-[13px] text-slate-500">Acción rápida</div>
          </button>
        )
      )}
    </section>
  );
}