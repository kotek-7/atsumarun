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
} from "@dnd-kit/sortable";
import { DateOptionWithUI } from "@/features/create/types";
import { DateOptionItem } from "./DateOptionItem";

interface DateOptionsListProps {
  dateOptions: DateOptionWithUI[];
  setDateOptions: React.Dispatch<React.SetStateAction<DateOptionWithUI[]>>;
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

  const handleTimeFocus = (index: number) => {
    const newDateOptions = dateOptions.map((opt, i) =>
      i === index
        ? { ...opt, timeFocused: true }
        : { ...opt, timeFocused: false }
    );
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
            <DateOptionItem
              key={option.id}
              option={option}
              index={index}
              isSelected={selectedIndexes.includes(index)}
              onItemClick={handleItemClick}
              onCheckboxClick={handleCheckboxClick}
              onDateChange={handleDateChange}
              onTimeChange={handleTimeChange}
              onDelete={handleDelete}
              onTimeFocus={handleTimeFocus}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
