import { ParticipantResponse } from "@/types/participation";

export interface Results {
  eventTitle: string;
  dateOptions: DateOptionResult[];
}

// 結果表示用の日程オプション
export interface DateOptionResult {
  date: string;
  time?: string;
  participants: ParticipantResponse[];
}
