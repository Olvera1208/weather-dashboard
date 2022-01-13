var searchFormEl = document.querySelector('#search-city');
var resultTextEl = document.querySelector('#currentCityName');
var currentCityName;
var APIkey = '23b89ccd37ecfa0524d0c35eae3690f8';
var weather = [];
var cityList = [];

//cities chosen in the past
function displayWeather(weather) {  
    $("#day0-wind").text(weather[0].wind);
    $("#day0-UV").text(weather[0].UV);
    $(`#currentCityName`).text(currentCityName);
    if (weather[0].UV >= 11) {varUV = `Violet`}; 
    if (weather[0].UV < 11) {varUV = `Red`}; 
    if (weather[0].UV < 8) {varUV = `Orange`}; 
    if (weather[0].UV < 6) {varUV = `Yellow`}; 
    if (weather[0].UV < 3) {varUV = `Green`}; 
    $(`#day0-UV`).css( "background-color", varUV);
    for (var i = 0; i <= 5; i++) {
        $(`#day`+i+`-temp`).text(weather[i].temp);
        $(`#day`+i+`-icon`).html(weather[i].icon);
        $(`#day`+i+`-hum`).text(weather[i].hum);
        $(`#day`+i+`-date`).html(weather[i].date);
        $(`#day`+i+`-icon`).attr("src",weather[i].icon);
    }
}

//cities chosen in the past
function showCityList(cityList) {  
    var varText = "";
    for (var i = 0; i < cityList.length; i++) {
      varText += `<li class="btn list-group-item list-group-item-action d-flex justify-content-between align-items-center" onclick="searchApi('`+cityList[i]+`')">`+cityList[i]+`</li>`;
    }
    $(`#cityListGroup`).html(varText);
}

//saves the city list to local storage
function updateCityList(currentCityName) {  
    cityList.indexOf(currentCityName) === -1 ? cityList.push(currentCityName) : console.log("City already on list")
    localStorage.setItem("cityList", JSON.stringify(cityList)); 
    showCityList(cityList);
}

//have to search API to get 5 day forcast
function searchApi2(varLat, varLon, currentCityName) { 
    var locQueryUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=`+varLat+`&lon=`+varLon+`&exclude=hourly&units=imperial&appid=23b89ccd37ecfa0524d0c35eae3690f8`;
    fetch(locQueryUrl)
      .then(function (response) {
        console.log(response)
        if (!response.ok) {
          throw response.json();
        }
        console.log(response.json)
        return response.json();
      })
      .then(function (locRes) {
        console.log(locRes);
        weather = [];
        updateCityList(currentCityName);
        for (var i = 0; i < 7; i++) {
             var wDay = {
                 "date":locRes.daily[i].dt,
                 "temp":locRes.daily[i].temp.day+` °F`,
                 "hum":locRes.daily[i].humidity+`%`,
                 "wind":locRes.daily[i].wind_speed+` MPH`,
                 "UV":locRes.daily[i].uvi,
                 "icon":`https://openweathermap.org/img/wn/`+locRes.daily[i].weather[0].icon+`.png`
             }
        wDay.date=wDay.date * 1000;
        const dateObject = new Date(wDay.date);
        wDay.date=dateObject.toLocaleDateString();
        weather.push(wDay);
        }   
        displayWeather(weather);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

function searchApi(query) {
    var locQueryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=`+query+`&appid=23b89ccd37ecfa0524d0c35eae3690f8`;
 
    fetch(locQueryUrl)
      .then(function (response) {
        console.log(response);
        if (!response.ok) {
          $("#search-input")[0].reset()
          alert("ERROR: City not found");
          throw response.json();
        }
        console.log(response.json);
        return response.json();
      })
      .then(function (locReset) {
        varLat = locReset.city.coord.lat;
        varLon = locReset.city.coord.lon;
        currentCityName = query;
        console.log(currentCityName + ` located at:`+varLat+`x`+ varLon);
        searchApi2(varLat, varLon, currentCityName);
    })
      .catch(function (error) {
        console.error(error);
      });
}

function handleSearchFormSubmit(event) {
    event.preventDefault();
    var searchInputVal = document.querySelector('#search-input').value;
    if (!searchInputVal) {
      console.error('You need a search input value!');
      return;
    }
    searchApi(searchInputVal);
  }

  //load the text from memory
function loadCityList(cityList) {  
    cityList = JSON.parse(localStorage.getItem("cityList"));
    if(!cityList) {  
        console.log("- No saved information"); 
        cityList=[];
        return cityList;
    }
    return cityList;
}
searchFormEl.addEventListener('submit', handleSearchFormSubmit);

cityList = loadCityList(cityList);
searchApi("Palm SpringsS");