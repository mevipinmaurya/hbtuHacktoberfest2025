// Temperature Converter
// Converts temperatures between Celsius, Fahrenheit, and Kelvin

function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

function fahrenheitToCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

function celsiusToKelvin(celsius) {
  return celsius + 273.15;
}

function kelvinToCelsius(kelvin) {
  return kelvin - 273.15;
}

function fahrenheitToKelvin(fahrenheit) {
  return celsiusToKelvin(fahrenheitToCelsius(fahrenheit));
}

function kelvinToFahrenheit(kelvin) {
  return celsiusToFahrenheit(kelvinToCelsius(kelvin));
}

// --- Examples ---

const boilingPointC = 100;
console.log(`${boilingPointC}°C = ${celsiusToFahrenheit(boilingPointC)}°F`);
console.log(`${boilingPointC}°C = ${celsiusToKelvin(boilingPointC)} K`);

const bodyTempF = 98.6;
console.log(`${bodyTempF}°F = ${fahrenheitToCelsius(bodyTempF).toFixed(2)}°C`);
console.log(`${bodyTempF}°F = ${fahrenheitToKelvin(bodyTempF).toFixed(2)} K`);

const absoluteZeroK = 0;
console.log(`${absoluteZeroK} K = ${kelvinToCelsius(absoluteZeroK).toFixed(2)}°C`);
console.log(`${absoluteZeroK} K = ${kelvinToFahrenheit(absoluteZeroK).toFixed(2)}°F`);
