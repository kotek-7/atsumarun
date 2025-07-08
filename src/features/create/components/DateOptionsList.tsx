"use client";

import { DateOption } from "@/features/shared/types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface DateOptionsListProps {
  dateOptions: DateOption[];
  selectedDateOptionIndexes: number[];
  onDateOptionClick: (index: number, event: React.MouseEvent) => void;
  onRemoveDateOption: (index: number) => void;
  onTimeChange: (index: number, time: string) => void;
  onDateChange?: (index: number, date: string) => void;
  selectRef: React.RefObject<HTMLSelectElement | null>;
  onSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onReorderDateOptions: (startIndex: number, endIndex: number) => void;
}

export const DateOptionsList = ({
  dateOptions,
  selectedDateOptionIndexes,
  onDateOptionClick,
  onRemoveDateOption,
  onTimeChange,
  onDateChange,
  selectRef,
  onSelectChange,
  onReorderDateOptions,
}: DateOptionsListProps) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    if (startIndex !== endIndex) {
      onReorderDateOptions(startIndex, endIndex);
    }
  };
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
                          onDateOptionClick(index, e);
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
                            onRemoveDateOption(index);
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
};
