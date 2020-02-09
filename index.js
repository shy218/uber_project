const JSONFileName = 'Assets/mean.json';

const hotspots = ["The Palace Of Fine Arts, 3601 Lyon St, San Francisco, CA", "Oracle Park, 24 Willie Mays Plaza, San Francisco, CA", "Fisherman's Wharf, 286-298 Jefferson St, San Francisco, CA"]
const barts = ["Embarcadero, San Francisco, CA", "2nd Street and Stevenson Street, San Francisco, CA", "Powell BART Station, Market St and Powell St, San Francisco, CA"]
const barts_name = ["Embarcadero Bart", "Montgomery Bart", "Powell Bart"]

const relation = {
  "The Palace Of Fine Arts, 3601 Lyon St, San Francisco, CA": "The Palace Of Fine Arts",
  "Fisherman's Wharf, 286-298 Jefferson St, San Francisco, CA": "Fisherman's Wharf",
  "Oracle Park, 24 Willie Mays Plaza, San Francisco, CA": "Oracle Park",
  "Embarcadero, San Francisco, CA": "Embarcadero Bart",
  "2nd Street and Stevenson Street, San Francisco, CA": "Montgomery Bart",
  "Powell BART Station, Market St and Powell St, San Francisco, CA": "Powell Bart"
}

const date_relation = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']



const date_list = ["Mon", 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']

var data = null;
var advice = null

document.getElementById("bestBart").style.display = "none"



//document.getElementById("d").style.display = "none"




function onSuccessCb(jsonData) {
  data = jsonData[0];
  advice = jsonData[1];

  Highcharts.chart("WeekGraph", {
    chart: {
      type: 'line',
      height: 200
    },
    title: {
      text: 'Travel Time for each date given time of day',
      margin: 10,
      style: {
        fontSize: '10px',

      }
    },

    legend: {
      enabled: false
    },

    yAxis: {
      title: {
        text: 'Travel Time (s)'
      }
    },

    xAxis: {
      categories: ["Mon", "Tue", "Wed", 'Thur', 'Fri', 'Sat', 'Sun'],
    },

    plotOptions: {
      area: {
        stacking: 'normal',
        lineColor: '#666666',
        lineWidth: 1,
        marker: {
          lineWidth: 1,
          lineColor: '#666666'
        }
      }
    },


    series: [{
      name: 'Time',
      data: []
    }]

  });
  Highcharts.chart("TimeGraph", {
    chart: {
      type: 'line',
      height: 200
    },
    title: {
      text: 'Travel Time for each time period given date',
      margin: 10,
      style: {
        fontSize: '10px'
      }
    },

    legend: {
      enabled: false
    },
    yAxis: {
      title: {
        text: 'Travel Time (s)'
      }
    },

    xAxis: {
      categories: ["Morn", "AM", "Noon", 'PM', 'Even'],
    },


    plotOptions: {
      area: {
        stacking: 'normal',
        lineColor: '#666666',
        lineWidth: 1,
        marker: {
          lineWidth: 1,
          lineColor: '#666666'
        }
      }
    },


    series: [{
      name: 'Time',
      data: []
    }]

  });
}

function convert(time) {
  time = Math.floor(time)
  return (Math.floor(time / 60) + " min " + (time % 60) + " s")
}

function findBestBart(end, date, time) {
  if (data != null && hotspots.findIndex(element => element === end) != -1) {
    var result = {}
    var temp = []
    barts.forEach(function (start) {

      result[start] = data[start][end][date][time - 1]
      temp.push(start)
    })

    temp.sort(function (a, b) {
      return result[a] - result[b]
    })

    document.getElementById("f").innerHTML = barts_name[0]
    document.getElementById("f_v").innerHTML = convert(result[temp[0]])
    document.getElementById("s").innerHTML = barts_name[1]
    document.getElementById("s_v").innerHTML = convert(result[temp[1]])
    document.getElementById("t").innerHTML = barts_name[2]
    document.getElementById("t_v").innerHTML = convert(result[temp[2]])
    document.getElementById("loc").innerHTML = "To " + relation[end]

    document.getElementById("bestBart").style.display = "block"

  } else {
    document.getElementById("bestBart").style.display = "none"
  }
}


function initMap() {
  var directionsRenderer = new google.maps.DirectionsRenderer;
  var directionsService = new google.maps.DirectionsService;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: {
      lat: 37.77,
      lng: -122.41
    }
  });
  directionsRenderer.setMap(map);
  //directionsRenderer.setPanel(document.getElementById('right-panel'));

  var control = document.getElementById('floating-panel');
  control.style.display = 'block';
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

  var onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
    //console.log(data)
    var start = document.getElementById('start').value;

    var end = document.getElementById('end').value;
    if ((barts.findIndex(element => element === start) != -1 && barts.findIndex(element => element === end) != -1) || (barts.findIndex(element => element === start) == -1 && barts.findIndex(element => element === end) == -1)) {
      alert("You cannot choose two hotspots or two barts")
      return;
    }
    var date = document.getElementById('date').value;
    var time = document.getElementById('time').value;

    //console.log(document.getElementById('end').text)

    let week = []
    date_list.forEach(function (date) {
      week.push(data[start][end][date][time - 1])
    })

    //var give_advice1 = "From" +


    document.getElementById('Travel').innerHTML = convert(data[start][end][date][time - 1])

    findBestBart(end, date, time);

    console.log(advice[start][end])


    var give_advice1 = relation[start] + " --> " + relation[end]
    var give_advice11 = "The best time to travel is " + date_relation[advice[start][end]["weekday"]] + " on " + advice[start][end]["time_of_day"] + " " + convert(advice[start][end]["Value"])
    var give_advice2 = relation[end] + " --> " + relation[start]
    var give_advice21 = "The best time to travel is " + date_relation[advice[end][start]["weekday"]] + " on " + advice[end][start]["time_of_day"] + " " + convert(advice[end][start]["Value"])
    document.getElementById("advice1").innerHTML = give_advice1
    document.getElementById("advice11").innerHTML = give_advice11
    document.getElementById("advice2").innerHTML = give_advice2
    document.getElementById("advice21").innerHTML = give_advice21
    Highcharts.charts[0].series[0].setData(week, true)
    Highcharts.charts[1].series[0].setData(data[start][end][date], true)



  };

  document.getElementById('start').addEventListener('change', onChangeHandler);
  document.getElementById('end').addEventListener('change', onChangeHandler);

  document.getElementById('date').addEventListener('change', onChangeHandler);
  document.getElementById('time').addEventListener('change', onChangeHandler);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  directionsService.route({
    origin: start,
    destination: end,
    travelMode: 'DRIVING'
  }, function (response, status) {
    if (status === 'OK') {
      directionsRenderer.setDirections(response);
      document.getElementById('Distance').innerHTML = response.routes[0].legs[0].distance.text

    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}



function fetchJSONFile(filePath, callbackFunc) {
  console.debug("Fetching file:", filePath);
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200 || httpRequest.status === 0) {
        console.info("Loaded file:", filePath);
        var data = JSON.parse(httpRequest.responseText);
        console.debug("Data parsed into valid JSON!");
        console.debug(data);
        if (callbackFunc) callbackFunc(data);
      } else {
        console.error("Error while fetching file", filePath,
          "with error:", httpRequest.statusText);
      }
    }
  };
  httpRequest.open('GET', filePath);
  httpRequest.send();
}

function doMain() {

  fetchJSONFile(JSONFileName, onSuccessCb);
}

document.onload = doMain();