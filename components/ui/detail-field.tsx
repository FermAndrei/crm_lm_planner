interface DetailFieldProps {
  label: string;
  value: React.ReactNode;
}

export default function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-gray-800">{value}</dd>
    </div>
  );
}
