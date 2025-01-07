const API_KEY = "1f0868ad4687f50e1fb0345863ecf1b0";
const BASE_API_URL = "https://api.openweathermap.org/data/2.5/weather";

const content = {
    mainGrid: document.querySelector(".grid-item.full-width"),
    locationName: document.querySelector(".location"),
    temp: document.querySelector(".temp"),
    unit: document.querySelector(".unit"),
    desc: document.querySelector(".desc"),
    max: document.querySelector(".max"),
    min: document.querySelector(".min"),

    humidity: document.querySelector(".humidity"),
    windSpeed: document.querySelector(".wind-speed"),

};

const searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", onSearchFormSubmit);

async function onSearchFormSubmit(e) {
    e.preventDefault();

    const locationName = searchForm.search.value.trim();
    if (!locationName) {
        alert("Please enter a city, state or country name.");
        return;
    }

    const unitType = "metric"; // Always use metric for simplicity

    try {
        const data = await getWeatherByLocation(locationName, unitType);

        if (data.cod === "404") {
            alert("Location not found.");
            return;
        }

        displayWeatherData(data);
    } catch (error) {
        console.error("Error on form submit.", error);
    }

    searchForm.reset();
}

async function getWeatherByLocation(locationName, unitType) {
    const apiUrl = `${BASE_API_URL}?q=${locationName}&appid=${API_KEY}&units=${unitType}`;
    return await fetchData(apiUrl);
}

async function fetchData(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data.", error);
        alert("Failed to fetch weather data. Please try again later.");
        throw error;
    }
}

function displayWeatherData(data) {
    const { weather, main, wind, sys, name } = data;

    content.locationName.textContent = name;
    content.temp.textContent = main.temp.toFixed(2);
    content.unit.textContent = "°C";
    content.desc.textContent = weather[0].description;
    content.max.textContent = `${main.temp_max} °C`;
    content.min.textContent = `${main.temp_min} °C`;
  
    content.humidity.textContent = `${main.humidity}%`;
    content.windSpeed.textContent = `${wind.speed} m/s`;



    // Change background based on weather description
    changeBackground(weather[0].description);
    
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const isDayTime = currentTimestamp >= sys.sunrise && currentTimestamp <= sys.sunset;

    content.mainGrid.classList.toggle("day-time", isDayTime);
    content.mainGrid.classList.toggle("night-time", !isDayTime);
}

function changeBackground(description) {
    const body = document.body; // Assuming you want to change the body background

    // Define background images for different weather descriptions
    const backgrounds = {
        "clear sky": "url('https://wallpapers.com/images/hd/clear-sky-with-wispy-clouds-zycncm0xf02v4a8i.jpg')",
        "few clouds": "url('https://e0.pxfuel.com/wallpapers/514/997/desktop-wallpaper-clouds-blue-sky-with-few-clouds-background-dark-blue-clouds.jpg')",
        "scattered clouds": "url('https://c0.wallpaperflare.com/preview/532/447/657/scattered-white-clouds.jpg')",
        "broken clouds": "url('https://images.pexels.com/photos/314726/pexels-photo-314726.jpeg?cs=srgb&dl=pexels-pixabay-314726.jpg&fm=jpg')",
        "overcast clouds": "url('https://img.freepik.com/free-photo/storm-clouds_1122-2748.jpg')", 
        "shower rain": "url('https://img.goodfon.com/wallpaper/big/d/ab/dozhd-liven-kapli-more-nebo-tuchi.webp')",
        "rain": "url('https://wallpapers.com/images/hd/rain-desktop-2560-x-1600-o13byeha70kti1ai.jpg')",
        "moderate rain": "url('https://wallpapers.com/images/hd/rain-desktop-2560-x-1600-o13byeha70kti1ai.jpg')",
        "thunderstorm": "url('https://wallpapercat.com/w/full/c/9/3/22084-3840x2160-desktop-4k-thunder-wallpaper-photo.jpg)",
        "snow": "url('https://images.unsplash.com/photo-1491002052546-bf38f186af56?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNub3clMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D')",
        "light snow": "url('https://images.unsplash.com/photo-1491002052546-bf38f186af56?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNub3clMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D')",

        "mist": "url('https://i.pinimg.com/736x/4c/4b/40/4c4b401e538f739fd3d54498de45708d.jpg')",
    };

    // Set the background image based on the description
    body.style.backgroundImage = backgrounds[description] || "url('path/to/default-background.jpg')";
}
