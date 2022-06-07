var randomBtn = $('.sw-randomBtn');
var maxPopSelect = $("#maxPopulation");
var searchBtn = $(".sw-searchBtn");
var searchText = $(".sw-searchInput");
var newSearchBtn = $('.sw-newSearch')
var searchState = $('.sw-search');
var resultsState = $('.sw-results')
var modal = new bootstrap.Modal($('.modal')[0], { keyboard: false });
var weatherAPIKey = 'f8bd4d0f6f0c65783299bae01aa1f960';
var restCountryDomain = 'https://restcountries.com/v3.1/';

// on load
$(function () {
    // set search state
    displayState('search');
})

function error(error) {
    // log error in console then show error modalmic
    console.error(error);
    modal.show();
}

function displayState(state) {
    if (state === 'search') {
        resultsState.hide();
        newSearchBtn.hide();
        searchState.show();
    } else if (state === 'results') {
        searchState.hide();
        resultsState.show();
        newSearchBtn.show();
    } else console.error('Invalid display state')
}

function storeCountry(country) {
    var savedSearch = localStorage.getItem("savedSearch") || "";
    savedSearch += savedSearch.length === 0 ? `${country}` : `,${country}`;
    localStorage.setItem("savedSearch", savedSearch);
}

function randomCountry(maxPop) {
    // get array of all countries from api
    var restAllURL = `${restCountryDomain}all`
    fetch(restAllURL)
        .then(response => response.json())
        .then(data => {
            // filter all countries by max population if a max was chosen
            var filtered = maxPop > 0 ? data.filter(country => country.population < maxPop) : data;
            // pick random country from array of all (filtered) countries
            var randCountry = filtered[Math.floor(Math.random() * filtered.length)];
            var countryData = parseCountry(randCountry);
            storeCountry(countryData.name);
            getWeather(countryData);
        }).catch(err => error(err));
}

function searchCountry(searchTerm) {
    // call REST Countries api to search by name
    var restCountryURL = `${restCountryDomain}name/${searchTerm}`
    fetch(restCountryURL)
        .then(response => response.json())
        .then(data => {
            var countryData = parseCountry(data[0]);
            //Check to see if country is found, if not found display error 
            if (!countryData.name) return modal.show();
            storeCountry(countryData.name);
            getWeather(countryData);
        }).catch(err => error(err));
}

function getWeather(countryData) {
    var capital = countryData.capital;
    // get capital coords for weather search
    var restCapitalURL = `https://restcountries.com/v3.1/capital/${capital}`
    //Fetch the weather url 
    fetch(restCapitalURL)
        .then(response => response.json())
        .then(capitalData => {
            var capitalInfo = capitalData[0].capitalInfo;
            var weatherSearchURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${capitalInfo.latlng[0]}&lon=${capitalInfo.latlng[1]}&exclude=daily,minutely,hourly&appid=${weatherAPIKey}&units=imperial`
            fetch(weatherSearchURL)
                .then(response => response.json())
                .then(weatherData => {
                    var weather = {
                        temp: weatherData.current.temp,
                        humidity: weatherData.current.humidity,
                        pressure: weatherData.current.pressure,
                        windSpeed: weatherData.current.wind_speed,
                        uvIndex: weatherData.current.uvi,
                        dataTime: moment.unix(weatherData.current.dt).format("M/D/YYYY")
                    };
                    // display country data on page
                    displayCountry(countryData, weather);
                    displayState('results');
                })
                .catch(err => error(err));
        }).catch(err => error(err));
}

function parseCountry(data) {
    // return an object with only the data being used for display
    return {
        name: data.name.common,
        flag: data.flags.svg,
        capital: data.capital[0],
        language: Object.values(data.languages).join(', '),
        timeZones: data.timezones,
        population: data.population,
        continents: data.continents.join(", "),
        //TODO: add all currencies
        currency: Object.values(data.currencies)[0].name
    }
}


function displayCountry(data, weather) {
    //Query Selector for display country info
    var countryName = $("#country-name");
    var flag = $("#flag");
    var capital = $("#capital");
    var population = $("#population");
    var language = $("#language");
    var currency = $("#currency");
    var timeZone = $("#time-zone");
    var continents = $("#continents");
    //Query Selector for weather info 
    var dateAndTime = $("#date-time");
    var temperature = $("#temp");
    var windSpeed = $("#wind");
    var humidity = $("#humidity");
    var uvIndex = $("#uv-index");
    var pressure = $("#pressure");
    //Display each country content to html 
    countryName.text(data.name);
    flag.attr("src", data.flag);
    capital.text(data.capital);
    population.text(data.population);
    language.text(data.language);
    currency.text(data.currency);
    timeZone.text(data.timeZones);
    continents.text(data.continents);
    //Display each weather content to html
    dateAndTime.text(weather.dataTime);
    temperature.text(`${weather.temp} \u2109`);
    windSpeed.text(`${weather.windSpeed} MPH`);
    humidity.text(`${weather.humidity}%`);
    uvIndex.text(weather.uvIndex);
    pressure.text(weather.pressure);
}

// random country picker
randomBtn.click(function (event) {
    var maxPop = maxPopSelect.val();
    randomCountry(maxPop);
});

// create event handler to allow user to press enter to search
searchText.on('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchBtn.click();
    }
});

// country search
searchBtn.click(function () {
    var searchTerm = searchText.val();
    searchText.val('');
    if (searchTerm.length === 0) return modal.show();
    // get country data from REST Countries API
    searchCountry(searchTerm);
});

// return to search state
newSearchBtn.click(function () { displayState('search') });
