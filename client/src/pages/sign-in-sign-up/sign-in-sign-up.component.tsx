import React, { ReactElement, useState } from 'react';
import { Box, Flex, SimpleGrid, Image, Tabs, TabPanel, TabPanels } from '@chakra-ui/react';

import Background from '../../assets/background/book-background.jpg';
import SignIn from '../../components/sign-in/sign-in.component';
import SignUp from '../../components/sign-up/sign-up.component';

const SignInSignUp = (): ReactElement => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <Box minH='100vh' width='full' maxW='full' mx='auto'>
        <SimpleGrid
          minH='100vh'
          maxW='full'
          columns={{ base: 1, md: 2 }}
          gridTemplate={{ base: `1fr`, md: `1fr 1fr` }}
          alignItems='center'
          justifyContent='center'
        >
          <Box bg='red' order={{ base: 2, md: 0 }} height={{ base: 'full', md: 'full' }} width='full'>
            <Image src={Background} alt='Background Sign Up & Log In' objectFit='cover' height='full' width='full' boxSize='100%' />
          </Box>
          <Box order={{ base: 1, md: 0 }} minH='full' height='100%' width='full'>
            <Flex direction='column' justifyContent={{ base: 'center', md: 'flex-start' }} height='full' width='full' py={{ base: 0, md: 16 }}>
              <Flex alignItems='center' justifyContent={{ base: 'center', md: 'flex-start' }} width='full' height='full' mr='auto'>
                <Tabs index={tabIndex}>
                  <TabPanels>
                    <TabPanel>
                      <SignIn dispatchTab={setTabIndex} />
                    </TabPanel>
                    <TabPanel>
                      <SignUp dispatchTab={setTabIndex} />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Flex>
            </Flex>
          </Box>
        </SimpleGrid>
      </Box>
    </>
  );
};

export default SignInSignUp;
