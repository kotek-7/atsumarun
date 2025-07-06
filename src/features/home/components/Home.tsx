"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

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
              onClick={() => router.push("/create")}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
            >
              イベントを作成する
            </button>
            
            <button
              onClick={() => router.push("/join")}
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