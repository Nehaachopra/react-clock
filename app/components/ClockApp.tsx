"use client";
import { useState } from "react";
import ClockMode from "./ClockMode";
import TimerMode from "./TimerMode";
import StopwatchMode from "./StopwatchMode";
import AlarmMode from "./AlarmMode";

const MODES = ["clock", "timer", "stopwatch", "alarm"];
const MODE_ICONS = { 
  clock: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-clock-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
</svg>), 
  timer: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-hourglass-split" viewBox="0 0 16 16">
  <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>
</svg>), 
stopwatch: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-stopwatch-fill" viewBox="0 0 16 16">
  <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07A7.001 7.001 0 0 0 8 16a7 7 0 0 0 5.29-11.584l.013-.012.354-.354.353.354a.5.5 0 1 0 .707-.707l-1.414-1.415a.5.5 0 1 0-.707.707l.354.354-.354.354-.012.012A6.97 6.97 0 0 0 9 2.071V1h.5a.5.5 0 0 0 0-1zm2 5.6V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 1 1 1 0"/>
</svg>),
alarm: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-alarm-fill" viewBox="0 0 16 16">
  <path d="M6 .5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H9v1.07a7.001 7.001 0 0 1 3.274 12.474l.601.602a.5.5 0 0 1-.707.708l-.746-.746A6.97 6.97 0 0 1 8 16a6.97 6.97 0 0 1-3.422-.892l-.746.746a.5.5 0 0 1-.707-.708l.602-.602A7.001 7.001 0 0 1 7 2.07V1h-.5A.5.5 0 0 1 6 .5m2.5 5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9zM.86 5.387A2.5 2.5 0 1 1 4.387 1.86 8.04 8.04 0 0 0 .86 5.387M11.613 1.86a2.5 2.5 0 1 1 3.527 3.527 8.04 8.04 0 0 0-3.527-3.527"/>
</svg>) 
};

const MODE_LABELS = { clock: "Clock", timer: "Timer", stopwatch: "Stopwatch", alarm: "Alarm" };

export default function ClockApp() {
  const [mode, setMode] = useState("clock");

  const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");

  return (
    <div style={{ minHeight: "100vh", background: "#f4f2ec", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem", fontFamily: "sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <div style={{ background: "white", borderRadius: "20px", border: "0.5px solid #e0ddd6", overflow: "hidden", boxShadow: "0 2px 24px rgba(0,0,0,0.07)" }}>
          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: "0.5px solid #e0ddd6", paddingTop: "1rem"}}>
            {MODES.map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1, padding: "12px 4px 10px", border: "none", cursor: "pointer", fontSize: "11px",
                  fontFamily: "sans-serif", fontWeight: mode === m ? "600" : "400",
                  background: "white", color: mode === m ? "#1a1a2e" : "#aaa",
                  borderBottom: mode === m ? "2px solid #1a1a2e" : "2px solid transparent",
                  transition: "all 0.15s", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px"
                }}
              >
                <span style={{ fontSize: "16px" }}>{MODE_ICONS[m]}</span>
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ padding: "1.5rem", minHeight: "280px" }}>
            {mode === "clock" && <ClockMode functions={pad}/>}
            {mode === "timer" && <TimerMode functions={pad}/>}
            {mode === "stopwatch" && <StopwatchMode functions={pad}/>}
            {mode === "alarm" && <AlarmMode functions={pad}/>} 
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "11px", color: "#bbb", letterSpacing: "0.08em" }}>
          WORLD CLOCK
        </div>
      </div>
    </div>
  );
}