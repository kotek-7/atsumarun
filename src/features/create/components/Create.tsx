"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/features/shared/components/Calendar";
import { TimeTemplateSelector } from "@/features/create/components/TimeTemplateSelector";
import { DateOptionsList } from "@/features/create/components/DateOptionsList";
import { EventData } from "@/features/shared/types";
import { DateOptionWithUI } from "@/features/create/types";

export default function Create() {
  const router = useRouter();
  const [dateOptions, setDateOptions] = useState<DateOptionWithUI[]>([]);
  const [eventData, setEventData] = useState<EventData>({
    title: "",
    description: "",
    dateOptions: [],
  });

  const handleAddDateOption = () => {
    setDateOptions((prev) => [
      ...prev,
      {
        id: `option-${Date.now()}-${Math.random()}`,
        date: "",
        time: "",
        selected: false,
      },
    ]);
  };

  const handleCalendarDateSelect = (dateString: string) => {
    const selectedIndexes = dateOptions
      .map((option, index) => (option.selected ? index : -1))
      .filter((index) => index !== -1);

    if (selectedIndexes.length > 0) {
      const newOptions = dateOptions.map((option, index) =>
        selectedIndexes.includes(index)
          ? { ...option, date: dateString }
          : option
      );
      setDateOptions(newOptions);
    } else {
      setDateOptions((prev) => [
        ...prev,
        {
          id: `option-${Date.now()}-${Math.random()}`,
          date: dateString,
          time: "",
          selected: false,
        },
      ]);
    }
  };

  const updateSelectedTime = (time: string) => {
    const selectedIndexes = dateOptions
      .map((option, index) => (option.selected ? index : -1))
      .filter((index) => index !== -1);

    console.log(
      "Time selection changed:",
      time,
      "for indexes:",
      selectedIndexes
    );

    const newOptions = dateOptions.map((option, index) =>
      selectedIndexes.includes(index) ? { ...option, time } : option
    );
    setDateOptions(newOptions);
  };

  const handleRemoveSelectedOptions = () => {
    setDateOptions((prev) => prev.filter((option) => !option.selected));
  };

  const handleSelectAll = () => {
    setDateOptions((prev) =>
      prev.map((option) => ({ ...option, selected: true }))
    );
  };

  const handleDeselectAll = () => {
    setDateOptions((prev) =>
      prev.map((option) => ({ ...option, selected: false }))
    );
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Event created:", eventData);
    router.push("/results");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-lg bg-white shadow-md">
              <div className="px-6 py-8">
                <div className="mb-6 flex items-center">
                  <button
                    onClick={() => router.push("/")}
                    className="mr-4 text-gray-500 hover:text-gray-700"
                  >
                    ← 戻る
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900">
                    イベントを作成
                  </h1>
                </div>

                <form onSubmit={handleEventSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      イベント名 *
                    </label>
                    <input
                      type="text"
                      id="title"
                      required
                      value={eventData.title}
                      onChange={(e) =>
                        setEventData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="focus:ring-primary-500 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
                      placeholder="例: チームミーティング"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      説明
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      value={eventData.description}
                      onChange={(e) =>
                        setEventData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="focus:ring-primary-500 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
                      placeholder="イベントの詳細を入力してください"
                    />
                  </div>

                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        候補日時 *
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handleRemoveSelectedOptions}
                          disabled={
                            !dateOptions.some((option) => option.selected)
                          }
                          className="text-danger-600 hover:bg-danger-50 hover:text-danger-800 rounded px-2 py-1 text-sm font-medium transition-colors duration-200 disabled:text-gray-400 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                        >
                          選択した候補を削除
                        </button>
                        <button
                          type="button"
                          onClick={handleSelectAll}
                          disabled={dateOptions.length === 0}
                          className="rounded px-2 py-1 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-800 disabled:text-gray-400 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                        >
                          全選択
                        </button>
                        <button
                          type="button"
                          onClick={handleDeselectAll}
                          disabled={
                            !dateOptions.some((option) => option.selected)
                          }
                          className="rounded px-2 py-1 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-800 disabled:text-gray-400 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                        >
                          選択解除
                        </button>
                        <button
                          type="button"
                          onClick={handleAddDateOption}
                          className="text-primary-600 hover:bg-primary-50 hover:text-primary-800 rounded px-2 py-1 text-sm font-medium transition-colors duration-200"
                        >
                          + 日時を追加
                        </button>
                      </div>
                    </div>

                    <DateOptionsList
                      dateOptions={dateOptions}
                      setDateOptions={setDateOptions}
                    />

                    {dateOptions.length === 0 && (
                      <div className="rounded-md border-2 border-dashed border-gray-300 py-4 text-center text-sm text-gray-500">
                        「日時を追加」をクリックするか、右のカレンダーから日付を選択してください
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 w-full rounded-md px-4 py-2 font-medium text-white transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
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
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  カレンダーから日付を選択
                </h3>
                <Calendar
                  onDateSelect={handleCalendarDateSelect}
                  selectedDates={dateOptions
                    .map((option) => option.date)
                    .filter((date) => date !== "")}
                />
              </div>

              <TimeTemplateSelector
                selectedDateIndexes={dateOptions
                  .map((option, index) => (option.selected ? index : -1))
                  .filter((index) => index !== -1)}
                updateSelectedTime={updateSelectedTime}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
