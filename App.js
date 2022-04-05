import { useState, useEffect, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    View,
    SafeAreaView,
    SectionList,
    Image,
    FlatList,
} from "react-native";
import * as Location from "expo-location";
import { getWeather, wait, getTime, getDay } from "./functions";
import CurrentWeather from "./components/CurrentWeather";
import colors from "./config/colors";
import AppText from "./components/AppText";

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
        // faster but less accurate
        // let loc = await Location.getLastKnownPositionAsync({});
        let loc = await Location.getCurrentPositionAsync({});
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
                <AppText>{item.date}</AppText>
                <Image
                    source={{
                        uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                    }}
                    style={styles.itemPhoto}
                    resizeMode="cover"
                />
                <AppText>{Math.round(item.temp)} &#x2109;</AppText>
                <AppText>{item.weather[0].description}</AppText>
            </View>
        );
    };
    const DailyListItem = ({ item }) => {
        return (
            <View style={styles.item}>
                <AppText>{item.day}</AppText>
                <View style={styles.verticalItem}>
                    <View style={styles.descContainer}>
                        <AppText>{item.weather[0].description}</AppText>
                    </View>
                    <Image
                        source={{
                            uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                        }}
                        style={styles.itemPhoto}
                        resizeMode="cover"
                    />
                    <View style={styles.highLow}>
                        <AppText>{Math.round(item.temp.max)} &#x2109;</AppText>
                        <AppText style={styles.secondaryText}>
                            {Math.round(item.temp.min)} &#x2109;
                        </AppText>
                    </View>
                </View>
            </View>
        );
    };

    let hourlyWeatherData;
    if (weather) {
        hourlyWeatherData = weather.hourly.map((item, index) => {
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
                day: getDay(item.dt),
                temp: item.temp,
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
                <AppText style={styles.city}>{text}</AppText>
                {weather && (
                    <>
                        <CurrentWeather
                            current={weather.current}
                            daily={weather.daily[0]}
                        />
                        <SectionList
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            contentContainerStyle={{
                                paddingHorizontal: 10,
                            }}
                            // stickySectionHeadersEnabled={true}
                            sections={SECTIONS}
                            renderSectionHeader={({ section }) => (
                                <>
                                    <AppText
                                        style={[
                                            styles.sectionHeader,
                                            { zIndex: 1 },
                                        ]}
                                    >
                                        {section.title}
                                    </AppText>
                                    {section.horizontal ? (
                                        <FlatList
                                            horizontal
                                            data={section.data}
                                            style={styles.horizontalList}
                                            renderItem={({ item }) => (
                                                <HourlyListItem item={item} />
                                            )}
                                            showsHorizontalScrollIndicator={
                                                false
                                            }
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
                    </>
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    secondaryText: {
        color: colors.secondaryText,
    },
    city: {
        fontSize: 36,
        textAlign: "center",
    },
    container: {
        flex: 1,
        backgroundColor: "#5ba9e1",
    },
    descContainer: {
        width: 120,
    },
    sectionHeader: {
        fontWeight: "700",
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#5ba9e1",
    },
    highLow: {
        flexDirection: "row",
        width: 120,
        justifyContent: "space-between",
    },
    item: {
        margin: 10,
        alignItems: "center",
    },
    itemPhoto: {
        width: 75,
        height: 75,
    },
    verticalItem: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 2,
        borderBottomColor: colors.secondaryText,
    },
    horizontalList: {
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderTopColor: colors.secondaryText,
        borderBottomColor: colors.secondaryText,
    },
});
