import { config } from '../config/env';

export const getWeatherInfo = async (city: string): Promise<string> => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${config.WEATHER_API_KEY}&units=metric`
    );
    if (!res.ok) return 'Weather data unavailable';
    const data: any = await res.json();
    const { main, weather } = data;
    return `${weather[0].description}, ${Math.round(main.temp)}°C, humidity ${main.humidity}%`;
  } catch {
    return 'Weather data unavailable';
  }
};
