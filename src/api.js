export async function getWeather(city) {
  const API_KEY = import.meta.env.AAB1F56C56FA958AA9F345537430E0A1;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("City not found");
  }
  const data = await res.json();
  return {
    temp: data.main.temp,
    description: data.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    city: data.name,
    country: data.sys.country,
  };
}
