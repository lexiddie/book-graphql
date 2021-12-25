import React from 'react';
import { Square, Flex, Text, Stack } from '@chakra-ui/react';

interface BookCardProps {
  title: string;
  author: string;
  isbn: string;
}

const BookCard = (props: BookCardProps): JSX.Element => {
  const { title, author, isbn } = props;
  return (
    <>
      <Square color='white' position='relative' size='xs' bgGradient={`linear(to-t, #C61063, #F50057)`}>
        <Flex position='absolute' top={0} px={3} alignItems='flex-start' justifyContent='space-between' width='full' height='15%'>
          <Text width='auto' height='full' fontSize='lg' fontWeight='semibold' mt={3} mr='auto'>
            Book
          </Text>
          <Stack direction='row' spacing={5} ml='auto'>
            <Text width='auto' height='full' fontSize='lg' fontWeight='semibold' mt={3} mr='auto'>
              {`${author}`}
            </Text>
          </Stack>
        </Flex>
        <Flex position='absolute' px={5} alignSelf='center' direction='column' width='full' alignItems='center' justifyContent='center'>
          <Text width='full' textAlign='start' fontSize='2xl' fontWeight='extrabold' px={5}>
            {title}
          </Text>
        </Flex>
        <Flex position='absolute' bottom={0} alignItems='flex-end' justifyContent='flex-end' width='full' height='15%'>
          <Text fontSize='lg' fontWeight='bold' textAlign='end' mr={3} mb={3}>
            {`ISBN: ${isbn}`}
          </Text>
        </Flex>
      </Square>
    </>
  );
};

export default BookCard;
