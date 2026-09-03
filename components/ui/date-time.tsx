import { Calendar, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function DateAndTime() {
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set the initial time on the client
    setCurrentDateTime(new Date());

    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  return (
    <>
      <div className="hidden items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 lg:flex">
        {currentDateTime && (
          <>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-emerald-600" />

              <span className="text-xs font-medium text-gray-700">
                {formatDate(currentDateTime)}
              </span>
            </div>

            <div className="h-4 w-px bg-gray-300" />

            <div className="flex items-center gap-2">
              <Clock size={14} className="text-emerald-600" />

              <span className="font-mono text-xs font-bold text-gray-700">
                {formatTime(currentDateTime)}
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
}
