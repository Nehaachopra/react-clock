"use client";
import { useState, useEffect } from "react";
import Btn from "./Btn";

export default function StopwatchMode(props) {
  const pad = props.functions;
  
  const [milliSeconds, setMilliSeconds] = useState<number>(0);
  const [laps, setLaps] = useState<string[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  function extractTimeFromMs(timeInMs: number) {
    const seconds = timeInMs / 1000;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 60 / 60);
    const s = Math.floor(seconds % 60);
    const ms = (timeInMs % 1000) / 10;
    if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(ms)}`;
    return `${pad(m)}:${pad(s)}:${pad(ms)}`;
  }

  useEffect(() => {
    if (!isStarted) return;
    if (isPaused) return;

    const interval = setInterval(() => {
      setMilliSeconds((prev) => prev + 10);
    }, 10);

    return () => clearInterval(interval);
  }, [milliSeconds, isStarted, isPaused]);

  const currentTimeString = extractTimeFromMs(milliSeconds);

  function startWatch() {
    setIsStarted(true);
    setIsPaused(false);
    setLaps([]);
    setMilliSeconds(0);
  }

  function resetWatch() {
    setIsStarted(false);
    setIsPaused(false);
    setMilliSeconds(0);
    setLaps([]);
  }

  function handleSetLap() {
    if (laps.at(-1) === currentTimeString) return;
    setLaps(prev => [...prev, currentTimeString]);
  }

  function computeDiffBwLaps() {
    if (laps.length <= 1) return `00:00:00:00`;
    const convertToMs = (time: string) => {
      const parts = time
        .split(":")
        .map(Number);

      let h = 0;
      let m = 0;
      let s = 0;
      let cs = 0;

      if (parts.length === 4) {
        [h, m, s, cs] = parts;
      } else {
        [m, s, cs] = parts;
      }

      return (
        h * 3600000 +
        m * 60000 +
        s * 1000 +
        cs * 10
      );
    };

    const lastLapString = laps.at(-2)!;
    const currrentLapString = laps.at(-1)!;

    const prevMs = convertToMs(lastLapString);

    const currentMs =
      convertToMs(currrentLapString);

    const diff = Math.abs(
      currentMs - prevMs
    );
    return extractTimeFromMs(diff);
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "'Courier New', monospace", fontSize: "3rem", fontWeight: "400",
        color: "#1a1a2e", margin: "1.5rem 0 1rem", letterSpacing: "0.02em",
        background: "#f7f6f2", borderRadius: "10px", padding: "0.75rem 1.5rem", display: "inline-block"
      }}>
        {currentTimeString}
      </div>

      <div style={{ display: "flex", gap: "8px", justifyContent: "center", margin: "0.5rem 0 1rem" }}>
        {!isStarted 
        ? (<Btn onClick={startWatch} accent={true}>Start</Btn>) 
        : (<Btn onClick={() => setIsPaused(!isPaused)} accent={true}>{isPaused ? "Resume" : "Pause"}</Btn>)
        }
        <Btn onClick={handleSetLap} disabled={!isStarted && !isPaused}>Lap</Btn>
        <Btn onClick={resetWatch}>Reset</Btn>
      </div>

      {laps.length > 0 && (
        <div style={{ maxHeight: "160px", overflowY: "auto", border: "0.5px solid #e0ddd6", borderRadius: "8px", background: "#faf9f6" }}>
          {[...laps].reverse().map((t, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 14px", borderBottom: "0.5px solid #ede", fontSize: "13px", fontFamily: "monospace" }}>
              <span style={{ color: "#aaa" }}>Lap {laps.length - i}</span>
              <span style={{ color: "#1a1a2e" }}>{t}</span>
              {i > 0 && <span style={{ color: "#888" }}>+{computeDiffBwLaps()}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}