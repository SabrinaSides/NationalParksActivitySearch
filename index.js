'use strict';


// National Park API info
const npApiKey = 'ZrLDFqf6q4neOh80ManaG2KezOheUuBeSeMb4BOI';
const npBaseUrl = 'https://developer.nps.gov/api/v1/parks';


// MAP API info(?)
const mqApiKey = 'dWKeOjMg2OQDeCdKT1WsmuQBVq6kEp8n';
const mqStaticBaseUrl = 'https://www.mapquestapi.com/directions/v2/route';


// NP API
//function to create search string to add to baseURL
function formatQueryParams(params){
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURI(params[key])}`)
    const queryJoined = queryItems.join('&');
    return queryJoined;
}


// function for npSearchUrl
function getNationalParks(activity, state){
    const params = {
        api_key: npApiKey,
        q: activity,
        stateCode: state
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
        .catch(error => alert('error'));

}

//HTML input div 'park-results' -- add to end of getNationalParks function
//loop through and add to ul
function displayResults(responseJson){

    for(let i = 0; i < responseJson.data.length; i++){
        if(responseJson.data.length > 0){
            $('#results-list').append(
            `<li class='js-result-li'>
            <h2>${responseJson.data[i].fullName}</h2>
            <img src='${responseJson.data[i].images[0].url}' alt='Park-image'>
            <p>${responseJson.data[i].description}</p>
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


// event listener for submit button

function manageParkSearch(){
    $('#js-forms').submit(event => {
    event.preventDefault();
    $('#results-list').empty();
    const activity = $('#js-activities').val();
    const state = $('#js-state').val();
    getNationalParks(activity, state);
});
}

/* callback(?) function at end */
$(manageParkSearch);