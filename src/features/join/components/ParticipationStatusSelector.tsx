"use client";

import { ParticipationStatus } from "@/types/participation";

interface ParticipationStatusSelectorProps {
  status: ParticipationStatus | null;
  onChange: (status: ParticipationStatus) => void;
  optionIndex: number;
}

export const ParticipationStatusSelector = ({
  status,
  onChange,
  optionIndex,
}: ParticipationStatusSelectorProps) => {
  const statusOptions: Array<{
    value: ParticipationStatus;
    label: string;
    symbol: string;
    color: string;
    bgColor: string;
    borderColor: string;
  }> = [
    {
      value: "available",
      label: "参加できます",
      symbol: "○",
      color: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
    },
    {
      value: "maybe",
      label: "検討中です",
      symbol: "△",
      color: "text-yellow-700",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-300",
    },
    {
      value: "unavailable",
      label: "参加できません",
      symbol: "×",
      color: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
    },
  ];

  return (
    <div className="space-y-2">
      {statusOptions.map((option) => (
        <label
          key={option.value}
          className={`flex cursor-pointer items-center rounded-md border p-3 transition-colors ${
            status === option.value
              ? `${option.borderColor} ${option.bgColor}`
              : "border-gray-300 bg-white hover:bg-gray-50"
          }`}
        >
          <input
            type="radio"
            name={`status-${optionIndex}`}
            value={option.value}
            checked={status === option.value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          <div
            className={`mr-3 flex h-6 w-6 items-center justify-center rounded-full font-bold ${
              status === option.value
                ? `${option.color} ${option.bgColor}`
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {option.symbol}
          </div>
          <span
            className={`font-medium ${
              status === option.value ? option.color : "text-gray-700"
            }`}
          >
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
};
