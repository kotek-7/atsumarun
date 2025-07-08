"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md overflow-hidden rounded-lg bg-white shadow-md">
        <div className="px-6 py-8">
          <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">
            あつまるん
          </h1>
          <p className="mb-8 text-center text-gray-600">
            みんなで集まれる日を見つけよう
          </p>

          <div className="space-y-4">
            <button
              onClick={() => router.push("/create")}
              className="w-full rounded-md bg-blue-600 px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              イベントを作成する
            </button>

            <button
              onClick={() => router.push("/join")}
              className="w-full rounded-md bg-green-600 px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
            >
              イベントに参加する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
