"use client";

import { useState } from "react";
import { DateOptionWithUI } from "@/features/create/types";

interface SimpleDateOptionsListProps {
  dateOptions: DateOptionWithUI[];
  setDateOptions: (dateOptions: DateOptionWithUI[]) => void;
}

export const SimpleDateOptionsList = ({
  dateOptions,
  setDateOptions,
}: SimpleDateOptionsListProps) => {
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  );

  // selectedIndexesを内部で計算
  const selectedIndexes = dateOptions
    .map((option, index) => (option.selected ? index : -1))
    .filter((index) => index !== -1);

  const handleItemClick = (index: number, event: React.MouseEvent) => {
    let newSelectedIndexes: number[];

    if (event.shiftKey && lastSelectedIndex !== null) {
      // Shift+Click: 範囲選択
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const rangeIndexes = Array.from(
        { length: end - start + 1 },
        (_, i) => start + i
      );

      // 既存の選択に範囲を追加
      newSelectedIndexes = [...new Set([...selectedIndexes, ...rangeIndexes])];
    } else if (event.ctrlKey || event.metaKey) {
      // Ctrl+Click: トグル選択
      if (selectedIndexes.includes(index)) {
        newSelectedIndexes = selectedIndexes.filter((i) => i !== index);
      } else {
        newSelectedIndexes = [...selectedIndexes, index];
      }
    } else {
      // 通常クリック: 単一選択
      if (selectedIndexes.includes(index) && selectedIndexes.length === 1) {
        // 既に選択されている唯一の項目をクリックした場合は選択解除
        newSelectedIndexes = [];
        setLastSelectedIndex(null);
      } else {
        newSelectedIndexes = [index];
      }
    }

    if (newSelectedIndexes.length > 0) {
      setLastSelectedIndex(index);
    }

    // dateOptionsを直接更新
    const newDateOptions = dateOptions.map((option, i) => ({
      ...option,
      selected: newSelectedIndexes.includes(i),
    }));
    setDateOptions(newDateOptions);
  };

  const handleCheckboxClick = (index: number, event: React.MouseEvent) => {
    event.stopPropagation(); // クリックイベントの伝播を防ぐ
    const newSelectedIndexes = selectedIndexes.includes(index)
      ? selectedIndexes.filter((i) => i !== index) // 選択解除
      : [...selectedIndexes, index]; // 選択追加
    setLastSelectedIndex(index);

    // dateOptionsを直接更新
    const newDateOptions = dateOptions.map((option, i) => ({
      ...option,
      selected: newSelectedIndexes.includes(i),
    }));
    setDateOptions(newDateOptions);
  };

  return (
    <div className="space-y-2">
      {dateOptions.map((option, index) => (
        <div
          key={index}
          onClick={(e) => handleItemClick(index, e)}
          className={`mb-3 flex cursor-pointer items-center gap-2 rounded p-2 transition-colors ${
            selectedIndexes.includes(index)
              ? "border border-blue-200 bg-blue-50"
              : "border border-transparent hover:bg-gray-50"
          }`}
          style={{ userSelect: "none" }}
        >
          {/* 選択インジケーター */}
          <div
            onClick={(e) => {
              handleCheckboxClick(index, e);
            }}
            className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
              selectedIndexes.includes(index)
                ? "border-blue-600 bg-blue-600"
                : "border-gray-300"
            }`}
          >
            {selectedIndexes.includes(index) && (
              <svg
                className="h-3 w-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>

          {/* 日付と時間の編集 */}
          <div className="flex flex-1 items-center gap-3">
            <input
              type="date"
              value={option.date}
              onChange={(e) => {
                e.stopPropagation();
                const newDateOptions = dateOptions.map((opt, i) =>
                  i === index ? { ...opt, date: e.target.value } : opt
                );
                setDateOptions(newDateOptions);
              }}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <input
              type="text"
              value={option.time || ""}
              onChange={(e) => {
                e.stopPropagation();
                const newDateOptions = dateOptions.map((opt, i) =>
                  i === index ? { ...opt, time: e.target.value } : opt
                );
                setDateOptions(newDateOptions);
              }}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="時間（オプション）"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const newDateOptions = dateOptions.filter(
                  (_, i) => i !== index
                );
                setDateOptions(newDateOptions);
              }}
              className="px-2 py-1 text-red-600 hover:text-red-800"
            >
              削除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
