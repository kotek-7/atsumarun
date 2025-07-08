"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DateOptionWithUI } from "@/features/create/types";

interface DateOptionsListProps {
  dateOptions: DateOptionWithUI[];
  setDateOptions: React.Dispatch<React.SetStateAction<DateOptionWithUI[]>>;
}

// SortableItemコンポーネント
function SortableDateItem({
  option,
  index,
  isSelected,
  onItemClick,
  onCheckboxClick,
  onDateChange,
  onTimeChange,
  onDelete,
}: {
  option: DateOptionWithUI;
  index: number;
  isSelected: boolean;
  onItemClick: (index: number, event: React.MouseEvent) => void;
  onCheckboxClick: (index: number, event: React.MouseEvent) => void;
  onDateChange: (index: number, value: string) => void;
  onTimeChange: (index: number, value: string) => void;
  onDelete: (index: number) => void;
}) {
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
          ? "border border-blue-300 bg-blue-100 shadow-lg"
          : isSelected
            ? "border border-blue-200 bg-blue-50"
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
            isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300"
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
          <input
            type="date"
            value={option.date}
            onChange={(e) => {
              e.stopPropagation();
              onDateChange(index, e.target.value);
            }}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <input
            type="text"
            value={option.time || ""}
            onChange={(e) => {
              e.stopPropagation();
              onTimeChange(index, e.target.value);
            }}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="時間（オプション）"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(index);
            }}
            className="px-2 py-1 text-red-600 hover:text-red-800"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}

export const DateOptionsList = ({
  dateOptions,
  setDateOptions,
}: DateOptionsListProps) => {
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setDateOptions((items) => {
        const oldIndex = items.findIndex(
          (item) => item.id === String(active.id)
        );
        const newIndex = items.findIndex((item) => item.id === String(over.id));

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDateChange = (index: number, value: string) => {
    const newDateOptions = dateOptions.map((opt, i) =>
      i === index ? { ...opt, date: value } : opt
    );
    setDateOptions(newDateOptions);
  };

  const handleTimeChange = (index: number, value: string) => {
    const newDateOptions = dateOptions.map((opt, i) =>
      i === index ? { ...opt, time: value } : opt
    );
    setDateOptions(newDateOptions);
  };

  const handleDelete = (index: number) => {
    const newDateOptions = dateOptions.filter((_, i) => i !== index);
    setDateOptions(newDateOptions);
  };

  const items = dateOptions.map((option) => option.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {dateOptions.map((option, index) => (
            <SortableDateItem
              key={option.id}
              option={option}
              index={index}
              isSelected={selectedIndexes.includes(index)}
              onItemClick={handleItemClick}
              onCheckboxClick={handleCheckboxClick}
              onDateChange={handleDateChange}
              onTimeChange={handleTimeChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
