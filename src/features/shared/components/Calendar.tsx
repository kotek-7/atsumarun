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
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月"
  ];
  
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  
  const handleDateClick = (day: number) => {
    const selectedDate = new Date(year, month, day);
    const dateString = selectedDate.toISOString().split('T')[0];
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
    const date = new Date(year, month, day);
    const dateString = date.toISOString().split('T')[0];
    return selectedDates.includes(dateString);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold text-gray-900">
          {year}年 {monthNames[month]}
        </h3>
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          →
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((dayName) => (
          <div key={dayName} className="text-center text-sm font-medium text-gray-500 py-2">
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
                className={`w-full h-full flex items-center justify-center text-sm rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isToday(day)
                    ? 'bg-blue-600 text-white font-semibold'
                    : isSelected(day)
                    ? 'bg-green-100 text-green-800 font-semibold border-2 border-green-500'
                    : isPast(day)
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-blue-50'
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