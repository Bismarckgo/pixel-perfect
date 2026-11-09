let audio: AudioContext | undefined;
export function prepareSessionDisplay() {
  if (typeof document === "undefined") return;
  if (!document.fullscreenElement) void document.documentElement.requestFullscreen?.().catch(() => {});
  try { audio ??= new AudioContext(); void audio.resume().catch(() => {}); } catch {}
}
export function sessionFeedback() {
  navigator.vibrate?.([150, 70, 150]);
  if (!audio || audio.state !== "running") return;
  const oscillator = audio.createOscillator(); const gain = audio.createGain(); oscillator.connect(gain); gain.connect(audio.destination);
  oscillator.frequency.value = 660; gain.gain.setValueAtTime(0.12, audio.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.35); oscillator.start(); oscillator.stop(audio.currentTime + 0.35);
}
export function exitSessionDisplay() { if (document.fullscreenElement) void document.exitFullscreen?.().catch(() => {}); }