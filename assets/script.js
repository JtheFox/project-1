// TODO: Change to jquery selector
var populationValue = document.querySelector("#maxPopulation");
var swSearchBtn = document.querySelector("#sw-searchBtn");
var swSearchTxt = document.querySelector("#sw-searchInput");
var swTooltip = document.querySelector("sw-searchInput");
var weatherAPIKey = '';


function getCountry() {
    var countryData = {
        weather: {}
    };
    // first api call (REST Countries)
    var data = restCountryData;
    data = data[0];
    // var restCountryURL = `https://restcountries.com/v3.1/capital/${data.capital}`
    // second api call (REST Countries/Capital)
    data = restCountryCapitalData;
    data = data[0];
    countryData.captial = data.capital;
    countryData.language = data.languages[0].name;
    countryData.timeZones = data.timezones[0];
    countryData.population = data.population;
    countryData.continents = data.continent;
    countryData.currency = data.currencies[0].name;
    // var weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.capitalInfo.latlng[0]}&lon=${data.capitalInfo.latlng[1]}&exclude=daily,minutely,hourly&appid=${weatherAPIKey}`
    // third api call (OpenWeatherMap)
    data = weatherData;
    var weather = countryData.weather;
    weather.temp = data.current.temp;
    weather.humidity = data.current.humidity;
    weather.pressure = data.current.pressure;
    weather.windSpeed = data.current.wind_speed;
    weather.uvIndex = data.current.uvi;
    weather.dataTime = data.current.dt;

    displayCountry(countryData);
}

function displayCountry(data) {

    //Query Selector for display country info
    var capital = $("#capital");
    var population = $("#population");
    var language = $("#language");
    var currency = $("#currency");
    var timeZone = $("#time-zone");
    var contients = $("#contients");

    //Query Selector for weather info 
    var dateAndTime = $("#date-time");
    var temperature = $("#temp");
    var windSpeed = $("#wind");
    var humidity = $("#humidity");
    var uvIndex = $("#uv-index");
    var pressure = $("#pressure");

    //Display each country content to html 
    capital.text(data.capital);
    population.text(data.population);
    language.text(data.language);
    currency.text(data.currency);
    timeZone.text(data.timeZones);
    contients.text(data.contients);
    
}

getCountry();