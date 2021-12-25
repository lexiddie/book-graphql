import React, { ReactElement } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import Nav from '../nav-bar/nav.component';
import Footer from '../footer/footer.component';

interface AppLayoutProps {
  children: ReactElement;
}

const AppLayout = ({ children }: AppLayoutProps): JSX.Element => {
  return (
    <>
      <Nav />
      <Box bg={useColorModeValue(`rgba(255, 255, 255, 0.8)`, `rgba(26, 33, 42, 0.8)`)}>{children}</Box>
      <Footer />
    </>
  );
};

export default AppLayout;
