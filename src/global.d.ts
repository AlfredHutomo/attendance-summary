declare type LogRow = [string, string, "C/In" | "C/Out"];

declare type Log = {
  name: string;
  date: string;
  logType: "C/In" | "C/Out";
};

declare type Attendance = {
  dayName: string;
  in: string;
  out: string;
  overtimeMinute: number;
};
