import React, { useState } from 'react';
import { Image, Flex, SimpleGrid, Skeleton, Text } from '@chakra-ui/react';
import LineHeading from '../line-heading/line-heading.component';

import data from '@/data/about';

const About = (): JSX.Element => {
  const [imageLoad, setImageLoad] = useState(false);
  return (
    <>
      <Flex direction='column' alignItems='flex-end' justifyContent='flex-start' width='full' height='full' mx='auto' mb={10}>
        <LineHeading textTransform='uppercase' fontSize='2xl' fontWeight='semibold' mr='auto' ml={{ base: 5, md: 0 }} textAlign='start'>
          About
        </LineHeading>
        <SimpleGrid mt={{ base: 5, md: 10 }} columns={{ base: 1, md: 2 }} gridTemplate={{ base: `1fr`, md: `1fr 1fr` }} alignItems='flex-start' justifyContent='center'>
          <Flex alignSelf='center' direction='column' my={{ base: 10, md: 0 }} width='full'>
            <Text maxW='100%' whiteSpace='pre-wrap' textAlign='left' pr={5} pl={{ base: 5, md: 0 }} fontSize='lg' fontWeight='semibold'>
              {data.introduction}
            </Text>
          </Flex>
          <Skeleton isLoaded={imageLoad} boxSize='100%'>
            <Image src='/assets/lex/profile-2.jpg' alt='second profile' objectFit='cover' onLoad={() => setImageLoad(true)} flexGrow={3} boxSize='100%' />
          </Skeleton>
        </SimpleGrid>
      </Flex>
    </>
  );
};

export default About;
