import React, { useState } from 'react';
import fetch from 'isomorphic-fetch';
import moment from 'moment';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const apiKey = process.env.REACT_APP_WEATHER_KEY;
const baseURL = "https://api.openweathermap.org/data/2.5/";

function App () {
  
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  
  const popover = (
    <Popover id="popover-basic" className="shadow border-0 text-muted">
      <Popover.Title as="h3">Instructions</Popover.Title>
      <Popover.Content>
          To search for your location enter exactly as follows: ex: 'Los Angeles, CA, US' - 
          city, state, and country code separated by commas.
      </Popover.Content>
    </Popover>
  );
  
  const search = evt => {
    if (evt.key === "Enter") {
      fetch(`${baseURL}weather?q=${query}&units=imperial&APPID=${apiKey}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery('');
          console.log(result);
        });
    } 
  };
  
  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    
    return `${day} ${date} ${month} ${year}`;
  };
  
  return (
    <div>
      <div className={(typeof weather.main != "undefined") ? ((weather.main.temp > 50) ? 'app warm'
        : 'app') : 'app' }>
        <main>
          <div className="search-box">
            <h1>Current Weather Tracker</h1>
            <OverlayTrigger 
             trigger="focus" 
             placement="bottom" 
             overlay={popover}
             >
              <input 
                type="text"
                className="search-bar"
                placeholder="Search (ex: Los Angeles, CA, US)"
                onChange={e => setQuery(e.target.value)}
                value={query}
                onKeyPress={search}
              />
            </OverlayTrigger>
          </div>
          {(typeof weather.main != "undefined") ? (
          <div>
            <div>
              <div className="location-box">
                <div className="location">{weather.name}, {weather.sys.country}</div>
                <div className="date">{dateBuilder(new Date())}</div>
              </div>
              <div className="weather-box">
                <div className="temp">
                  {Math.round(weather.main.temp)}&deg;f
                </div>
                <div className="weather">{weather.weather[0].description}</div>
                <div className="cloud">Cloudiness: {weather.clouds.all}%</div>
                <div className="wind">Wind Speed: {Math.round(weather.wind.speed)} mph</div>
                <div className="feels-like">Feels Like: {Math.round(weather.main.feels_like)} &deg;f</div>
                <div className="humidity">Humidity: {Math.round(weather.main.humidity)}%</div>
                <div className="sunrise">Sunrise: {moment(weather.sys.sunrise * 1000).format('LT')}</div>
                <div className="sunset">Sunset: {moment(weather.sys.sunset * 1000).format('LT')}</div>
              </div>
            </div>
          </div>
          ) : ('')}
        </main>
      </div>
    </div>
  );
}

export default App;

