import { StyleSheet, Text, View, Image } from "react-native";
import { getDay } from "./functions";
import colors from "./config/colors";

export default function CurrentWeather({ current, daily }) {
    const day = getDay(current.dt);
    return (
        <View style={styles.container}>
            <View style={styles.center}>
                <Text style={[styles.mainDescription, styles.primaryText]}>
                    {current.weather[0].description}
                </Text>
                <Text style={[styles.mainTemp, styles.primaryText]}>
                    {Math.round(current.temp)} &#x2109;
                </Text>
                <Image
                    source={{
                        uri: `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`,
                    }}
                    style={styles.mainImage}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.bar}>
                <Text style={styles.primaryText}>{day} TODAY</Text>
                <View style={styles.highLow}>
                    <Text style={styles.primaryText}>
                        {Math.round(daily.temp.max)} &#x2109;
                    </Text>
                    <Text style={styles.secondaryText}>
                        {Math.round(daily.temp.min)} &#x2109;
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    primaryText: {
        color: colors.primaryText,
    },
    secondaryText: {
        color: colors.secondaryText,
    },
    bar: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    center: {
        alignSelf: "center",
    },
    container: {
        margin: 10,
        borderWidth: 2,
        borderColor: "orange",
    },
    description: {
        textAlign: "center",
    },
    highLow: {
        flexDirection: "row",
        borderWidth: 2,
        borderColor: "purple",
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
        width: 75,
        height: 75,
    },
});
