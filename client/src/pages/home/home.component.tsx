import React, { ReactElement, useEffect, useState } from 'react';
import {
  Text,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  Flex,
  SimpleGrid,
  useColorModeValue,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiChevronDown } from 'react-icons/bi';
import { useQuery } from '@apollo/client';

import BookCard from '../../components/book-card/book-card.component';
import { GET_BOOKS, BookType } from '../book/book.component';
import { graphqlErrorException } from '../../utils/graphql-error-exception.utils';

const Home = (): ReactElement => {
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('recent');
  const [books, setBooks] = useState<BookType[]>([]);

  const toast = useToast();

  const { loading, error, data } = useQuery(GET_BOOKS, { onError: () => null });

  const filteredBooks = books.filter((element) => element.title.toLowerCase().includes(filter)).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  if (sort === 'old') {
    filteredBooks.reverse();
  }

  useEffect(() => {
    graphqlErrorException(error, toast);

    if (data !== undefined && data != null) {
      console.log(`Checking Data:`, data);
      const { books } = data;
      setBooks(books);
    }
  }, [error, data]);

  return (
    <>
      <Box minH='100vh' height='full' maxW='6xl' mx='auto' py={28} px={3}>
        <Flex direction='column' justifyContent={{ base: 'center', md: 'flex-start' }} height='full' width='full' p={{ base: '0', sm: '17' }}>
          <Flex direction='column' alignItems='center' width='full' height='full' mx='auto'>
            <Flex width='full' direction={{ base: 'column', md: 'row' }} my={7} px={{ base: 5, sm: 10 }} justifyContent='space-between'>
              <InputGroup maxWidth={{ base: 'full', md: '200px' }} mb={{ base: 5, md: 0 }}>
                <InputLeftElement pointerEvents='none'>
                  <AiOutlineSearch color='gray.300' />
                </InputLeftElement>
                <Input
                  variant='filled'
                  type='text'
                  placeholder='Search'
                  _placeholder={{
                    color: useColorModeValue('gray.800', 'whiteAlpha.800')
                  }}
                  onChange={(e) => setFilter(e.target.value.toLowerCase())}
                />
              </InputGroup>

              <Menu>
                <MenuButton as={Button} rightIcon={<BiChevronDown />}>
                  Sort by...
                </MenuButton>
                <MenuList zIndex={998}>
                  <MenuItem zIndex={999} isDisabled={sort === 'recent'} onClick={() => setSort('recent')}>
                    Recent
                  </MenuItem>
                  <MenuItem zIndex={999} isDisabled={sort === 'old'} onClick={() => setSort('old')}>
                    Oldest
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>

            {loading ? <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='teal.500' size='xl' /> : null}

            {filteredBooks.length === 0 && (
              <Text fontSize='2xl' textAlign='center' mt={10}>
                No Results😪🥶
              </Text>
            )}
            <SimpleGrid
              mt={{ base: 5, md: 10 }}
              columns={{ base: 1, md: 2, lg: 3 }}
              gridTemplate={{ base: `1fr`, md: `1fr 1fr`, lg: `1fr 1fr 1fr` }}
              alignItems='flex-start'
              justifyContent='center'
              spacing={5}>
              {filteredBooks.map((element, index) => {
                return <BookCard key={`book-card-${index}`} title={element.title} isbn={element.isbn} author={element.author.name} />;
              })}
            </SimpleGrid>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Home;
