import { Mail, Paperclip, X } from "lucide-react";

type FileChipItem = {
  id: string | number;
  name: string;
};

type Props = {
  items?: FileChipItem[];
  onRemove?: (id: string | number) => void;
  icon?: "paperclip" | "mail";
  className?: string;
  emptyText?: string;
};

export default function FileChips({
  items = [],
  onRemove = () => {},
  icon = "paperclip",
  className = "",
  emptyText = "",
}: Props) {
  if (items.length === 0) {
    return emptyText ? (
      <div className={`mt-2 text-[12px] text-slate-500 ${className}`}>
        {emptyText}
      </div>
    ) : null;
  }

  const Icon = icon === "mail" ? Mail : Paperclip;

  return (
    <div className={`mt-2 flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <span
          key={item.id}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-[12px] shadow-sm"
        >
          <Icon className="h-3.5 w-3.5 text-slate-500" />

          <span className="max-w-[220px] truncate" title={item.name}>
            {item.name}
          </span>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-slate-400 hover:text-rose-500"
            aria-label={`Eliminar ${item.name}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </span>
      ))}
    </div>
  );
}