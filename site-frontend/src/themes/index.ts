// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react"
import { ButtonStyles as Button } from "./button"
// 2. Call `extendTheme` and pass your custom values
export const theme = extendTheme({
    colors: {
        primary: "#119da4",
        black: "#040404"
    },
    components: {
        Button
    }
})
