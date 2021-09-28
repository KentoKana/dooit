import { darken, mode, whiten } from "@chakra-ui/theme-tools"
export const TextStyles = {
    sizes: {},
    variants: {
        primary: {
            color: 'primary'
        },
        link: (props: any) => ({
            color: 'primary',
            _hover: {
                color:
                    mode(darken("primary", 10), whiten("primary", 10))(props)
            },
        })
    },
    defaultProps: {}
}