import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Box, Flex, Link as ChakraLink, chakra, useColorModeValue, useColorMode } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

import MobileNav from './mobile-nav.component';
import DesktopNav from './desktop-nav.component';
import { transparentize } from '@chakra-ui/theme-tools';
// import useScrollPosition from '../../hooks/use-scroll-position-hook';

import routes from '../../routes/routes';
import { selectIsSignIn } from '../../redux/user/user.selectors';
import { signOut } from 'src/redux/user/user.actions';

const Nav = (props): JSX.Element => {
  const { isSignIn, signOut } = props;
  const { colorMode } = useColorMode();
  const [width, setWidth] = useState(0);
  // const { y, max } = useScrollPosition();
  // const { pathname } = useRouter();

  // const projectPage = pathname === '/projects/[slug]';

  // useEffect(() => {
  //   if (projectPage) {
  //     const newWidth = y / max;
  //     if (newWidth !== width) {
  //       setWidth(newWidth * 100);
  //     }
  //   }
  // }, [y, max, width, projectPage]);

  return (
    <chakra.header
      display={`${!isSignIn ? 'none' : ''}`}
      width='full'
      pos='fixed'
      _before={{
        transition: 'all 0.10s ',
        transitionTimingFunction: '1 100 10 10 ',
        content: '""',
        width: width + '%',
        top: 0,
        left: 0,
        height: '6px',
        bg: useColorModeValue('lex.500', 'lex.300'),
        position: 'absolute',
        zIndex: 9999
      }}
      top={0}
      left={0}
      zIndex={10}
      bg={useColorModeValue(`rgba(255, 255, 255, 0.8)`, `rgba(26, 33, 41, 0.8)`)}
      sx={{ backdropFilter: `saturate(180%) blur(5px)` }}
    >
      <chakra.nav mx='auto' p={3}>
        <Flex mx='auto' justifyContent='space-between' alignContent='center' maxW='6xl' width='full'>
          <Box display='flex' alignContent='center'>
            <ChakraLink
              to='/'
              as={NavLink}
              fontSize='lg'
              margin='auto'
              fontWeight='semibold'
              position='relative'
              textTransform='capitalize'
              _after={{
                transition: `all 0.25s ease-in-out`,
                content: `''`,
                outline: `1px solid transparent`,
                width: `0%`,
                height: `25%`,
                position: `absolute`,

                bottom: 1,
                left: 0,
                bg: colorMode === 'light' ? transparentize(`lex.500`, 0.46) : transparentize(`lex.500`, 0.36),
                zIndex: -1
              }}
              _hover={{
                _after: {
                  width: `100%`
                },
                color: colorMode === 'light' ? `gray.900` : `white`
              }}
              color={colorMode === 'light' ? 'gray.900' : 'white'}
            >
              Home
            </ChakraLink>
          </Box>
          <MobileNav links={routes} isSignIn={isSignIn} signOut={signOut} />
          <DesktopNav links={routes} isSignIn={isSignIn} signOut={signOut} />
        </Flex>
      </chakra.nav>
    </chakra.header>
  );
};

const mapStateToProps = createStructuredSelector({
  isSignIn: selectIsSignIn
});

const mapDispatchToProps = (dispatch) => ({
  signOut: () => dispatch(signOut())
});

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
