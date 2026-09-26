/**
 * Dependency-free SVG charts (no chart library = no JS on the critical path).
 * Used for the Search Console monitoring template so trends are visible inline.
 */

export function BarChart({
  data,
  caption,
  height = 168,
  colour = "var(--accent)",
}: {
  data: { label: string; value: number }[];
  caption?: string;
  height?: number;
  colour?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barGap = 6;
  const barWidth = 100 / data.length;

  return (
    <figure className="chart" style={{ margin: "1.5rem 0" }}>
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={caption || "Bar chart"}
        style={{ height: `${height}px` }}
      >
        {[0.25, 0.5, 0.75, 1].map((fraction) => (
          <line
            key={fraction}
            x1="0"
            x2="100"
            y1={height - fraction * height}
            y2={height - fraction * height}
            stroke="var(--line)"
            strokeWidth="0.4"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {data.map((item, index) => {
          const barHeight = (item.value / max) * (height - 8);
          return (
            <rect
              key={item.label}
              x={index * barWidth + barGap / 2}
              y={height - barHeight}
              width={barWidth - barGap}
              height={barHeight}
              fill={colour}
              opacity={0.85}
            />
          );
        })}
      </svg>
      <div className="chart-legend" aria-hidden="true">
        {data.map((item) => (
          <span key={item.label} style={{ color: colour }}>
            {item.label}: {item.value.toLocaleString("en-IN")}
          </span>
        ))}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export function LineChart({
  series,
  caption,
  height = 180,
}: {
  series: { name: string; points: number[]; colour: string }[];
  caption?: string;
  height?: number;
}) {
  const all = series.flatMap((s) => s.points);
  const max = Math.max(...all, 1);
  const count = Math.max(...series.map((s) => s.points.length), 2);

  const toPath = (points: number[]) =>
    points
      .map((value, index) => {
        const x = (index / (count - 1)) * 100;
        const y = height - (value / max) * (height - 10) - 4;
        return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");

  return (
    <figure className="chart" style={{ margin: "1.5rem 0" }}>
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={caption || "Line chart"}
        style={{ height: `${height}px` }}
      >
        {[0.25, 0.5, 0.75, 1].map((fraction) => (
          <line
            key={fraction}
            x1="0"
            x2="100"
            y1={height - fraction * height}
            y2={height - fraction * height}
            stroke="var(--line)"
            strokeWidth="0.4"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {series.map((s) => (
          <path
            key={s.name}
            d={toPath(s.points)}
            fill="none"
            stroke={s.colour}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
      </svg>
      <div className="chart-legend">
        {series.map((s) => (
          <span key={s.name} style={{ color: s.colour }}>
            {s.name}
          </span>
        ))}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
