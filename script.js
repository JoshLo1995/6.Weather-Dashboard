$(document).ready(function() {
    init();
    // Do this stuff when the submit button is pressed
    $("#submitButton").click(function() {
        console.log("Submit has been clicked!");

    });
    
    // Do this stuff when enter button is pressed
    $("#searchBar").bind("enterKey", function(e) {
        clearFields();
        console.log("Enter is being pressed!!");
        let city = addToPrevSearch();
        checkWeather(city);
    });
    $("#searchBar").keyup(function(e) {
        if(e.keyCode == 13) {
            $(this).trigger("enterKey");
        }
    });
});

/**
 * Function description
 *
 * Populate all text fields with previously saved information from localStorage
 * @param - Takes no params
 * @return - Does not return Anything
 *
 */
function load() {

}

function init() {
    this.prevSearched = [];
    loadTodayWeather(findUser());
}

async function findUser() {


    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(function() {
            if ("geolocation" in navigator){ //check geolocation available 
                //try to get user current location using getCurrentPosition() method
                navigator.geolocation.getCurrentPosition(function(position){ 
                    let coordinates = [position.coords.latitude, position.coords.longitude];
                    debugger;
                    return coordinates;
                    });
            } else {
                console.log("Browser doesn't support geolocation!");
            }
        }), 1000)
    });

    let coordinates = await promise;
    return coordinates
    
}

function addToPrevSearch() {
    let city = $("#searchBar").val();
    this.prevSearched.push(city);
    $(".previouslySearched").append("<div class = 'text-center'>" + city + "</div>");
    $("#searchBar").val("");
    return city;
}

async function loadTodayWeather(coords) {
    await findUser();
    $.ajax({url: "https://api.openweathermap.org/data/2.5/forecast?lat=" + coords[0] + "&lon=" + coords[1] + "&APPID=7e6a24a68dbf04f8280d98667782c96b", success: function(result) {
        this.weatherStats = [];
        let weather = result.list[0].weather[0].main;
        let temp = (result.list[0].main.temp - 273.15) * 1.8 + 32;
        let humidity = result.list[0].main.humidity;
        let windSpeed = result.list[0].wind.speed;
        
        $("#currentWeatherDisplay").text(
            weather + "\n" + 
            "Temperature: " + temp + "˚F\n" +
            "Humidity: " + humidity + "%\n" +
            "Wind Speed: " + windSpeed + " mph"
        );
    }});
    $("#currentWeatherDisplay").text(
        moment().format('MMMM Do YYYY, h:mm:ss a')
    );
}

function checkWeather(city) {
    $.ajax({url: "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=7e6a24a68dbf04f8280d98667782c96b", success: function(result) {
        this.weatherStats = [];
        for (let i = 1; i <= 5; i++) {
            let weather = result.list[i].weather[0].main;
            let temp = (result.list[i].main.temp - 273.15) * 1.8 + 32;
            let humidity = result.list[i].main.humidity;
            let windSpeed = result.list[i].wind.speed;
            this.weatherStats.push([weather, temp, humidity, windSpeed]);
        }
        return this.weatherStats;
    }}).then(function(event) {
        loadFiveDayForecast(this.weatherStats);
    });
}

function loadFiveDayForecast(forecast) {
    for (let i = 0; i < forecast.length; i++) {
        let weather = forecast[i][0];
        let temp = Math.trunc(forecast[i][1]);
        let humidity = forecast[i][2];
        let windSpeed = forecast[i][3];
        $("#weatherDisplay" + (i + 1)).append("<div id = 'weather' style = 'background-color: white'" + i + ">" + weather + "</div>");
        $("#weatherDisplay" + (i + 1)).append("<div id = 'temp' style = 'background-color: white'" + i + ">" + "Temperature: " + temp + "˚F" + "</div>");
        $("#weatherDisplay" + (i + 1)).append("<div id = 'humidity' style = 'background-color: white'" + i + ">" + "Humidity: " + humidity + "%" + "</div>");
        $("#weatherDisplay" + (i + 1)).append("<div id = 'windSpeed' style = 'background-color: white'" + i + ">" + "Wind Speed: " + windSpeed + "mph" + "</div>");
       
    }
}

function clearFields() {
    for (let i = 1; i <= 5; i++) {
        $("#weatherDisplay" + i).empty();
    }
}



