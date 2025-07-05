"use client";

import { DateOption } from "@/features/shared/types";

interface DateOptionsListProps {
  dateOptions: DateOption[];
  selectedDateOptionIndexes: number[];
  onDateOptionClick: (index: number, event: React.MouseEvent) => void;
  onRemoveDateOption: (index: number) => void;
  onTimeChange: (index: number, time: string) => void;
  onDateChange?: (index: number, date: string) => void;
  selectRef: React.RefObject<HTMLSelectElement>;
  onSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const DateOptionsList = ({
  dateOptions,
  selectedDateOptionIndexes,
  onDateOptionClick,
  onRemoveDateOption,
  onTimeChange,
  onDateChange,
  selectRef,
  onSelectChange
}: DateOptionsListProps) => {
  return (
    <div>
      {/* 隠れたselect要素（ブラウザ標準の選択動作を担当） */}
      <select
        ref={selectRef}
        multiple
        className="sr-only"
        value={selectedDateOptionIndexes.map(String)}
        onChange={onSelectChange}
      >
        {dateOptions.map((_, index) => (
          <option key={index} value={index}>
            {index}
          </option>
        ))}
      </select>

      {/* 候補日時の表示 */}
      <div className="space-y-2">
        {dateOptions.map((option, index) => (
          <div 
            key={index} 
            className={`flex items-center gap-2 mb-3 p-2 rounded cursor-pointer transition-colors ${
              selectedDateOptionIndexes.includes(index) 
                ? 'bg-blue-50 border-blue-200 border' 
                : 'hover:bg-gray-50 border border-transparent'
            }`}
            onClick={(e) => onDateOptionClick(index, e)}
          >
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
              selectedDateOptionIndexes.includes(index) 
                ? 'bg-blue-600 border-blue-600' 
                : 'border-gray-300'
            }`}>
              {selectedDateOptionIndexes.includes(index) && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1 flex items-center gap-3">
              <input
                type="date"
                value={option.date}
                onChange={(e) => {
                  e.stopPropagation(); // 親のクリックイベントを止める
                  onDateChange?.(index, e.target.value);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                value={option.time || ""}
                onChange={(e) => {
                  e.stopPropagation(); // 親のクリックイベントを止める
                  onTimeChange(index, e.target.value);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="時間（オプション）"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // 親のクリックイベントを止める
                  onRemoveDateOption(index);
                }}
                className="text-red-600 hover:text-red-800 px-2 py-1"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};