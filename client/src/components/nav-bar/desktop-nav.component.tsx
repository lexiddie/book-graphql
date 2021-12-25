import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HStack, useColorMode, Link as ChakraLink } from '@chakra-ui/react';
import { transparentize } from '@chakra-ui/theme-tools';
import { NavLink } from 'react-router-dom';
import ToggleTheme from './toggle-theme.component';

const DesktopNav = ({ links, isSignIn, signOut }: { links: any; isSignIn: boolean; signOut: any }): JSX.Element => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    console.log(`Checking Location`, location);
    return () => {};
  }, [location]);

  return (
    <>
      <HStack spacing={8} display={{ base: `none`, md: `flex` }}>
        {links.map((element: any, index: number) => {
          return (
            <ChakraLink
              key={index.toString()}
              to={element.link}
              as={NavLink}
              color={colorMode === 'light' ? `gray.800` : `white`}
              fontSize='lg'
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
                bg: colorMode === `light` ? transparentize(`lex.500`, 0.46) : transparentize(`lex.500`, 0.36),
                zIndex: -1
              }}
              _hover={{
                _after: {
                  width: `100%`
                }
              }}>
              {element.name}
            </ChakraLink>
          );
        })}
        <ChakraLink
          onClick={() => {
            signOut();
            navigate('/sign-in-sign-up');
          }}
          display={`${!isSignIn ? 'none' : ''}`}
          color={colorMode === 'light' ? `gray.800` : `white`}
          fontSize='lg'
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
            bg: colorMode === `light` ? transparentize(`lex.500`, 0.46) : transparentize(`lex.500`, 0.36),
            zIndex: -1
          }}
          _hover={{
            _after: {
              width: `100%`
            }
          }}>
          Sign Out
        </ChakraLink>
        <HStack spacing={2}>
          <ToggleTheme />
        </HStack>
      </HStack>
    </>
  );
};

export default DesktopNav;
