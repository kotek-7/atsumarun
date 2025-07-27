export interface DateOption {
  date: string;
  time?: string;
}

export interface EventData {
  title: string;
  description: string;
  dateOptions: DateOption[];
}
