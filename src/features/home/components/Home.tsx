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
              className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 w-full rounded-md px-4 py-3 font-medium text-white transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              イベントを作成する
            </button>

            <button
              onClick={() => router.push("/join")}
              className="bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 w-full rounded-md px-4 py-3 font-medium text-white transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              イベントに参加する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
