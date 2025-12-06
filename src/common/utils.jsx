// src/features/greenhouse/components/utils.js
export function formatTime(d) {
  const t = new Date(d);
  return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function randomNoise(scale = 1) {
  return (Math.random() - 0.5) * scale;
}
