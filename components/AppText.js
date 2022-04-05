import { StyleSheet, Text } from "react-native";
import colors from "../config/colors";

export default function AppText(props) {
    return <Text style={[styles.text, props.style]}>{props.children}</Text>;
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        color: colors.primaryText,
    },
});
