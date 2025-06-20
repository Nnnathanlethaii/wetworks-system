const apiKey = 'aab1f56c56fa958aa9f345537430e0a1';

// 🌙 Dark Mode toggle
document.getElementById('modeToggle')?.addEventListener('change', function () {
  document.body.classList.toggle('dark', this.checked);
});

// 🌍 Fetch weather by city input
async function getWeather() {
  const city = document.getElementById('cityInput')?.value.trim();
  if (!city) return showError('Please enter a city name');
  await fetchWeatherData({ city });
}

// 📍 Fetch weather by geolocation
async function getWeatherByLocation() {
  if (!navigator.geolocation) return showError('Geolocation not supported');

  navigator.geolocation.getCurrentPosition(async ({ coords }) => {
    await fetchWeatherData({ lat: coords.latitude, lon: coords.longitude });
  }, () => showError('Unable to retrieve your location'));
}

// 🔄 Generic fetch function
async function fetchWeatherData({ city = '', lat, lon }) {
  try {
    const baseUrl = 'https://api.openweathermap.org/data/2.5';
    const query = city
      ? `q=${encodeURIComponent(city)}`
      : `lat=${lat}&lon=${lon}`;
    const common = `&appid=${apiKey}&units=metric`;

    const [weatherRes, forecastRes] = await Promise.all([
      fetch(`${baseUrl}/weather?${query}${common}`),
      fetch(`${baseUrl}/forecast?${query}${common}`)
    ]);

    if (!weatherRes.ok || !forecastRes.ok) throw new Error('City not found');

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    displayWeather(weatherData);
    displayForecast(forecastData);
  } catch (err) {
    showError(err.message);
  }
}

// 🌦 Render current weather
function displayWeather(data) {
  const { name, main, weather } = data;
  if (!weather?.[0]) return showError('Incomplete weather data');

  const result = `
    <h2>${name}</h2>
    <p>${weather[0].description}</p>
    <p><strong>${main.temp}°C</strong></p>
    <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}" />
  `;
  document.getElementById('weatherResult').innerHTML = result;
}

// 📅 Render 5-day forecast
function displayForecast(data) {
  const forecastEl = document.getElementById('forecastResult');
  forecastEl.innerHTML = '<h3>5-Day Forecast</h3>';

  const daily = data.list.filter(item => item.dt_txt.includes('12:00:00'));

  daily.forEach(({ dt_txt, weather, main }) => {
    const date = new Date(dt_txt).toLocaleDateString();
    const desc = weather[0]?.description ?? 'N/A';
    const icon = weather[0]?.icon ?? '01d';
    const temp = main.temp;

    forecastEl.innerHTML += `
      <div style="margin: 0.5rem 0;">
        <strong>${date}</strong>: ${desc}, ${temp}°C
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}" />
      </div>
    `;
  });
}

// ⚠️ Reusable error display
function showError(message) {
  document.getElementById('weatherResult').innerHTML = `<p style="color:red;">${message}</p>`;
  document.getElementById('forecastResult').innerHTML = '';
}
