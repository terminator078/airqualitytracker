let none = "";
let typecity, fromdate, todate, season, seasonyear, fromyear, frommonth, fromweek, toyear, tomonth, toweek, charttype, pollutant, comparecity;
let btemperature, baqi, bconc, baqisub, bindia=false, bus, bcompare=false;
let datafrequency = 2, chartheadingname,labc=0;

let vtcity,vccity="";

let monthname = {
    "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun",
    "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
};

let fileurl2 = 'DataFiles/airqualitydata-2020Q2.csv';
let fileurl3 = 'DataFiles/airqualitydata-2020Q3.csv';
let fileurl1 = 'DataFiles/airqualitydata-2020Q1.csv';
let fileurl4 = 'DataFiles/airqualitydata-2020Q4.csv';
let fileurl5 = 'DataFiles/airqualitydata-2019Q1.csv';
let fileurl6 = 'DataFiles/airqualitydata-2019Q2.csv';
let fileurl7 = 'DataFiles/airqualitydata-2019Q3.csv';
let fileurl8 = 'DataFiles/airqualitydata-2019Q4.csv';
let fileurl9 = 'DataFiles/airqualitydata-2018H1.csv';
let fileurl10 = 'DataFiles/airqualitydata-2017H1.csv';
let fileurl11 = 'DataFiles/airqualitydata-2016H1.csv';
let fileurl12 = 'DataFiles/airqualitydata-2015H1.csv';
let fileurl13 = 'DataFiles/airqualitydata-2020.csv';

let fileurlarray = [];
fileurlarray.push(fileurl1); fileurlarray.push(fileurl2); fileurlarray.push(fileurl3);
fileurlarray.push(fileurl4); fileurlarray.push(fileurl5); fileurlarray.push(fileurl6);
fileurlarray.push(fileurl7); fileurlarray.push(fileurl8); fileurlarray.push(fileurl9);
fileurlarray.push(fileurl10); fileurlarray.push(fileurl11); fileurlarray.push(fileurl12);
fileurlarray.push(fileurl13);

isonline();
inidisable();



async function inputcheck() {
    if (!navigator.onLine) { alert('No internet'); return 0; }
    typecity = document.getElementById('typecity').value;
    if (typecity == none) { alert("city name is required!!!"); return 0; }
    typecity=tosearchablename(typecity);
    vtcity=typecity;

    fromdate = document.getElementById('fromdate').value;
    todate = document.getElementById('todate').value;
    season = document.getElementById('season').value;
    seasonyear = document.getElementById('seasonyear').value;

    fromyear = document.getElementById('fromyear').value;
    frommonth = document.getElementById('frommonth').value;
    fromweek = document.getElementById('fromweek').value;
    toyear = document.getElementById('toyear').value;
    tomonth = document.getElementById('tomonth').value;
    toweek = document.getElementById('toweek').value;

    let rtemp = 0;
    if (fromdate != none && todate != none) rtemp = 1;
    else if (season != none && seasonyear != none) rtemp = 1;
    else if (fromyear != none && frommonth != none && fromweek != none && toyear != none && tomonth != none && toweek != none) rtemp = 1;

    if (rtemp == 0) {
        alert('invalid time interval!'); return 0;
    }
    if (season != none && seasonyear != none) seasontodate();
    if (fromyear != none && frommonth != none && fromweek != none && toyear != none && tomonth != none && toweek != none) weekmonthtodate();
    if (fromdate > todate) {
        alert('invalid time interval!'); return 0;
    }
    rtemp = 0;
    pollutant = document.getElementById('pollutant').value;
    if (btemperature) rtemp = 1;

    else if (baqi && (bindia || bus)) rtemp = 1;
    else if (pollutant != none && bconc) rtemp = 1;
    else if (pollutant != none && baqisub && (bindia || bus)) rtemp = 1;
    if (rtemp == 0) {
        alert('incomplete pollutant/parameter detais!'); return 0;
    }
    rtemp = 0;

    charttype = document.getElementById('charttype').value;

    comparecity = document.getElementById('comparecity').value;
    if (bcompare && comparecity == none) {
        alert("Do you really want to compare or not!"); return 0;
    }

    return 1;
}


async function fun() {

    let temp = await inputcheck();
    if (temp == 0) return;

    document.getElementById("charts").innerHTML = "";
    document.getElementById("nodata").innerHTML = "";
    document.getElementById("nodata1").innerHTML = "";
   

    $("#header :input").attr("disabled", true);
    let tempc= $(":enabled");
    tempc.prop("disabled",true);
    $("#header :input").attr("disabled", false);
     
    await chartit();
    tempc.prop("disabled",false);
    document.getElementById('status').innerHTML = `<strong>Search complete</strong>`;
}

// season and year to date
function seasontodate() {
    if (season == "spring") { fromdate = seasonyear + "-02-01"; todate = seasonyear + "-03-31"; }
    else if (season == "summer") { fromdate = seasonyear + "-04-01"; todate = seasonyear + "-06-30"; }
    else if (season == "mansoon") { fromdate = seasonyear + "-07-01"; todate = seasonyear + "-09-15"; }
    else if (season == "autumn") { fromdate = seasonyear + "-09-16"; todate = seasonyear + "-11-30"; }
    else if (season == "winter") {
        fromdate = seasonyear + "-12-01";
        let intyear = parseInt(seasonyear);
        intyear++;
        todate = intyear.toString() + "-01-30";
    }
}

//week/month to date
function weekmonthtodate() {
    fromdate = fromyear + "-" + frommonth + "-" + fromweek;
    if (toweek != "1") todate = toyear + "-" + tomonth + "-" + toweek;
    else {
        if (tomonth == "04" || tomonth == "06" || tomonth == "09" || tomonth == "11") toweek = "30";
        else if (tomonth == "02") {
            if (toyear == "2016" || toyear == "2020") toweek = "29"; else toweek = "28";
        }
        else toweek = "31";
        todate = toyear + "-" + tomonth + "-" + toweek;
    }
}

//is net on
function isonline() {
    if (!navigator.onLine) alert('connect to internet');
}

//no data for charts
async function nodata() {
    document.getElementById("nodata").innerHTML = `<div class='wholeline wholelinecentre'><strong>Sorry,NO Historical data available for ${typecity} city/this time period</strong></div>`;

}
async function nodata1() {
    document.getElementById("nodata1").innerHTML = `<div class='wholeline wholelinecentre'><strong>Sorry,NO Historical data available for ${typecity} city/this time period</strong></div>`;

}
//for chart html elements
function charthtml() {
    document.getElementById("charts").innerHTML = `<canvas id="chart" ></canvas>`;
}

// pollutant name display
function pollutantname(pollutant) {
    if (pollutant == "pm10") return "Particulate Matter 10";
    else if (pollutant == "pm25") return "Particulate Matter 2.5";
    else if (pollutant == "co") return "Carbon Monoxide";
    else if (pollutant == "so2") return "Sulfur Di Oxide";
    else if (pollutant == "o3") return "Ozone";
    else if (pollutant == "no2") return "Nitrogen Di Oxide";
}


//chart/graph
async function chartit() {
    labc=0;
    let dataarray = await getfinaldata();
    let booltemp1 = true, booltemp2 = true;
    if (dataarray.length == 0) { await nodata(); booltemp1 = false; }
    let avg = await mean(dataarray);//mean in string form
    if (bindia || bus) avg = parseInt(avg);
    let avgarray = []; for (let i = 0; i < dataarray.length; i++)avgarray.push(avg);
    let xlabels = [], ylabels = [];
    for (let i = 0; i < dataarray.length; i++) { xlabels.push(dataarray[i][0]); ylabels.push(dataarray[i][1]); }
    let dataset1, tempx, tempy, tempxx, tempyy;
    tempx = {
        label: chartheadingvalue(),
        data: ylabels,
        fill: false,
        borderColor: 'rgba(224, 63, 63,1)',
        backgroundColor: 'rgba(224, 63, 63,1)',
        borderWidth: 3,

    };
    tempy = {
        type: charttype,
        label: `Mean Value for ${typecity}`,
        data: avgarray,
        borderColor: 'rgba(150, 120, 120, 1)',
        backgroundColor: 'rgba(150, 120, 120, 1)',
        fill: false,
        borderWidth: 3
    };
    if (comparecity != none) {
        typecity = comparecity;
        typecity=tosearchablename(typecity);
        vccity= typecity;
        let comparedataarray = await getfinaldata();
        if (comparedataarray.length == 0) { await nodata1(); booltemp2 = false; }
        let compareavg = await mean(comparedataarray);//mean in string form
        if (bindia || bus) compareavg = parseInt(compareavg);
        let compareavgarray = []; for (let i = 0; i < comparedataarray.length; i++)compareavgarray.push(compareavg);
        let comparexlabels = [], compareylabels = [];
        for (let i = 0; i < comparedataarray.length; i++) { comparexlabels.push(comparedataarray[i][0]); compareylabels.push(comparedataarray[i][1]); }
        tempxx = {
            label: chartheadingvalue(),
            data: compareylabels,
            fill: false,
            borderColor: 'rgba(255, 148, 8,1)',
            backgroundColor: 'rgba(255, 148, 8,1)',
            borderWidth: 3,

        };
        tempyy = {
            type: charttype,
            label: `Mean Value for ${typecity}`,
            data: compareavgarray,
            borderColor: 'rgba(173, 173, 129,1)',
            backgroundColor: 'rgba(173, 173, 129,1)',
            fill: false,
            borderWidth: 3
        };
        if (dataarray.length != 0 && comparedataarray.length == 0) dataset1 = [tempx, tempy];
        else if (dataarray.length == 0) { dataset1 = [tempxx, tempyy]; xlabels = comparexlabels; }
        else dataset1 = [tempx, tempy, tempxx, tempyy];
    }
    else dataset1 = [tempx, tempy];
    if ((!booltemp1 && !booltemp2)||(!booltemp1 && comparecity==none)) return;
    charthtml();
    let ctx = document.getElementById("chart").getContext('2d');
    let myChart = new Chart(ctx, {
        type: charttype,
        data: {
            labels: xlabels,
            datasets: dataset1
        },
        options: {
            legend: {
                labels: {
                    fontStyle: '800',
                    usePointStyle: true,
                    pointStyle: 'line'
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{ ticks: { fontColor: '#000', fontStyle: '600' } }]
            },
            aspectRatio: 3,
            maintainAspectRatio: true,
        }
    });
}

//data from each file returns array of [date,datevalue]
async function getdata(fileurl) {
    let dataarray = [], tempaqimap = new Map();
    let response = await fetch(fileurl);
    let data = await response.text();
    let rows = data.split('\n').slice(1);
    rows.forEach(element => {
        let row = element.split(',');
        if (row[2] == typecity) {
            if (btemperature || (pollutant != none && baqisub && bus)) {
                if (btemperature) pollutant = "temperature";
                if (row[3] == pollutant && row[7] != undefined && row[0] >= fromdate && row[0] <= todate) {
                    let date = row[0];
                    let datevalue = row[7];
                    dataarray.push([date, datevalue]);
                }
            }
            else if (bconc) {
                if (row[3] == pollutant && row[7] != undefined && row[0] >= fromdate && row[0] <= todate) {
                    let date = row[0];
                    let datevalue = ussubindextoconc(pollutant, row[7]);
                    dataarray.push([date, datevalue]);
                }
            }
            else if (pollutant != none && baqisub && bindia) {
                if (row[3] == pollutant && row[7] != undefined && row[0] >= fromdate && row[0] <= todate) {
                    let date = row[0];
                    let temppconc = ussubindextoconc(pollutant, row[7]);
                    let datevalue = conctoindiasubindex(pollutant, temppconc);
                    dataarray.push([date, datevalue]);
                }
            }
            else if (baqi && (bus || bindia)) {
                if ((row[3] == "pm10" || row[3] == "pm25" || row[3] == "so2" || row[3] == "no2" || row[3] == "co" || row[3] == "o3") && row[7] != undefined && row[0] >= fromdate && row[0] <= todate) {
                    let date = row[0];
                    let datevalue = row[7];
                    if (bindia) {
                        let temp = ussubindextoconc(row[3], datevalue);
                        datevalue = conctoindiasubindex(row[3], temp);
                    }
                    if (!tempaqimap.has(date)) {
                        let l = [];
                        tempaqimap.set(date, l);
                    }
                    else {
                        let l = tempaqimap.get(date);
                        l.push(datevalue);
                        tempaqimap.set(date, l);
                    }
                }
            }
        }
    })
    if (baqi && (bus || bindia)) {
        tempaqimap.forEach((elementarray, key) => {
            let temp = 0;
            for (let i = 0; i < elementarray.length; i++)
                // if(!isNaN(elementarray[i]))
                temp = Math.max(temp, elementarray[i]);
            dataarray.push([key, temp]);
        })

    }
    return dataarray;
}

// combined data from all files returns sorted combined array of [date,datevalue]
async function getalldata() {
    labc++;
    let bst =false;
    let dataarray = [];
    if(btemperature)pollutant="temperature";
    if(labc==1)cityl=vtcity;else cityl=vccity;
    let objprop = {
        cityl : cityl, fromdate :fromdate , todate : todate, baqi: baqi, bindia:bindia, bconc: bconc, pollutant :pollutant
    };

    if(sessionStorage.getItem(cityl)!=null)
    {let tempobjprop = JSON.parse(sessionStorage.getItem(cityl))[0];
    if(JSON.stringify(tempobjprop)==JSON.stringify(objprop))bst=true;}
  

    if(!bst)
    {
    for (let i = 0; i < fileurlarray.length; i++) {
        let tempdataarray = [];
        tempdataarray = await getdata(fileurlarray[i]);
        if (i <= 2) document.getElementById('status').innerHTML = `<strong>Wait while fetching data for <span class="blue">${typecity}</span></strong>`;
        else if (i < 12) document.getElementById('status').innerHTML = `<strong>Wait while fetching data for <span class="blue"> ${typecity} ${(i - 2) * 10}%</span></strong>`;
        // else document.getElementById('status').innerHTML = `<strong>yay! done</strong>`;
        for (let j = 0; j < tempdataarray.length; j++)dataarray.push(tempdataarray[j]);
    }
    dataarray.sort();
    let st = [objprop,dataarray];
    sessionStorage.setItem(cityl,JSON.stringify(st));
    }
    else
    {
      dataarray= JSON.parse(sessionStorage.getItem(cityl))[1];
    }
    return dataarray;
}

//get final data
async function getfinaldata() {
    let tempdataarray = await getalldata();
    let dataarray = [];
    if (datafrequency == 1) dataarray = await getdailydata(tempdataarray);
    else if (datafrequency == 2) dataarray = await getweeklydata(tempdataarray);
    else if (datafrequency == 3) dataarray = await getmonthlydata(tempdataarray);
    else if (datafrequency == 4) dataarray = await getyearlydata(tempdataarray);
    return dataarray;
}

// daily data
async function getdailydata(tempdataarray) {
    let i = 0, n = tempdataarray.length;
    let tempyear, tempmonth, tempdate;
    let xstring;
    let dataarray = [];
    while (i < n) {
        xstring = "";
        tempmonth = tempdataarray[i][0].slice(5, 7);
        tempdate = tempdataarray[i][0].slice(8, 10);
        tempyear = tempdataarray[i][0].slice(0, 4);
        tempdate = parseInt(tempdate);
        xstring += tempdate + " " + monthname[tempmonth] + " " + tempyear;
        dataarray.push([xstring, tempdataarray[i][1]]);
        i++;
    }
    return dataarray;
}

//weekly data
async function getweeklydata(tempdataarray) {
    let i = 0, n = tempdataarray.length;
    let tempdate, tempmonth;
    let xstring;
    let dataarray = [];
    while (i < n) {
        let tempavg = 0, tempint, l = 0;
        xstring = "";
        tempmonth = tempdataarray[i][0].slice(5, 7);
        tempdate = tempdataarray[i][0].slice(8, 10);
        tempyear = tempdataarray[i][0].slice(0, 4);
        if (tempdate >= "01" && tempdate <= "07") {
            xstring += "1st week";
            while (i < n && tempdate >= "01" && tempdate <= "07") {
                tempint = parseFloat(tempdataarray[i][1]);
                tempavg += tempint; l++;
                i++;
                if (i < n) tempdate = tempdataarray[i][0].slice(8, 10);
            }
        }
        else if (tempdate >= "08" && tempdate <= "14") {
            xstring += "2nd week";
            while (i < n && tempdate >= "08" && tempdate <= "14") {
                tempint = parseFloat(tempdataarray[i][1]);
                tempavg += tempint; l++;
                i++;
                if (i < n) tempdate = tempdataarray[i][0].slice(8, 10);
            }
        }
        else if (tempdate >= "15" && tempdate <= "21") {
            xstring += "3rd week";
            while (i < n && tempdate >= "15" && tempdate <= "21") {
                tempint = parseFloat(tempdataarray[i][1]);
                tempavg += tempint; l++;
                i++;
                if (i < n) tempdate = tempdataarray[i][0].slice(8, 10);
            }
        }
        else if (tempdate >= "22" && tempdate <= "31") {
            xstring += "4th week";
            while (i < n && tempdate >= "22" && tempdate <= "31") {
                tempint = parseFloat(tempdataarray[i][1]);
                tempavg += tempint; l++;
                i++;
                if (i < n) tempdate = tempdataarray[i][0].slice(8, 10);
            }
        }
        tempavg = tempavg / l;
        xstring += " " + monthname[tempmonth] + " " + tempyear;
        if (bus || bindia) tempavg = parseInt(tempavg);
        else tempavg = parseFloat(tempavg.toFixed(3));
        dataarray.push([xstring, tempavg]);
    }
    return dataarray;
}

//monthly data
async function getmonthlydata(tempdataarray) {
    let i = 0, n = tempdataarray.length;
    let tempmonth, tempmonth1;
    let xstring;
    let dataarray = [];
    while (i < n) {
        let tempavg = 0, tempint, l = 0;
        xstring = "";
        tempmonth = tempdataarray[i][0].slice(5, 7);
        tempmonth1 = tempmonth;
        tempyear = tempdataarray[i][0].slice(0, 4);
        while (i < n && tempmonth1 == tempmonth) {
            tempint = parseFloat(tempdataarray[i][1]);
            tempavg += tempint; l++;
            i++;
            if (i < n) tempmonth1 = tempdataarray[i][0].slice(5, 7);
        }
        tempavg = tempavg / l;
        xstring += monthname[tempmonth] + " " + tempyear;
        if (bus || bindia) tempavg = parseInt(tempavg);
        else tempavg = parseFloat(tempavg.toFixed(3));
        dataarray.push([xstring, tempavg]);
    }
    return dataarray;
}

// yearly data
async function getyearlydata(tempdataarray) {
    let i = 0, n = tempdataarray.length;
    let tempyear, tempyear1;
    let xstring;
    let dataarray = [];
    while (i < n) {
        let tempavg = 0, tempint, l = 0;
        xstring = "";
        tempyear = tempdataarray[i][0].slice(0, 4);
        tempyear1 = tempyear;
        while (i < n && tempyear1 == tempyear) {
            tempint = parseFloat(tempdataarray[i][1]);
            tempavg += tempint; l++;
            i++;
            if (i < n) tempyear1 = tempdataarray[i][0].slice(0, 4);
        }
        tempavg = tempavg / l;
        xstring += tempyear;
        if (bus || bindia) tempavg = parseInt(tempavg);
        else tempavg = parseFloat(tempavg.toFixed(3));
        dataarray.push([xstring, tempavg]);
    }
    return dataarray;
}

// chartheading name
function chartheadingvalue() {
    if (btemperature) chartheadingname = `Temperature (Deg Celcius) of ${typecity}`;
    else if (baqi) {
        if (bindia) chartheadingname = `AQI Index (INDIAN Standard) of ${typecity}`;
        else chartheadingname = `AQI Index (US EPA Standard) of ${typecity}`;
    }
    else if (baqisub) {
        if (bindia) chartheadingname = `AQI SubIndex (INDIAN Standard) for ${pollutantname(pollutant)} of ${typecity}`;
        else chartheadingname = `AQI SubIndex (US EPA Standard) for ${pollutantname(pollutant)} of ${typecity}`;
    }
    else if (bconc) {
        if (pollutant == "co") chartheadingname = `${pollutantname(pollutant)} Concentration (miligram per meter cube) of ${typecity}`;
        else chartheadingname = `${pollutantname(pollutant)} Concentration (microgram per meter cube) of ${typecity}`;
    }
    return chartheadingname;
}

///to searchable name first char upper else lower case
function tosearchablename(typecity) {
    let temp = typecity.toLowerCase();
    return temp[0].toUpperCase() + temp.slice(1);
}

async function mean(dataarray) {
    let ans = 0;
    for (let i = 0; i < dataarray.length; i++)
        ans += parseFloat(dataarray[i][1]);
    ans = ans / dataarray.length;
    return ans.toFixed(2);
}



function conctoindiasubindex(element, elementvalue) {
    let i1, i2, b1, b2, value, r;
    c = parseFloat(elementvalue);
    let ans = 0.0;
    if (element == 'pm10') {
        if (c >= 0 && c <= 50) { i1 = 0; i2 = 50; b1 = 0; b2 = 50; }
        else if (c >= 50 && c <= 100) { i1 = 51; i2 = 100; b1 = 51; b2 = 100; }
        else if (c >= 100 && c <= 250) { i1 = 101; i2 = 200; b1 = 101; b2 = 250; }
        else if (c >= 250 && c <= 350) { i1 = 201; i2 = 300; b1 = 251; b2 = 350; }
        else if (c >= 350 && c <= 430) { i1 = 301; i2 = 400; b1 = 351; b2 = 430; }
        else if (c >= 430) { i1 = 401; i2 = 500; b1 = 431; b2 = c; }
    }
    else if (element == 'pm25') {
        if (c >= 0 && c <= 30) { i1 = 0; i2 = 50; b1 = 0; b2 = 30; }
        else if (c >= 30 && c <= 60) { i1 = 51; i2 = 100; b1 = 31; b2 = 60; }
        else if (c >= 60 && c <= 90) { i1 = 101; i2 = 200; b1 = 61; b2 = 90; }
        else if (c >= 90 && c <= 120) { i1 = 201; i2 = 300; b1 = 91; b2 = 120; }
        else if (c >= 120 && c <= 250) { i1 = 301; i2 = 400; b1 = 121; b2 = 250; }
        else if (c >= 250) { i1 = 401; i2 = 500; b1 = 251; b2 = c; }
    }
    else if (element == 'no2') {
        if (c >= 0 && c <= 40) { i1 = 0; i2 = 50; b1 = 0; b2 = 40; }
        else if (c >= 40 && c <= 80) { i1 = 51; i2 = 100; b1 = 41; b2 = 80; }
        else if (c >= 80 && c <= 180) { i1 = 101; i2 = 200; b1 = 81; b2 = 180; }
        else if (c >= 180 && c <= 280) { i1 = 201; i2 = 300; b1 = 181; b2 = 280; }
        else if (c >= 280 && c <= 400) { i1 = 301; i2 = 400; b1 = 281; b2 = 400; }
        else if (c >= 400) { i1 = 401; i2 = 500; b1 = 401; b2 = c; }
    }
    else if (element == 'o3') {
        if (c >= 0 && c <= 50) { i1 = 0; i2 = 50; b1 = 0; b2 = 50; }
        else if (c >= 50 && c <= 100) { i1 = 51; i2 = 100; b1 = 51; b2 = 100; }
        else if (c >= 100 && c <= 168) { i1 = 101; i2 = 200; b1 = 101; b2 = 168; }
        else if (c >= 168 && c <= 208) { i1 = 201; i2 = 300; b1 = 169; b2 = 208; }
        else if (c >= 208 && c <= 748) { i1 = 301; i2 = 400; b1 = 209; b2 = 748; }
        else if (c >= 748) { i1 = 401; i2 = 500; b1 = 749; b2 = c; }
    }
    else if (element == 'so2') {
        if (c >= 0 && c <= 40) { i1 = 0; i2 = 50; b1 = 0; b2 = 40; }
        else if (c >= 40 && c <= 80) { i1 = 51; i2 = 100; b1 = 41; b2 = 80; }
        else if (c >= 80 && c <= 380) { i1 = 101; i2 = 200; b1 = 81; b2 = 380; }
        else if (c >= 380 && c <= 800) { i1 = 201; i2 = 300; b1 = 381; b2 = 800; }
        else if (c >= 800 && c <= 1600) { i1 = 301; i2 = 400; b1 = 801; b2 = 1600; }
        else if (c >= 1600) { i1 = 401; i2 = 500; b1 = 1601; b2 = c; }
    }
    else if (element == 'co') {
        if (c >= 0 && c <= 1.0) { i1 = 0; i2 = 50; b1 = 0; b2 = 1.0; }
        else if (c >= 1.0 && c <= 2.0) { i1 = 51; i2 = 100; b1 = 1.1; b2 = 2.0; }
        else if (c >= 2.0 && c <= 10) { i1 = 101; i2 = 200; b1 = 2.1; b2 = 10; }
        else if (c >= 10 && c <= 17) { i1 = 201; i2 = 300; b1 = 10; b2 = 17; }
        else if (c >= 17 && c <= 34) { i1 = 301; i2 = 400; b1 = 17; b2 = 34; }
        else if (c >= 34) { i1 = 401; i2 = 500; b1 = 34; b2 = c; }
    }
    ans = ((i2 - i1) / (b2 - b1)) * (c - b1) + i1;
    r = parseInt(ans);
    return r;
}


function ussubindextoconc(element, elementvalue) {
    let a1, a2, c1, c2, a, ans;
    a = parseFloat(elementvalue);
    if (element == "pm25") {
        if (a >= 0 && a <= 50) { a2 = 50; a1 = 0; c2 = 12; c1 = 0; }
        else if (a >= 50 && a <= 100) { a2 = 100; a1 = 51; c2 = 35.4; c1 = 12.1; }
        else if (a >= 100 && a <= 150) { a2 = 150; a1 = 101; c2 = 55.4; c1 = 35.5; }
        else if (a >= 150 && a <= 200) { a2 = 200; a1 = 151; c2 = 150.4; c1 = 55.5; }
        else if (a >= 200 && a <= 300) { a2 = 300; a1 = 201; c2 = 250.4; c1 = 150.5; }
        else if (a >= 300 && a <= 400) { a2 = 400; a1 = 301; c2 = 350.4; c1 = 250.5; }
        else if (a >= 400 && a <= 500) { a2 = 500; a1 = 401; c2 = 500.4; c1 = 350.5; }
        else if (a >= 500) { a2 = 600; a1 = 501; c2 = 650; c1 = 500.4; }
        ans = 1;
    }
    else if (element == "pm10") {
        if (a >= 0 && a <= 50) { a2 = 50; a1 = 0; c2 = 54; c1 = 0; }
        else if (a >= 50 && a <= 100) { a2 = 100; a1 = 51; c2 = 154; c1 = 55; }
        else if (a >= 100 && a <= 150) { a2 = 150; a1 = 101; c2 = 254; c1 = 155; }
        else if (a >= 150 && a <= 200) { a2 = 200; a1 = 151; c2 = 354; c1 = 255; }
        else if (a >= 200 && a <= 300) { a2 = 300; a1 = 201; c2 = 424; c1 = 355; }
        else if (a >= 300 && a <= 400) { a2 = 400; a1 = 301; c2 = 504; c1 = 425; }
        else if (a >= 400 && a <= 500) { a2 = 500; a1 = 401; c2 = 604; c1 = 505; }
        else if (a >= 500) { a2 = 600; a1 = 501; c2 = 705; c1 = 604; }
        ans = 1;
    }
    else if (element == "co") {
        if (a >= 0 && a <= 50) { a2 = 50; a1 = 0; c2 = 4.4; c1 = 0; }
        else if (a >= 50 && a <= 100) { a2 = 100; a1 = 51; c2 = 9.4; c1 = 4.5; }
        else if (a >= 100 && a <= 150) { a2 = 150; a1 = 101; c2 = 12.4; c1 = 9.5; }
        else if (a >= 150 && a <= 200) { a2 = 200; a1 = 151; c2 = 15.4; c1 = 12.5; }
        else if (a >= 200 && a <= 300) { a2 = 300; a1 = 201; c2 = 30.4; c1 = 15.5; }
        else if (a >= 300 && a <= 400) { a2 = 400; a1 = 301; c2 = 40.4; c1 = 30.5; }
        else if (a >= 400 && a <= 500) { a2 = 500; a1 = 401; c2 = 50.4; c1 = 40.5; }
        else if (a >= 500) { a2 = 600; a1 = 501; c2 = 60.4; c1 = 50.5; }
        ans = 1.146;
    }
    else if (element == "so2") {
        if (a >= 0 && a <= 50) { a2 = 50; a1 = 0; c2 = 35; c1 = 0; }
        else if (a >= 50 && a <= 100) { a2 = 100; a1 = 51; c2 = 75; c1 = 36; }
        else if (a >= 100 && a <= 150) { a2 = 150; a1 = 101; c2 = 185; c1 = 76; }
        else if (a >= 150 && a <= 200) { a2 = 200; a1 = 151; c2 = 304; c1 = 186; }
        else if (a >= 200 && a <= 300) { a2 = 300; a1 = 201; c2 = 604; c1 = 305; }
        else if (a >= 300 && a <= 400) { a2 = 400; a1 = 301; c2 = 804; c1 = 605; }
        else if (a >= 400 && a <= 500) { a2 = 500; a1 = 401; c2 = 1004; c1 = 805; }
        else if (a >= 500) { a2 = 600; a1 = 501; c2 = 1200; c1 = 1005; }
        ans = 2.616;
    }
    else if (element == "o3") {
        if (a >= 0 && a <= 50) { a2 = 50; a1 = 0; c2 = 54; c1 = 0; }
        else if (a >= 50 && a <= 100) { a2 = 100; a1 = 51; c2 = 70; c1 = 55; }
        else if (a >= 100 && a <= 150) { a2 = 150; a1 = 101; c2 = 85; c1 = 71; }
        else if (a >= 150 && a <= 200) { a2 = 200; a1 = 151; c2 = 105; c1 = 86; }
        else if (a >= 200 && a <= 300) { a2 = 300; a1 = 201; c2 = 200; c1 = 106; }
        else if (a >= 300 && a <= 400) { a2 = 400; a1 = 301; c2 = 504; c1 = 405; }
        else if (a >= 400 && a <= 500) { a2 = 500; a1 = 401; c2 = 604; c1 = 505; }
        else if (a >= 500) { a2 = 600; a1 = 501; c2 = 704; c1 = 605; }
        ans = 1.962;
    }

    else if (element == "no2") {
        if (a >= 0 && a <= 50) { a2 = 50; a1 = 0; c2 = 53; c1 = 0; }
        else if (a >= 50 && a <= 100) { a2 = 100; a1 = 51; c2 = 100; c1 = 54; }
        else if (a >= 100 && a <= 150) { a2 = 150; a1 = 101; c2 = 360; c1 = 101; }
        else if (a >= 150 && a <= 200) { a2 = 200; a1 = 151; c2 = 649; c1 = 361; }
        else if (a >= 200 && a <= 300) { a2 = 300; a1 = 201; c2 = 1244; c1 = 650; }
        else if (a >= 300 && a <= 400) { a2 = 400; a1 = 301; c2 = 1644; c1 = 1245; }
        else if (a >= 400 && a <= 500) { a2 = 500; a1 = 401; c2 = 2044; c1 = 1645; }
        else if (a >= 500) { a2 = 600; a1 = 501; c2 = 2440; c1 = 2045; }
        ans = 1.88;
    }
    ans = ans * (((a - a1) / (a2 - a1)) * (c2 - c1) + c1);
    return parseFloat(ans.toFixed(3));
}


//html all enable disable

// initial all disabled options
function inidisable() {
    btemperature = false; baqi = false; bconc = false; baqisub = false; bindia = false; bus = false;
    frequency = 0;
    document.getElementById('fromdate').disabled = true;
    document.getElementById('todate').disabled = true;
    document.getElementById('season').disabled = true;
    document.getElementById('seasonyear').disabled = true;
    document.getElementById('fromyear').disabled = true;
    document.getElementById('frommonth').disabled = true;
    document.getElementById('fromweek').disabled = true;
    document.getElementById('toyear').disabled = true;
    document.getElementById('tomonth').disabled = true;
    document.getElementById('toweek').disabled = true;
    document.getElementById('aqi').disabled = true;
    document.getElementById('temperature').disabled = true;
    document.getElementById('pollutant').disabled = true;
    document.getElementById('bypollutantconc').disabled = true;
    document.getElementById('bypollutantsubindex').disabled = true;
    document.getElementById('byindia').disabled = true;
    document.getElementById('byus').disabled = true;
    document.getElementById('comparecity').disabled = true;
    document.getElementById('no').checked = true;
}
// onclick disable for timeperiod type
function enabledate() {
    document.getElementById('fromdate').disabled = false;
    document.getElementById('todate').disabled = false;
    document.getElementById('season').value = "";
    document.getElementById('seasonyear').value = "";
    document.getElementById('fromyear').value = "";
    document.getElementById('frommonth').value = "";
    document.getElementById('fromweek').value = "";
    document.getElementById('toyear').value = "";
    document.getElementById('tomonth').value = "";
    document.getElementById('toweek').value = "";
    document.getElementById('season').disabled = true;
    document.getElementById('seasonyear').disabled = true;
    document.getElementById('fromyear').disabled = true;
    document.getElementById('frommonth').disabled = true;
    document.getElementById('fromweek').disabled = true;
    document.getElementById('toyear').disabled = true;
    document.getElementById('tomonth').disabled = true;
    document.getElementById('toweek').disabled = true;
}

function enableseason() {
    document.getElementById('season').disabled = false;
    document.getElementById('seasonyear').disabled = false;
    document.getElementById('fromdate').value = "";
    document.getElementById('todate').value = "";
    document.getElementById('fromyear').value = "";
    document.getElementById('frommonth').value = "";
    document.getElementById('fromweek').value = "";
    document.getElementById('toyear').value = "";
    document.getElementById('tomonth').value = "";
    document.getElementById('toweek').value = "";
    document.getElementById('fromdate').disabled = true;
    document.getElementById('todate').disabled = true;
    document.getElementById('fromyear').disabled = true;
    document.getElementById('frommonth').disabled = true;
    document.getElementById('fromweek').disabled = true;
    document.getElementById('toyear').disabled = true;
    document.getElementById('tomonth').disabled = true;
    document.getElementById('toweek').disabled = true;
}

function enableweek() {
    document.getElementById('fromyear').disabled = false;
    document.getElementById('frommonth').disabled = false;
    document.getElementById('fromweek').disabled = false;
    document.getElementById('toyear').disabled = false;
    document.getElementById('tomonth').disabled = false;
    document.getElementById('toweek').disabled = false;
    document.getElementById('fromdate').value = "";
    document.getElementById('todate').value = "";
    document.getElementById('season').value = "";
    document.getElementById('seasonyear').value = "";
    document.getElementById('fromdate').disabled = true;
    document.getElementById('todate').disabled = true;
    document.getElementById('season').disabled = true;
    document.getElementById('seasonyear').disabled = true;
}

//onclick disable for pollutant/parameter type

function enableparameter() {
    document.getElementById('aqi').disabled = false;
    document.getElementById('temperature').disabled = false;

    document.getElementById('pollutant').value = "";
    bconc = false; baqisub = false; bindia = false; bus = false;
    document.getElementById('bypollutantconc').checked = false;
    document.getElementById('bypollutantsubindex').checked = false;
    document.getElementById('byindia').checked = false;
    document.getElementById('byus').checked = false;

    document.getElementById('pollutant').disabled = true;
    document.getElementById('bypollutantconc').disabled = true;
    document.getElementById('bypollutantsubindex').disabled = true;
    document.getElementById('byindia').disabled = true;
    document.getElementById('byus').disabled = true;
}

function enablepollutant() {
    document.getElementById('pollutant').disabled = false;
    document.getElementById('bypollutantconc').disabled = false;
    document.getElementById('bypollutantsubindex').disabled = false;

    btemperature = false; baqi = false; bindia = false; bus = false;
    document.getElementById('aqi').checked = false;
    document.getElementById('temperature').checked = false;
    document.getElementById('byindia').checked = false;
    document.getElementById('byus').checked = false;

    document.getElementById('aqi').disabled = true;
    document.getElementById('temperature').disabled = true;
    document.getElementById('byindia').disabled = true;
    document.getElementById('byus').disabled = true;
}

function enablestandard() {
    document.getElementById('byindia').disabled = false;
    document.getElementById('byus').disabled = false;
}

function disablestandard() {
    bindia = false; bus = false;
    document.getElementById('byindia').checked = false;
    document.getElementById('byus').checked = false;

    document.getElementById('byindia').disabled = true;
    document.getElementById('byus').disabled = true;
}

function standardvalue(l) {
    if (l == 1) { bindia = true; bus = false; }
    else { bindia = false; bus = true; }
}

function parametervalue(l) {
    if (l == 1) { baqi = true; btemperature = false; enablestandard(); }
    else { baqi = false; btemperature = true; disablestandard(); }
}

function pollutantvalue(l) {
    if (l == 1) { bconc = true; baqisub = false; disablestandard(); }
    else { bconc = false; baqisub = true; enablestandard(); }
}

function frequencyvalue(l) {
    datafrequency = l;
}

function enablecompare() {
    bcompare = true;
    document.getElementById('comparecity').disabled = false;
}

function disablecompare() {
    bcompare = false;
    document.getElementById('comparecity').value = "";
    document.getElementById('comparecity').disabled = true;
}
