import { memo, useState, useRef } from 'react';
import './weather.scss';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faCaretDown, faCaretUp, faDroplet, faTemperatureArrowDown, faTemperatureArrowUp } from '@fortawesome/free-solid-svg-icons';
import { CircularProgress } from 'react-cssfx-loading/lib';
import skeletonWeather from '../../assets/weatherIcon/skeleton-weather.svg';
import clearDay from '../../assets/weatherIcon/day.svg';
import clearNight from '../../assets/weatherIcon/night.svg';
import cloudy1Day from '../../assets/weatherIcon/cloudy-lv1-day.svg';
import cloudy1Night from '../../assets/weatherIcon/cloudy-lv1-night.svg';
import cloudy2Day from '../../assets/weatherIcon/cloudy-lv2-day.svg';
import cloudy2Night from '../../assets/weatherIcon/cloudy-lv2-night.svg';
import cloudy3 from '../../assets/weatherIcon/cloudy-lv3.svg';
import rainyShower1 from '../../assets/weatherIcon/rainy-shower-lv1.svg';
import rainyShower2 from '../../assets/weatherIcon/rainy-shower-lv2.svg';
import rainyShower3 from '../../assets/weatherIcon/rainy-shower-lv3.svg';
import rainyShower4 from '../../assets/weatherIcon/rainy-shower-lv4.svg';
import rainyDrizzle1 from '../../assets/weatherIcon/rainy-drizzle-lv1.svg';
import rainyDrizzle2 from '../../assets/weatherIcon/rainy-drizzle-lv2.svg';
import rainyDrizzle3 from '../../assets/weatherIcon/rainy-drizzle-lv3.svg';
import rainy1 from '../../assets/weatherIcon/rainy-lv1.svg';
import rainy2 from '../../assets/weatherIcon/rainy-lv2.svg';
import rainy3 from '../../assets/weatherIcon/rainy-lv3.svg';
import rainy4 from '../../assets/weatherIcon/rainy-lv4.svg';
import thunder1 from '../../assets/weatherIcon/thunder-lv1.svg';
import thunder2 from '../../assets/weatherIcon/thunder-lv2.svg';
import thunder3 from '../../assets/weatherIcon/thunder-lv3.svg';
import thunderRain1 from '../../assets/weatherIcon/thunder-rain-lv1.svg';
import thunderRain2 from '../../assets/weatherIcon/thunder-rain-lv2.svg';
import thunderRain3 from '../../assets/weatherIcon/thunder-rain-lv3.svg';

function Weather() {
    const themeMode = useSelector(state => state.auth.themeMode) === 'dark' ? ' dark' : ''
    const weather = useSelector(state => state.auth.weather)
    const weatherInfo = weather ? JSON.parse(weather) : null
    const currentWeather = getCurrentWeather(weatherInfo)
    const weatherCode = currentWeather ? currentWeather.weather[0].id : null
    const weatherHourList = weatherInfo ? weatherInfo.list.filter(item => item.dt > new Date().getTime()/1000) : null
    const [moreWeatherDetail, setMoreWeatherDetail] = useState(false)
    const [buttonScrollLeft, setButtonScrollLeft] = useState(false)
    const scrollX = useRef(0)

    function getCurrentWeather(weatherInfo) {
        if (weatherInfo) {
            let currentWeather = null
            const currentDateTime = new Date().getTime()/1000
            for (let i = 0; i < weatherInfo.list.length; i++) {
                if ((weatherInfo.list[i]).dt < currentDateTime && (weatherInfo.list[i+1]).dt > currentDateTime) {
                    currentWeather = weatherInfo.list[i+1]
                }
            }
            if (!currentWeather) {
                currentWeather = weatherInfo.list[0]
            }
            return currentWeather
        }
        return null
    }
    function isNightTime(dateTime) {
        const hour = getHours(dateTime)*1
        if (hour > 5 && hour < 18) {
            return false
        }
        return true
    }
    function isRain(weatherCode) {
        const isRainCode = 
            weatherCode === 500 || weatherCode === 501 || weatherCode === 502 || 
            weatherCode === 503 || weatherCode === 520 || weatherCode === 521 || 
            weatherCode === 522 || weatherCode === 531 || weatherCode === 300 || 
            weatherCode === 301 || weatherCode === 302 || weatherCode === 310 || 
            weatherCode === 311 || weatherCode === 312 || weatherCode === 313 || 
            weatherCode === 314 || weatherCode === 321 || weatherCode === 300  
        if (isRainCode) {
            return true
        }
        return false
    }
    function getWeatherIcon(weatherCode, dateTime) {
        switch (weatherCode) {
            case 800:
                if (isNightTime(dateTime)) {
                    return clearNight
                }
                return clearDay
            case 801:
                if (isNightTime(dateTime)) {
                    return cloudy1Night
                }
                return cloudy1Day
            case 802:
                if (isNightTime(dateTime)) {
                    return cloudy2Night
                }
                return cloudy2Day
            case 803:
            case 804:
                return cloudy3
            case 500:
                return rainy1
            case 501:
                return rainy2
            case 502:
                return rainy3
            case 503:
            case 504:
                return rainy4
            case 520:
                return rainyShower1
            case 521:
            case 313:
                return rainyShower2
            case 522:
            case 314:
                return rainyShower3
            case 531:
            case 321:
                return rainyShower4
            case 300:
            case 310:
                return rainyDrizzle1
            case 301:
            case 311:
                return rainyDrizzle2
            case 302:
            case 312:
                return rainyDrizzle3
            case 210:
                return thunder1
            case 211:
                return thunder2
            case 212: 
                return thunder3
            case 221:
                return thunder3
            case 200:
            case 230:
                return thunderRain1
            case 201:
            case 231:
                return thunderRain2
            case 202:
            case 232:
                return thunderRain3
            default:
                return cloudy3
        }
    }
    function round(value, precision) {
        const multiplier = Math.pow(10, precision || 0)
        return Math.round(value * multiplier) / multiplier
    }
    function getHours(datetime) {
        return new Date(datetime*1000).getHours()
    }
    function getMinutes(datetime) {
        return new Date(datetime*1000).getMinutes()
    }
    function getDay(datetime) {
        return new Date(datetime*1000).getDate()
    }
    function getMonth(datetime) {
        return new Date(datetime*1000).getMonth() + 1
    }
    function getWindDirection(deg) {
        if (deg < 22.5) {
            return "N"
        }
        if (deg > 22.5 && deg < 67.5) {
            return "NE"
        }
        if (deg > 67.5 && deg < 112.5) {
            return "E"
        }
        if (deg > 112.5 && deg < 157.5) {
            return "SE"
        }
        if (deg > 157.5 && deg < 202.5) {
            return "S"
        }
        if (deg > 202.5 && deg < 247.5) {
            return "SW"
        }
        if (deg > 247.5 && deg < 292.5) {
            return "W"
        }
        if (deg > 292.5 && deg < 337.5) {
            return "NW"
        }
        if (deg > 337.5) {
            return "N"
        }
    }

    return (
        <>
        {
            currentWeather 
            ?
            <div className={"weather"+themeMode}>
                <div className={isRain(weatherCode) ? "weather-top rain" : "weather-top"}>
                    <div className="weather-top-location-name">
                        <h2 className="location-name">{weatherInfo.city.name}</h2>
                    </div>
                    <div className="weather-top-icon">
                        <div 
                            alt="weather-icon" className="weather-icon" 
                            style={{backgroundImage: `url(${getWeatherIcon(weatherCode, currentWeather.dt)})`}}
                        />
                    </div>
                    <div className="weather-top-wrap-info">
                        <div className="weather-top-description">
                            <h3 className="weather-short-desc">{currentWeather.weather[0].description}</h3>
                        </div>
                        <div className="weather-top-temperature-group">
                            <div className="wrap-temperature-avg">
                                <h2 className="temperature-avg">{round(currentWeather.main.temp - 273.15)}</h2>
                            </div>
                            <div className="wrap-temperature-range">
                                <div className="wrap-temperature max">
                                    <FontAwesomeIcon icon={faTemperatureArrowUp} className="temperature-icon max" />
                                    <h3 className="temperature max">{round(currentWeather.main.temp_max - 273.15)}</h3>
                                </div>
                                <div className="wrap-temperature min">
                                    <FontAwesomeIcon icon={faTemperatureArrowDown} className="temperature-icon min" />
                                    <h3 className="temperature min">{round(currentWeather.main.temp_min - 273.15)}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    moreWeatherDetail
                    ?
                    <>
                        <div className="weather-center">
                            <ul className="weather-center-temperature-list">
                            {
                                weatherHourList.map(item => {
                                    return (
                                        <li 
                                            key={item.dt} 
                                            className={ 
                                                isRain(item.weather[0].id) 
                                                ? "weather-center-temperature-item rain" 
                                                : "weather-center-temperature-item"
                                            }
                                        >
                                            <div className="temperature-item-top">
                                                <h3 className="date">{getDay(item.dt) + '/' +getMonth(item.dt)}</h3>
                                                <h3 className="hour">{getHours(item.dt) + ':00'}</h3>
                                                <div className="wrap-chance-of-rain">
                                                    <FontAwesomeIcon icon={faDroplet} className="chance-of-rain-icon"/>
                                                    <h3 className="chance-of-rain">{item.main.humidity + "%"}</h3>
                                                </div>
                                            </div>
                                            <div className="temperature-item-center">
                                                <img src={getWeatherIcon(item.weather[0].id, item.dt)} alt="" className="hour-temperature-icon" />
                                            </div>
                                            <div className="temperature-item-bottom">
                                                <h3 className="hour-temperature">{round(item.main.temp - 273.15)}</h3>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                            </ul>
                            {
                                buttonScrollLeft &&
                                <div 
                                    role="button" className="btn-circle btn-weather-scroll left"
                                    onClick={() => {
                                        const weatherList = document.querySelector('.weather-center-temperature-list')
                                        scrollX.current -= 222
                                        if (scrollX.current <= 0) {
                                            scrollX.current = 0
                                            setButtonScrollLeft(false)
                                        }
                                        weatherList.scrollTo({ behavior: 'smooth', left: scrollX.current })
                                    }}
                                >
                                    <FontAwesomeIcon icon={faAngleLeft} className="weather-scroll-icon" />
                                </div>
                            }
                            <div 
                                role="button" className="btn-circle btn-weather-scroll right"
                                onClick={() => {
                                    const weatherList = document.querySelector('.weather-center-temperature-list')
                                    scrollX.current += 222
                                    setButtonScrollLeft(true)
                                    const isScrollToEnd = weatherList.scrollLeft + weatherList.clientWidth >= weatherList.scrollWidth
                                    if (isScrollToEnd) {
                                        scrollX.current = 0
                                        setButtonScrollLeft(false)
                                    }
                                    weatherList.scrollTo({ behavior: 'smooth', left: scrollX.current })
                                }}
                            >
                                <FontAwesomeIcon icon={faAngleRight} className="weather-scroll-icon" />
                            </div>
                        </div>
                        <div className="weather-bottom">
                            <ul className="weather-bottom-list left">
                                <li className="weather-bottom-item left">
                                    <p className="item-name">SUNRISE</p>
                                    <p className="item-desc">
                                    {
                                        getHours(weatherInfo.city.sunrise) + ":" + getMinutes(weatherInfo.city.sunrise)
                                    }
                                    </p>
                                </li>
                                <li className="weather-bottom-item left">
                                    <p className="item-name">CHANCE OF RAIN</p>
                                    <p className="item-desc">60%</p>
                                </li>
                                <li className="weather-bottom-item left">
                                    <p className="item-name">WIND</p>
                                    <p className="item-desc">
                                    {
                                        getWindDirection(currentWeather.wind.deg) + " " + round(currentWeather.wind.speed*1.61, 1) + " km/h"
                                    }
                                    </p>
                                </li>
                                <li className="weather-bottom-item left">
                                    <p className="item-name">PRECIPITATION</p>
                                    <p className="item-desc">2 cm</p>
                                </li>
                                <li className="weather-bottom-item left">
                                    <p className="item-name">VISIBILITY</p>
                                    <p className="item-desc">{round(currentWeather.visibility/1000) + " km"}</p>
                                </li>
                            </ul>
                            <ul className="weather-bottom-list right">
                                <li className="weather-bottom-item right">
                                    <p className="item-name">SUNSET</p>
                                    <p className="item-desc">
                                    {
                                        getHours(weatherInfo.city.sunset) + ":" + getMinutes(weatherInfo.city.sunset)
                                    }
                                    </p>
                                </li>
                                <li className="weather-bottom-item right">
                                    <p className="item-name">HUMIDITY</p>
                                    <p className="item-desc">{currentWeather.main.humidity + "%"}</p>
                                </li>
                                <li className="weather-bottom-item right">
                                    <p className="item-name">FEELS LIKE</p>
                                    <p className="item-desc temperature">{round(currentWeather.main.feels_like -273.15)}</p>
                                </li>
                                <li className="weather-bottom-item right">
                                    <p className="item-name">PRESSURE</p>
                                    <p className="item-desc">{currentWeather.main.pressure + " hPa"}</p>
                                </li>
                                <li className="weather-bottom-item right">
                                    <p className="item-name">UV INDEX</p>
                                    <p className="item-desc">8</p>
                                </li>
                            </ul>

                        </div>
                        <button 
                            className="btn btn-weather-more-detail"
                            onClick={() => {
                                setMoreWeatherDetail(false)
                                setButtonScrollLeft(false)
                            }}
                        >
                            <p className="weather-more-detail-desc">Thu gọn</p>
                            <FontAwesomeIcon icon={faCaretUp} className="weather-more-detail-icon up"/>
                        </button>
                    </>
                    :
                    <button 
                        className="btn btn-weather-more-detail"
                        onClick={() => setMoreWeatherDetail(true)}
                    >
                        <p className="weather-more-detail-desc">Xem thêm</p>
                        <FontAwesomeIcon icon={faCaretDown} className="weather-more-detail-icon down"/>
                    </button>
                }

            </div>
            : 
            <div className="skeleton-weather">
                <div 
                    alt="skeleton-weather-icon" className="skeleton-weather-icon" 
                    style={{backgroundImage: `url(${skeletonWeather})`}}
                />
                <div className="wrapper-spin-weather">
                    <CircularProgress width={30} height={30} color="#bdbdbd" style={{margin: 6}}/>
                </div>
                <h3 className="skeleton-weather-loading">loading weather...</h3>
            </div>
        }
        </>
    )
}


export default memo(Weather);