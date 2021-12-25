import { ChakraTheme, extendTheme, ThemeComponentProps } from '@chakra-ui/react';
import { transparentize, mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true
  },
  components: {
    Link: {
      baseStyle: (props: any) => ({
        color: mode('lex.600', 'lex.300')(props)
      })
    },
    Heading: {
      baseStyle: {
        fontFamily: 'Quicksand'
      }
    },
    Text: {
      baseStyle: {
        fontFamily: 'Quicksand'
      }
    },
    Button: {
      variants: {
        ghostAlwaysOn: (props: ThemeComponentProps<ChakraTheme>) => {
          const darkBg = transparentize(`${props.colorScheme}`, 0.12)(props.theme);
          const darkHoverBg = transparentize(`${props.colorScheme}.darkRed`, 0.24)(props.theme);
          const darkActiveBg = transparentize(`${props.colorScheme}.red`, 0.36)(props.theme);
          return {
            color: mode(`${props.colorScheme}.600`, `${props.colorScheme}.200`)(props),
            bgColor: props.colorMode === 'light' ? `${props.colorScheme}.50` : darkBg,
            _hover: {
              bgColor: mode(`${props.colorScheme}.100`, darkHoverBg)(props)
            },
            _active: {
              bgColor: mode(`${props.colorScheme}.200`, darkActiveBg)(props)
            }
          };
        }
      }
    }
  },
  styles: {
    global: (props: any) => ({
      '*': {
        bg: 'none',

        _selection: {
          color: props.colorMode === `dark` ? `black` : `white`,
          bg: props.colorMode === `dark` ? `lex.red` : `lex.darkRed`
        }
      }
    })
  },
  colors: {
    lex: {
      primary: `#3D8BA6`,
      black: `#12171A`,
      white: `#FEFEFE`,
      red: `#C62827`,
      darkRed: `#74151D`,
      greyLight: `#efefef`,
      200: `#6794A0`,
      300: `#708C93`,
      400: `#50d38b`,
      500: `#174D5B`,
      600: `#095063`,
      700: `#1d7444`,
      800: `#1d7444`,
      900: `#155733`
    }
  }
});

export default theme;
