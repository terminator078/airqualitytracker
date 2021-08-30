/////for data availablity search and aqi etc search

let apikeyaqi = api.apikeyaqi, temperatureapikey = api.temperatureapikey,locationapikey=api.locationapikey;
let longt = "", latt = "";
let displaycity = "", aqi, temperature = "Not Available";

///
document.getElementById("locationsearch").addEventListener("keyup", function(event) {
    if (event.keyCode === 13)fun1();
});


//city to lat, lon
async function citytolatlon(tempcity) {
    let response =await fetch(`https://trueway-geocoding.p.rapidapi.com/Geocode?address=${displaycity}&language=en`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": locationapikey,
            "x-rapidapi-host": "trueway-geocoding.p.rapidapi.com"
        }
    });
    if (!response.ok) errorfunction();
    let datalatlong = await response.json();
        if (datalatlong.results.length == 0) { errorspellfunction(); return 0; }
    latt = datalatlong.results[0].location.lat;
    longt = datalatlong.results[0].location.lng;

    return 1;
}

//lat, lon to aqi
async function onlineaqidata() {

    let response = await fetch(`https://api.waqi.info/feed/geo:${latt};${longt}/?token=${apikeyaqi}`);
    if (!response.ok) errorfunction();
    let data = await response.json();
    aqi = data.data.aqi;
    latt = data.data.city.geo[0]; longt = data.data.city.geo[1];
}

//again lat,lon to datacity
async function datacity() {
    let response = await fetch(`https://trueway-geocoding.p.rapidapi.com/ReverseGeocode?location=${latt},${longt}&language=en`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": locationapikey,
            "x-rapidapi-host": "trueway-geocoding.p.rapidapi.com"
        }
    });
    if (!response.ok) errorfunction();
    let data = await response.json();
    displaycity = data.results[0].locality;
    if(displaycity==undefined) displaycity = data.results[0].area;
    if(displaycity==undefined) displaycity = data.results[0].region;
}

//for temperatue
async function temperaturefun() {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latt}&lon=${longt}&appid=${temperatureapikey}&units=metric`);
    if (!response.ok) errorfunction();
    let data = await response.json();
    temperature = data.main.temp;
}
//error function
function errorfunction() {
    document.getElementById("abovestatus").innerHTML = `<strong>Some Error Occured</strong>`;
}
//city spelling error
function errorspellfunction() {
    document.getElementById("abovestatus").innerHTML = `<strong>Error, try different spelling of city</strong>`;
}

async function fun1() {
    document.getElementById("abovestatus").innerHTML = ` <div class="wholeline wholelinecentre" id="abovestatus">Search from above</div>`;
    displaycity = document.getElementById("locationsearch").value;
    if (displaycity == none) { alert("Enter city!"); return; }
    let temp = displaycity;
    if (displaycity == none) { alert("you pressed enter without entering the city!!!"); return; }
    document.getElementById("abovestatus").innerHTML = `<strong>fetching...</strong>`;
    let tempspell = await citytolatlon(displaycity);
    if (tempspell == 0) return;
    await temperaturefun();
    await onlineaqidata();
    await datacity();
    if (document.getElementById("abovestatus").innerHTML != `<strong>Some Error Occured</strong>`)
        document.getElementById("abovestatus").innerHTML = `<div class='wholeline wholelinecentre'>Temperature : <span class='aqicolorbox'>${temperature}&#176;C (${tosearchablename(temp)})</span></div>
         <div class='wholeline wholelinecentre'>AQI Index (US epa) : <span class='aqicolorbox'>${aqi} (${displaycity})</span></div>`;

}
