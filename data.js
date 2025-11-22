// with XMLHttpRequest
const cityName = document.querySelector('#cityName');
const countryCode=document.querySelector("#countryCode");
const btn = document.querySelector('button');
const container = document.querySelector('section');
const id = '413d0defb02ebb494ea5e39ceb810e6b';

function weatherShow() {
    container.innerHTML = '';
    const xml=new XMLHttpRequest();
    xml.open('GET',`https://api.openweathermap.org/data/2.5/forecast?q=${cityName.value},${countryCode.value}&units=metric&appid=${id}`);
    xml.responseType='json';
    xml.onload=()=>{
        const result=xml.response;
        result.list.map(el => {
            const block = document.createElement('div');
            block.innerHTML = `
                <h3>${el['dt_txt']}</h3>
                <h2>${result.city.name} ,${result.city.country}</h2>
                <h4>${el.weather[0].main}</h4>
                <img src="https://openweathermap.org/img/wn/${el.weather[0].icon}.png" alt="${el.weather[0]['description']}" width="150" draggable="false">
                <p>temperature:${Math.round(el.main.temp)}&degC</p>
                <p>feels like:${Math.round(el.main['feels_like'])}&degC</p>
                <p>min temp:${Math.round(el.main['temp_min'])}&degC</p>
                <p>max temp:${Math.round(el.main['temp_max'])}&degC</p>
                <hr style="width:100%; border:1px solid black;">
                <p>wind:${el.wind.speed}m/sec.</p>
                <hr style="width:100%; border:1px solid black;">
                <p class="wind-arrow" style="transform: rotate(${el.wind.deg}deg);">&uarr;</p>
                `;
            container.append(block);
        });
    };
    xml.send();
};

btn.addEventListener('click',weatherShow);
document.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        weatherShow();
    };
});
document.querySelectorAll('button')[1].addEventListener('click', () => location.reload());