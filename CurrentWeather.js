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
import { getDay } from "./functions";

export default function CurrentWeather({ current, daily }) {
    const day = getDay(current.dt);
    return (
        <View style={styles.container}>
            <View style={styles.center}>
                <Text style={styles.mainDescription}>
                    {current.weather[0].description}
                </Text>
                <Text style={styles.mainTemp}>
                    {Math.round(current.temp)} &#x2109;
                </Text>
            </View>
            <View style={styles.bar}>
                <Text>{day} TODAY</Text>
                <View style={styles.highLow}>
                    <Text>{Math.round(daily.temp.max)} &#x2109;</Text>
                    <Text>{Math.round(daily.temp.min)} &#x2109;</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
});
