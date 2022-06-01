let now = new Date();
let hour = now.getHours();
if (hour < 10) {
  hour = `0${hour}`;
}
let minute = now.getMinutes();
if (minute < 10) {
  minute = `0${minute}`;
}
let months = [
  `January`,
  `Febuary`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`
];
let month = months[now.getMonth()];
let date = now.getDate();
let year = now.getFullYear();
let days = [`Sun.`, `Mon.`, `Tue.`, `Wed.`, `Thu.`, `Fri.`, `Sat.`];
let day = days[now.getDay()];

let currentTime = document.querySelector("#current-time");
currentTime.innerText = `${hour}:${minute}`;

let currentDate = document.querySelector("#current-date");
currentDate.innerText = `${month} ${date}`;

let currentDay = document.querySelector("#current-day");
currentDay.innerHTML = `${day}`;

let celsiusTemperature = null;

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = `76f96a93beeb1a74b7f32846e978f838`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(showForecast);
}

function showTemperature(response) {
  console.log(response);
  let city = response.data.name;
  let currentCity = document.querySelector("h1.city-name");
  currentCity.innerHTML = `${city}`;
  let temp = Math.round(response.data.main.temp);
  celsiusTemperature = Math.round(response.data.main.temp);
  let temperatureNow = document.querySelector("#temperature-now");
  temperatureNow.innerHTML = `${temp}°C`;
  let description = response.data.weather[0].description;
  let weatherDescription = document.querySelector("#description");
  weatherDescription.innerHTML = `${description}`;
  let humidity = response.data.main.humidity;
  let humidityNow = document.querySelector("#humidity");
  humidityNow.innerHTML = `Humidity: ${humidity}%`;
  let windspeed = response.data.wind.speed;
  let windNow = document.querySelector("#windspeed");
  windNow.innerHTML = `Wind: ${windspeed} km/h`;
  let icon = document.querySelector("#icon");
  icon.setAttribute("src", `img/${description}.png`);

  getForecast(response.data.coord);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [`Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, `Sun`];
  return days[day];
}

function showForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#weather-forecast");
  let forecastHTML = `<div class="row">`;
  console.log(forecast);
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
      <div class="day rounded-border">
        ${formatDay(forecastDay.dt)}.
      </div>
      <div class="forecasted-weather-icon">
        <img id="forecasted-weather-icon" src="img/${
          forecastDay.weather[0].description
        }.png" width="100%">
      </div>
      <div class="forecasted-weather-temperature">
        <span class="forecased-weather-temperature-max">
          ${Math.round(forecastDay.temp.max)}°
        </span>
        <span class="forecased-weather-temperature-min">
          ${Math.round(forecastDay.temp.min)}
        </span>
      </div>
    </div>
  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function search(city) {
  let apiKey = `76f96a93beeb1a74b7f32846e978f838`;
  let unit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
}

function handleSubmit(event){
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let cityName = document.querySelector("h1.city-name");
  cityName.innerText = `${cityInput.value}`;
  search(cityInput.value);
}

let searchCityForm = document.querySelector("#search-form");
searchCityForm.addEventListener("submit", handleSubmit);

function handlePosition(position) {
  let locationSwitch = document.querySelector("#switch");
  locationSwitch.innerHTML = `on`;
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = `76f96a93beeb1a74b7f32846e978f838`;
  let unit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
}
navigator.geolocation.getCurrentPosition(handlePosition);

let geolocation = document.querySelector("#geolocation");
geolocation.addEventListener("click", handlePosition);

function showCelsiusUnits(event) {
  event.preventDefault();
  let temperatureNow = document.querySelector("#temperature-now");
  temperatureNow.innerText = `${celsiusTemperature}°C`;
}

let celsiusUnits = document.querySelector("#celsius-link");
celsiusUnits.addEventListener("click", showCelsiusUnits);

function showFahrenheitUnits(event) {
  event.preventDefault();
  let fahrenheitTemerature = Math.round((celsiusTemperature * 9) / 5 + 32);
  let temperatureNow = document.querySelector("#temperature-now");
  temperatureNow.innerText = `${fahrenheitTemerature}°F`;
}
let fahrenheitUnits = document.querySelector("#fahrenheit-link");
fahrenheitUnits.addEventListener("click", showFahrenheitUnits);

search("Mandaluyong City");