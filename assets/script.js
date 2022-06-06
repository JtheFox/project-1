// TODO: Change to jquery selector
var populationValue = document.querySelector("#maxPopulation");
var swSearchBtn = document.querySelector("#sw-searchBtn");
var swSearchTxt = document.querySelector("#sw-searchInput");
var swTooltip = document.querySelector("sw-searchInput");
var weatherAPIKey = '';
var countryData = {
    weather: {}
};

function getCountry() {
    // first api call (REST Countries)
    var data = restCountryData;
    data = data[0];
    // var restCountryURL = `https://restcountries.com/v3.1/capital/${data.capital}`
    // second api call (REST Countries/Capital)
    data = restCountryCapitalData;
    data = data[0];
    // var weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.capitalInfo.latlng[0]}&lon=${data.capitalInfo.latlng[1]}&exclude=daily,minutely,hourly&appid=${weatherAPIKey}`
    // third api call (OpenWeatherMap)
    data = weatherData;
}

function displayCountry(data) {
    
}
