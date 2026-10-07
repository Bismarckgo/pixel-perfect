import { useEffect, useState } from "react";

export type Place = { name: string; lat: number; lon: number };
export type Weather = { temp: number; code: number; max: number; min: number; isDay: boolean };

const LOC_KEY = "cerebro.location.v1";
const DEFAULT_PLACE: Place = { name: "Ciudad de Panamá", lat: 8.9824, lon: -79.5199 };

export function describe(code: number): string {
  if (code === 0) return "Despejado";
  if (code <= 2) return "Parcialmente nublado";
  if (code === 3) return "Nublado";
  if (code <= 48) return "Neblina";
  if (code <= 67) return "Lluvia";
  if (code <= 77) return "Nieve";
  if (code <= 82) return "Chubascos";
  return "Tormenta";
}

export async function fetchWeather(p: Place): Promise<Weather> {
  const u = `https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
  const r = await fetch(u);
  if (!r.ok) throw new Error("clima no disponible");
  const j = await r.json();
  return {
    temp: Math.round(j.current.temperature_2m),
    code: j.current.weather_code,
    isDay: j.current.is_day === 1,
    max: Math.round(j.daily.temperature_2m_max[0]),
    min: Math.round(j.daily.temperature_2m_min[0]),
  };
}

export async function geocodeCity(q: string): Promise<Place | null> {
  const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=es`);
  if (!r.ok) return null;
  const j = await r.json();
  const g = j.results?.[0];
  return g ? { name: g.name, lat: g.latitude, lon: g.longitude } : null;
}

export function usePlace() {
  const [place, setPlaceState] = useState<Place>(DEFAULT_PLACE);
  const [custom, setCustom] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOC_KEY);
      if (raw) { setPlaceState(JSON.parse(raw)); setCustom(true); }
    } catch {}
  }, []);
  function setPlace(p: Place) {
    setPlaceState(p); setCustom(true);
    localStorage.setItem(LOC_KEY, JSON.stringify(p));
  }
  return { place, setPlace, custom };
}
