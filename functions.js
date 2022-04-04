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
        setterFunction(data);
    } catch (error) {
        console.log(error);
    }
};

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const getTime = (dt) => {
    const date = new Date(dt * 1000);
    let hours = date.getHours();
    const AmPm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    const totalDate = `${hours}${AmPm}`;
    return totalDate;
};

const getDay = (dt) => {
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const date = new Date(dt * 1000);
    const day = weekday[date.getDay()];
    return day;
};

export { getWeather, wait, getTime, getDay };
