"use strict"

// --------------------------------------------------------
// --------------------SELECTED ELEMENTS-------------------
// --------------------------------------------------------
const inputEl = document.getElementById("search-inp");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const searchPlacesBtn = document.getElementById("search-places");
const closeSearchBtn = document.getElementById("close-search-container");



let hour = new Date().getHours();
let latitude, longitude;
let todayData, futureData, airData;



// ---------------------------------------------------------
// ------------------EVENT LISTENERS------------------------
// ---------------------------------------------------------
searchBtn.addEventListener("click", function () {
    getCoordinates(inputEl.value);
    setTimeout(() => {
        getCurrentWeather();
        getDailyWeather();
        getAirQuality();
    }, 200);
    setTimeout(() => {
        setTodayValues(todayData);
        setTodayAirQuality(airData);
    }, 600)
})

locationBtn.addEventListener("click", function () {
    currentLocation();
    setTimeout(() => {
        getCurrentWeather();
        getDailyWeather();
        getAirQuality();
    }, 200);
    setTimeout(() => {
        setTodayValues(todayData);
        setTodayAirQuality(airData);
    }, 600)
})

document.addEventListener("DOMContentLoaded", function () {
    yourIPCoordinates();
    setTimeout(() => {
        getCurrentWeather();
        getDailyWeather();
        getAirQuality();
    }, 1000);
    setTimeout(() => {
        setTodayValues(todayData);
        setTodayAirQuality(airData);
    }, 2000)
})

searchPlacesBtn.addEventListener("click", () => {
    document.querySelector(".search-container").classList.remove("hidden");
    document.querySelector(".today-weather-container").classList.add("hidden");
})

closeSearchBtn.addEventListener("click", () => {
    document.querySelector(".search-container").classList.add("hidden");
    document.querySelector(".today-weather-container").classList.remove("hidden");
})

// ------------------------------------------------------
// -----------------WEATHER DATA FUNCTIONS---------------
// ------------------------------------------------------

function getCoordinates(city) {
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`).then((response) => response.json()).then((coordinatesData) => {
        console.log("success", coordinatesData);
        latitude = coordinatesData.results[0].latitude;
        longitude = coordinatesData.results[0].longitude;
    }).catch((error) => {
        console.log("Error", error);
    })
}

function getCurrentWeather() {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,weathercode,surface_pressure,visibility,windspeed_10m,winddirection_10m&timezone=auto`).then((response) => response.json()).then((weatherCurrentData) => {
        console.log("success", weatherCurrentData);
        todayData = weatherCurrentData;
    }).catch((error) => {
        console.log("Error", error);
    })
}

function getDailyWeather() {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`).then((response) => response.json()).then((weatherDailyData) => {
        console.log("success", weatherDailyData);
        futureData = weatherDailyData;
    }).catch((error) => {
        console.log("Error", error);
    })
}

function getAirQuality() {
    fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=pm10,pm2_5&timezone=auto`).then((response) => response.json()).then((airQualityData) => {
        console.log("success", airQualityData);
        airData = airQualityData;
    }).catch((error) => {
        console.log("Error", error);
    })
}


// ------------------------------------------------------
// -----------------USER LOCATION/IP---------------------
// ------------------------------------------------------
function currentLocation() {
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        const crd = pos.coords;
        latitude = crd.latitude;
        longitude = crd.longitude;
        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(crd, pos);
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
}

function yourIPCoordinates() {
    fetch("https://api.ipify.org?format=json").then((response) => response.json()).then((data) => {
        console.log('success', data)
        fetch(`http://ip-api.com/json/${data.ip}`).then((response2) => response2.json()).then((data2) => {
            console.log('success', data2)
            latitude = data2.lat;
            longitude = data2.lon
        })
            .catch((error2) => {
                console.error('Error:', error2);
            });
    })
        .catch((error) => {
            console.error('Error:', error);
        });
}


// ------------------------------------------------------
// -----------------TODAYS WEATHER-----------------------
// ------------------------------------------------------

const todayTempEl = document.getElementById("today-temp");
const todayDescirptionEl = document.getElementById("description");
const todayDateEl = document.getElementById("today-date");
const todayWindEl = document.getElementById("wind-value");
const todayWindArrowEl = document.getElementById("wind-direction-arrow");
const todayhumidityEl = document.getElementById("humidity-value");
const humidityBar = document.getElementById("humidity-progress");
const todayAirPressureEl = document.getElementById("air-pressure-value");
const todayAirQualityEl = document.getElementById("air-quality-value");


function setTodayValues(data) {
    todayTempEl.innerText = data.hourly.temperature_2m[hour];
    todayWindEl.innerText = data.hourly.windspeed_10m[hour];
    todayWindArrowEl.style.rotate = `${data.hourly.winddirection_10m[hour]}deg`;
    todayhumidityEl.innerText = data.hourly.relativehumidity_2m[hour];
    humidityBar.value = data.hourly.relativehumidity_2m[hour];
    todayAirPressureEl.innerText = data.hourly.surface_pressure[hour];
}

function setTodayAirQuality(data) {
    todayAirQualityEl.innerText = data.hourly.pm2_5[hour];
}