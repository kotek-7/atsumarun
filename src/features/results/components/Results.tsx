"use client";

import { useRouter } from "next/navigation";
import { DateOptionResult, ParticipationStatus } from "@/types";

export default function Results() {
  const router = useRouter();

  const mockResults = {
    eventTitle: "チームミーティング",
    dateOptions: [
      {
        date: "2024-01-15",
        time: "10:00",
        participants: [
          { name: "田中太郎", status: "available" as ParticipationStatus },
          { name: "佐藤花子", status: "available" as ParticipationStatus },
          { name: "鈴木一郎", status: "maybe" as ParticipationStatus },
        ],
      },
      {
        date: "2024-01-16",
        time: "14:00",
        participants: [
          { name: "田中太郎", status: "available" as ParticipationStatus },
          { name: "佐藤花子", status: "maybe" as ParticipationStatus },
          { name: "山田次郎", status: "unavailable" as ParticipationStatus },
        ],
      },
      {
        date: "2024-01-17",
        time: "09:00",
        participants: [
          { name: "田中太郎", status: "available" as ParticipationStatus },
          { name: "鈴木一郎", status: "available" as ParticipationStatus },
          { name: "山田次郎", status: "available" as ParticipationStatus },
        ],
      },
      {
        date: "2024-01-18",
        time: "15:30",
        participants: [
          { name: "田中太郎", status: "maybe" as ParticipationStatus },
          { name: "佐藤花子", status: "unavailable" as ParticipationStatus },
        ],
      },
    ] as DateOptionResult[],
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
    return `${month}/${day}(${dayOfWeek})`;
  };

  // 参加状態の表示記号とスタイルを取得
  const getStatusDisplay = (status: ParticipationStatus) => {
    switch (status) {
      case "available":
        return { symbol: "○", color: "text-green-600", bgColor: "bg-green-50" };
      case "maybe":
        return {
          symbol: "△",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
        };
      case "unavailable":
        return { symbol: "×", color: "text-red-600", bgColor: "bg-red-50" };
    }
  };

  // 全参加者のユニークリストを取得
  const allParticipants = Array.from(
    new Set(
      mockResults.dateOptions.flatMap((option) =>
        option.participants.map((p) => p.name)
      )
    )
  );

  // 各日程の参加状態別人数を計算
  const getStatusCounts = (participants: { status: ParticipationStatus }[]) => {
    return {
      available: participants.filter((p) => p.status === "available").length,
      maybe: participants.filter((p) => p.status === "maybe").length,
      unavailable: participants.filter((p) => p.status === "unavailable")
        .length,
    };
  };

  // 参加者の特定日程での参加状態を取得
  const getParticipantStatus = (
    participantName: string,
    optionIndex: number
  ): ParticipationStatus | null => {
    const option = mockResults.dateOptions[optionIndex];
    const participant = option.participants.find(
      (p) => p.name === participantName
    );
    return participant ? participant.status : null;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="px-6 py-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">結果発表</h1>
                <p className="mt-1 text-gray-600">{mockResults.eventTitle}</p>
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
                参加状況マトリックス
              </h2>

              {/* マトリックステーブル */}
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                        日程
                      </th>
                      <th className="border border-gray-300 px-3 py-3 text-center font-semibold text-green-700">
                        ○
                      </th>
                      <th className="border border-gray-300 px-3 py-3 text-center font-semibold text-yellow-700">
                        △
                      </th>
                      <th className="border border-gray-300 px-3 py-3 text-center font-semibold text-red-700">
                        ×
                      </th>
                      {allParticipants.map((participant, index) => (
                        <th
                          key={index}
                          className="border border-gray-300 px-3 py-3 text-center font-medium text-gray-900"
                        >
                          <div className="min-w-20 text-sm break-words">
                            {participant}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockResults.dateOptions.map((option, optionIndex) => {
                      const statusCounts = getStatusCounts(option.participants);
                      return (
                        <tr key={optionIndex} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                            <div>
                              {formatDate(option.date)}
                              {option.time && (
                                <div className="text-sm text-gray-600">
                                  {option.time}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="border border-gray-300 px-3 py-3 text-center">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                              {statusCounts.available}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-3 py-3 text-center">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 font-bold text-yellow-700">
                              {statusCounts.maybe}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-3 py-3 text-center">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100 font-bold text-red-700">
                              {statusCounts.unavailable}
                            </span>
                          </td>
                          {allParticipants.map(
                            (participant, participantIndex) => {
                              const status = getParticipantStatus(
                                participant,
                                optionIndex
                              );
                              const statusDisplay = status
                                ? getStatusDisplay(status)
                                : null;
                              return (
                                <td
                                  key={participantIndex}
                                  className="border border-gray-300 px-3 py-3 text-center"
                                >
                                  {statusDisplay ? (
                                    <span
                                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full font-bold ${statusDisplay.bgColor} ${statusDisplay.color}`}
                                    >
                                      {statusDisplay.symbol}
                                    </span>
                                  ) : null}
                                </td>
                              );
                            }
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 凡例 */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                    ○
                  </span>
                  <span>参加可能</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 font-bold text-yellow-700">
                    △
                  </span>
                  <span>検討中</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 font-bold text-red-700">
                    ×
                  </span>
                  <span>参加不可</span>
                </div>
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
