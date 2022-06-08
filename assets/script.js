var randomBtn = $('.sw-randomBtn');
var maxPopSelect = $("#maxPopulation");
var searchBtn = $(".sw-searchBtn");
var searchText = $(".sw-searchInput");
var newSearchBtn = $('.sw-newSearch');
var recents = $('.sw-recents');
var searchState = $('.sw-search');
var resultsState = $('.sw-results');
var errorModal = new bootstrap.Modal($('.errorModal')[0], { keyboard: false });
var weatherAPIKey = 'f8bd4d0f6f0c65783299bae01aa1f960';
var restCountryDomain = 'https://restcountries.com/v3.1/';

// on load
$(function () {
    // set search state
    displayState('search');
})

function error(err) {
    // log error in console then show error modal
    console.error(err);
    errorModal.show();
}

function displayState(state) {
    if (state === 'search') {
        // hide results elements and display search elements
        resultsState.hide();
        newSearchBtn.hide();
        searchState.show();
        // display recent searches
        recents.html('');
        recents.append('<option value="none" selected disabled hidden>Recent</option>');
        var searches = localStorage.getItem('savedSearch').split(',');
        console.log(searches)
        if (searches.length > 0) searches.forEach(country => recents.append(`<option value="${country}">${country}</option>`));
    } else if (state === 'results') {
        // hide search elements and display results elements
        searchState.hide();
        resultsState.show();
        newSearchBtn.show();
    } else console.error('Invalid display state');
}

function storeCountry(country) {
    // get saved searches from localStorage
    var savedSearch = localStorage.getItem("savedSearch") || [];
    if (savedSearch.length > 0) savedSearch = savedSearch.split(',');
    // add new search to list
    savedSearch.unshift(country);
    // only save the 5 most recent searches
    var newSavedSearch = savedSearch.slice(0, 5).join(',');
    // update localStorage
    localStorage.setItem("savedSearch", newSavedSearch);
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
            // store country name is localStorage
            storeCountry(countryData.name);
            // get weather in the capital
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
            if (!countryData.name) return errorModal.show();
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
        timeZones: data.timezones.join(', '),
        population: data.population.toLocaleString(),
        continent: data.continents.join(", "),
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
    var continent = $("#continent");
    //Query Selector for weather info 
    var capitalWeather = $('#capitalWeather');
    var dateAndTime = $("#date-time");
    var temperature = $("#temp");
    var windSpeed = $("#wind");
    var humidity = $("#humidity");
    var uvIndex = $("#uv-index");
    //Display each country content to html 
    countryName.text(data.name);
    flag.attr("src", data.flag);
    capital.text(data.capital);
    population.text(data.population);
    language.text(data.language);
    currency.text(data.currency);
    timeZone.text(data.timeZones);
    continent.text(data.continent);
    //Display each weather content to html
    capitalWeather.text(data.capital);
    dateAndTime.text(weather.dataTime);
    temperature.text(`${weather.temp} °F`);
    windSpeed.text(`${weather.windSpeed} MPH`);
    humidity.text(`${weather.humidity}%`);
    uvIndex.text(weather.uvIndex);
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
    // get text in search bar
    var searchTerm = searchText.val();
    searchText.val('');
    if (searchTerm.length === 0) return;
    // get country data from REST Countries API
    searchCountry(searchTerm);
});

// return to search state
newSearchBtn.click(function () { displayState('search') });

// autofill search bar when a recent search is selected
recents.on('change', function () {
    searchText.val(recents.val());
});