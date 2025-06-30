var searchInput = document.getElementById('search');
var submitButton = document.getElementById('submit');
var weatherDataContainer = document.getElementById('weatherData');

var apiKey = '65c8a2c5c4ef4586abc63400252206';

async function getWeatherData(location) {
    try {
        var response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`);
        var data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        // Log any errors to the console
        console.error('error getting weather data:', error);
    }
}

function displayWeatherData(data) {
    var { location, current, forecast } = data;
    var forecastDays = forecast.forecastday;

    var weatherHtml = `
        <div class="col-lg-4 col-md-12 p-0">
            <div class="forecast-container today">
                <div class="forecast-header rounded-0 d-flex justify-content-between">
                    <span>${new Date(forecastDays[0].date).toLocaleDateString('en-US', { weekday: 'long' })}</span>
                    <span>${new Date(forecastDays[0].date).toLocaleDateString('en-US', { day: '2-digit', month: 'long' })}</span>
                </div>
                <div class="forecast-content">
                    <div class="location">${location.name}</div>
                    <div class="degree">
                        <div class="num">${current.temp_c}<sup>o</sup>C</div>
                    </div>
                    <div class="forecast-icon">
                        <img src="https:${current.condition.icon}" alt="" width="90">
                    </div>
                    <div class="custom">${current.condition.text}</div>
                    <span><i class="fas fa-umbrella me-1"></i>${current.humidity}%</span>
                    <span class="mx-2"><i class="fas fa-wind me-1"></i>${current.wind_kph}km/h</span>
                    <span><i class="far fa-compass me-1"></i>${current.wind_dir}</span>
                </div>
            </div>
        </div>
    `;

    for (var i = 1; i < forecastDays.length; i++) {
        var day = forecastDays[i];
        var additionalClass = '';
        if (i === 1) {
            additionalClass = ' middle-card';
        }
        weatherHtml += `
            <div class="col-lg-4 col-md-12 p-0">
                <div class="forecast-container rounded-0 text-center h-100${additionalClass}">
                    <div class="forecast-header">
                        <div>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                    </div>
                    <div class="forecast-content">
                        <div class="forecast-icon">
                            <img src="https:${day.day.condition.icon}" alt="" width="48">
                        </div>
                        <div class="degree">${day.day.maxtemp_c}<sup>o</sup>C</div>
                        <small class="min-degree">${day.day.mintemp_c}<sup>o</sup></small>
                        <div class="custom">${day.day.condition.text}</div>
                    </div>
                </div>
            </div>
        `;
    }

    weatherDataContainer.innerHTML = weatherHtml;
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            getWeatherData(lat + ',' + lon);
        }, function () {
            getWeatherData('cairo');
        });
    } else {
        getWeatherData('cairo');
    }
}

submitButton.addEventListener('click', function () {
    var location = searchInput.value;
    if (location) {
        getWeatherData(location);
    }
});

searchInput.addEventListener('keyup', function () {
    var location = searchInput.value;
    if (location.length > 2) {
        getWeatherData(location);
    } else {
        if (location.length === 0) {
            getCurrentLocation();
        }
    }
});

getCurrentLocation();