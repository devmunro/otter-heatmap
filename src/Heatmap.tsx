import React, { useState, useRef } from "react";
import { addDays, format, differenceInDays } from "date-fns";
import { getColorForCount } from "./utils";

/* ==============================
   Heatmap Component Props
   ============================== */
export interface HeatmapProps {
  data: Record<string, number>;
  startDate: Date;
  endDate: Date;
  baseColor?: string;
  cellSize?: number;
  cellSpacing?: number;
  weekStart?: 0 | 1;
  width?: number | string;
  scrollable?: boolean;
  className?: string;
  tooltip?: (day: { date: Date; count: number }) => string;
  cellType?: "rect" | "circle";
  monthLabelColor?: string;
  weekdayLabelColor?: string;
}

/* ==============================
   Heatmap Component
   ============================== */
const Heatmap: React.FC<HeatmapProps> = ({
  data,
  startDate,
  endDate,
  baseColor = "#239a3b",
  cellSize = 14,
  cellSpacing = 4,
  weekStart = 0,
  width = "100%",
  scrollable = true,
  className = "",
  tooltip,
  cellType = "rect",
  monthLabelColor = "#000",
  weekdayLabelColor = "#000",
}) => {
  /* ==============================
     State: Tooltip Hover
     ============================== */
  const [hovered, setHovered] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  /* ==============================
     Align Start Date to Week Start
     ============================== */
  const alignedStart = addDays(
    startDate,
    -((startDate.getDay() - weekStart + 7) % 7)
  );
  const totalDays = differenceInDays(endDate, alignedStart) + 1;
  const totalWeeks = Math.ceil(totalDays / 7);

  /* ==============================
     Compute Maximum Count for Scaling
     ============================== */
  const maxCount = Math.max(...Object.values(data), 1);

  /* ==============================
     Generate Heatmap Cells
     ============================== */
  const cells: { date: Date; count: number; x: number; y: number }[] = [];
  for (let i = 0; i < totalDays; i++) {
    const current = addDays(alignedStart, i);
    const count = data[current.toISOString().slice(0, 10)] || 0;
    const weekIndex = Math.floor(i / 7);
    const dayIndex = i % 7;

    cells.push({
      date: current,
      count,
      x: weekIndex * (cellSize + cellSpacing),
      y: dayIndex * (cellSize + cellSpacing),
    });
  }

  /* ==============================
     Generate Month Labels
     ============================== */
  const monthLabels: { month: string; x: number }[] = [];
  const seenMonths = new Set<string>();
  cells.forEach((cell) => {
    if (cell.date < startDate) return;
    const month = cell.date.toLocaleString("default", { month: "short" });
    if (!seenMonths.has(month)) {
      seenMonths.add(month);
      monthLabels.push({ month, x: cell.x });
    }
  });

  /* ==============================
     Compute SVG Dimensions
     ============================== */
  const svgWidth = totalWeeks * (cellSize + cellSpacing) + 50;
  const svgHeight = 7 * (cellSize + cellSpacing) + 20;

  /* ==============================
     Weekday Labels
     ============================== */
  const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  /* ==============================
     Render Component
     ============================== */
  return (
    <div
      className={`heatmap-container ${className}`}
      style={{
        width,
        overflowX: scrollable ? "auto" : "hidden",
        position: "relative",
        paddingTop: 20,
      }}
    >
      {/* Tooltip */}
      {hovered && (
        <div
          style={{
            position: "fixed",
            left: hovered.x,
            top: hovered.y,
            background: "rgba(0,0,0,0.85)",
            color: "#fff",
            padding: "4px 8px",
            borderRadius: 4,
            fontSize: 11,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            transform: "translate(-50%, -100%)",
            zIndex: 9999,
          }}
        >
          {hovered.text}
        </div>
      )}

      {/* Scrollable Wrapper */}
      <div style={{ minWidth: svgWidth }}>
        <svg width={svgWidth} height={svgHeight}>
          {/* Month Labels */}
          {monthLabels.map((label, idx) => (
            <text
              key={idx}
              x={label.x + 50}
              y={12}
              fontSize={12}
              fontFamily="sans-serif"
              fill={monthLabelColor}
            >
              {label.month}
            </text>
          ))}

          {/* Weekday Labels */}
          {weekLabels.map((day, i) => (
            <text
              key={i}
              x={0}
              y={i * (cellSize + cellSpacing) + cellSize / 1.5 + 20}
              fontSize={12}
              fontFamily="sans-serif"
              fill={weekdayLabelColor}
            >
              {day}
            </text>
          ))}

          {/* Cells */}
          {cells.map((cell, idx) => {
            const color = getColorForCount(cell.count, baseColor, maxCount);
            const tooltipText = tooltip
              ? tooltip({ date: cell.date, count: cell.count })
              : `${cell.count} event${cell.count !== 1 ? "s" : ""} on ${format(
                  cell.date,
                  "MMM dd"
                )}`;

            const x = cell.x + 50;
            const y = cell.y + 20;

            if (cellType === "circle") {
              return (
                <circle
                  key={idx}
                  cx={x + cellSize / 2}
                  cy={y + cellSize / 2}
                  r={cellSize / 2}
                  fill={color}
                  onMouseEnter={(e) =>
                    setHovered({
                      x: e.clientX,
                      y: e.clientY,
                      text: tooltipText,
                    })
                  }
                  onMouseLeave={() => setHovered(null)}
                />
              );
            }

            return (
              <rect
                key={idx}
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                rx={4}
                ry={4}
                fill={color}
                onMouseEnter={(e) =>
                  setHovered({ x: e.clientX, y: e.clientY, text: tooltipText })
                }
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default Heatmap;
