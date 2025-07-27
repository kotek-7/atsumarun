"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ParticipationStatus } from "@/features/shared/types";
import { ParticipationStatusSelector } from "./ParticipationStatusSelector";

interface ParticipantResponse {
  name: string;
  responses: Record<number, ParticipationStatus>;
  message: string;
}

export default function Join() {
  const router = useRouter();
  const [participantData, setParticipantData] = useState<ParticipantResponse>({
    name: "",
    responses: {},
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
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
    return `${month}/${day}(${dayOfWeek})`;
  };

  const handleStatusChange = (optionIndex: number, status: ParticipationStatus) => {
    setParticipantData((prev) => ({
      ...prev,
      responses: {
        ...prev.responses,
        [optionIndex]: status,
      },
    }));
  };

  const handleParticipantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Participant response:", participantData);
    router.push("/results");
  };

  // 少なくとも一つの回答があるかチェック
  const hasAnyResponse = Object.keys(participantData.responses).length > 0;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-lg bg-white shadow-md">
        <div className="px-6 py-8">
          <div className="mb-6 flex items-center">
            <button
              onClick={() => router.push("/")}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              ← 戻る
            </button>
            <h1 className="text-2xl font-bold text-gray-900">イベントに参加</h1>
          </div>

          <div className="border-primary-200 bg-primary-50 mb-6 rounded-lg border p-4">
            <h2 className="text-primary-900 mb-2 text-lg font-semibold">
              {mockEventData.title}
            </h2>
            <p className="text-primary-700 mb-2 text-sm">
              主催者: {mockEventData.hostName}
            </p>
            {mockEventData.description && (
              <p className="text-primary-700 text-sm">
                {mockEventData.description}
              </p>
            )}
          </div>

          <form onSubmit={handleParticipantSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="participantName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                お名前 *
              </label>
              <input
                type="text"
                id="participantName"
                required
                value={participantData.name}
                onChange={(e) =>
                  setParticipantData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="focus:ring-primary-500 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
                placeholder="山田花子"
              />
            </div>

            <div>
              <label className="mb-4 block text-sm font-medium text-gray-700">
                各日時への参加可否をお答えください *
              </label>
              <div className="space-y-6">
                {mockEventData.dateOptions.map((option, index) => (
                  <div key={index} className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-3">
                      <span className="font-medium text-gray-900">
                        {formatDate(option.date)}
                      </span>
                      {option.time && (
                        <span className="ml-2 text-gray-600">
                          {option.time}
                        </span>
                      )}
                    </div>
                    <ParticipationStatusSelector
                      status={participantData.responses[index] || null}
                      onChange={(status) => handleStatusChange(index, status)}
                      optionIndex={index}
                    />
                  </div>
                ))}
              </div>
              {!hasAnyResponse && (
                <p className="text-danger-500 mt-4 text-sm">
                  少なくとも1つの日時にお答えください
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="participantMessage"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                メッセージ（任意）
              </label>
              <textarea
                id="participantMessage"
                rows={3}
                value={participantData.message}
                onChange={(e) =>
                  setParticipantData((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                className="focus:ring-primary-500 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
                placeholder="ご質問やご要望があればお書きください"
              />
            </div>

            <button
              type="submit"
              disabled={!hasAnyResponse}
              className="bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 w-full rounded-md px-4 py-2 font-medium text-white transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              参加登録する
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
