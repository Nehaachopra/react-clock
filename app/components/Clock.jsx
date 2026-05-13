"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const MODES = ["clock", "timer", "stopwatch", "alarm"];

const pad = (n) => String(Math.floor(n)).padStart(2, "0");

function AnalogClock({ hours, minutes, seconds }) {
  const secDeg = seconds * 6;
  const minDeg = minutes * 6 + seconds * 0.1;
  const hrDeg = (hours % 12) * 30 + minutes * 0.5;

  return (
    <svg viewBox="0 0 200 200" width="200" height="200" style={{ display: "block", margin: "0 auto" }}>
      <circle cx="100" cy="100" r="96" fill="none" stroke="#e2e0d8" strokeWidth="1.5" />
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

function ClockMode() {
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

function TimerMode() {
  const [input, setInput] = useState({ h: 0, m: 5, s: 0 });
  const [remaining, setRemaining] = useState(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  const totalInput = input.h * 3600 + input.m * 60 + input.s;

  const start = useCallback(() => {
    if (remaining === null) {
      if (totalInput <= 0) return;
      setRemaining(totalInput);
    }
    setDone(false);
    setRunning(true);
  }, [remaining, totalInput]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setDone(true);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const pause = () => setRunning(false);
  const reset = () => { setRunning(false); setRemaining(null); setDone(false); };

  const display = remaining !== null ? remaining : totalInput;
  const dh = Math.floor(display / 3600);
  const dm = Math.floor((display % 3600) / 60);
  const ds = display % 60;
  const progress = remaining !== null && totalInput > 0 ? remaining / totalInput : 1;
  const r = 88, circ = 2 * Math.PI * r;

  return (
    <div style={{ textAlign: "center" }}>
      <svg viewBox="0 0 200 200" width="200" height="200" style={{ display: "block", margin: "0 auto" }}>
        <circle cx="100" cy="100" r={r} fill="none" stroke="#e2e0d8" strokeWidth="4" />
        <circle
          cx="100" cy="100" r={r} fill="none"
          stroke={done ? "#c0392b" : "#1a6b3c"}
          strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - progress)}
          transform="rotate(-90 100 100)"
          style={{ transition: "stroke-dashoffset 0.8s linear" }}
        />
        <text x="100" y="95" textAnchor="middle" fontSize="28" fontWeight="400" fill={done ? "#c0392b" : "#1a1a2e"} fontFamily="Georgia, serif">
          {pad(dh)}:{pad(dm)}:{pad(ds)}
        </text>
        <text x="100" y="120" textAnchor="middle" fontSize="11" fill="#999" fontFamily="sans-serif">
          {done ? "time's up!" : running ? "running" : "timer"}
        </text>
      </svg>

      {remaining === null && !running && (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", margin: "1rem 0", alignItems: "center" }}>
          {["h", "m", "s"].map(unit => (
            <div key={unit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <label style={{ fontSize: "11px", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em" }}>{unit}</label>
              <input
                type="number" min="0" max={unit === "h" ? 23 : 59}
                value={input[unit]}
                onChange={e => setInput(p => ({ ...p, [unit]: Math.max(0, parseInt(e.target.value) || 0) }))}
                style={{ width: "56px", textAlign: "center", fontSize: "1.1rem", padding: "6px 4px", border: "0.5px solid #ccc", borderRadius: "6px", fontFamily: "Georgia, serif" }}
              />
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "0.75rem" }}>
        {!running
          ? <Btn onClick={start} accent>{remaining !== null ? "Resume" : "Start"}</Btn>
          : <Btn onClick={pause}>Pause</Btn>
        }
        <Btn onClick={reset}>Reset</Btn>
      </div>
    </div>
  );
}

function StopwatchMode() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const startRef = useRef(null);
  const savedRef = useRef(0);

  useEffect(() => {
    let raf;
    if (running) {
      startRef.current = Date.now();
      const tick = () => {
        setElapsed(savedRef.current + Date.now() - startRef.current);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const toggle = () => {
    if (running) { savedRef.current = elapsed; }
    setRunning(r => !r);
  };
  const reset = () => { setRunning(false); savedRef.current = 0; setElapsed(0); setLaps([]); };
  const lap = () => setLaps(l => [...l, elapsed]);

  const fmt = (ms) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const cs = Math.floor((ms % 1000) / 10);
    return `${h ? pad(h) + ":" : ""}${pad(m)}:${pad(sec)}:${pad(cs)}`;
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "'Courier New', monospace", fontSize: "3rem", fontWeight: "400",
        color: "#1a1a2e", margin: "1.5rem 0 1rem", letterSpacing: "0.02em",
        background: "#f7f6f2", borderRadius: "10px", padding: "0.75rem 1.5rem", display: "inline-block"
      }}>
        {fmt(elapsed)}
      </div>

      <div style={{ display: "flex", gap: "8px", justifyContent: "center", margin: "0.5rem 0 1rem" }}>
        <Btn onClick={toggle} accent>{running ? "Pause" : elapsed > 0 ? "Resume" : "Start"}</Btn>
        <Btn onClick={lap} disabled={!running}>Lap</Btn>
        <Btn onClick={reset}>Reset</Btn>
      </div>

      {laps.length > 0 && (
        <div style={{ maxHeight: "160px", overflowY: "auto", border: "0.5px solid #e0ddd6", borderRadius: "8px", background: "#faf9f6" }}>
          {[...laps].reverse().map((t, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 14px", borderBottom: "0.5px solid #ede", fontSize: "13px", fontFamily: "monospace" }}>
              <span style={{ color: "#aaa" }}>Lap {laps.length - i}</span>
              <span style={{ color: "#1a1a2e" }}>{fmt(t)}</span>
              {i > 0 && <span style={{ color: "#888" }}>+{fmt(t - laps[laps.length - i - 1])}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AlarmMode() {
  const [alarms, setAlarms] = useState([]);
  const [inputTime, setInputTime] = useState("07:00");
  const [inputLabel, setInputLabel] = useState("");
  const [ringing, setRinging] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      const cur = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      setAlarms(prev => prev.map(a => {
        if (a.active && a.time === cur && now.getSeconds() === 0 && !a.ringing) {
          setRinging(a.id);
          return { ...a, ringing: true };
        }
        return a;
      }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const addAlarm = () => {
    if (!inputTime) return;
    setAlarms(prev => [...prev, { id: Date.now(), time: inputTime, label: inputLabel || "Alarm", active: true, ringing: false }]);
    setInputLabel("");
  };

  const toggle = (id) => setAlarms(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  const remove = (id) => setAlarms(prev => prev.filter(a => a.id !== id));
  const dismiss = (id) => { setRinging(null); setAlarms(prev => prev.map(a => a.id === id ? { ...a, ringing: false } : a)); };

  return (
    <div>
      {ringing && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "10px", padding: "12px 16px", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#c0392b", fontWeight: "500", fontSize: "14px" }}>
            🔔 {alarms.find(a => a.id === ringing)?.label} is ringing!
          </span>
          <Btn onClick={() => dismiss(ringing)} danger>Dismiss</Btn>
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", marginBottom: "1rem", flexWrap: "wrap" }}>
        <input type="time" value={inputTime} onChange={e => setInputTime(e.target.value)}
          style={{ flex: "0 0 auto", padding: "8px 10px", border: "0.5px solid #ccc", borderRadius: "8px", fontFamily: "'Georgia', serif", fontSize: "1rem", color: "black" }} />
        <input type="text" value={inputLabel} onChange={e => setInputLabel(e.target.value)}
          placeholder="Label (optional)"
          style={{ flex: 1, minWidth: "100px", padding: "8px 10px", border: "0.5px solid #ccc", borderRadius: "8px", fontSize: "0.9rem", color: "black" }} />
        <Btn onClick={addAlarm} accent>+ Add</Btn>
      </div>

      {alarms.length === 0 && (
        <div style={{ textAlign: "center", color: "#bbb", fontSize: "13px", padding: "2rem 0", fontStyle: "italic" }}>No alarms set</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {alarms.map(alarm => (
          <div key={alarm.id} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 14px", border: "0.5px solid #e0ddd6", borderRadius: "10px",
            background: alarm.ringing ? "#fef2f2" : alarm.active ? "#f7f6f2" : "#fafaf8",
            opacity: alarm.active ? 1 : 0.6
          }}>
            <div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "1.4rem", color: "#1a1a2e", lineHeight: 1 }}>{alarm.time}</div>
              <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>{alarm.label}</div>
            </div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <button onClick={() => toggle(alarm.id)} style={{
                width: "40px", height: "22px", borderRadius: "11px", border: "none", cursor: "pointer",
                background: alarm.active ? "#1a6b3c" : "#ddd", position: "relative", transition: "background 0.2s"
              }}>
                <span style={{
                  position: "absolute", top: "3px", left: alarm.active ? "21px" : "3px",
                  width: "16px", height: "16px", borderRadius: "50%", background: "white",
                  transition: "left 0.2s"
                }} />
              </button>
              <button onClick={() => remove(alarm.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: "16px", padding: "4px", lineHeight: 1 }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Btn({ children, onClick, accent, danger, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "8px 18px", border: "0.5px solid",
        borderColor: danger ? "#fca5a5" : accent ? "#1a6b3c" : "#ccc",
        borderRadius: "8px", cursor: disabled ? "default" : "pointer",
        background: danger ? "#fef2f2" : accent ? "#1a6b3c" : "transparent",
        color: danger ? "#c0392b" : accent ? "#fff" : "#444",
        fontSize: "13px", fontFamily: "sans-serif", fontWeight: "500",
        opacity: disabled ? 0.4 : 1, transition: "all 0.15s"
      }}
    >
      {children}
    </button>
  );
}

const MODE_ICONS = { 
  clock: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-clock-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
</svg>), 
  timer: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-hourglass-split" viewBox="0 0 16 16">
  <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>
</svg>), 
stopwatch: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-stopwatch-fill" viewBox="0 0 16 16">
  <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07A7.001 7.001 0 0 0 8 16a7 7 0 0 0 5.29-11.584l.013-.012.354-.354.353.354a.5.5 0 1 0 .707-.707l-1.414-1.415a.5.5 0 1 0-.707.707l.354.354-.354.354-.012.012A6.97 6.97 0 0 0 9 2.071V1h.5a.5.5 0 0 0 0-1zm2 5.6V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 1 1 1 0"/>
</svg>),
alarm: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-alarm-fill" viewBox="0 0 16 16">
  <path d="M6 .5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H9v1.07a7.001 7.001 0 0 1 3.274 12.474l.601.602a.5.5 0 0 1-.707.708l-.746-.746A6.97 6.97 0 0 1 8 16a6.97 6.97 0 0 1-3.422-.892l-.746.746a.5.5 0 0 1-.707-.708l.602-.602A7.001 7.001 0 0 1 7 2.07V1h-.5A.5.5 0 0 1 6 .5m2.5 5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9zM.86 5.387A2.5 2.5 0 1 1 4.387 1.86 8.04 8.04 0 0 0 .86 5.387M11.613 1.86a2.5 2.5 0 1 1 3.527 3.527 8.04 8.04 0 0 0-3.527-3.527"/>
</svg>) 
};

const MODE_LABELS = { clock: "Clock", timer: "Timer", stopwatch: "Stopwatch", alarm: "Alarm" };

export default function ClockApp() {
  const [mode, setMode] = useState("clock");

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
            {mode === "clock" && <ClockMode />}
            {mode === "timer" && <TimerMode />}
            {mode === "stopwatch" && <StopwatchMode />}
            {mode === "alarm" && <AlarmMode />}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "11px", color: "#bbb", letterSpacing: "0.08em" }}>
          WORLD CLOCK
        </div>
      </div>
    </div>
  );
}
