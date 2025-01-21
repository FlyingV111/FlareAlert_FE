export interface Day {
  name: string;
  active: boolean;
  startTime: number | null;
  endTime: number | null;
  dayExceptions: DayExceptions[];
}

export type DayExceptions = {
  selectedDay: string;
  exceptionStartTime: number;
  exceptionEndTime: number;
}
