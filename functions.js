const getWeather = async (location, setterFunction) => {
    const url = "https://weather-api-server.herokuapp.com/weather";
    // console.log(JSON.stringify(location));
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "Application/json",
            },
            body: JSON.stringify(location),
        });
        const data = await response.json();
        console.log(data.city.name);
        console.log(data.city.country);
        data.list.forEach((item) => {
            console.log(item.dt_txt);
            console.log(item.weather[0].main);
            console.log(item.weather[0].description);
            console.log(item.weather[0].icon);
            console.log(item.main.temp);
        });
        setterFunction(data);
    } catch (error) {
        console.log(error);
    }
};

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

export { getWeather, wait };
