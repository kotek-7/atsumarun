"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateOptionWithUI } from "@/features/create/types";

interface DateOptionItemProps {
  option: DateOptionWithUI;
  index: number;
  isSelected: boolean;
  onItemClick: (index: number, event: React.MouseEvent) => void;
  onCheckboxClick: (index: number, event: React.MouseEvent) => void;
  onDateChange: (index: number, value: string) => void;
  onTimeChange: (index: number, value: string) => void;
  onDelete: (index: number) => void;
}

export function DateOptionItem({
  option,
  index,
  isSelected,
  onItemClick,
  onCheckboxClick,
  onDateChange,
  onTimeChange,
  onDelete,
}: DateOptionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: option.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`mb-3 flex items-center gap-2 rounded p-2 transition-colors ${
        isDragging
          ? "border-primary-300 bg-primary-100 border shadow-lg"
          : isSelected
            ? "border-primary-200 bg-primary-50 border"
            : "border border-transparent hover:bg-gray-50"
      }`}
    >
      {/* ドラッグハンドル */}
      <div
        {...listeners}
        className="mr-2 flex cursor-grab items-center justify-center text-gray-400 hover:text-gray-600 active:cursor-grabbing"
        style={{ touchAction: "none" }}
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
        </svg>
      </div>

      {/* クリック可能エリア */}
      <div
        onClick={(e) => onItemClick(index, e)}
        className="flex flex-1 cursor-pointer items-center gap-2"
        style={{ userSelect: "none" }}
      >
        {/* 選択インジケーター */}
        <div
          onClick={(e) => {
            onCheckboxClick(index, e);
          }}
          className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
            isSelected ? "border-primary-600 bg-primary-600" : "border-gray-300"
          }`}
        >
          {isSelected && (
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
          <div className="flex-1">
            <DatePicker
              selected={option.date ? new Date(option.date) : null}
              onChange={(date: Date | null) => {
                if (date) {
                  const dateString = date.toISOString().split("T")[0];
                  onDateChange(index, dateString);
                }
              }}
              onClickOutside={(e) => e.stopPropagation()}
              onSelect={(e) => e.stopPropagation()}
              className="focus:ring-primary-500 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
              placeholderText="日付を選択"
              dateFormat="yyyy/MM/dd"
              required
            />
          </div>
          <input
            type="text"
            value={option.time || ""}
            onChange={(e) => {
              e.stopPropagation();
              onTimeChange(index, e.target.value);
            }}
            className="focus:ring-primary-500 flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
            placeholder="時間（オプション）"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(index);
            }}
            className="text-danger-600 hover:text-danger-800 px-2 py-1"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
