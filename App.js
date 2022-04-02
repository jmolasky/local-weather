import { useState, useEffect, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    SectionList,
    ScrollView,
    RefreshControl,
    Image,
    FlatList,
} from "react-native";
import * as Location from "expo-location";
import { getWeather, wait, getTime } from "./functions";

export default function App() {
    const [address, setAddress] = useState(null);
    const [weather, setWeather] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const getLocation = async () => {
        // destructures status from response to async function
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
            return "not granted";
        }
        let loc = await Location.getLastKnownPositionAsync({});
        let address = await Location.reverseGeocodeAsync({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
        });
        setAddress(address[0]);
        return loc;
    };

    useEffect(async () => {
        const loc = await getLocation();
        if (loc != "not granted") {
            getWeather(loc.coords, setWeather);
        }
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        const loc = await getLocation();
        getWeather(loc.coords, setWeather);
        wait(1000).then(() => setRefreshing(false));
    }, []);

    let text = "Waiting...";
    if (errorMsg) {
        text = errorMsg;
    } else if (address) {
        // text = JSON.stringify(location);
        text = address.city;
    }

    const HourlyListItem = ({ item }) => {
        return (
            <View style={styles.item}>
                <Text>{item.date}</Text>
                <Image
                    source={{
                        uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                    }}
                    style={styles.itemPhoto}
                    resizeMode="cover"
                />
                <Text>{item.temp} &#x2109;</Text>
                <Text>{item.weather[0].description}</Text>
            </View>
        );
    };
    const DailyListItem = ({ item }) => {
        return (
            <View style={styles.item}>
                <Image
                    source={{
                        uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                    }}
                    style={styles.itemPhoto}
                    resizeMode="cover"
                />
                <Text>{item.temp} &#x2109;</Text>
                <Text>{item.weather[0].description}</Text>
            </View>
        );
    };

    let hourlyWeatherData;
    if (weather) {
        hourlyWeatherData = weather.hourly.map((item, index) => {
            // const unixTime = item.dt;
            // const date = new Date(unixTime * 1000);
            // let hours = date.getHours();
            // const AmPm = hours >= 12 ? "pm" : "am";
            // hours = hours % 12 || 12;
            // const totalDate = `${hours}${AmPm}`;

            return {
                key: index,
                date: getTime(item.dt),
                temp: item.temp,
                weather: item.weather,
            };
        });
    }

    let dailyWeatherData;
    if (weather) {
        dailyWeatherData = weather.daily.map((item, index) => {
            return {
                key: index,
                temp: item.temp.day,
                weather: item.weather,
            };
        });
    }

    let SECTIONS = [
        {
            title: "Hourly Forecast",
            horizontal: true,
            data: weather ? hourlyWeatherData : null,
        },
        {
            title: "Daily Forecast",
            horizontal: false,
            data: weather ? dailyWeatherData : null,
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <SafeAreaView style={{ flex: 1 }}>
                {/* <ScrollView
                    contentContainerStyle={styles.scrollView}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                > */}
                <Text>{text}</Text>
                {weather && (
                    <SectionList
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                        stickySectionHeadersEnabled={false}
                        sections={SECTIONS}
                        renderSectionHeader={({ section }) => (
                            <>
                                <Text style={styles.sectionHeader}>
                                    {section.title}
                                </Text>
                                {section.horizontal ? (
                                    <FlatList
                                        horizontal
                                        data={section.data}
                                        renderItem={({ item }) => (
                                            <HourlyListItem item={item} />
                                        )}
                                        showsHorizontalScrollIndicator={false}
                                    />
                                ) : null}
                            </>
                        )}
                        renderItem={({ item, section }) => {
                            if (section.horizontal) {
                                return null;
                            }
                            return <DailyListItem item={item} />;
                        }}
                    />
                )}
                {/* <Text style={styles.text}>{text}</Text> */}
                {/* {weather && (
                        <Image
                            source={{
                                uri: `http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`,
                            }}
                            style={{ width: 150, height: 150 }}
                        />
                    )}  */}
                {/* </ScrollView> */}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    sectionHeader: {
        fontWeight: "800",
        fontSize: 18,
        color: "#f4f4f4",
        marginTop: 20,
        marginBottom: 5,
    },
    item: {
        margin: 10,
    },
    itemPhoto: {
        width: 75,
        height: 75,
    },
    itemText: {
        color: "#ffffff7f",
        marginTop: 5,
    },
    text: {
        color: "white",
    },
    scrollView: {
        flex: 1,
        backgroundColor: "#3ae9cf",
        alignItems: "center",
        justifyContent: "center",
    },
});
