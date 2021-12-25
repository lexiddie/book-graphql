import React from 'react';
import { Stack, Text, useColorModeValue, Box, SimpleGrid } from '@chakra-ui/react';
import { createStructuredSelector } from 'reselect';

import { selectIsSignIn } from '../../redux/user/user.selectors';
import { connect } from 'react-redux';

const Footer = (props): JSX.Element => {
  const { isSignIn } = props;
  return (
    <Box display={`${!isSignIn ? 'none' : ''}`} bg={useColorModeValue(`gray.50`, `gray.900`)} color={useColorModeValue(`gray.700`, `gray.200`)}>
      <SimpleGrid columns={{ base: 1, md: 2 }} gridTemplate={{ base: `1fr`, md: `1fr 1fr` }} mx='auto' maxW='6xl' py={4} px={5} alignItems='center'>
        <Stack direction='row' spacing={5} ml={{ base: `auto`, md: 5 }} mb={{ base: 5, md: 0 }} mr='auto'></Stack>
        <Text display='flex' alignSelf='center' ml='auto' mr={{ base: `auto`, md: 5 }}>
          {`© ${new Date().getFullYear()} Book GraphQL. All Right Reserved`}
        </Text>
      </SimpleGrid>
    </Box>
  );
};

const mapStateToProps = createStructuredSelector({
  isSignIn: selectIsSignIn
});

export default connect(mapStateToProps)(Footer);
