import React from 'react';
import { Box, Button, IconButton, useColorModeValue, useDisclosure, VStack } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { AiOutlineMenu } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import ToggleTheme from './toggle-theme.component';

const MobileNav = ({ links, isSignIn, signOut }: { links: any; isSignIn: boolean; signOut: any }): JSX.Element => {
  const mobileNav = useDisclosure();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/sign-in-sign-up');
    mobileNav.isOpen ? mobileNav.onClose() : mobileNav.onOpen();
  };

  return (
    <Box display={{ md: `none` }}>
      <ToggleTheme />

      <IconButton
        aria-label='toggle menu'
        icon={mobileNav.isOpen ? <IoClose size='1.5em' style={{ zIndex: 20 }} aria-label='Close menu' /> : <AiOutlineMenu size='1.5em' />}
        variant='ghost'
        onClick={mobileNav.isOpen ? mobileNav.onClose : mobileNav.onOpen}
      />

      <VStack
        pos='absolute'
        top={0}
        left={0}
        width='100vw'
        height='100vh'
        css={{
          backdropFilter: `saturate(180%) blur(5px)`,
          backgroundColor: useColorModeValue(`rgba(255, 255, 255, 0.9)`, `rgba(26, 32, 44, 0.9)`)
        }}
        display={mobileNav.isOpen ? `flex` : `none`}
        flexDirection='column'
        spacing={3}
        rounded='sm'
        shadow='sm'>
        <Button to='/' as={NavLink} w='full' mt={16} variant='ghost' onClick={mobileNav.isOpen ? mobileNav.onClose : mobileNav.onOpen}>
          Home
        </Button>

        {links.map((element: any, index: number) => {
          return (
            <Button
              to={element.link}
              key={`${index.toString()}-link`}
              as={NavLink}
              w='full'
              mx={2}
              variant='ghost'
              onClick={mobileNav.isOpen ? mobileNav.onClose : mobileNav.onOpen}>
              {element.name}
            </Button>
          );
        })}

        <Button display={`${!isSignIn ? 'none' : ''}`} onClick={handleSignOut} w='full' mx={2} variant='ghost'>
          Sign Out
        </Button>
      </VStack>
    </Box>
  );
};

export default MobileNav;
