import React from "react";

type PageHeaderProps = {
  breadcrumb: string;
  title: string;
  rightSlot?: React.ReactNode;
  sticky?: boolean;
};

export default function PageHeader({
  breadcrumb,
  title,
  rightSlot,
  sticky = true,
}: PageHeaderProps) {
  return (
    <div
      className={[
        "bg-white border-b border-slate-200 z-20",
        sticky ? "sticky top-0" : "",
      ].join(" ")}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <div>
          <div className="text-[12px] text-slate-500">{breadcrumb}</div>
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        </div>

        {rightSlot ? <div>{rightSlot}</div> : null}
      </div>
    </div>
  );
}