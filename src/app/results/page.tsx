"use client";

import { useRouter } from "next/navigation";

export default function ResultsPage() {
  const router = useRouter();

  // Mock results data - in real app this would come from API/database
  const mockResults = {
    eventTitle: "チームミーティング",
    hostName: "田中太郎",
    dateOptions: [
      { date: "2024-01-15", time: "10:00", participants: ["田中太郎", "山田花子", "佐藤次郎"] },
      { date: "2024-01-16", time: "14:00", participants: ["田中太郎", "山田花子"] },
      { date: "2024-01-17", time: "09:00", participants: ["田中太郎", "佐藤次郎", "鈴木三郎"] },
      { date: "2024-01-18", time: "15:30", participants: ["田中太郎"] },
    ]
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
    return `${month}/${day}(${dayOfWeek})`;
  };

  // Sort by number of participants (descending)
  const sortedOptions = [...mockResults.dateOptions].sort((a, b) => b.participants.length - a.participants.length);
  const maxParticipants = sortedOptions[0]?.participants.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  集計結果
                </h1>
                <p className="text-gray-600 mt-1">
                  {mockResults.eventTitle} - 主催者: {mockResults.hostName}
                </p>
              </div>
              <button
                onClick={() => router.push("/")}
                className="text-gray-500 hover:text-gray-700"
              >
                ← ホームに戻る
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                参加人数の多い順
              </h2>
              <div className="space-y-4">
                {sortedOptions.map((option, index) => (
                  <div 
                    key={index}
                    className={`border rounded-lg p-4 ${
                      option.participants.length === maxParticipants && maxParticipants > 1
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">
                          {formatDate(option.date)}
                        </span>
                        {option.time && (
                          <span className="ml-2 text-gray-600">
                            {option.time}
                          </span>
                        )}
                        {option.participants.length === maxParticipants && maxParticipants > 1 && (
                          <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                            最多
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          {option.participants.length}人
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            option.participants.length === maxParticipants && maxParticipants > 1
                              ? 'bg-green-500'
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${maxParticipants > 0 ? (option.participants.length / maxParticipants) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">参加者: </span>
                      {option.participants.length > 0 ? (
                        option.participants.join(", ")
                      ) : (
                        <span className="text-gray-400">参加者なし</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                参加者一覧
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from(new Set(mockResults.dateOptions.flatMap(option => option.participants)))
                  .map((participant, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <span className="font-medium text-gray-900">{participant}</span>
                      <div className="text-sm text-gray-600 mt-1">
                        {mockResults.dateOptions.filter(option => option.participants.includes(participant)).length}件の候補に参加可能
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => router.push("/create")}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
              >
                新しいイベントを作成
              </button>
              <button
                onClick={() => router.push("/join")}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
              >
                別のイベントに参加
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}