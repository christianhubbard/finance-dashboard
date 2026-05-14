import { getThemeColor } from "@/lib/theme";
import type { Budget } from "@/lib/types";

type DonutChartProps = {
  budgets: Budget[];
  size?: number;
  strokeWidth?: number;
};

type Segment = {
  dashArray: string;
  offset: number;
  color: string;
  arcLength: number;
};

export function DonutChart({
  budgets,
  size = 240,
  strokeWidth = 36,
}: DonutChartProps) {
  const total = budgets.reduce((s, b) => s + b.spent, 0);
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  const segments: Segment[] = [];
  let accumulated = 0;

  for (const b of budgets) {
    const fraction = total > 0 ? b.spent / total : 0;
    const arcLength = fraction * circumference;
    const dashArray = `${arcLength} ${circumference - arcLength}`;
    const offset = -accumulated;
    accumulated += arcLength;
    segments.push({
      dashArray,
      offset,
      color: getThemeColor(b.theme),
      arcLength,
    });
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
      aria-hidden
    >
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        className="stroke-beige-100 dark:stroke-[#26241e]"
        strokeWidth={strokeWidth}
      />
      {segments.map((s, i) =>
        s.arcLength > 0 ? (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={s.color}
            strokeWidth={strokeWidth}
            strokeDasharray={s.dashArray}
            strokeDashoffset={s.offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        ) : null,
      )}
    </svg>
  );
}
