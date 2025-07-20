"use client";

import { useState } from "react";

interface CalendarProps {
  onDateSelect: (date: string) => void;
  selectedDates: string[];
}

export const Calendar = ({ onDateSelect, selectedDates }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const monthNames = [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ];

  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

  const handleDateClick = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onDateSelect(dateString);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isToday = (day: number) => {
    const date = new Date(year, month, day);
    return date.toDateString() === today.toDateString();
  };

  const isPast = (day: number) => {
    const date = new Date(year, month, day);
    return date < today && !isToday(day);
  };

  const isSelected = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return selectedDates.includes(dateString);
  };

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        カレンダーから日付を選択
      </h3>
      <p className="mb-4 block text-sm font-medium text-gray-700">
        選択中の候補日時に一括で日付を適用します。
      </p>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="rounded p-1 hover:bg-gray-100"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold text-gray-900">
          {year}年 {monthNames[month]}
        </h3>
        <button
          type="button"
          onClick={goToNextMonth}
          className="rounded p-1 hover:bg-gray-100"
        >
          →
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {dayNames.map((dayName) => (
          <div
            key={dayName}
            className="py-2 text-center text-sm font-medium text-gray-500"
          >
            {dayName}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div key={index} className="aspect-square">
            {day && (
              <button
                type="button"
                onClick={() => handleDateClick(day)}
                disabled={isPast(day)}
                className={`flex h-full w-full items-center justify-center rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  isToday(day)
                    ? "bg-blue-600 font-semibold text-white hover:bg-blue-700"
                    : isSelected(day)
                      ? "border-2 border-green-500 bg-green-100 font-semibold text-green-800 hover:bg-green-200"
                      : isPast(day)
                        ? "cursor-not-allowed text-gray-400"
                        : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
