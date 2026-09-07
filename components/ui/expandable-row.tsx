"use client";

import type { ReactNode } from "react";

export interface ExpandableField {
  label: string;
  value: ReactNode;
}

interface ExpandableRowProps {
  isExpanded: boolean;
  colSpan: number;
  title?: string;
  fields?: ExpandableField[];
  children?: ReactNode;
}

export default function ExpandableRow({
  isExpanded,
  colSpan,
  title,
  fields,
  children,
}: ExpandableRowProps) {
  if (!isExpanded) return null;

  return (
    <tr className="bg-[#F3F9F5]">
      <td colSpan={colSpan} className="px-4 pb-4 pt-2">
        <div className="rounded-2xl border border-[#191924]/8 bg-white p-5 shadow-xs">
          {title && (
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              {title}
            </h3>
          )}

          {fields && fields.length > 0 && (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4 xl:grid-cols-6">
              {fields.map((field) => (
                <div key={field.label}>
                  <dt className="text-[10.5px] font-bold uppercase tracking-wider text-[#9a9ab0]">
                    {field.label}
                  </dt>

                  <dd className="mt-0.5 font-mono text-xs font-semibold text-[#191924]">
                    {field.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {children}
        </div>
      </td>
    </tr>
  );
}
