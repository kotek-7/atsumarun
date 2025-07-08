"use client";

import { useState, useEffect } from "react";

interface TimeSelectionPanelProps {
  selectedDateIndexes: number[];
  onTimeChange: (time: string) => void;
}

export const TimeSelectionPanel = ({
  selectedDateIndexes,
  onTimeChange,
}: TimeSelectionPanelProps) => {
  const [customTimes, setCustomTimes] = useState<string[]>([]);
  const [newTime, setNewTime] = useState("");

  // Load custom times from localStorage on component mount
  useEffect(() => {
    const savedTimes = localStorage.getItem("atsumarun-custom-times");
    if (savedTimes) {
      try {
        const parsedTimes = JSON.parse(savedTimes);
        if (Array.isArray(parsedTimes)) {
          setCustomTimes(parsedTimes);
        }
      } catch (error) {
        console.error("Failed to parse saved custom times:", error);
      }
    }
  }, []);

  // Save custom times to localStorage whenever customTimes changes
  useEffect(() => {
    localStorage.setItem("atsumarun-custom-times", JSON.stringify(customTimes));
  }, [customTimes]);

  const allTimes = customTimes.sort();

  const addCustomTime = () => {
    const trimmedTime = newTime.trim();
    if (trimmedTime && !allTimes.includes(trimmedTime)) {
      setCustomTimes((prev) => [...prev, trimmedTime]);
      setNewTime("");
    }
  };

  const removeCustomTime = (timeToRemove: string) => {
    setCustomTimes((prev) => prev.filter((time) => time !== timeToRemove));
  };

  if (selectedDateIndexes.length === 0) {
    return (
      <div className="time-selection-panel rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">時刻選択</h3>
        <p className="py-8 text-center text-sm text-gray-500">
          左側の候補日時を選択してください
        </p>
      </div>
    );
  }

  return (
    <div className="time-selection-panel rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        時刻選択
        {selectedDateIndexes.length > 0 && (
          <span className="ml-2 text-sm font-normal text-gray-600">
            ({selectedDateIndexes.length}件選択中)
          </span>
        )}
      </h3>

      {allTimes.length > 0 && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            時刻を選択
          </label>
          <div className="max-h-48 space-y-1 overflow-y-auto">
            {allTimes.map((time) => (
              <div key={time} className="flex items-center gap-2">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                  onClick={() => onTimeChange(time)}
                  className="flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  {time}
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                  onClick={() => removeCustomTime(time)}
                  className="rounded p-2 text-red-600 hover:bg-red-50 hover:text-red-800"
                  title="削除"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`${allTimes.length > 0 ? "border-t" : ""} pt-4`}>
        <label
          htmlFor="add-time-input"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          時刻を追加
        </label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addCustomTime();
          }}
          className="flex gap-2"
        >
          <input
            id="add-time-input"
            type="text"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="例: 9:00, 午前中, ランチタイム"
          />
          <button
            type="submit"
            onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
            className="rounded-md bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
          >
            追加
          </button>
        </form>
      </div>
    </div>
  );
};
