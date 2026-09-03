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
    topBorder: "bg-blue-600",
    iconBg: "bg-blue-600",
    iconText: "text-white",
    value: "text-blue-900",
    badge: "bg-blue-100 text-blue-700",
  },

  green: {
    topBorder: "bg-[#08783F]",
    iconBg: "bg-[#056B38]",
    iconText: "text-white",
    value: "text-emerald-900",
    badge: "bg-emerald-100 text-emerald-700",
  },

  emerald: {
    topBorder: "bg-teal-600",
    iconBg: "bg-teal-600",
    iconText: "text-white",
    value: "text-teal-900",
    badge: "bg-teal-100 text-teal-700",
  },

  purple: {
    topBorder: "bg-purple-700",
    iconBg: "bg-purple-700",
    iconText: "text-white",
    value: "text-purple-950",
    badge: "bg-purple-100 text-purple-700",
  },

  amber: {
    topBorder: "bg-orange-600",
    iconBg: "bg-orange-600",
    iconText: "text-white",
    value: "text-orange-950",
    badge: "bg-amber-100 text-amber-800",
  },

  rose: {
    topBorder: "bg-rose-600",
    iconBg: "bg-rose-600",
    iconText: "text-white",
    value: "text-rose-950",
    badge: "bg-rose-100 text-rose-700",
  },
};

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
      {DASHBOARD_STATS.map((stat) => {
        const Icon = icons[stat.label as keyof typeof icons] || Users;

        const style =
          colorStyles[stat.color as keyof typeof colorStyles] ||
          colorStyles.blue;

        return (
          <div
            key={stat.id}
            className="relative overflow-hidden bg-white rounded-xl border border-gray-100 shadow-sm"
          >
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 ${style.topBorder}`}
            />

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 leading-tight max-w-[75%]">
                  {stat.label}
                </p>
                <div
                  className={`
                    flex items-center justify-center
                    w-10 h-10
                    rounded-lg
                    shrink-0
                    shadow-md
                    ${style.iconBg}
                    ${style.iconText}
                  `}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="">
                <h3
                  className={`
                    text-3xl
                    font-bold
                    tracking-tight
                    ${style.value}
                  `}
                >
                  {stat.value}
                </h3>
              </div>

              <div className="border-t border-gray-100 mt-2 pt-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-gray-500 leading-tight">
                    {stat.remarks}
                  </p>

                  {stat.change && (
                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-1
                        px-2.5
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        whitespace-nowrap
                        mt-2
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
          </div>
        );
      })}
    </div>
  );
}
