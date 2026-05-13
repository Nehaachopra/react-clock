import { useState, useEffect } from "react";

interface AnalogClockInputs {
  hours: number,
  minutes: number,
  seconds: number
}

function AnalogClock({ hours, minutes, seconds }: AnalogClockInputs) {
  const secDeg = seconds * 6;
  const minDeg = minutes * 6 + seconds * 0.1;
  const hrDeg = (hours % 12) * 30 + minutes * 0.5;

  return (
    <svg viewBox="0 0 200 200" width="200" height="200" style={{ display: "block", margin: "0 auto" }}>
      <circle cx="100" cy="100" r="100" fill="none" stroke="#e2e0d8" strokeWidth="1.5" />
      {[...Array(12)].map((_, i) => {
        const angle = ((i * 30 - 90) * Math.PI) / 180;
        const r1 = i % 3 === 0 ? 82 : 87;
        return (
          <line
            key={i}
            x1={100 + r1 * Math.cos(angle)}
            y1={100 + r1 * Math.sin(angle)}
            x2={100 + 92 * Math.cos(angle)}
            y2={100 + 92 * Math.sin(angle)}
            stroke={i % 3 === 0 ? "#555" : "#aaa"}
            strokeWidth={i % 3 === 0 ? 2 : 1}
            strokeLinecap="round"
          />
        );
      })}
      {[12, 3, 6, 9].map((n, i) => {
        const angle = ((i * 90 - 90) * Math.PI) / 180;
        return (
          <text
            key={n}
            x={100 + 72 * Math.cos(angle)}
            y={100 + 72 * Math.sin(angle)}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="13"
            fontWeight="500"
            fill="#333"
            fontFamily="Georgia, serif"
          >
            {n}
          </text>
        );
      })}
      {/* Hour hand */}
      <line
        x1="100" y1="100"
        x2={100 + 52 * Math.cos(((hrDeg - 90) * Math.PI) / 180)}
        y2={100 + 52 * Math.sin(((hrDeg - 90) * Math.PI) / 180)}
        stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round"
      />
      {/* Minute hand */}
      <line
        x1="100" y1="100"
        x2={100 + 72 * Math.cos(((minDeg - 90) * Math.PI) / 180)}
        y2={100 + 72 * Math.sin(((minDeg - 90) * Math.PI) / 180)}
        stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round"
      />
      {/* Second hand */}
      <line
        x1={100 - 18 * Math.cos(((secDeg - 90) * Math.PI) / 180)}
        y1={100 - 18 * Math.sin(((secDeg - 90) * Math.PI) / 180)}
        x2={100 + 80 * Math.cos(((secDeg - 90) * Math.PI) / 180)}
        y2={100 + 80 * Math.sin(((secDeg - 90) * Math.PI) / 180)}
        stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round"
      />
      <circle cx="100" cy="100" r="4" fill="#c0392b" />
      <circle cx="100" cy="100" r="2" fill="white" />
    </svg>
  );
}

export default function ClockMode(props) {
  const pad = props.functions;
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;


  return (
    <div style={{ textAlign: "center" }}>
      <AnalogClock hours={h} minutes={m} seconds={s} />
      <div style={{ marginTop: "1.5rem", fontFamily: "'Georgia', serif", letterSpacing: "0.04em" }}>
        <span style={{ fontSize: "3rem", fontWeight: "400", color: "#1a1a2e", lineHeight: 1 }}>
          {pad(h12)}:{pad(m)}:{pad(s)}
        </span>
        <span style={{ fontSize: "1.1rem", color: "#888", marginLeft: "8px", fontFamily: "sans-serif" }}>{ampm}</span>
      </div>
      <div style={{ marginTop: "0.5rem", color: "#aaa", fontSize: "0.85rem", fontFamily: "sans-serif", letterSpacing: "0.08em" }}>
        {now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </div>
    </div>
  );
}