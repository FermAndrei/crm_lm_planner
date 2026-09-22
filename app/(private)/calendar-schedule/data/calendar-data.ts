export interface CalendarEvent {
  id: string;
  clientName: string;
  accountNo: string;
  amount: number;
  productType: string;
  category: string; // e.g., "Loan Payment"
  date: string; // "YYYY-MM-DD"
  startTime: string; // "08:00 AM"
  endTime: string; // "08:30 AM"
  modalTimeRange?: string; // "08:00 AM - 09:30 AM"
}

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: "evt-1",
    clientName: "TRIUMPH MOTORCYCLE CORPORATION",
    accountNo: "1020006844012760",
    amount: 2500000,
    productType: "SME Working Capital B",
    category: "Loan Payment",
    date: "2026-09-14",
    startTime: "08:00 AM",
    endTime: "08:30 AM",
    modalTimeRange: "08:00 AM - 09:30 AM",
  },
  {
    id: "evt-2",
    clientName: "Santos, Maria C.",
    accountNo: "1020006841289410",
    amount: 125000,
    productType: "SME Working Capital B",
    category: "Loan Payment",
    date: "2026-09-14",
    startTime: "09:30 AM",
    endTime: "10:00 AM",
    modalTimeRange: "09:30 AM - 10:00 AM",
  },
  {
    id: "evt-3",
    clientName: "BALTAZAR, JOEL GALICIA",
    accountNo: "1020006840425304",
    amount: 158500,
    productType: "SME Working Capital B",
    category: "Loan Payment",
    date: "2026-09-14",
    startTime: "11:00 AM",
    endTime: "11:30 AM",
    modalTimeRange: "10:00 AM - 10:30 AM",
  },
  {
    id: "evt-4",
    clientName: "Reyes, Antonio M.",
    accountNo: "1020006849921475",
    amount: 85000,
    productType: "SME Working Capital B",
    category: "Loan Payment",
    date: "2026-09-14",
    startTime: "11:00 AM",
    endTime: "11:30 AM",
    modalTimeRange: "11:00 AM - 11:30 AM",
  },
  {
    id: "evt-5",
    clientName: "BULAON, GEOFFREY BANQUERIGO",
    accountNo: "1020006050586242",
    amount: 75000,
    productType: "SME Working Capital B",
    category: "Loan Payment",
    date: "2026-09-14",
    startTime: "02:00 PM",
    endTime: "02:30 PM",
    modalTimeRange: "02:00 PM - 02:30 PM",
  },
  {
    id: "evt-6",
    clientName: "Dela Cruz, Juan P.",
    accountNo: "1020006843391002",
    amount: 50000,
    productType: "Microfinance Loan",
    category: "Loan Payment",
    date: "2026-09-14",
    startTime: "03:00 PM",
    endTime: "03:30 PM",
    modalTimeRange: "03:00 PM - 03:30 PM",
  },
  {
    id: "evt-7",
    clientName: "Mendoza, Ricardo L.",
    accountNo: "1020006841109923",
    amount: 30000,
    productType: "SME Working Capital B",
    category: "Loan Payment",
    date: "2026-09-14",
    startTime: "03:30 PM",
    endTime: "04:00 PM",
    modalTimeRange: "03:30 PM - 04:00 PM",
  },
  {
    id: "evt-8",
    clientName: "Garcia, Ana Marie S.",
    accountNo: "1020006845501872",
    amount: 20000,
    productType: "Microfinance Loan",
    category: "Loan Payment",
    date: "2026-09-14",
    startTime: "04:00 PM",
    endTime: "04:30 PM",
    modalTimeRange: "04:00 PM - 04:30 PM",
  },
  // Additional events for other days in September 2026 to match Weekly and Monthly mockups
  {
    id: "evt-9",
    clientName: "Alcantara, Rodelio S.",
    accountNo: "1020006842211901",
    amount: 450000,
    productType: "SME Working Capital B",
    category: "Loan Payment",
    date: "2026-09-01",
    startTime: "09:00 AM",
    endTime: "09:30 AM",
    modalTimeRange: "09:00 AM - 09:30 AM",
  },
  {
    id: "evt-10",
    clientName: "Villanueva, Crisanto T.",
    accountNo: "1020006847712349",
    amount: 620000,
    productType: "SME Working Capital B",
    category: "Loan Payment",
    date: "2026-09-09",
    startTime: "10:00 AM",
    endTime: "10:30 AM",
    modalTimeRange: "10:00 AM - 10:30 AM",
  },
  {
    id: "evt-11",
    clientName: "BALTAZAR, JOEL G.",
    accountNo: "1020006840425304",
    amount: 158500,
    productType: "SME Working Capital B",
    category: "Loan Payment",
    date: "2026-09-16",
    startTime: "10:00 AM",
    endTime: "10:30 AM",
    modalTimeRange: "10:00 AM - 10:30 AM",
  },
  {
    id: "evt-12",
    clientName: "BULAON, GEOFFREY B.",
    accountNo: "1020006050586242",
    amount: 75000,
    productType: "SME Working Capital B",
    category: "Loan Payment",
    date: "2026-09-18",
    startTime: "02:00 PM",
    endTime: "02:30 PM",
    modalTimeRange: "02:00 PM - 02:30 PM",
  },
];

export const DAILY_HOURS = [
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

export const WEEKLY_HOURS = [
  "08:00 AM",
  "10:00 AM",
  "12:00 PM",
  "02:00 PM",
  "04:00 PM",
];

export function formatDateToISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatFullDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatCurrency(amount: number): string {
  return `₱ ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatSimpleCurrency(amount: number): string {
  return `₱ ${amount.toLocaleString("en-US")}`;
}

export function getWeekDays(currentDate: Date): Date[] {
  // Monday is day 1, Sunday is day 7
  const date = new Date(currentDate);
  const day = date.getDay();
  // In JS: 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  const diffToMonday = day === 0 ? -6 : 1 - day;
  
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(monday);
    nextDay.setDate(monday.getDate() + i);
    days.push(nextDay);
  }
  return days;
}

export function formatWeekRange(currentDate: Date): string {
  const days = getWeekDays(currentDate);
  const start = days[0];
  const end = days[6];

  const startMonth = start.toLocaleDateString("en-US", { month: "short" });
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}
