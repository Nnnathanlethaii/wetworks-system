const apiKey = 'aab1f56c56fa958aa9f345537430e0a1';

document.getElementById('modeToggle')?.addEventListener('change', function () {
  document.body.classList.toggle('dark', this.checked);
});

document.addEventListener('DOMContentLoaded', loadHistory);

async function getWeather() {
  const city = document.getElementById('cityInput')?.value.trim();
  const country = document.getElementById('countryCode')?.value.trim();

  if (!city) return showError('Please enter a city name');

  const query = country ? `${city},${country}` : city;
  saveToHistory(query);
  await fetchWeatherData({ city: query });
}

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

function displayWeather(data) {
  const { name, main, weather, wind } = data;
  if (!weather?.[0]) return showError('Incomplete weather data');

  const result = `
    <h2>${name}</h2>
    <p>${weather[0].description}</p>
    <p><strong>${main.temp}°C</strong> | Feels like ${main.feels_like}°C</p>
    <p>Wind: ${wind?.speed ?? 'N/A'} m/s | Humidity: ${main.humidity}%</p>
    <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}" />
  `;
  document.getElementById('weatherResult').innerHTML = result;
}

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
      <div>
        <strong>${date}</strong>: ${desc}, ${temp}°C
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}" />
      </div>
    `;
  });
}

function showError(message) {
  document.getElementById('weatherResult').innerHTML = `<p style="color:red;">${message}</p>`;
  document.getElementById('forecastResult').innerHTML = '';
}

function saveToHistory(query) {
  let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  if (!history.includes(query)) {
    history.unshift(query);
    if (history.length > 5) history.pop();
    localStorage.setItem('weatherHistory', JSON.stringify(history));
    loadHistory();
  }
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  const list = document.getElementById('historyList');
  list.innerHTML = '';

  history.forEach(query => {
    const cityOnly = query.split(',')[0];

    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = cityOnly;
    span.onclick = () => {
      document.getElementById('cityInput').value = cityOnly;
      getWeather();
    };

    const delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteHistoryItem(query);
    };

    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

function deleteHistoryItem(query) {
  let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  history = history.filter(item => item !== query);
  localStorage.setItem('weatherHistory', JSON.stringify(history));
  loadHistory();
}

function clearHistory() {
  localStorage.removeItem('weatherHistory');
  loadHistory();
}

function toggleDropdown(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}
