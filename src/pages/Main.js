import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrash, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import cloudIcon from '../assets/icons/cloud.png';
import sunIcon from '../assets/icons/sun.png';

import { ThemeContext } from '../contexts/ThemeContext';

import '../assets/css/main.css';

export default function Main() {
    const apiUrl = process.env.REACT_APP_OPENWEATHERMAP_API_URL;
    const apiKey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;

    const { theme, toggleTheme } = useContext(ThemeContext);

    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const [searchHistory, setSearchHistory] = useState(localStorage.getItem('searchHistory') ? JSON.parse(localStorage.getItem('searchHistory')) : []); // JSON.parse() converts string to object (in this case, the string is from local
    const [errorMsg, setErrorMsg] = useState('');

    const updateSearchHistory = (data) => {
        setSearchHistory(prevState => {
            let newState = [...prevState];
            newState.map((item, index) => {
                if(item.id === data.id){
                    newState.splice(index, 1);
                }
                return null;
            })
            newState.unshift(data);
            return newState;
        });

    }

    const deleteSearchHistory = (id) => {
        setSearchHistory(prevState => {
            let newState = [...prevState];
            newState.map((item, index) => {
                if(item.id === id){
                    newState.splice(index, 1);
                }
                return null;
            })
            return newState;
        });
    }

    const getWeather = (location = null) => {
        const fetchWeather = async () => {
            axios.get(`${apiUrl}/data/2.5/weather?q=${location ? location : searchInput}&appid=${apiKey}`)
            .then((response) => {
                console.log(response.data);
                setSearchResults(response.data);
                updateSearchHistory(response.data);
                setErrorMsg("");
            }).catch((err) => {
                setErrorMsg("Location not found");
                console.log(err);
            });
        }
        fetchWeather();
    }

    useEffect(() => {
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }, [searchHistory]);

    useEffect(() => {
        console.log(theme)
    }, [theme]);

    return (
        <div className='main-container' style={{
            backgroundImage: theme === "light" ? `url("bg-light.png")` : `url("bg-dark.png")`,
            color: theme ==="light" ? "#000" : "#fff"
            }}>
            <div className={`main-div`}>
                <div className='search-container'>
                    <div className='search-input-container'>
                        <input style={{color: theme === "dark" ? 'white' : "black"}} id="search-input" className={`search-input ${theme + '-mode-0point3'}`} type='text' placeholder='' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                        <label htmlFor="search-input" className='search-input-label'>Location</label>
                    </div>
                    <button className='get-weather-button' onClick={() => {getWeather();}} >
                        <FontAwesomeIcon icon={faSearch}/>
                    </button>
                    
                </div>
                {errorMsg !== "" && 
                    <div className='search-feedback'>
                        {errorMsg}
                    </div>
                }
                <div className={`main-body-div ${theme + "-mode-0point2"}`}>
                    {Object.keys(searchResults).length !== 0 && 
                    <div className='current-weather-div'>
                        <div className='current-weather-icon-div'>
                            <img src={searchResults.weather[0].main === "Clouds" ? cloudIcon : searchResults.weather === "Sunny" ? sunIcon : "" } className='current-weather-icon-img' alt=""></img>
                        </div>
                        {searchResults.name + ", " + searchResults.sys.country} <br />
                        {searchResults.weather[0].main}<br />
                        desc: {searchResults.weather[0].description}<br />
                        temp: {(searchResults.main.temp - 273.15).toFixed(2) + "°C"}<br />
                        humidity: {searchResults.main.humidity + "%"}<br />
                        Time: {new Date(searchResults.dt * 1000).toLocaleString()}
                    </div>
                    }
                    <div className={`search-history-container ${theme + "-mode-0point3"}`}>
                        Search History
                        {searchHistory.map((item, index) => {
                            return (
                                <div key={index} className={`search-history-item ${theme + "-mode-0point3"}`}>
                                    <div>
                                        {item.name + ", " + item.sys.country}
                                    </div>
                                    <div>
                                        {new Date(item.dt * 1000).toLocaleString()}
                                    </div>
                                    <div className='search-history-action-container'>
                                        <button className='search-history-button' onClick={() => {setSearchInput(item.name); getWeather(item.name);}} ><FontAwesomeIcon icon={faSearch}/></button>
                                        <button className='search-history-button' onClick={() => deleteSearchHistory(item.id)}><FontAwesomeIcon icon={faTrash} /></button>
                                    </div>
                                </div>
                            )
                        })}
                        {searchHistory.length === 0 && <tr><td colSpan='3'>No search history</td></tr>}
                        
                    </div>
                    <div className='settings-container'>
                        <div className='theme-switch-div'>
                            <input type='checkbox' className='theme-switch-input' id="theme-switch-input"  onChange={() => toggleTheme()} checked={theme === "light" ? false : true}/>
                            <label htmlFor="theme-switch-input" className="theme-switch-label">
                                <FontAwesomeIcon icon={faMoon} style={{color: 'white'}}/>
                                <FontAwesomeIcon icon={faSun} style={{color: 'white'}}/>
                                <span className="theme-switch-ball"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}