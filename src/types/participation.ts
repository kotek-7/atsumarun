// 参加状態の型定義
export type ParticipationStatus = "available" | "maybe" | "unavailable";

// 参加者の回答情報
export interface ParticipantResponse {
  name: string;
  status: ParticipationStatus;
}
