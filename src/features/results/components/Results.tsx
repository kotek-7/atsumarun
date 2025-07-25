"use client";

import { useRouter } from "next/navigation";

export default function Results() {
  const router = useRouter();

  const mockResults = {
    eventTitle: "�����ƣ�",
    hostName: "0-*�",
    dateOptions: [
      {
        date: "2024-01-15",
        time: "10:00",
        participants: ["0-*�", "q0�P", "P�!�"],
      },
      { date: "2024-01-16", time: "14:00", participants: ["0-*�", "q0�P"] },
      {
        date: "2024-01-17",
        time: "09:00",
        participants: ["0-*�", "P�!�", "4(	�"],
      },
      { date: "2024-01-18", time: "15:30", participants: ["0-*�"] },
    ],
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ["�", "", "k", "4", "(", "�", ""][date.getDay()];
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
                <h1 className="text-2xl font-bold text-gray-900">�P�</h1>
                <p className="mt-1 text-gray-600">
                  {mockResults.eventTitle} - ;�: {mockResults.hostName}
                </p>
              </div>
              <button
                onClick={() => router.push("/")}
                className="text-gray-500 hover:text-gray-700"
              >
                � ���k;�
              </button>
            </div>

            <div className="mb-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                 �pnD
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
                               
                            </span>
                          )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          {option.participants.length}�
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
                      <span className="font-medium"> : </span>
                      {option.participants.length > 0 ? (
                        option.participants.join(", ")
                      ) : (
                        <span className="text-gray-400"> jW</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">  �</h3>
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
                      �n�k ��
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
                �WD���Ȓ\
              </button>
              <button
                onClick={() => router.push("/join")}
                className="bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 rounded-md px-6 py-2 font-medium text-white transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                %n����k 
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
