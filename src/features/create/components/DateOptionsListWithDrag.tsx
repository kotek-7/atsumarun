"use client";

import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { DateOption } from "@/features/shared/types";

interface DateOptionsListProps {
  dateOptions: DateOption[];
  setDateOptions: (dateOptions: DateOption[]) => void;
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

export const DateOptionsListWithDrag = forwardRef<
  DateOptionsListRef,
  DateOptionsListProps
>(
  (
    {
      dateOptions,
      setDateOptions,
      onRemoveDateOption,
      onTimeChange,
      onDateChange,
      onSelectionChange,
    },
    ref
  ) => {
    const [selectedDateOptionIndexes, setSelectedDateOptionIndexes] = useState<
      number[]
    >([]);
    const selectRef = useRef<HTMLSelectElement | null>(null);

    // 選択状態の変更を親に通知
    useEffect(() => {
      onSelectionChange(selectedDateOptionIndexes);
    }, [selectedDateOptionIndexes, onSelectionChange]);

    const handleDragEnd = (result: DropResult) => {
      if (!result.destination) return;

      const startIndex = result.source.index;
      const endIndex = result.destination.index;

      if (startIndex === endIndex) return;

      // 配列の並び替え処理をここで実行
      const newOptions = Array.from(dateOptions);
      const [reorderedItem] = newOptions.splice(startIndex, 1);
      newOptions.splice(endIndex, 0, reorderedItem);

      setDateOptions(newOptions);

      // 選択状態も調整
      const newSelectedIndexes = selectedDateOptionIndexes.map((oldIndex) => {
        if (oldIndex === startIndex) {
          return endIndex;
        } else if (startIndex < endIndex) {
          if (oldIndex > startIndex && oldIndex <= endIndex) {
            return oldIndex - 1;
          }
        } else {
          if (oldIndex >= endIndex && oldIndex < startIndex) {
            return oldIndex + 1;
          }
        }
        return oldIndex;
      });

      setSelectedDateOptionIndexes(newSelectedIndexes);
    };

    const handleSelectChange = (
      event: React.ChangeEvent<HTMLSelectElement>
    ) => {
      const selectedOptions = Array.from(event.target.selectedOptions);
      const selectedIndexes = selectedOptions.map((option) =>
        parseInt(option.value)
      );
      setSelectedDateOptionIndexes(selectedIndexes);
    };

    const handleDateOptionClick = (index: number, event: React.MouseEvent) => {
      const selectElement = selectRef.current;
      if (!selectElement || !selectElement.options) return;

      const option = selectElement.options[index];
      if (!option) return;

      if (event.shiftKey) {
        const lastSelected =
          selectedDateOptionIndexes[selectedDateOptionIndexes.length - 1] ?? 0;
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
      const selectedIndexes = selectedOptions.map((opt) => parseInt(opt.value));
      setSelectedDateOptionIndexes(selectedIndexes);
    };

    const handleRemoveDateOptionInternal = (index: number) => {
      // 親コンポーネントの削除処理を呼び出し
      onRemoveDateOption(index);

      // 選択状態も調整
      setSelectedDateOptionIndexes((prev) =>
        prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i))
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

      setSelectedDateOptionIndexes(
        Array.from({ length: dateOptions.length }, (_, i) => i)
      );
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

      const sortedIndexes = [...selectedDateOptionIndexes].sort(
        (a, b) => b - a
      );

      sortedIndexes.forEach((index) => {
        onRemoveDateOption(index);
      });

      setSelectedDateOptionIndexes([]);
    };

    // 外部からアクセスできるように参照を公開
    useImperativeHandle(ref, () => ({
      selectAll,
      deselectAll,
      removeSelectedOptions,
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="date-options">
            {(provided) => (
              <div
                className="space-y-2"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {dateOptions.map((option, index) => (
                  <Draggable
                    key={`option-${index}`}
                    draggableId={`option-${index}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`mb-3 flex items-center gap-2 rounded p-2 transition-colors ${
                          snapshot.isDragging
                            ? "border border-blue-300 bg-blue-100 shadow-lg"
                            : selectedDateOptionIndexes.includes(index)
                              ? "border border-blue-200 bg-blue-50"
                              : "border border-transparent hover:bg-gray-50"
                        }`}
                      >
                        {/* ドラッグハンドル */}
                        <div
                          {...provided.dragHandleProps}
                          className="flex h-6 w-6 cursor-grab items-center justify-center text-gray-400 hover:text-gray-600 active:cursor-grabbing"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                          </svg>
                        </div>

                        {/* 選択インジケーター */}
                        <div
                          className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded border-2 ${
                            selectedDateOptionIndexes.includes(index)
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-300"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDateOptionClick(index, e);
                          }}
                        >
                          {selectedDateOptionIndexes.includes(index) && (
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

                        {/* 入力フィールド */}
                        <div className="flex flex-1 items-center gap-3">
                          <input
                            type="date"
                            value={option.date}
                            onChange={(e) => {
                              e.stopPropagation();
                              onDateChange?.(index, e.target.value);
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
                              handleRemoveDateOptionInternal(index);
                            }}
                            className="px-2 py-1 text-red-600 hover:text-red-800"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
);

DateOptionsListWithDrag.displayName = "DateOptionsListWithDrag";
