const cityInput = document.getElementById("city_name");
const searchButton = document.getElementById("btn");
const getlocation = document.getElementById("getlocation");
const Current_Weather_E = document.querySelector(".current-weather");
const Weather_card = document.querySelector(".weather-cards");

const API_KEY = "72930e128e126b373329fa9625dc9603"; // API key for OpenWeatherMap API


const createWeatherCard = (cityName, weatherinfo, index) => {
    if (index === 0) { // HTML for the main weather card
        return `
        <div class=" grid location ml-3.5 mt-5 my-10 md:mr-10 my-2"><i class="fa-solid fa-location-dot"> ${cityName}</i></div>
        <div class="date p-5">
        <p class="text-lg ">Current Date</p>
        <h2 class="text-lg font-bold">${weatherinfo.dt_txt.split(" ")[0]}</h2>
    </div>
    <div class="img flex justify-center items-center ">
        <img class="w-40" src="https://openweathermap.org/img/wn/${weatherinfo.weather[0].icon}@4x.png">
    </div>
    <div class="temp flex justify-center items-center text-2xl font-bold text-amber-500 my-5">${(weatherinfo.main.temp - 273.15).toFixed(2)}°C</div>
    <div class="whether">
        <h2 class="text-lg  pl-5">Wind: <span class="text-xl font-bold">${weatherinfo.wind.speed} M/S</span></h2>
        <h2 class=" text-lg  py-8 pl-5">Humidity: <span class="text-xl font-bold">${weatherinfo.main.humidity}%</span></h2>
    </div>`;
    } else { 
        return `
        <div class="1 bg-sky-500 rounded-lg p-5 ">
        <h2 class="last_data text-center font-bold text-white text-xl sm:text-base  ">${weatherinfo.dt_txt.split(" ")[0]}</h2>
        <div class="flex items-center justify-center flex-col "><img class="w-25 h-25" src="https://openweathermap.org/img/wn/${weatherinfo.weather[0].icon}@4x.png">
        </div>
        <p class="font-bold text-white text-center text-2xl">${weatherinfo.weather[0].description}</p>
        <h5 class="last_temp font-bold text-white m-2 ">Temp:  <span class="text-amber-500">${(weatherinfo.main.temp - 273.15).toFixed(2)}°C</span></h5>
        <h5 class="last_wind font-bold text-white m-2">Wind:  <span>${weatherinfo.wind.speed} km/h</span></h5>
        <h5 class="last_humidity font-bold text-white m-2">Humidity:  <span>${weatherinfo.main.humidity}%</span></h5>
    </div>`;
    }
}

const getWeatherDetails = (cityName, latitude, longitude) => {
    const API_Url_Weather = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(API_Url_Weather).then(res => res.json()).then(data => {
        // Filter the forecasts to get only one forecast per day
        const forecaste_u = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!forecaste_u.includes(forecastDate)) {
                return forecaste_u.push(forecastDate);
            }
        });

       
        cityInput.value = "";
        Current_Weather_E.innerHTML = "";
        Weather_card.innerHTML = "";

        fiveDaysForecast.forEach((weatherinfo, index) => {
            const html = createWeatherCard(cityName, weatherinfo, index);
            if (index === 0) {
                Current_Weather_E.insertAdjacentHTML("beforeend", html);
            } else {
                Weather_card.insertAdjacentHTML("beforeend", html);
            }
        });
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
}

searchButton.addEventListener("click",() => {
    if(cityInput.value==""){
    alert("Input is empty");
    }
    else{
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    // Get entered city coordinates (latitude, longitude, and name) from the API response
    fetch(API_URL).then(res => res.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { lat, lon, name } = data[0];
        getWeatherDetails(name, lat, lon);

     
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}
})

getlocation.addEventListener("click",() => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords; 
          
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL).then(res => res.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error occurred while fetching the city name!");
            });
        },
        error => { // Show alert if User Denied Permission
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        });
})



cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());

