"use client";

import { cn } from "@/lib/utils";
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
        <div className="rounded-lg bg-white px-5 py-4">
          {title && (
            <h3 className="mb-4 text-base font-bold uppercase tracking-wide text-[#05582E]">
              {title}
            </h3>
          )}

          {fields && fields.length > 0 && (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4 xl:grid-cols-6">
              {fields.map((field) => (
                <div key={field.label}>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    {field.label}
                  </dt>

                  <dd className="mt-0.5 font-mono text-sm text-gray-900">
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
