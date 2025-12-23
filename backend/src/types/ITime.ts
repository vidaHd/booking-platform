export interface ITime extends Document {
  companyId: string;
  day: string;
  times: string[]; // Array of time strings like ["9:00", "10:00", "14:00"]
}
