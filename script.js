'use strict'

window.onload = function () {
  setDate();
  startClock();
  setLocation();
};

var getImage = function (lat, lon) {
  document.getElementById("image").src = "https://maps.googleapis.com/maps/api/staticmap?center=" + lat + "," + lon + "&zoom=15&size=300x200&sensor=false";
}

var getWeatherData = function (lat, lon) {
  console.log("getjson");
  $.getJSON("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=53ffcc0e9ab24a64bce823edccab5765", parseWeather);
}

var parseWeather = function (json) {
  console.log(json);
  document.getElementById('place').innerHTML = json.name + ", " + json.sys.country;

  document.getElementById('coordinates').innerHTML = json.coord.lat + " " + json.coord.lon;

  document.getElementById('weather').innerHTML = (json.main.temp - 273.15) + "°C";

  document.getElementById('type').innerHTML = json.weather[0].main;

  document.getElementById('temperature').innerHTML = "Min: " + (json.main.temp_min - 273.15) + "°C" + ",   Max: " + (json.main.temp_max - 273.15) + "°C";

  document.getElementById('pressure').innerHTML = "Pressure: " + json.main.pressure;

  document.getElementById('humidity').innerHTML = "Humidity: " + json.main.humidity;

  document.getElementById('wind').innerHTML = "Wind Speed: " + json.wind.speed + ",  Deg: " + json.wind.deg;

  document.getElementById('visibility').innerHTML = "Visibility: " + json.visibility;

  let sunrise_time = convertToDate(json.sys.sunrise);
  document.getElementById('sunrise').innerHTML = "Sunrise: " + sunrise_time.getHours() + ":" + sunrise_time.getMinutes();

  let sunset_time = convertToDate(json.sys.sunset);
  document.getElementById('sunset').innerHTML = "Sunset: " + sunset_time.getHours() + ":" + sunset_time.getMinutes();

  let updated_date = convertToDate(json.dt);
  document.getElementById("dt").innerHTML = "Last updated on " + updated_date.toDateString() + " " + updated_date.getHours() + ":" + updated_date.getMinutes();
}

var convertToDate = function (utc) {
  var d = new Date(0);
  d.setUTCSeconds(utc);
  return d;
}

var geoError = function (error) {
  console.log('Error occurred. Error code: ' + error.code);
  // error.code can be:
  //   0: unknown error
  //   1: permission denied
  //   2: position unavailable (error response from location provider)
  //   3: timed out
  switch (error.code) {
    case 0:
      showError("This shouldn't have happened! Please try again later");
      break;
    case 1:
      showError("Location required for showing your weather!")
      break;
    case 2:
      showError("Position unavailable at current moment");
      break;
    case 3:
      showError("Timed Out! Please turn on permission");
      break;
  }
};

var showError = function (string) {
  document.getElementById('error').innerHTML = string;
};

var geoSuccess = function (position) {
  console.log(position);
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  getWeatherData(lat, lon);
  getImage(lat, lon);
};

var setLocation = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  } else {
    showError("Geolocation not supported");
  }
}

var setDate = function () {
  let d = new Date();
  document.getElementById('heading').innerHTML = d.toDateString();
}

var startClock = function () {
  var clock = document.getElementById('clock');
  var pad = function (x) {
    return x < 10 ? '0' + x : x;
  };

  var ticktock = function () {
    var d = new Date();

    var h = pad(d.getHours());
    var m = pad(d.getMinutes());
    var s = pad(d.getSeconds());

    var current_time = [h, m, s].join(':');

    clock.innerHTML = current_time;

  };

  ticktock();
  setInterval(ticktock, 1000);
};