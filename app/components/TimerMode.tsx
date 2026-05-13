import { useState, useEffect } from "react";
import Btn from "../components/Btn";

interface TimeData {
  h: number;
  m: number;
  s: number;
}

function extractTimeFromSeconds(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return { h, m, s };
}

export default function TimerMode(props) {
  const pad = props.functions;
  const [timeData, setTimeData] = useState<TimeData>({
    h: 0,
    m: 0,
    s: 0,
  });
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!secondsRemaining || secondsRemaining === 0) {
      return;
    }
    if (isPaused) return;

    const updateTimer = () => {
      const updatedSecondsReamining = secondsRemaining! - 1;
      setSecondsRemaining(updatedSecondsReamining);
    };
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isPaused, secondsRemaining]);

  const startTimer = () => {
    const updatedSeconds = timeData.h * 60 * 60 + timeData.m * 60 + timeData.s;
    if (updatedSeconds < 1) return;
    setSecondsRemaining(updatedSeconds);
    setIsPaused(false);
  };

  const resetTimer = () => {
    setSecondsRemaining(null);
    setIsPaused(false);
  }

  const currentTimeDataSeconds =
    timeData.h * 60 * 60 + timeData.m * 60 + timeData.s;
  // const currentTime = secondsRemaining ? extractTimeFromSeconds(secondsRemaining) : {h: 0, m: 0, s: 0};
  const currentTime = secondsRemaining === null
  ? timeData
  : extractTimeFromSeconds(secondsRemaining);

  const progress =
    secondsRemaining && secondsRemaining > 0 && currentTimeDataSeconds > 0
      ? secondsRemaining / currentTimeDataSeconds
      : 1;
  const r = 88,
    circ = 2 * Math.PI * r;

  return (
    <div style={{ textAlign: "center" }}>
      <svg
        viewBox="0 0 200 200"
        width="200"
        height="200"
        style={{ display: "block", margin: "0 auto" }}
      >
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="#e2e0d8"
          strokeWidth="4"
        />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke={
            secondsRemaining === null  
            ? "#1a6b3c" 
            : secondsRemaining > 1
            ? "#1a6b3c"
            : secondsRemaining > 0 
            ? "#c0392b"
            : ""
          }
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - progress)}
          transform="rotate(-90 100 100)"
          style={{ transition: "stroke-dashoffset 0.8s linear" }}
        />
        <text
          x="100"
          y="95"
          textAnchor="middle"
          fontSize="28"
          fontWeight="400"
          fill={
            secondsRemaining === null 
            ? "#1a1a2e" 
            : secondsRemaining > 1
            ? "#1a1a2e"
            : "#c0392b"
          }
          fontFamily="Georgia, serif"
        >
          {pad(currentTime.h)}:{pad(currentTime.m)}:{pad(currentTime.s)}
        </text>
        <text
          x="100"
          y="120"
          textAnchor="middle"
          fontSize="11"
          fill="#999"
          fontFamily="sans-serif"
        >
          {secondsRemaining === null
            ? "timer"
            : secondsRemaining > 0
            ? "running"
            : "time's up!"
              }
        </text>
      </svg>

      {secondsRemaining === null && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            margin: "1rem 0",
            alignItems: "center",
          }}
        >
          {["h", "m", "s"].map((unit) => (
            <div
              key={unit}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <label
                style={{
                  fontSize: "11px",
                  color: "#aaa",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {unit}
              </label>
              <input
                type="number"
                min="0"
                max={unit === "h" ? 23 : 59}
                value={timeData[unit]}
                onChange={(e) => {
                  const value = Math.max(0, Number(e.target.value));
                    setTimeData((p) => {
                    const updated = {
                      ...p,
                      [unit]: value
                    }
                    return updated
                    })
                  }
                }
                style={{
                  width: "56px",
                  textAlign: "center",
                  fontSize: "1.1rem",
                  padding: "6px 4px",
                  border: "0.5px solid #ccc",
                  borderRadius: "6px",
                  fontFamily: "Georgia, serif",
                  color: "black",
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "center",
          marginTop: "0.75rem",
        }}
      >
        {secondsRemaining === null 
          ?<>
            <Btn onClick={() => {
              setTimeData({h: 0, m: 0, s: 0})
            }}>Reset</Btn>
            <Btn onClick={startTimer} accent>Start</Btn>
          </>
          :<>
            <Btn onClick={resetTimer} accent={secondsRemaining < 1}>Reset</Btn>
            {secondsRemaining > 0 && <Btn onClick={() => setIsPaused(!isPaused)} accent>{isPaused? "Resume" : "Pause"}</Btn>}
          </> 
          
        }
        
      </div>
    </div>
  );
}