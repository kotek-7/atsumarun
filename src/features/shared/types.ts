export interface DateOption {
  date: string;
  time?: string;
}

export type ViewMode = "home" | "create-event" | "join-event" | "results";

export interface EventData {
  title: string;
  description: string;
  dateOptions: DateOption[];
}

export interface ParticipantData {
  name: string;
  availableOptions: number[];
  message: string;
}
