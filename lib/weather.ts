/**
 * Accurate weather via Open-Meteo (no API key).
 * https://open-meteo.com — ECMWF/NOAA models, CC BY 4.0 attribution required.
 */

export const NS_DEFAULT = {
  name: "Truro, NS",
  lat: 45.3647,
  lon: -63.2797,
};

export interface CurrentWeather {
  time: string;
  temperatureC: number;
  feelsLikeC: number;
  humidity: number;
  weatherCode: number;
  weatherLabel: string;
  windKmh: number;
  windGustKmh: number;
  windDirectionDeg: number;
  windCompass: string;
  pressureHpa: number;
  cloudCover: number;
  precipitationMm: number;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  weatherLabel: string;
  tempMaxC: number;
  tempMinC: number;
  precipitationMm: number;
  windMaxKmh: number;
  sunrise: string;
  sunset: string;
}

export interface HourlyPoint {
  time: string;
  temperatureC: number;
  windKmh: number;
  precipitationMm: number;
  weatherCode: number;
}

export interface WeatherBundle {
  latitude: number;
  longitude: number;
  timezone: string;
  locationLabel: string;
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly: HourlyPoint[];
  source: "Open-Meteo";
  fetchedAt: string;
}

const WMO: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Heavy freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Rain showers",
  81: "Rain showers",
  82: "Violent rain showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with heavy hail",
};

export function weatherLabel(code: number): string {
  return WMO[code] ?? `Code ${code}`;
}

export function windCompass(deg: number): string {
  const labels = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return labels[Math.round(deg / 22.5) % 16];
}

/** Hunter activity heuristic from wind + precip + temp */
export function huntScore(current: CurrentWeather): {
  score: number;
  note: string;
} {
  let score = 70;
  if (current.windKmh > 25) score -= 20;
  else if (current.windKmh > 15) score -= 8;
  else if (current.windKmh < 8) score += 5;
  if (current.precipitationMm > 2) score -= 15;
  else if (current.precipitationMm > 0.2) score -= 5;
  if (current.temperatureC < -15 || current.temperatureC > 25) score -= 10;
  if (current.weatherCode >= 95) score -= 25;
  score = Math.max(0, Math.min(100, score));
  let note = "Fair conditions";
  if (score >= 80) note = "Good sit weather — moderate wind, limited precip";
  else if (score < 45) note = "Tough conditions — wind, precip, or extremes";
  return { score, note };
}

export async function fetchWeather(
  lat: number,
  lon: number,
  locationLabel = "Your location"
): Promise<WeatherBundle> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
      "cloud_cover",
      "pressure_msl",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m",
    ].join(","),
    hourly: [
      "temperature_2m",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
      "wind_speed_10m_max",
      "sunrise",
      "sunset",
    ].join(","),
    timezone: "America/Halifax",
    forecast_days: "7",
    wind_speed_unit: "kmh",
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params}`;
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) {
    throw new Error(`Open-Meteo error ${res.status}`);
  }
  const data = await res.json();

  const c = data.current;
  const current: CurrentWeather = {
    time: c.time,
    temperatureC: c.temperature_2m,
    feelsLikeC: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    weatherCode: c.weather_code,
    weatherLabel: weatherLabel(c.weather_code),
    windKmh: c.wind_speed_10m,
    windGustKmh: c.wind_gusts_10m,
    windDirectionDeg: c.wind_direction_10m,
    windCompass: windCompass(c.wind_direction_10m),
    pressureHpa: c.pressure_msl,
    cloudCover: c.cloud_cover,
    precipitationMm: c.precipitation,
  };

  const daily: DailyForecast[] = (data.daily?.time ?? []).map(
    (date: string, i: number) => ({
      date,
      weatherCode: data.daily.weather_code[i],
      weatherLabel: weatherLabel(data.daily.weather_code[i]),
      tempMaxC: data.daily.temperature_2m_max[i],
      tempMinC: data.daily.temperature_2m_min[i],
      precipitationMm: data.daily.precipitation_sum[i],
      windMaxKmh: data.daily.wind_speed_10m_max[i],
      sunrise: data.daily.sunrise[i],
      sunset: data.daily.sunset[i],
    })
  );

  const hourly: HourlyPoint[] = (data.hourly?.time ?? [])
    .slice(0, 24)
    .map((time: string, i: number) => ({
      time,
      temperatureC: data.hourly.temperature_2m[i],
      windKmh: data.hourly.wind_speed_10m[i],
      precipitationMm: data.hourly.precipitation[i],
      weatherCode: data.hourly.weather_code[i],
    }));

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    locationLabel,
    current,
    daily,
    hourly,
    source: "Open-Meteo",
    fetchedAt: new Date().toISOString(),
  };
}
