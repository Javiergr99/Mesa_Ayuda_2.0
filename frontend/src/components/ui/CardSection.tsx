import React from "react";

type CardSectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function CardSection({
  title,
  children,
  className = "",
}: CardSectionProps) {
  return (
    <section className={`mb-6 ${className}`}>
      <div className="mb-2 text-[13px] font-medium text-slate-700">{title}</div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        {children}
      </div>
    </section>
  );
}