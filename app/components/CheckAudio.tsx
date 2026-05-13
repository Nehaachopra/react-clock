"use client";

const audio = new Audio("/audio/alarm.mp3");

export default function Play() {
  return (
    <button onClick={() => audio.play()}>Play</button>
  )
}