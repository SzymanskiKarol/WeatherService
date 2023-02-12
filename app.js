"use strict"

// --------------------------------------------------------
// --------------------SELECTED ELEMENTS-------------------
// --------------------------------------------------------
const inputEl = document.getElementById("search-inp");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const searchPlacesBtn = document.getElementById("search-places");
const closeSearchBtn = document.getElementById("close-search-container");

let latitude, longitude;
let todayData, futureData, airData;
let city;
const todayLocationEl = document.getElementById("today-location");


// ---------------------------------------------------------
// -------------------------DATE SET------------------------
// ---------------------------------------------------------
const weekdayArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let date = new Date();
let hour = date.getHours();

function dateValues(index) {
    let nextDay = new Date(date);
    nextDay.setDate(date.getDate() + index);
    let month = monthArr[nextDay.getMonth()];
    let day = nextDay.getDate();
    let weekday = weekdayArr[nextDay.getDay()];
    return `${weekday}, ${day} ${month}`;
}

const todayDateEl = document.getElementById("today-date");
todayDateEl.innerText = dateValues(0);

const futureDateEl = document.querySelectorAll(".future-date");
futureDateEl.forEach((day, index) => {
    day.innerText = dateValues(index + 1);
})



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
        setNext5DaysWeather();
        todayLocationEl.innerText = inputEl.value;
        inputEl.value = '';
    }, 600)
})

locationBtn.addEventListener("click", function () {
    currentLocation();
    setTimeout(() => {
        getCurrentWeather();
        getDailyWeather();
        getAirQuality();
        yourCity();
    }, 200);
    setTimeout(() => {
        setTodayValues(todayData);
        setTodayAirQuality(airData);
        setNext5DaysWeather();
        todayLocationEl.innerText = city;
    }, 600)
})

document.addEventListener("DOMContentLoaded", function () {
    yourIPCoordinates();
    setTimeout(() => {
        getCurrentWeather();
        getDailyWeather();
        getAirQuality();
        yourCity();
    }, 1000);
    setTimeout(() => {
        setTodayValues(todayData);
        setTodayAirQuality(airData);
        setNext5DaysWeather();
        todayLocationEl.innerText = city;
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

function yourCity() {
    fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`).then((response) => response.json()).then((data) => {
        console.log('success', data)
        city = data.address.city;
    })
        .catch((error) => {
            console.error('Error:', error);
        });
}


// ------------------------------------------------------
// -----------------TODAYS WEATHER-----------------------
// ------------------------------------------------------
const todayTempEl = document.getElementById("today-temp");
const mainImgEl = document.getElementById("main-image");
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
    let code = data.hourly.weathercode[hour];
    setImage(code, mainImgEl);
}

function setTodayAirQuality(data) {
    todayAirQualityEl.innerText = data.hourly.pm2_5[hour];
}



// ------------------------------------------------------
// -----------------NEXT 5 DAYS WEATHER------------------
// ------------------------------------------------------
function setNext5DaysWeather() {
    const next5DaysMaxTemp = document.querySelectorAll(".future-temp-max");
    next5DaysMaxTemp.forEach((max, index) => {
        max.innerText = futureData.daily.temperature_2m_max[index + 1] + "℃";
    });

    const next5DaysMinTemp = document.querySelectorAll(".future-temp-min");
    next5DaysMinTemp.forEach((min, index) => {
        min.innerText = futureData.daily.temperature_2m_min[index + 1] + "℃";
    });

    const futureImg = document.querySelectorAll(".future-img");
    futureImg.forEach((img, index) => {
        let code = futureData.daily.weathercode[index + 1];
        // img.src = "images/Snow.png"
        setImage(code, img);
    })
}

function setImage(code, img) {
    switch (code) {
        case 0:
            img.src = "images/Clear.png"
            break;
        case 1:
        case 2:
        case 3:
            img.src = "images/LightCloud.png"
            break;
        case 45:
        case 48:
            img.src = "images/HeavyCloud.png"
            break;
        case 71:
        case 73:
        case 75:
        case 77:
            img.src = "images/Snow.png"
            break;
        case 51:
        case 53:
        case 55:
        case 61:
        case 63:
        case 65:
            img.src = "images/LightRain.png"
            break;
        case 56:
        case 57:
        case 66:
        case 67:
        case 85:
        case 86:
            img.src = "images/Sleet.png"
            break;
        case 80:
        case 81:
        case 82:
            img.src = "images/HeavyRain.png"
            break;
        case 95:
        case 96:
        case 99:
            img.src = "images/ThunderStorm.png"
            break;
    }
}