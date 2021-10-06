// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react"
import { ButtonStyles as Button } from "./button"
import { TextStyles as Text } from "./text"
import { InputStyles as Input } from "./input"
import { LinkStyles as Link } from "./link"
// 2. Call `extendTheme` and pass your custom values
export const theme = extendTheme({
    colors: {
        primary: "#119da4",
        black: "#040404",
        grey: {
            50: "#f0f0fa",
            100: "#d1d3e1",
            200: "#b3b6c9",
            300: "#9499b4",
            400: "#777c9f",
            500: "#5d6385",
            600: "#484d69",
            700: "#34374b",
            800: "#1e212e",
            900: "#080b14",
        },
    },
    components: {
        Button, Text, Input, Link
    }
})
