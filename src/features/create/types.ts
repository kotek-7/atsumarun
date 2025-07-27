// 選択状態を含む、フロント用の日付候補の型
export interface DateOptionWithUI {
  id: string;
  date: string; // 日付の文字列（例: "2023-10-01"）
  time: string; // 任意の時間の文字列（例: "14:00", "1限"）
  selected: boolean; // 選択状態
  timeFocused?: boolean; // 時間入力欄がフォーカスされているかどうか（オプション）
}
