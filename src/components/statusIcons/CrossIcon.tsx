import React from "react";

export default function CrossIcon({
  size = 100,
  color = "#000000",
  strokeWidth = 10,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    >
      <path d="M20 20 L80 80 M80 20 L20 80" fill="none" />
    </svg>
  );
}
