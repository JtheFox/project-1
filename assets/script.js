var randomBtn = $('.sw-randomBtn');
var maxPopSelect = $("#maxPopulation");
var searchBtn = $(".sw-searchBtn");
var searchText = $(".sw-searchInput");
var modal = new bootstrap.Modal(document.querySelector('.modal'), { keyboard: false });
var weatherAPIKey = '';
var restCountryDomain = 'https://restcountries.com/v3.1/';

function randomCountry(maxPop) {
    var countryData = {};
    // get array of all countries from api
    var restAllURL = `${restCountryDomain}all`
    fetch(restAllURL)
        .then(response =>response.json())
        .then(data =>{
            // filter all countries by max population if a max was chosen
    if (maxPop) data = data.filter(country => country.population < maxPop);
    // pick random country from array of all (filtered) countries
    var randCountry = data[Math.floor(Math.random() * data.length)];
    countryData = parseCountry[randCountry];
        });
    
    return countryData;
}

function searchCountry(searchTerm) {
    var countryData = {};
    // call REST Countries api to search by name
    var restCountryURL = `${restCountryDomain}name/${searchTerm}`
    fetch(restCountryURL)
        .then(response => response.json())
        .then(data => {
            countryData = parseCountry(data[0]);
        });
    
    
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
    fetch(restCapitalURL)
        .then(response => response.json())
        .then(data => {
             weatherSearchURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.capitalInfo.latlng[0]}&lon=${data.capitalInfo.latlng[1]}&exclude=daily,minutely,hourly&appid=${weatherAPIKey}`
        });

   
    fetch(weatherSearchURL)
        .then(response => response.json())
        .then(data => {
        data = weatherAPIData;
        weatherData.temp = data.current.temp;
        weatherData.humidity = data.current.humidity;
        weatherData.pressure = data.current.pressure;
        weatherData.windSpeed = data.current.wind_speed;
        weatherData.uvIndex = data.current.uvi;
        weather.dataTime = data.current.dt;
        });

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

     //Get country data from REST Countries API
     var countryData = randomCountry(maxPop);

    //Check to see if country is found, if not found display error 
    if (Object.keys(countryData).length === 0) {
        modal.show();
    }

    //Get the country data weather information
    countryData.weather = getWeather(countryData.capital);

    //If api calls are successful and data is valid, redirect user to results page
    if (Object.keys(countryData.weather) > 0) {
        location.replace(results.html);
    }

    //Display country data on page
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

        //display error if search text is empty
        modal.show();
        return;
    }
    // get country data from REST Countries API
    var countryData = searchCountry(searchTerm);
   
    //Check to see if country is found, if not found display error 
    if (Object.keys(countryData).length === 0) {
        modal.show();
    }

    countryData.weather = getWeather(countryData.capital);

    //If api calls are successful and data is valid, redirect user to results page
    if (Object.keys(countryData.weather) > 0) {
        location.replace(results.html);
    }
    
    // display country data on page
    displayCountry(countryData);
})
