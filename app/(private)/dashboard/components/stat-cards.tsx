import { DASHBOARD_STATS } from "@/mockData";
import {
  Users,
  Scale,
  Wallet,
  TrendingUpDown,
  CalendarClock,
  ArrowUpRight,
} from "lucide-react";

const icons = {
  "Total Active Clients": Users,
  "Outstanding Balance": Scale,
  "Total Amount": Wallet,
  "PAR Rate": TrendingUpDown,
  "Total Amount of Past Due Account": CalendarClock,
};

const colorStyles = {
  blue: {
    iconBg: "bg-[#E4E9FF]",
    iconText: "text-[#4F46E5]",
    badge: "bg-[#E4E9FF] text-[#4F46E5]",
  },
  red: {
    iconBg: "bg-[#FFE3EE]",
    iconText: "text-[#E0509A]",
    badge: "bg-[#FFE3EE] text-[#E0509A]",
  },
  emerald: {
    iconBg: "bg-[#E2F6ED]",
    iconText: "text-[#059669]",
    badge: "bg-[#E2F6ED] text-[#059669]",
  },
  purple: {
    iconBg: "bg-[#EFEAFF]",
    iconText: "text-[#6C4CF1]",
    badge: "bg-[#EFEAFF] text-[#6C4CF1]",
  },
  amber: {
    iconBg: "bg-[#FFF3DC]",
    iconText: "text-[#b0700f]",
    badge: "bg-[#FFF3DC] text-[#b0700f]",
  },
  rose: {
    iconBg: "bg-[#FFE3EE]",
    iconText: "text-[#E0509A]",
    badge: "bg-[#FFE3EE] text-[#E0509A]",
  },
};

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      {DASHBOARD_STATS.map((stat) => {
        const Icon = icons[stat.label as keyof typeof icons] || Users;

        const style =
          colorStyles[stat.color as keyof typeof colorStyles] ||
          colorStyles.blue;

        return (
          <div
            key={stat.id}
            className="bg-white rounded-2xl border border-[#191924]/8 shadow-cloud-card hover:shadow-cloud-card-hover transition-all p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#9a9ab0] leading-tight max-w-[75%]">
                  {stat.label}
                </p>
                <div
                  className={`
                    flex items-center justify-center
                    w-9 h-9
                    rounded-xl
                    shrink-0
                    shadow-sm
                    ${style.iconBg}
                    ${style.iconText}
                  `}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <h3 className="text-3xl font-extrabold tracking-tight text-[#191924]">
                  {stat.value}
                </h3>
              </div>
            </div>

            <div className="border-t border-[#F1EEF8] mt-4 pt-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11.5px] text-[#5a5a70] font-medium leading-tight">
                  {stat.remarks}
                </p>

                {stat.change && (
                  <span
                    className={`
                      inline-flex
                      items-center
                      gap-0.5
                      px-2
                      py-0.5
                      rounded-full
                      text-[10.5px]
                      font-bold
                      whitespace-nowrap
                      ${style.badge}
                    `}
                  >
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.change}
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
