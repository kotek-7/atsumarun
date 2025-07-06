"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ParticipantData } from "@/features/shared/types";

export default function Join() {
  const router = useRouter();
  const [participantData, setParticipantData] = useState<ParticipantData>({
    name: "",
    email: "",
    availableOptions: [],
    message: "",
  });

  const mockEventData = {
    title: "チームミーティング",
    description: "月次の進捗確認ミーティングです",
    hostName: "田中太郎",
    dateOptions: [
      { date: "2024-01-15", time: "10:00" },
      { date: "2024-01-16", time: "14:00" },
      { date: "2024-01-17", time: "09:00" },
      { date: "2024-01-18", time: "15:30" },
    ],
    duration: "1時間",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
    return `${month}/${day}(${dayOfWeek})`;
  };

  const handleOptionToggle = (index: number) => {
    setParticipantData(prev => ({
      ...prev,
      availableOptions: prev.availableOptions.includes(index)
        ? prev.availableOptions.filter(i => i !== index)
        : [...prev.availableOptions, index]
    }));
  };

  const handleParticipantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Participant response:", participantData);
    router.push("/results");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.push("/")}
              className="text-gray-500 hover:text-gray-700 mr-4"
            >
              ← 戻る
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              イベントに参加
            </h1>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              {mockEventData.title}
            </h2>
            <p className="text-blue-700 text-sm mb-2">
              主催者: {mockEventData.hostName}
            </p>
            {mockEventData.description && (
              <p className="text-blue-700 text-sm mb-2">
                {mockEventData.description}
              </p>
            )}
            {mockEventData.duration && (
              <p className="text-blue-700 text-sm">
                所要時間: {mockEventData.duration}
              </p>
            )}
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
                  placeholder="山田花子"
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
              <div className="space-y-2">
                {mockEventData.dateOptions.map((option, index) => (
                  <label 
                    key={index}
                    className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                      participantData.availableOptions.includes(index)
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={participantData.availableOptions.includes(index)}
                      onChange={() => handleOptionToggle(index)}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        {formatDate(option.date)}
                      </span>
                      {option.time && (
                        <span className="ml-2 text-gray-600">
                          {option.time}
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              {participantData.availableOptions.length === 0 && (
                <p className="text-red-500 text-sm mt-2">
                  少なくとも1つの日時を選択してください
                </p>
              )}
            </div>

            <div>
              <label htmlFor="participantMessage" className="block text-sm font-medium text-gray-700 mb-2">
                メッセージ（任意）
              </label>
              <textarea
                id="participantMessage"
                rows={3}
                value={participantData.message}
                onChange={(e) => setParticipantData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ご質問やご要望があればお書きください"
              />
            </div>

            <button
              type="submit"
              disabled={participantData.availableOptions.length === 0}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              参加登録する
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}