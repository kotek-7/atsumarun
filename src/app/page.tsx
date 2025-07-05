"use client";

import { useState, useRef } from "react";
import { Calendar } from "@/features/shared/components/Calendar";
import { TimeSelectionPanel } from "@/features/event-creation/components/TimeSelectionPanel";
import { DateOptionsList } from "@/features/event-creation/components/DateOptionsList";
import { ViewMode, DateOption, EventData, ParticipantData } from "@/features/shared/types";


export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("home");
  const [selectedDateOptionIndexes, setSelectedDateOptionIndexes] = useState<number[]>([]);
  const selectRef = useRef<HTMLSelectElement>(null);
  const [eventData, setEventData] = useState<EventData>({
    title: "",
    description: "",
    hostName: "",
    hostEmail: "",
    dateOptions: [],
    duration: "",
  });

  const [participantData, setParticipantData] = useState<ParticipantData>({
    name: "",
    email: "",
    availableOptions: [],
    message: "",
  });

  const handleAddDateOption = () => {
    setEventData(prev => ({
      ...prev,
      dateOptions: [...prev.dateOptions, { date: "", time: "" }]
    }));
  };

  const handleCalendarDateSelect = (dateString: string) => {
    setEventData(prev => ({
      ...prev,
      dateOptions: [...prev.dateOptions, { date: dateString, time: "" }]
    }));
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

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions);
    const selectedIndexes = selectedOptions.map(option => parseInt(option.value));
    console.log("Select changed:", selectedIndexes);
    setSelectedDateOptionIndexes(selectedIndexes);
  };

  const handleDateOptionClick = (index: number, event: React.MouseEvent) => {
    const selectElement = selectRef.current;
    if (!selectElement || !selectElement.options) return;

    const option = selectElement.options[index];
    if (!option) return;

    // ブラウザの標準選択動作を活用
    if (event.shiftKey) {
      // Shift+Click: 範囲選択
      const lastSelected = selectedDateOptionIndexes[selectedDateOptionIndexes.length - 1] ?? 0;
      const start = Math.min(lastSelected, index);
      const end = Math.max(lastSelected, index);
      
      // 範囲内のすべてのoptionを選択
      for (let i = start; i <= end; i++) {
        const optionToSelect = selectElement.options[i];
        if (optionToSelect) {
          optionToSelect.selected = true;
        }
      }
    } else if (event.ctrlKey || event.metaKey) {
      // Ctrl+Click (Cmd+Click on Mac): 個別選択切り替え
      option.selected = !option.selected;
    } else {
      // 通常のクリック: 単一選択
      for (let i = 0; i < selectElement.options.length; i++) {
        const optionToUpdate = selectElement.options[i];
        if (optionToUpdate) {
          optionToUpdate.selected = i === index;
        }
      }
    }

    // React stateを直接更新（DOM操作の後にReactの状態も同期）
    const selectedOptions = Array.from(selectElement.selectedOptions);
    const selectedIndexes = selectedOptions.map(opt => parseInt(opt.value));
    setSelectedDateOptionIndexes(selectedIndexes);
  };


  const handleRemoveDateOption = (index: number) => {
    setEventData(prev => ({
      ...prev,
      dateOptions: prev.dateOptions.filter((_, i) => i !== index)
    }));
    // Update selected indexes after removal
    setSelectedDateOptionIndexes(prev => 
      prev
        .filter(i => i !== index) // Remove the deleted index
        .map(i => i > index ? i - 1 : i) // Adjust indexes after the deleted one
    );
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Event created:", eventData);
    // Mock: show results view
    setViewMode("results");
  };

  const handleParticipantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Participant response:", participantData);
    setViewMode("results");
  };

  if (viewMode === "home") {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
              あつまるん
            </h1>
            <p className="text-gray-600 text-center mb-8">
              みんなで集まれる日を見つけよう
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => setViewMode("create-event")}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
              >
                イベントを作成する
              </button>
              
              <button
                onClick={() => setViewMode("join-event")}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
              >
                イベントに参加する
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "create-event") {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-8">
                  <div className="flex items-center mb-6">
                    <button
                      onClick={() => setViewMode("home")}
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
                  <button
                    type="button"
                    onClick={handleAddDateOption}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    + 日時を追加
                  </button>
                </div>
                
                <DateOptionsList
                  dateOptions={eventData.dateOptions}
                  selectedDateOptionIndexes={selectedDateOptionIndexes}
                  onDateOptionClick={handleDateOptionClick}
                  onRemoveDateOption={handleRemoveDateOption}
                  onTimeChange={(index, time) => handleDateOptionChange(index, "time", time)}
                  onDateChange={(index, date) => handleDateOptionChange(index, "date", date)}
                  selectRef={selectRef}
                  onSelectChange={handleSelectChange}
                />
                
                {eventData.dateOptions.length === 0 && (
                  <div className="text-gray-500 text-sm py-4 text-center border-2 border-dashed border-gray-300 rounded-md">
                    「日時を追加」をクリックするか、右のカレンダーから日付を選択してください
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  所要時間
                </label>
                <select
                  id="duration"
                  value={eventData.duration}
                  onChange={(e) => setEventData(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  <option value="30分">30分</option>
                  <option value="1時間">1時間</option>
                  <option value="1時間30分">1時間30分</option>
                  <option value="2時間">2時間</option>
                  <option value="その他">その他</option>
                </select>
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

  if (viewMode === "join-event") {
    // Mock event data for participant view
    const mockEvent = {
      title: "チームミーティング",
      description: "月次チームミーティングを開催します",
      hostName: "山田太郎",
      dateOptions: [
        { date: "2024-01-15", time: "10:00" },
        { date: "2024-01-16", time: "14:00" },
        { date: "2024-01-17", time: "16:00" },
        { date: "2024-01-18", time: "" }
      ],
      duration: "1時間"
    };

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setViewMode("home")}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← 戻る
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                イベントに参加
              </h1>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{mockEvent.title}</h2>
              <p className="text-gray-600 text-sm mb-2">{mockEvent.description}</p>
              <p className="text-gray-600 text-sm">主催者: {mockEvent.hostName}</p>
              {mockEvent.duration && <p className="text-gray-600 text-sm">所要時間: {mockEvent.duration}</p>}
            </div>
            
            <form onSubmit={handleParticipantSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="participantName" className="block text-sm font-medium text-gray-700 mb-2">
                    お名前 *
                  </label>
                  <input
                    type="text"
                    id="participantName"
                    required
                    value={participantData.name}
                    onChange={(e) => setParticipantData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="田中花子"
                  />
                </div>
                
                <div>
                  <label htmlFor="participantEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス *
                  </label>
                  <input
                    type="email"
                    id="participantEmail"
                    required
                    value={participantData.email}
                    onChange={(e) => setParticipantData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  参加可能な日時を選択してください *
                </label>
                <div className="space-y-3">
                  {mockEvent.dateOptions.map((option, index) => (
                    <label key={index} className="flex items-center p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={participantData.availableOptions.includes(index)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setParticipantData(prev => ({
                              ...prev,
                              availableOptions: [...prev.availableOptions, index]
                            }));
                          } else {
                            setParticipantData(prev => ({
                              ...prev,
                              availableOptions: prev.availableOptions.filter(i => i !== index)
                            }));
                          }
                        }}
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {new Date(option.date).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            weekday: 'long'
                          })}
                        </div>
                        {option.time && (
                          <div className="text-sm text-gray-600">
                            {option.time}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="participantMessage" className="block text-sm font-medium text-gray-700 mb-2">
                  メッセージ・備考
                </label>
                <textarea
                  id="participantMessage"
                  rows={3}
                  value={participantData.message}
                  onChange={(e) => setParticipantData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ご質問やご要望がございましたらお聞かせください"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
              >
                参加登録する
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "results") {
    // Mock results data
    const mockResults = {
      eventTitle: "チームミーティング",
      participants: [
        { name: "田中花子", availableOptions: [0, 2, 3] },
        { name: "佐藤次郎", availableOptions: [1, 2] },
        { name: "高橋三郎", availableOptions: [0, 1, 3] }
      ],
      dateOptions: [
        { date: "2024-01-15", time: "10:00" },
        { date: "2024-01-16", time: "14:00" },
        { date: "2024-01-17", time: "16:00" },
        { date: "2024-01-18", time: "" }
      ]
    };

    const getParticipantCount = (optionIndex: number) => {
      return mockResults.participants.filter(p => p.availableOptions.includes(optionIndex)).length;
    };

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setViewMode("home")}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← ホームに戻る
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                集計結果
              </h1>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{mockResults.eventTitle}</h2>
              <p className="text-gray-600 text-sm">参加者: {mockResults.participants.length}名</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">候補日時別参加者数</h3>
              
              {mockResults.dateOptions.map((option, index) => {
                const count = getParticipantCount(index);
                const percentage = (count / mockResults.participants.length) * 100;
                
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <div className="font-medium text-gray-900">
                          {new Date(option.date).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            weekday: 'long'
                          })}
                        </div>
                        {option.time && (
                          <div className="text-sm text-gray-600">
                            {option.time}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{count}名</div>
                        <div className="text-sm text-gray-500">({percentage.toFixed(0)}%)</div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      参加者: {mockResults.participants
                        .filter(p => p.availableOptions.includes(index))
                        .map(p => p.name)
                        .join(', ') || 'なし'}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">おすすめの日時</h4>
              <p className="text-green-700">
                {(() => {
                  const maxCount = Math.max(...mockResults.dateOptions.map((_, index) => getParticipantCount(index)));
                  const bestOptions = mockResults.dateOptions
                    .map((option, index) => ({ option, index, count: getParticipantCount(index) }))
                    .filter(item => item.count === maxCount)
                    .map(item => {
                      const date = new Date(item.option.date).toLocaleDateString('ja-JP', {
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long'
                      });
                      return item.option.time ? `${date} ${item.option.time}` : date;
                    });
                  
                  return `${bestOptions.join(' または ')} (${maxCount}名参加可能)`;
                })()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}