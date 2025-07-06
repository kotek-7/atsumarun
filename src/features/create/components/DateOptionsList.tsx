"use client";

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { DateOption } from "@/features/shared/types";

interface DateOptionsListProps {
  dateOptions: DateOption[];
  onRemoveDateOption: (index: number) => void;
  onTimeChange: (index: number, time: string) => void;
  onDateChange?: (index: number, date: string) => void;
  onSelectionChange: (selectedIndexes: number[]) => void;
}

export interface DateOptionsListRef {
  selectAll: () => void;
  deselectAll: () => void;
  removeSelectedOptions: () => void;
}

export const DateOptionsList = forwardRef<DateOptionsListRef, DateOptionsListProps>(({
  dateOptions,
  onRemoveDateOption,
  onTimeChange,
  onDateChange,
  onSelectionChange
}, ref) => {
  const [selectedDateOptionIndexes, setSelectedDateOptionIndexes] = useState<number[]>([]);
  const selectRef = useRef<HTMLSelectElement | null>(null);

  // 選択状態の変更を親に通知
  useEffect(() => {
    onSelectionChange(selectedDateOptionIndexes);
  }, [selectedDateOptionIndexes, onSelectionChange]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions);
    const selectedIndexes = selectedOptions.map(option => parseInt(option.value));
    setSelectedDateOptionIndexes(selectedIndexes);
  };

  const handleDateOptionClick = (index: number, event: React.MouseEvent) => {
    const selectElement = selectRef.current;
    if (!selectElement || !selectElement.options) return;

    const option = selectElement.options[index];
    if (!option) return;

    if (event.shiftKey) {
      const lastSelected = selectedDateOptionIndexes[selectedDateOptionIndexes.length - 1] ?? 0;
      const start = Math.min(lastSelected, index);
      const end = Math.max(lastSelected, index);
      
      for (let i = start; i <= end; i++) {
        const optionToSelect = selectElement.options[i];
        if (optionToSelect) {
          optionToSelect.selected = true;
        }
      }
    } else if (event.ctrlKey || event.metaKey) {
      option.selected = !option.selected;
    } else {
      if (option.selected) {
        option.selected = false;
      } else {
        for (let i = 0; i < selectElement.options.length; i++) {
          const optionToUpdate = selectElement.options[i];
          if (optionToUpdate) {
            optionToUpdate.selected = i === index;
          }
        }
      }
    }

    const selectedOptions = Array.from(selectElement.selectedOptions);
    const selectedIndexes = selectedOptions.map(opt => parseInt(opt.value));
    setSelectedDateOptionIndexes(selectedIndexes);
  };

  const handleRemoveDateOptionInternal = (index: number) => {
    onRemoveDateOption(index);
    setSelectedDateOptionIndexes(prev => 
      prev
        .filter(i => i !== index)
        .map(i => i > index ? i - 1 : i)
    );
  };

  const selectAll = () => {
    const selectElement = selectRef.current;
    if (!selectElement || !selectElement.options) return;

    for (let i = 0; i < selectElement.options.length; i++) {
      const option = selectElement.options[i];
      if (option) {
        option.selected = true;
      }
    }

    setSelectedDateOptionIndexes(Array.from({ length: dateOptions.length }, (_, i) => i));
  };

  const deselectAll = () => {
    const selectElement = selectRef.current;
    if (!selectElement || !selectElement.options) return;

    for (let i = 0; i < selectElement.options.length; i++) {
      const option = selectElement.options[i];
      if (option) {
        option.selected = false;
      }
    }

    setSelectedDateOptionIndexes([]);
  };

  const removeSelectedOptions = () => {
    if (selectedDateOptionIndexes.length === 0) return;
    
    const sortedIndexes = [...selectedDateOptionIndexes].sort((a, b) => b - a);
    
    sortedIndexes.forEach(index => {
      onRemoveDateOption(index);
    });
    
    setSelectedDateOptionIndexes([]);
  };

  // 外部からアクセスできるように参照を公開
  useImperativeHandle(ref, () => ({
    selectAll,
    deselectAll,
    removeSelectedOptions
  }));

  return (
    <div>
      {/* 隠れたselect要素（ブラウザ標準の選択動作を担当） */}
      <select
        ref={selectRef}
        multiple
        className="sr-only"
        value={selectedDateOptionIndexes.map(String)}
        onChange={handleSelectChange}
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
            onClick={(e) => handleDateOptionClick(index, e)}
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
                  e.stopPropagation();
                  onDateChange?.(index, e.target.value);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                value={option.time || ""}
                onChange={(e) => {
                  e.stopPropagation();
                  onTimeChange(index, e.target.value);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="時間（オプション）"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveDateOptionInternal(index);
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
});