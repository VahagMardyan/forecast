import { countries, toCapitalize } from './forExport.js';

const API_KEY = 'YOUR_API_KEY';
const container = document.querySelector('section');
const cityName = document.querySelector('#cityName');
const countryCode = document.querySelector('#countryCode');
const searchCountry = document.querySelector('#searchCountry');
const showInCBtn = document.querySelector('#showInCBtn');
const showInFBtn = document.querySelector('#showInFBtn');
const resetBtn = document.querySelector('#resetBtn');
const currentLocationBtn = document.getElementById('currentLocation');

countries.map(country => {
    const option = document.createElement('option');
    option.value = country.code;
    option.innerText = country.name;
    countryCode.append(option);
});

const options = Array.from(countryCode.options);

function searchCountryByCode() {
    const searchTerm = toCapitalize(searchCountry.value);
    countryCode.innerHTML = "";
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.innerText = "Select Country Code (Optional)";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    countryCode.append(defaultOption);

    const filtered = options.filter(option => {
        return option.innerText.includes(searchTerm) && option.value !== "";
    });
    filtered.forEach(country => {
        const option = document.createElement('option');
        option.value = country.value;
        option.innerText = country.innerText;
        countryCode.append(option);
    });
}

function getWeatherByLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=> {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            container.innerHTML = "Getting your location...";
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
            .then(data => data.json())
            .then(result => {
                renderWeather(result, "°C");
            })
            .catch(()=>{
                container.innerHTML = `<h1>404 City "${cityName.value} ${countryCode.value}" not found 😢</h1>`;
            });
        }, ()=> {
            alert("Please allow your location.");
        });
    } else {
        alert("Your browser doesn't support geolocation");
    }
}

function renderWeather(result, symbol) {
    container.innerHTML = "";
    result.list.map(el=>{
        const block = document.createElement('div');
        block.innerHTML = `
            <h3>${el['dt_txt']}</h3>
            <h2>${result.city.name}, ${result.city.country}
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 18 18">
                <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                </svg> 
            </span>
            </h2>
            <h4>${el.weather[0].main}</h4>
            <img src="https://openweathermap.org/img/wn/${el.weather[0].icon}.png" 
                alt="${el.weather[0]['description']}" draggable="false">
            <p>Temperature:${Math.round(el.main.temp)} ${symbol}</p>
            <p>Feels like:${Math.round(el.main['feels_like'])} ${symbol}</p>
            <p>Min Temp:${Math.round(el.main['temp_min'])} ${symbol}</p>
            <p>Max Temp:${Math.round(el.main['temp_max'])} ${symbol}</p>
            <hr style="width:100%; border:1px solid black;">
            <p>Wind: ${el.wind.speed} m/sec.</p>
            <hr style="width:100%; border:1px solid black;">
            <p class="wind-arrow" style="transform: rotate(${el.wind.deg}deg);">&uarr;</p>
        `;
        container.append(block);
    });
}

function fetchWeather(unit) {
    const unitParam = unit === "C" ? 'metric' : "imperial";
    const symbol = unit === "C" ? "°C" : "°F";
    
    if (!cityName.value) {
        alert("Please enter a city name");
        return;
    }

    container.innerHTML = "Loading...";
    
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName.value},${countryCode.value}&units=${unitParam}&appid=${API_KEY}`)
    .then(res => {
        if(!res.ok) throw new Error("City not found");
        return res.json();
    })
    .then(result => {
        renderWeather(result, symbol);
    })
    .catch(err => {
        container.innerHTML = `<h1>404 The city "${cityName.value} ${countryCode.value}" not found 😢</h1>`;
    });
}

searchCountry.addEventListener('keyup', searchCountryByCode);
currentLocationBtn.addEventListener('click', getWeatherByLocation);

showInCBtn.addEventListener('click', () => fetchWeather("C"));
document.addEventListener('keyup', (event) => {
    event.key === "Enter" ? fetchWeather("C") : null;
});

showInFBtn.addEventListener('click', () => fetchWeather("F"));

resetBtn.addEventListener('click', ()=> {
    location.reload();
});
