import CountUp from "@/components/ui/count-up";
import { DASHBOARD_STATS } from "@/mockData";

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      {DASHBOARD_STATS.map((stat) => {
        return (
          <div
            key={stat.id}
            className="bg-white shadow-xs rounded-md border border-gray-200/70 shadow-cloud-card hover:shadow-cloud-card-hover transition-all p-5 flex flex-col justify-between"
          >
            <div className="flex flex-col h-full justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A3A2A2] leading-tight">
                {stat.label}
              </p>

              <div className="mt-2 flex items-baseline">
                <CountUp
                  from={0}
                  to={stat.value}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text text-3xl font-bold tracking-tight text-[#1E6E25]"
                  delay={0}
                />

                {stat.suffix && (
                  <span className="ml-1 text-3xl font-bold tracking-tight text-[#1E6E25]">
                    {stat.suffix}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
