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

// 参加状態の型定義
export type ParticipationStatus = "available" | "maybe" | "unavailable";

// 参加者の回答情報
export interface ParticipantResponse {
  name: string;
  status: ParticipationStatus;
}

// 結果表示用の日程オプション
export interface DateOptionResult {
  date: string;
  time?: string;
  participants: ParticipantResponse[];
}

export interface ParticipantData {
  name: string;
  availableOptions: number[];
  message: string;
}
