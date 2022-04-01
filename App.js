import { useState, useEffect, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    RefreshControl,
    Image,
} from "react-native";
import { getLocation, getWeather, wait } from "./functions";

export default function App() {
    const [weather, setWeather] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(async () => {
        const loc = await getLocation();
        getWeather(loc.coords, setWeather);
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
    } else if (weather) {
        // text = JSON.stringify(location);
        text = weather.city.name;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <Text style={styles.text}>{text}</Text>
                {weather && (
                    <Image
                        source={{
                            uri: `http://openweathermap.org/img/wn/${weather.list[12].weather[0].icon}@2x.png`,
                        }}
                        style={{ width: 150, height: 150 }}
                    />
                )}
            </ScrollView>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
