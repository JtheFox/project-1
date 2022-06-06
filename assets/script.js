var randomBtn = $('.sw-randomBtn');
var maxPopSelect = $("#maxPopulation");
var searchBtn = $(".sw-searchBtn");
var searchText = $(".sw-searchInput");
var weatherAPIKey = '';
var restCountryDomain = 'https://restcountries.com/v3.1/';

function randomCountry(maxPop) {
    var countryData = {};
    // get array of all countries from api
    var restAllURL = `${restCountryDomain}all`
    // TODO: add fetch to get all countries
    // TODO: move following lines of code until line break inside the last then statement
    // filter all countries by max population if a max was chosen
    if (maxPop) data = data.filter(country => country.population < maxPop);
    // pick random country from array of all (filtered) countries
    var randCountry = data[Math.floor(Math.random() * data.length)];
    countryData = parseCountry[randCountry];

    return countryData;
}

function searchCountry(searchTerm) {
    var countryData = {};
    // call REST Countries api to search by name
    var restCountryURL = `${restCountryDomain}name/${searchTerm}`
    // TODO: add fetch to get country data
    var data = restCountryData[0]; // TODO: remove after implementing fetch
    // TODO: move following line inside the last then statement
    countryData = parseCountry(data[0]);
    
    return countryData;
}

function parseCountry(data) {
    // return an object with only the data being used for display
    return {
        capital: data.capital,
        language: data.languages[0].name,
        timeZones: data.timezones,
        population: data.population,
        continent: data.continent,
        currency: data.currencies[0].name
    }
}

function getWeather(capital) {
    var weatherData = {};
    var weatherSearchURL = '';
    // get capital coords for weather search
    var restCapitalURL = `https://restcountries.com/v3.1/capital/${capital}`
    // TODO: add fetch to get capital data for coords
    // TODO: move following line inside the last then statement
    weatherSearchURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.capitalInfo.latlng[0]}&lon=${data.capitalInfo.latlng[1]}&exclude=daily,minutely,hourly&appid=${weatherAPIKey}`
    // get current weather in capital
    // TODO: add fetch to get weather data in capital

    data = weatherAPIData;
    weatherData.temp = data.current.temp;
    weatherData.humidity = data.current.humidity;
    weatherData.pressure = data.current.pressure;
    weatherData.windSpeed = data.current.wind_speed;
    weatherData.uvIndex = data.current.uvi;
    weather.dataTime = data.current.dt;

    return weatherData;
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
    
    //Display each weather content to html
    dateAndTime.text(data.dataTime);
    temperature.text(data.temp);
    windSpeed.text(data.windSpeed);
    humidity.text(data.humidity);
    uvIndex.text(data.uvIndex);
    pressure.text(data.pressure);
}

// random country picker
randomBtn.click(function(event) {
    var maxPop = maxPopSelect.val();
     // get country data from REST Countries API
     var countryData = randomCountry(maxPop);
     // display error if no country data was found, return so the page doesn't redirect
     // TODO: add checker to return and display error (not using alert()) if no data
     countryData.weather = getWeather(countryData.capital);
     // TODO: if api calls are successful and data is valid, redirect user to results page
     // display country data on page
     displayCountry(countryData);
})

// create event handler to allow user to press enter to search
searchText.on('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchBtn.click();
    }
})

// country search
searchBtn.click(function() {
    var searchTerm = searchText.val();
    if (searchTerm.length === 0) {
        // TODO: display error if search text is empty (not using alert())
        return;
    }
    // get country data from REST Countries API
    var countryData = searchCountry(searchTerm);
    // display error if no country data was found, return so the page doesn't redirect
    // TODO: add checker to return and display error (not using alert()) if no results found
    countryData.weather = getWeather(countryData.capital);
    // TODO: if api calls are successful and data is valid, redirect user to results page
    // display country data on page
    displayCountry(countryData);
})