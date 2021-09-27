// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react"
// 2. Call `extendTheme` and pass your custom values
export const theme = extendTheme({
    colors: {
        primary: {
            100: "#119da4",
            200: "#13505b",
        },
        black: {
            100: "#040404"
        }
    },
})
