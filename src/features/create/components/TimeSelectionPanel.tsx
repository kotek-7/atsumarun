"use client";

import { useState, useEffect } from "react";

interface TimeSelectionPanelProps {
  selectedDateIndexes: number[];
  onTimeChange: (time: string) => void;
}

export const TimeSelectionPanel = ({ selectedDateIndexes, onTimeChange }: TimeSelectionPanelProps) => {
  const [customTimes, setCustomTimes] = useState<string[]>([]);
  const [newTime, setNewTime] = useState("");

  // Load custom times from localStorage on component mount
  useEffect(() => {
    const savedTimes = localStorage.getItem('atsumarun-custom-times');
    if (savedTimes) {
      try {
        const parsedTimes = JSON.parse(savedTimes);
        if (Array.isArray(parsedTimes)) {
          setCustomTimes(parsedTimes);
        }
      } catch (error) {
        console.error('Failed to parse saved custom times:', error);
      }
    }
  }, []);

  // Save custom times to localStorage whenever customTimes changes
  useEffect(() => {
    localStorage.setItem('atsumarun-custom-times', JSON.stringify(customTimes));
  }, [customTimes]);

  const allTimes = customTimes.sort();

  const addCustomTime = () => {
    const trimmedTime = newTime.trim();
    if (trimmedTime && !allTimes.includes(trimmedTime)) {
      setCustomTimes(prev => [...prev, trimmedTime]);
      setNewTime("");
    }
  };

  const removeCustomTime = (timeToRemove: string) => {
    setCustomTimes(prev => prev.filter(time => time !== timeToRemove));
  };

  if (selectedDateIndexes.length === 0) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm time-selection-panel">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">時刻選択</h3>
        <p className="text-gray-500 text-sm text-center py-8">
          左側の候補日時を選択してください
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm time-selection-panel">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        時刻選択 
        {selectedDateIndexes.length > 0 && (
          <span className="text-sm text-gray-600 font-normal ml-2">
            ({selectedDateIndexes.length}件選択中)
          </span>
        )}
      </h3>
      
      {allTimes.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            時刻を選択
          </label>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {allTimes.map((time) => (
              <div key={time} className="flex items-center gap-2">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                  onClick={() => onTimeChange(time)}
                  className="flex-1 px-3 py-2 text-sm rounded border text-left bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  {time}
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                  onClick={() => removeCustomTime(time)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                  title="削除"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`${allTimes.length > 0 ? 'border-t' : ''} pt-4`}>
        <label htmlFor="add-time-input" className="block text-sm font-medium text-gray-700 mb-2">
          時刻を追加
        </label>
        <form onSubmit={(e) => { e.preventDefault(); addCustomTime(); }} className="flex gap-2">
          <input
            id="add-time-input"
            type="text"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="例: 9:00, 午前中, ランチタイム"
          />
          <button
            type="submit"
            onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            追加
          </button>
        </form>
        
      </div>
    </div>
  );
};