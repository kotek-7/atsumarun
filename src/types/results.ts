import { ParticipantResponse } from "@/types/participation";

// 結果表示用の日程オプション
export interface DateOptionResult {
  date: string;
  time?: string;
  participants: ParticipantResponse[];
}
