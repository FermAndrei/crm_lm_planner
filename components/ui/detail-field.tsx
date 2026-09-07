interface DetailFieldProps {
  label: string;
  value: React.ReactNode;
}

export default function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div>
      <dt className="text-[10.5px] font-bold uppercase tracking-wider text-[#9a9ab0]">
        {label}
      </dt>
      <dd className="mt-0.5 font-mono text-xs font-semibold text-[#191924]">{value}</dd>
    </div>
  );
}
