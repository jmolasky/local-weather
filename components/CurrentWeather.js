import { StyleSheet, Text, View, Image } from "react-native";
import { getDay } from "../functions";
import colors from "../config/colors";
import AppText from "./AppText";

export default function CurrentWeather({ current, daily }) {
    const day = getDay(current.dt);
    return (
        <View style={styles.container}>
            <View style={styles.center}>
                <AppText style={styles.mainDescription}>
                    {current.weather[0].description}
                </AppText>

                <AppText style={styles.mainTemp}>
                    {Math.round(current.temp)} &#x2109;
                </AppText>
                <Image
                    source={{
                        uri: `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`,
                    }}
                    style={styles.mainImage}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.bar}>
                <AppText>{day} TODAY</AppText>
                <View style={styles.highLow}>
                    <AppText>{Math.round(daily.temp.max)} &#x2109;</AppText>

                    <AppText style={styles.secondaryText}>
                        {Math.round(daily.temp.min)} &#x2109;
                    </AppText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    secondaryText: {
        color: colors.secondaryText,
    },
    bar: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 2,
        borderBottomColor: colors.secondaryText,
        paddingBottom: 10,
        marginBottom: 0,
    },
    center: {
        alignSelf: "center",
    },
    container: {
        margin: 10,
        marginBottom: 0,
    },
    highLow: {
        flexDirection: "row",
        width: 120,
        justifyContent: "space-between",
    },
    mainDescription: {
        textAlign: "center",
    },
    mainTemp: {
        fontSize: 72,
        textAlign: "center",
    },
    mainImage: {
        alignSelf: "center",
        width: 100,
        height: 100,
    },
});
