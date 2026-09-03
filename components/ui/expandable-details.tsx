"use client";

import DetailField from "./detail-field";

interface DetailItem {
  label: string;
  value: React.ReactNode;
}

interface ExpandableDetailsProps {
  title?: string;
  fields: DetailItem[];
}

export default function ExpandableDetails({
  title = "Details",
  fields,
}: ExpandableDetailsProps) {
  return (
    <>
      <h3 className="mb-4 text-base font-bold uppercase tracking-wide text-[#05582E]">
        {title}
      </h3>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4 xl:grid-cols-6">
        {fields.map((field) => (
          <DetailField
            key={field.label}
            label={field.label}
            value={field.value}
          />
        ))}
      </dl>
    </>
  );
}
