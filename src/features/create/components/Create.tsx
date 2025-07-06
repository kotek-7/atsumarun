"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/features/shared/components/Calendar";
import { TimeSelectionPanel } from "@/features/create/components/TimeSelectionPanel";
import { DateOptionsList, DateOptionsListRef } from "@/features/create/components/DateOptionsList";
import { EventData } from "@/features/shared/types";

export default function Create() {
  const router = useRouter();
  const [selectedDateOptionIndexes, setSelectedDateOptionIndexes] = useState<number[]>([]);
  const dateOptionsListRef = useRef<DateOptionsListRef>(null);
  const [eventData, setEventData] = useState<EventData>({
    title: "",
    description: "",
    hostName: "",
    hostEmail: "",
    dateOptions: [],
  });

  const handleAddDateOption = () => {
    setEventData(prev => ({
      ...prev,
      dateOptions: [...prev.dateOptions, { date: "", time: "" }]
    }));
  };

  const handleCalendarDateSelect = (dateString: string) => {
    if (selectedDateOptionIndexes.length > 0) {
      selectedDateOptionIndexes.forEach(index => {
        handleDateOptionChange(index, "date", dateString);
      });
    } else {
      setEventData(prev => ({
        ...prev,
        dateOptions: [...prev.dateOptions, { date: dateString, time: "" }]
      }));
    }
  };

  const handleDateOptionChange = (index: number, field: "date" | "time", value: string) => {
    setEventData(prev => ({
      ...prev,
      dateOptions: prev.dateOptions.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }));
  };

  const handleTimeSelectionChange = (time: string) => {
    console.log("Time selection changed:", time, "for indexes:", selectedDateOptionIndexes);
    selectedDateOptionIndexes.forEach(index => {
      handleDateOptionChange(index, "time", time);
    });
  };

  const handleSelectionChange = (selectedIndexes: number[]) => {
    setSelectedDateOptionIndexes(selectedIndexes);
  };

  const handleRemoveDateOption = (index: number) => {
    setEventData(prev => ({
      ...prev,
      dateOptions: prev.dateOptions.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveSelectedOptions = () => {
    dateOptionsListRef.current?.removeSelectedOptions();
  };

  const handleSelectAll = () => {
    dateOptionsListRef.current?.selectAll();
  };

  const handleDeselectAll = () => {
    dateOptionsListRef.current?.deselectAll();
  };


  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Event created:", eventData);
    router.push("/results");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-8">
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => router.push("/")}
                    className="text-gray-500 hover:text-gray-700 mr-4"
                  >
                    ← 戻る
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900">
                    イベントを作成
                  </h1>
                </div>
          
                <form onSubmit={handleEventSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                イベント名 *
              </label>
              <input
                type="text"
                id="title"
                required
                value={eventData.title}
                onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: チームミーティング"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                説明
              </label>
              <textarea
                id="description"
                rows={3}
                value={eventData.description}
                onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="イベントの詳細を入力してください"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hostName" className="block text-sm font-medium text-gray-700 mb-2">
                  主催者名 *
                </label>
                <input
                  type="text"
                  id="hostName"
                  required
                  value={eventData.hostName}
                  onChange={(e) => setEventData(prev => ({ ...prev, hostName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="山田太郎"
                />
              </div>
              
              <div>
                <label htmlFor="hostEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス *
                </label>
                <input
                  type="email"
                  id="hostEmail"
                  required
                  value={eventData.hostEmail}
                  onChange={(e) => setEventData(prev => ({ ...prev, hostEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  候補日時 *
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleRemoveSelectedOptions}
                    disabled={selectedDateOptionIndexes.length === 0}
                    className="text-red-600 px-2 py-1 rounded hover:text-red-800 hover:bg-red-50 text-sm font-medium disabled:text-gray-400 disabled:hover:text-gray-400 disabled:hover:bg-transparent transition-colors duration-200"
                  >
                    選択した候補を削除
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    disabled={eventData.dateOptions.length === 0}
                    className="text-gray-600 px-2 py-1 rounded hover:text-gray-800 hover:bg-gray-100 text-sm font-medium disabled:text-gray-400 disabled:hover:text-gray-400 disabled:hover:bg-transparent transition-colors duration-200"
                  >
                    全選択
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    disabled={selectedDateOptionIndexes.length === 0}
                    className="text-gray-600 px-2 py-1 rounded hover:text-gray-800 hover:bg-gray-100 text-sm font-medium disabled:text-gray-400 disabled:hover:text-gray-400 disabled:hover:bg-transparent transition-colors duration-200"
                  >
                    選択解除
                  </button>
                  <button
                    type="button"
                    onClick={handleAddDateOption}
                    className="text-blue-600 px-2 py-1 rounded hover:text-blue-800 hover:bg-blue-50 text-sm font-medium transition-colors duration-200"
                  >
                    + 日時を追加
                  </button>
                </div>
              </div>
              
              <DateOptionsList
                ref={dateOptionsListRef}
                dateOptions={eventData.dateOptions}
                onRemoveDateOption={handleRemoveDateOption}
                onTimeChange={(index, time) => handleDateOptionChange(index, "time", time)}
                onDateChange={(index, date) => handleDateOptionChange(index, "date", date)}
                onSelectionChange={handleSelectionChange}
              />
              
              {eventData.dateOptions.length === 0 && (
                <div className="text-gray-500 text-sm py-4 text-center border-2 border-dashed border-gray-300 rounded-md">
                  「日時を追加」をクリックするか、右のカレンダーから日付を選択してください
                </div>
              )}
            </div>


                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                  >
                    イベントを作成する
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">カレンダーから日付を選択</h3>
                <Calendar 
                  onDateSelect={handleCalendarDateSelect} 
                  selectedDates={eventData.dateOptions.map(option => option.date).filter(date => date !== "")}
                />
              </div>
              
              <TimeSelectionPanel
                selectedDateIndexes={selectedDateOptionIndexes}
                onTimeChange={handleTimeSelectionChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}