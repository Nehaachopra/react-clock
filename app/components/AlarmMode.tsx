'use client';
import { useEffect, useState } from "react";
import Btn from "./Btn";

interface Alarm {
  id: number,
  h: number,
  m: number,
  expired: boolean,
  isPaused: boolean,
  isActive: boolean,
  label: string
}
interface HourMin {
  h: number,
  m: number,
}

export default function AlarmMode(props) {
  const pad = props.functions;
  const [audio] = useState(() => new Audio('/audio/alarm.mp3'));
  const [hourMin, setHourMin] = useState<HourMin | null>(null);
  const [label, setLabel] = useState<string>('');
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  audio.loop = true;

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();

      setAlarms(prev => 
        prev.map(alarm => {
          if (alarm.h === h && alarm.m === m && alarm.isActive && !alarm.expired) {
            if (audio.paused) {
              audio.currentTime = 0;
              audio.play().catch(console.error);
            }
            const updated = {
              ...alarm,
              expired: true,
            };
            setRingingAlarm(updated);
             return updated;
          }
          else if (alarm.expired && alarm.m !== m) {
            return {
              ...alarm,
              expired: false
            }
          }
          
          return alarm;
        })
      )
    }
    checkAlarms();
    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
    
  },[])
  
  function addAlarm() {
    if (hourMin && (hourMin.h > 0 || hourMin.m > 0)) {
      const duplicate = alarms.find(one => one.h === hourMin.h && one.m === hourMin.m);
      if (!duplicate) {
        setAlarms(prev => [...prev, 
          {
            id: Date.now(),
            h: hourMin.h, 
            m: hourMin.m, 
            expired: false, 
            isPaused: false, 
            isActive: true,
            label
          }])
      }
    }
    
    setHourMin(null);
    setLabel('');
  }
  return (
    <div>
      {ringingAlarm && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "10px", padding: "12px 16px", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#c0392b", fontWeight: "500", fontSize: "14px" }}>
            🔔 {ringingAlarm.label.length > 1} alarm is ringing!
          </span>
          <Btn onClick={() => {
            audio.pause();
            audio.currentTime = 0;
            setAlarms(prev => {
              const updated = [...prev];
              const targetAlarm = updated.find(one => one.id === ringingAlarm.id);
              if (targetAlarm) {
                targetAlarm.isPaused = false;
                targetAlarm.isActive = true;
              }
              return updated;
            });
            setRingingAlarm(null);
          }} danger>Dismiss</Btn>
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", marginBottom: "1rem", flexWrap: "wrap" }}>
        <input type="time" value={hourMin ? `${pad(hourMin.h)}:${pad(hourMin.m)}` : "00:00"} onChange={(e) => {
          const [h, m] = e.target.value.split(":").map(Number);
          setHourMin({h, m});
        }}
          style={{ flex: "0 0 auto", padding: "8px 10px", border: "0.5px solid #ccc", borderRadius: "8px", fontFamily: "'Georgia', serif", fontSize: "1rem", color: "black" }} />

        <input type="text" value={label} onChange={e => setLabel(e.target.value)}
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
            background: alarm.expired ? "#fef2f2" : alarm.isActive ? "#f7f6f2" : "#fafaf8",
            opacity: alarm.isActive ? 1 : 0.6
          }}>
            <div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "1.4rem", color: "#1a1a2e", lineHeight: 1 }}>{pad(alarm.h)}:{pad(alarm.m)}</div>
              <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>{alarm.label}</div>
            </div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              {!alarm.expired 
              && (<button onClick={() => {
                setAlarms(prev => {
                  const updated = [...prev];
                  const targetAlarm = updated.find(one => one.id === alarm.id);
                  if (targetAlarm) {
                    targetAlarm.isActive = !targetAlarm.isActive;
                  }
                  return updated;
                })
              }} style={{
                width: "40px", height: "22px", borderRadius: "11px", border: "none", cursor: "pointer",
                background: alarm.isActive ? "#1a6b3c" : "#ddd", position: "relative", transition: "background 0.2s"
                }}>
                <span style={{
                  position: "absolute", top: "3px", left: alarm.isActive ? "21px" : "3px",
                  width: "16px", height: "16px", borderRadius: "50%", background: "white",
                  transition: "left 0.2s"
                }} />
              </button>
              
              )
              }
              <button onClick={() => {
                if (ringingAlarm && ringingAlarm.id === alarm.id) {
                  audio.pause();
                  audio.currentTime = 0;
                  setRingingAlarm(null);
                }
                setAlarms(prev => {
                  const updated = [...prev];
                  const targetIndex = updated.findIndex(one => one.id === alarm.id);
                  if (targetIndex !== -1) {
                    updated.splice(targetIndex, 1);
                  }
                  return updated
                })
              }} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: "16px", padding: "4px", lineHeight: 1 }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}