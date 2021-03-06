import { ComponentSingleStyleConfig } from "@chakra-ui/react"
import { darken, mode, whiten } from "@chakra-ui/theme-tools"
const primaryButton = (props: any) => {
    return {
        color: mode("white", "black")(props),
        bgColor: mode(darken("primary", 10), whiten("primary", 10))(props),
    }
}
export const ButtonStyles: ComponentSingleStyleConfig = {
    baseStyle: {
        bgColor: "primary"
    },
    variants: {
        primary: (props: any) => ({
            color: "white",
            bg: "primary",
            borderRadius: "3px",
            _active: primaryButton(props),
            _disabled: primaryButton(props),
            _hover: {
                ...primaryButton(props),
                _disabled: primaryButton(props),
            },
        }),
        outline: (props: any) => ({
            color: "grey.700",
            bg: "#fff",
            borderRadius: "3px",
            borderColor: "grey.700",
        })
    },
    defaultProps: {}
}