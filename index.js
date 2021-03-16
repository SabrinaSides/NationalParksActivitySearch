'use strict';


// National Park API info
const npApiKey = 'ZrLDFqf6q4neOh80ManaG2KezOheUuBeSeMb4BOI';
const npBaseUrl = 'https://developer.nps.gov/api/v1/parks';


// Weather API info
const weatherAppId = '56cc56c93fd959533797e699c7869aeb';
const weatherBaseUrl = 'https://api.openweathermap.org/data/2.5/forecast';




//function to create search string to add to baseURL
function formatQueryParams(params){
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURI(params[key])}`)
    const queryJoined = queryItems.join('&');
    return queryJoined;
}

//function to fetch weather data
function getWeatherForecast(latitude, longitude){
    const params = {
        appid: weatherAppId,
        lat: latitude,
        lon: longitude,
    };
    const queryString = formatQueryParams(params);
    const weatherSearchUrl = weatherBaseUrl + '?' + queryString + '&units=imperial&cnt=30';

    fetch(weatherSearchUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
        }
            throw new Error(`There's been an error:` + response.statusText);
        })
        .then(responseJson => displayWeather(responseJson))
        .catch(error => alert(error));
}

function convertUnixTime(unix){
    const convertToMilliseconds = unix*1000;
    const dateObject = new Date(convertToMilliseconds);
    const humanDateFormat = dateObject.toLocaleString("en-US", {weekday: "long"});
    
    return humanDateFormat;
}


//function to display weather
function displayWeather(responseJson){
    $('.weather-results').empty();
    $('.weather-results').append(
        `<h2>Weather for ${responseJson.city.name}:`);

    for (let i = 0; i < responseJson.list.length; i += 8) {
        const date = convertUnixTime(responseJson.list[i].dt);
        const conditions = responseJson.list[i].weather[0].description;

        $('.weather-results').append(`
            <section>
                <div class='forecast'>
                        <div><h2> ${date} </h2>
                        <div><h3> Conditions: ${conditions}</h3></div>
                        <div><h4> Temp: ${Math.round(responseJson.list[i].main.temp)}&degF</h4></div>
                        <div><p>(Feels like ${Math.round(responseJson.list[i].main.feels_like)}&degF)</p></div>
                </div>
            </section>
        `);
    }
}

// function for npSearchUrl
function getNationalParks(activity, state){
    const params = {
        api_key: npApiKey,
        q: activity,
        stateCode: state,
    };
    const queryString = formatQueryParams(params);
    const npSearchUrl = npBaseUrl + '?' + queryString;

    fetch(npSearchUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
        }
            throw new Error(`There's been an error:` + response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(error => alert(error));
}

//function to display park search results
function displayResults(responseJson){
    $('#results-count').empty();
    $('#results-count').append(
        `<h2>${responseJson.data.length} parks found: </h2>`
    );
    for(let i = 0; i < responseJson.data.length; i++){
        if(responseJson.data.length > 0){
            $('.results-list').append(
            `<li class='js-result-li'>
            <h2>${responseJson.data[i].fullName}</h2>
            <img src='${responseJson.data[i].images[0].url}' alt='Park-image'>
            <p>${responseJson.data[i].description}</p>
            <p>Find this park's weather forecast at top of page using these coordinates: ${responseJson.data[i].latitude}, ${responseJson.data[i].longitude}</p>
            <a href='${responseJson.data[i].url}' target='_blank'>More Park Info at NPS.gov</a>
            </li>`)
        } else{
            //const activity = $('#js-activities').val();
            //const state = $('#js-state').val();
            console.log('Nothing');
           // $('#results-list').append(`<li>Sorry, no ${activity} available in national parks in ${state}</li>`)
        }
    }
}

// event listeners:

//find parks button clicked
function findParksClicked(){
    $('#js-forms').submit(event => {
    event.preventDefault();
    $('.results-list').empty();
    const activity = $('#js-activities').val();
    const state = $('#js-state').val();
    //need const for postalCode input
    $('#weather-form').removeClass('hidden');
    getNationalParks(activity, state);
});
}

//get weather button clicked
function getWeatherClicked(){
    $('#weather-form').submit(event => {
        event.preventDefault();
        const latitude = $('#js-latitude').val();
        const longitude = $('#js-longitude').val();
        getWeatherForecast(latitude, longitude);
    })
}

function manageParkSearch(){
    findParksClicked();
    getWeatherClicked();
    //checkWeather();
}

//callback function
$(manageParkSearch);