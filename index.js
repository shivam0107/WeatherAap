    // console.log('shivam singh');
// const API_KEY = '0d2df8fc5878ee1ebf39a24572139a44';



//     function renderWeatherInfo(data) {
        
//         let newPara = document.createElement('p');
//         newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`;

//         document.body.appendChild(newPara);
//     }

//     async function fetchWeatherDetail(){
//     // let latitude = 15.3333;
//     // let longitude = 74.0833;
//     try {

//         let city = "satna";
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
//         const data = await response.json();


//         console.log("weather data:-> ", data);
//         renderWeatherInfo(data);
//     }
//     catch (e) {
        
//         console.log(e);
//     }
    
// }
   
// async function getCustomWeatherDetail() {
    
//     try {
        
//         let lattitude = 15.67884;
//         let longitude = 28.67884;

//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lattitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
//         const data = await response.json();

//         console.log("Weather data:->", data);

//         renderWeatherInfo(data);


//     }
//     catch (e) {
//         console.log("Error Found", e);
//     }
// }

const userTab = document.querySelector("[data-userWeather]");
const searchTab  = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-Container");
const searchForm = document.querySelector(".form-container");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
// const grantAccessContainer = document.querySelector(".grant-location-container");
// const grantAccessContainer = document.querySelector(".grant-location-container");


// initially variable

let oldTab = userTab;
const API_KEY = '0d2df8fc5878ee1ebf39a24572139a44';
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab) {

    if (newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;

        oldTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            // is search form container invisible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            // pehle search tab par tha ab your weather visible karna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, weather bhi display karna padega

            getfromSessionStorage();

        }

    }
} 

userTab.addEventListener("click", () => {
    //passed clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //passed clicked tab as input parameter
    switchTab(searchTab);
});

// check if cordinates are already present in session  storage
function getfromSessionStorage() {
    
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        //agar local coordinates present nahi hai
        grantAccessContainer.classList.add("active");

    }
    else {
        
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
        
    }

}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    //make grant container invisible 
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //api call
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        
        const data = await response.JSON;
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);



    }
    catch (e) {
        loadingScreen.classList.remove("active");

        console.log("Error Found:", e);

        
    }



    
}

function renderWeatherInfo(weatherInfo) {
    
    //firstly we have to fetch the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-WeatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    
    console.log(weatherInfo);

    // fetch values from weatherInfo object and put it ui element
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}°C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;



}



function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else {
        alert("grant to Access Location");
    }
}


function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };
    
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);


}
const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if (cityName === "") return;

    fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
    
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`

        );

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);


    }
    catch (err) {
        
        console.log("Error found:", err);

        
    }


}