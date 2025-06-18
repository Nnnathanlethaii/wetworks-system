import React, { useState } from "react";
import { getWeather } from "./api";
import WeatherCard from "./components/WeatherCard";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setWeather(null);
    try {
      const data = await getWeather(city);
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="w-full max-w-md space-y-6">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="flex-grow px-4 py-2 rounded-lg border"
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" type="submit">
            {loading ? "Loading..." : "Get Weather"}
          </button>
        </form>
        {error && <p className="text-red-500">{error}</p>}
        {weather && <WeatherCard weather={weather} />}
      </div>
    </div>
  );
}
