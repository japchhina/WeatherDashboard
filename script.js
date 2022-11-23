var searchHistory = [];
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
var weatherApiRootUrl = 'https://api.openweathermap.org';
var weatherApiKey = 'cb6375fa2d4e446a9c692d3790665e05';

var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var searchHistoryList = document.querySelector('#search-history-list');
var currentWeatherContainer = document.querySelector('#current-weather-container');
var forecastContainer = document.querySelector('#forecast-container');

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function renderSearchHistory() {
    searchHistoryContainer.innerHTML = '';
    for (var i = searchHistory.length - 1; i>=0; i--) {
        var btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('aria-controls', 'today forecast');
        btn.classList.add('history-btn','btn-history');
        btn.setAttribute('data-search', searchHistory[i]);
        btn.textContent = searchHistory[i];
        searchHistoryContainer.append(btn);
    }
}
function appendToHistory (search) {
    if (searchHistory.indexOf(search) !== -1) {
        return;
    }
    searchHistory.push(search);
    localStorage.setItem('search-history', JSON.stringify(searchHistory));
    renderSearchHistory();
}
function initSearchHistory () {
    var storedHistory = local.Storage.getItem('search-hisotry');
    if (storedHistory) {
        searchHistory = JSON.parse(storedHistory);
    }
    renderSearchHistory();
}
function getCurrentWeather (city, weather) {
    var weatherIcon = weather.weather[0].icon;
    var weatherIconUrl = 'https://openweathermap.org/img/wn/' + weatherIcon + '.png';
    var weatherIconImg = document.createElement('img');
    weatherIconImg.setAttribute('src', weatherIconUrl);
    weatherIconImg.setAttribute('alt', weather.weather[0].description);

    var weatherTitle = document.createElement('h2');
    weatherTitle.textContent = city + ' (' + dayjs().format('M/D/YYYY') + ') ';
    weatherTitle.append(weatherIconImg);

    var tempF = (weather.main.temp);
    var tempP = document.createElement('p');
    tempP.textContent = 'Temperature: ' + tempF.toFixed(1) + ' °F';

    var humidityP = document.createElement('p');
    humidityP.textContent = 'Humidity: ' + weather.main.humidity + '%';

    var windSpeedP = document.createElement('p');
    windSpeedP.textContent = 'Wind Speed: ' + weather.wind.speed + ' MPH';

    var currentWeatherDiv = document.createElement('div');
    currentWeatherDiv.append(weatherTitle, tempP, humidityP, windSpeedP);
    currentWeatherContainer.innerHTML = '';
    currentWeatherContainer.append(currentWeatherDiv);

    heading.setAttribute('class', 'hide');
    currentWeatherContainer.setAttribute('class', 'show');
    forecastContainer.setAttribute('class', 'show');
    tempP.setAttribute('class', 'show');
    humidityP.setAttribute('class', 'show');
    windSpeedP.setAttribute('class', 'show');
}
function getForecastCard(forecast) {
    var iconUrl = 'https://openweathermap.org/img/wn/' + forecast.weather[0].icon + '.png';
    var iconImg = document.createElement('img');
    iconImg.setAttribute('src', iconUrl);
    iconImg.setAttribute('alt', forecast.weather[0].description);
    var dateP = document.createElement('p');
    dateP.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
    var tempF = (forecast.main.temp - 273.15) * 1.80 + 32;
    var tempP = document.createElement('p');
    tempP.textContent = 'Temp: ' + tempF.toFixed(1) + ' °F';
    var humidityP = document.createElement('p');
    humidityP.textContent = 'Humidity: ' + forecast.main.humidity + '%';
    var cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.append(dateP, iconImg, tempP, humidityP);
    return cardDiv;
}
function getForecast (city, forecast) {
    forecastContainer.innerHTML = '';
    var forecastTitle = document.createElement('h3');
    forecastTitle.textContent = '5-Day Forecast:';
    forecastContainer.append(forecastTitle);
    var forecastRow = document.createElement('div');
    forecastRow.classList.add('row');
    for (var i = 0; i < forecast.list.length; i++) {
        if (forecast.list[i].dt_txt.indexOf('15:00:00') !== -1) {
            var forecastCard = getForecastCard(forecast.list[i]);
            forecastRow.append(forecastCard);
        }
    }
    forecastContainer.append(forecastRow);
}
function getWeather (city) {
    var weatherUrl = weatherApiRootUrl + '/data/2.5/weather?q=' + city + '&appid=' + weatherApiKey;
    fetch(weatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            getCurrentWeather(city, data);
            var forecastUrl = weatherApiRootUrl + '/data/2.5/forecast?q=' + city + '&appid=' + weatherApiKey;
            fetch(forecastUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    getForecast(city, data);
                });
        });
}
function handleSearchFormSubmit (event) {
    event.preventDefault();
    var search = searchInput.value.trim();
    if (search) {
        getWeather(search);
        searchInput.value = '';
        appendToHistory(search);
    } else {
        alert('Please enter a City');
    }
}
function handleSearchHistoryClick (event) {
    var city = event.target.getAttribute('data-city');
    if (city) {
        getWeather(city);
    }
}
function renderSearchHistory () {
    searchHistoryContainer.innerHTML = '';
    for (var i = 0; i < searchHistory.length; i++
    ) { 
    var historyItem = document.createElement('input');
    historyItem.setAttribute('type', 'text');
    historyItem.setAttribute('readonly', true); }
    historyItem.setAttribute('class', 'form-control d-block bg-white');
    historyItem.setAttribute('value', searchHistory[i]);
    historyItem.addEventListener('click', handleSearchHistoryClick);
    searchHistoryContainer.append(historyItem);
}   
function appendToHistory (city) {
    searchHistory.push(city);
    localStorage.setItem('search', JSON.stringify(searchHistory));
    renderSearchHistory();
}
function init () {
    var search = localStorage.getItem('search');
    if (search) {
        searchHistory = JSON.parse(search);
    }
    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }
}
searchForm.addEventListener('submit', handleSearchFormSubmit);
init();