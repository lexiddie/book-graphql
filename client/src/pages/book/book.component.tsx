import React, { ReactElement, useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { MdEdit, MdDelete } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiChevronDown } from 'react-icons/bi';
import { gql, useQuery } from '@apollo/client';
import dayjs from 'dayjs';

import CreateBookModal from '../../components/create-book-modal/create-book-modal.component';
import { graphqlErrorException } from '../../utils/graphql-error-exception.utils';
import DeleteBookAlert from 'src/components/delete-book-alert/delete-book-alert.component';

export const GET_BOOKS = gql`
  {
    books {
      _id
      title
      isbn
      rate
      publisher
      author {
        _id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export interface BookType {
  _id: string;
  title: string;
  isbn: string;
  rate: number;
  publisher: string;
  author: {
    _id;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

const Book = (): ReactElement => {
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('recent');
  const [books, setBooks] = useState<BookType[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isUpdateBook, setIsUpdateBook] = useState<boolean>(false);
  const [book, setBook] = useState<BookType | undefined>();
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [bookId, setBookId] = useState<string>('');

  const toast = useToast();

  const { loading, error, data } = useQuery(GET_BOOKS, { onError: () => null });

  const appendBook = useCallback(
    (record: BookType) => {
      setBook(undefined);
      const check = books.find((element) => element._id === record._id);
      if (check) {
        const records = [...books];
        const index = records.findIndex((element) => element._id === bookId);
        records[index] = record;
        setBooks([...records]);
      } else {
        setBooks([...books, record]);
      }
    },
    [books]
  );

  const removeBook = useCallback(
    (bookId: string) => {
      const records = books.filter((element) => element._id !== bookId);
      setBooks([...records]);
    },
    [books]
  );

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
      <Box minH='100vh' height='full' width='full' maxW='6xl' mx='auto' py='28' px='3'>
        <Flex direction='column' justifyContent={{ base: 'center', md: 'flex-start' }} height='full' width='full' p={{ base: 0, sm: 16 }}>
          <Flex direction='column' alignItems='center' width='full' height='full' mx='auto'>
            <CreateBookModal
              appendBook={appendBook}
              book={book}
              showModal={showModal}
              setShowModal={setShowModal}
              isUpdateBook={isUpdateBook}
              setIsUpdateBook={setIsUpdateBook}
            />
            <DeleteBookAlert bookId={bookId} removeBook={removeBook} showDelete={showDelete} setShowDelete={setShowDelete} />
            <Flex width='full' direction={{ base: 'column', md: 'row' }} my={7} px={{ base: 5, sm: 0 }} justifyContent='space-between'>
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

            <Box width='full' display={`${loading ? 'none' : 'flex'}`} alignItems='center' justifyContent='center' mt='4rem' my={7}>
              <Table display={{ base: 'block', md: '' }} overflowX='auto' whiteSpace='nowrap' mx='auto' variant='simple'>
                <Thead>
                  <Tr>
                    <Th>Title</Th>
                    <Th>ISBN</Th>
                    <Th>Rate</Th>
                    <Th>Publisher</Th>
                    <Th>Author</Th>
                    <Th>Created At</Th>
                    <Th>Updated At</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredBooks.length === 0 && (
                    <Tr>
                      <Td textAlign={`center`} colSpan={8}>
                        No Result ☹️
                      </Td>
                    </Tr>
                  )}
                  {filteredBooks.map((element, index) => {
                    return (
                      <Tr key={`table-data-${index}`}>
                        <Td whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden' maxW='350px'>
                          {element.title}
                        </Td>
                        <Td>{element.isbn}</Td>
                        <Td>{element.rate}</Td>
                        <Td>{element.publisher}</Td>
                        <Td>{element.author.name}</Td>
                        <Td>{dayjs(element.createdAt).format('MMM D, YYYY HH:mm')}</Td>
                        <Td>{dayjs(element.updatedAt).format('MMM D, YYYY HH:mm')}</Td>
                        <Td>
                          <HStack>
                            <IconButton
                              onClick={() => {
                                setBook(element);
                                setShowModal(true);
                                setIsUpdateBook(true);
                              }}
                              size='md'
                              fontSize='lg'
                              aria-label={`Edit`}
                              title={`Edit`}
                              variant='ghost'
                              colorScheme='dark'
                              icon={<MdEdit size={20} />}></IconButton>
                            <IconButton
                              onClick={() => {
                                setBookId(element._id);
                                setShowDelete(true);
                              }}
                              size='md'
                              fontSize='lg'
                              aria-label={`Delete`}
                              title={`Delete`}
                              variant='ghost'
                              colorScheme='dark'
                              icon={<MdDelete size={20} />}></IconButton>
                          </HStack>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Book;
