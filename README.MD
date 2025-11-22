# Otter Heatmap

![Heatmap Demo](https://github.com/devmunro/otter-heatmap/raw/main/src/assets/example.png)


A customizable React heatmap component built with TypeScript and `date-fns`.
Supports rectangular and circular cells, tooltips, and scrollable layouts.

## Features

- Display data by date in a heatmap
- Configurable cell size, spacing, and color
- Optional scrollable layout
- Custom tooltips for each day
- Works with React 19

## Installation

```bash
npm install react-activity-heatmap
```

## Usage

```tsx
import React from "react";
import Heatmap from "react-activity-heatmap";

const data = {
  "2025-01-01": 5,
  "2025-01-02": 10,
  "2025-01-03": 3,
};

export const App = () => (
  <div style={{ padding: 20 }}>
    <Heatmap
      data={data}
      startDate={new Date("2025-01-01")}
      endDate={new Date("2025-01-31")}
      baseColor="#239a3b"
      cellSize={14}
      cellSpacing={4}
      scrollable={true}
    />
  </div>
);
```

## Props

| Prop          | Type                                             | Default   | Description                  |                |
| ------------- | ------------------------------------------------ | --------- | ---------------------------- | -------------- |
| `data`        | `Record<string, number>`                         | —         | Object with dates and counts |                |
| `startDate`   | `Date`                                           | —         | Start date of heatmap        |                |
| `endDate`     | `Date`                                           | —         | End date of heatmap          |                |
| `baseColor`   | `string`                                         | `#239a3b` | Base color for cells         |                |
| `cellSize`    | `number`                                         | 14        | Size of each cell            |                |
| `cellSpacing` | `number`                                         | 4         | Spacing between cells        |                |
| `scrollable`  | `boolean`                                        | true      | Enable horizontal scrolling  |                |
| `cellType`    | `"rect"                                          | "circle"` | `"rect"`                     | Shape of cells |
| `tooltip`     | `(day: { date: Date, count: number }) => string` | —         | Custom tooltip text          |                |

## License

MIT
