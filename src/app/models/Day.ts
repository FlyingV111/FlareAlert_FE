export interface Day {
  name: string;
  active: boolean;
  startTime: string;
  endTime: string;
  exceptions: Exception[];
}

export type Exception = {
  selectedDay: string;
  exceptionStartTime: string;
  exceptionEndTime: string;
}
