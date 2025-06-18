import React from "react";

export default function WeatherCard({ weather }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 text-center space-y-4">
      <h2 className="text-2xl font-semibold">{weather.city}, {weather.country}</h2>
      <img className="w-20 mx-auto" src={weather.icon} alt={weather.description} />
      <p className="text-xl">{Math.round(weather.temp)}°C</p>
      <p className="capitalize text-gray-600">{weather.description}</p>
    </div>
  );
}
