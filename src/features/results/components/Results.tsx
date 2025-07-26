"use client";

import { useRouter } from "next/navigation";

export default function Results() {
  const router = useRouter();

  const mockResults = {
    eventTitle: "チームミーティング",
    dateOptions: [
      {
        date: "2024-01-15",
        time: "10:00",
        participants: ["田中太郎", "佐藤花子", "鈴木一郎"],
      },
      { date: "2024-01-16", time: "14:00", participants: ["田中太郎", "佐藤花子"] },
      {
        date: "2024-01-17",
        time: "09:00",
        participants: ["田中太郎", "鈴木一郎", "山田次郎"],
      },
      { date: "2024-01-18", time: "15:30", participants: ["田中太郎"] },
    ],
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
    return `${month}/${day}(${dayOfWeek})`;
  };

  const sortedOptions = [...mockResults.dateOptions].sort(
    (a, b) => b.participants.length - a.participants.length
  );
  const maxParticipants = sortedOptions[0]?.participants.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="px-6 py-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">結果発表</h1>
                <p className="mt-1 text-gray-600">
                  {mockResults.eventTitle}
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
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                候補日時の結果
              </h2>
              <div className="space-y-4">
                {sortedOptions.map((option, index) => (
                  <div
                    key={index}
                    className={`rounded-lg border p-4 ${
                      option.participants.length === maxParticipants &&
                      maxParticipants > 1
                        ? "border-secondary-300 bg-secondary-50"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">
                          {formatDate(option.date)}
                        </span>
                        {option.time && (
                          <span className="ml-2 text-gray-600">
                            {option.time}
                          </span>
                        )}
                        {option.participants.length === maxParticipants &&
                          maxParticipants > 1 && (
                            <span className="bg-secondary-100 text-secondary-800 ml-2 rounded-full px-2 py-1 text-xs font-medium">
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
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className={`h-2 rounded-full ${
                            option.participants.length === maxParticipants &&
                            maxParticipants > 1
                              ? "bg-secondary-500"
                              : "bg-primary-500"
                          }`}
                          style={{
                            width: `${maxParticipants > 0 ? (option.participants.length / maxParticipants) * 100 : 0}%`,
                          }}
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
              <h3 className="mb-4 text-lg font-semibold text-gray-900">参加者一覧</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from(
                  new Set(
                    mockResults.dateOptions.flatMap(
                      (option) => option.participants
                    )
                  )
                ).map((participant, index) => (
                  <div key={index} className="rounded-lg bg-gray-50 p-3">
                    <span className="font-medium text-gray-900">
                      {participant}
                    </span>
                    <div className="mt-1 text-sm text-gray-600">
                      {
                        mockResults.dateOptions.filter((option) =>
                          option.participants.includes(participant)
                        ).length
                      }
                      個の候補に参加
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => router.push("/create")}
                className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 rounded-md px-6 py-2 font-medium text-white transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                新しいイベントを作成
              </button>
              <button
                onClick={() => router.push("/join")}
                className="bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 rounded-md px-6 py-2 font-medium text-white transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
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