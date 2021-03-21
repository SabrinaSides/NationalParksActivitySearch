'use strict';


// National Park API info
const npApiKey = 'ZrLDFqf6q4neOh80ManaG2KezOheUuBeSeMb4BOI';
const npBaseUrl = 'https://developer.nps.gov/api/v1/parks';


//Accuweather API
const dailyForecast = 'https://dataservice.accuweather.com/forecasts/v1/daily/1day/';
const weatherLocation = 'https://dataservice.accuweather.com/locations/v1/cities/geoposition/search';
const accuweatherKey = '9I5je7q85bu9l4krJjNWfcqTVDgLC67H';


//function to create search string to add to baseURL
function formatQueryParams(params){
    const queryItems = Object.keys(params).map(key => `${encodeURI(key)}=${encodeURIComponent(params[key])}`)
    const queryJoined = queryItems.join('&');
    return queryJoined;
}

//used to store lat/long coordinates needed as query parameter in getLocationKey function
let store = [];

//push lat/long value (from NP API results) to store variable
function weatherDropDownClicked(){
    store = [];
    const selected = $("#js-weather-dropdown :selected").val();
    store.push(selected);
}

//call locationKey API--> get accuweather function nested inside (because it requires value from locationKey API)
function getLocationKey(store){
    const params = {
        apikey: accuweatherKey,
        q: store[0],
    };
    const queryString = formatQueryParams(params);
    const weatherSearchUrl = weatherLocation + '?' + queryString;

    fetch(weatherSearchUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
        }
            throw new Error(`There's been an error:` + response.statusText);
        })
        .then(responseJson => getAccuweather(responseJson.Key))
        .catch(error => alert(error));
}

//call daily forecast API
function getAccuweather(location){
    const params = {
        apikey: accuweatherKey,
    };
    const queryString = formatQueryParams(params);
    const weatherSearchUrl = dailyForecast + location + '?' + queryString;

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
 
//display accuweather daily forecast
function displayWeather(responseJson){
    $('#weather-results').empty();
    for(let i = 0; i < responseJson.DailyForecasts.length; i++){
        $('#weather-results').append(`
            <section>

                <div id='forecast'>
                    <div><h4>High Temp:</h4><p>${responseJson.DailyForecasts[i].Temperature.Maximum.Value}&degF</p></div>
                    <div><h4>Low Temp:</h4><p>${responseJson.DailyForecasts[i].Temperature.Minimum.Value}&degF</p></div>
                    <div><h4>Condition:</h4><p>${responseJson.DailyForecasts[i].Day.IconPhrase}</p></div>
                </div>
                <a href='${responseJson.Headline.Link}' target='_blank'>More at Accuweather</a>
            </section>
        `)};
}


// function to fetch NP API
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
    $('.results-count').empty();
    $('.results-count').append(
        `${responseJson.data.length} Parks Found`
    );
    if(responseJson.data.length > 0){
        for(let i = 0; i < responseJson.data.length; i++){
            //full park list
            $('.results-list').append(
            `<li class='js-result-li'>
            <h2>${responseJson.data[i].fullName}</h2>
            <div class='park-image'><a href='${responseJson.data[i].url}' target='_blank' title='Click to go to park at NPS.gov'><img src='${responseJson.data[i].images[0].url}' alt='Park image' class='park-image'></a></div>
            <p>${responseJson.data[i].description}</p>
            <div class='park-links'>
                <div class='google-maps-link'><a href = 'https://www.google.com/maps/@${responseJson.data[i].latitude},${responseJson.data[i].longitude},15z' target='_blank' title='Open park on Google Maps'><img src='images/google-maps.png' alt='Google Maps icon' class='google-logo'></a></div>
                <div><a href='${responseJson.data[i].url}' target='_blank' title='Click to go to park at NPS.gov'><img src='images/nps-logo.png' alt='National Park Logo' class='nps-logo'></a></div>
            </div>
            <hr>
            </li>`)
            
            //weather dropdown list created
            $('.weather-form').removeClass('hidden');
            $('#js-weather-dropdown').append(
                `<option value='${responseJson.data[i].latitude},${responseJson.data[i].longitude}'>${responseJson.data[i].fullName}</option>`
            )
        }
    }else{
        $('.results-list').append(`<li>Sorry, this state doesn't have any national parks that support this activity.</li>`)
    }
}

// event listeners:

//find parks button clicked
function findParksClicked(){
    $('.activity-state-form').submit(event => {
    event.preventDefault();
    $('.results-list').empty();
    $('.weather-results-container').addClass('hidden');
    $('#weather-results').empty();
    $('#js-weather-dropdown').empty();
    const activity = $('#js-activities').val();
    const state = $('#js-state').val();
    getNationalParks(activity, state);
});
}

//get weather button clicked
function getForecastClicked(){
    $('.weather-form').submit(event => {
        event.preventDefault();
        $('.weather-results-container').removeClass('hidden');
        weatherDropDownClicked();
        getLocationKey(store);
    })
}

//Code for back to top button

window.onscroll = function() {scrollFunction()};
function scrollFunction() {
    let mybutton = document.getElementById('myBtn');
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function manageParkSearch(){
    findParksClicked();
    getForecastClicked();
}

//callback function
$(manageParkSearch);
