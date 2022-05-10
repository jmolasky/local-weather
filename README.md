# Local Weather

## Introduction

An application built with Expo/React Native that uses location services and the OpenWeatherMap API to display the current weather.

## Features

Once opened, the app performs an API call and displays the current weather, along with a 48-hour hourly side-scrollable forecast and a 7-day forecast.

Users can pull down to refresh the page, which triggers another location lookup/weather API call.

## Technologies Used

-   JavaScript
-   NodeJS
-   Expo
-   React Native
-   React
-   OpenWeatherMap API

## Screenshots

![The App Live](https://i.imgur.com/cFjNCkOl.png)
![Gif of App](./assets/local_weather.gif)

## Unsolved Problems

-   The API data only updates every 10 minutes, but I was unable to figure out how to only trigger another API call when the page is refreshed if a certain amount of time has elapsed.
-   I was unable to get the border to show up under the sticky "Daily Forecast" header.

## Future Enhancements/Next Steps

-   The ability to see different types of weather data on different pages
-   Rendering additional data such as wind chill, wind speed, sunrise/sunset etc.
-   A background image that changes based on the current weather
