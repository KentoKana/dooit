import { mode } from "@chakra-ui/theme-tools"
import { lighten, darken } from "@chakra-ui/theme-tools"
export const LinkStyles = {
    sizes: {},
    variants: {
        dashboard_active: (props: any) => ({
            display: "block",
            backgroundColor: mode(lighten("primary", 50), darken("primary", 50))(props),
            color: mode("grey.700", "white")(props),
            marginBottom: "10px",
            padding: "5px 10px",
            borderRadius: "3px",
            _hover: {
                color: mode("grey.700", "white")(props),
                textDecoration: "none",
            },
        }),
        dashboard_inactive: (props: any) => ({
            display: "block",
            color: mode("grey.700", "white")(props),
            marginBottom: "10px",
            padding: "5px 10px",
            borderRadius: "5px",
            _hover: {
                display: "block",
                backgroundColor: mode(lighten("primary", 40), darken("primary", 40))(props),
                color: mode("grey.700", "white")(props),
                marginBottom: "10px",
                padding: "5px 10px",
                borderRadius: "3px",
                textDecoration: "none",
            },
        }),
    },
    defaultProps: {}
}

