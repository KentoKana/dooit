import { darken, mode, whiten } from "@chakra-ui/theme-tools"
export const ButtonStyles = {
    baseStyle: {
        bgColor: "primary"
    },
    sizes: {},
    variants: {
        primary: (props: any) => ({
            color: "white",
            _hover: {
                bgColor:
                    mode(darken("primary", 10), whiten("primary", 10))(props)
            },
            // _active: mode(darken("primary", 10), whiten("primary", 10))(props),
            bg: "primary",
        })
    },
    defaultProps: {}
}