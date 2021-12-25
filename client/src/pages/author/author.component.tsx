import React, { ReactElement, useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Flex,
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
  useToast,
  HStack,
  IconButton
} from '@chakra-ui/react';
import { MdEdit, MdDelete } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiChevronDown } from 'react-icons/bi';
import { gql, useQuery } from '@apollo/client';
import dayjs from 'dayjs';

import CreateAuthorModal from '../../components/create-author-modal/create-author-modal.component';
import DeleteAuthorAlert from '../../components/delete-author-alert/delete-author-alert.component';

import { graphqlErrorException } from '../../utils/graphql-error-exception.utils';

export const GET_AUTHORS = gql`
  {
    authors {
      _id
      name
      createdBy {
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export interface AuthorType {
  _id: string;
  name: string;
  createdBy: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

const Author = (): ReactElement => {
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('recent');
  const [authors, setAuthors] = useState<AuthorType[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isUpdateAuthor, setIsUpdateAuthor] = useState<boolean>(false);
  const [author, setAuthor] = useState<AuthorType | undefined>();
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [authorId, setAuthorId] = useState<string>('');

  const toast = useToast();

  const { loading, error } = useQuery(GET_AUTHORS, {
    onCompleted: (data) => {
      if (data !== undefined) {
        console.log(`Fetching authors...`);
        const { authors } = data;
        setAuthors(authors);
      }
    },
    onError: () => null,
    fetchPolicy: 'no-cache'
  });

  const appendAuthor = useCallback(
    (record: AuthorType) => {
      setAuthor(undefined);
      const check = authors.find((element) => element._id === record._id);
      if (check) {
        // const records = authors.filter((element) => element._id !== author._id);
        // records.push(author);
        const records = [...authors];
        const index = records.findIndex((element) => element._id === record._id);
        records[index] = record;
        setAuthors([...records]);
      } else {
        setAuthors([...authors, record]);
      }
    },
    [authors]
  );

  const removeAuthor = useCallback(
    (authorId: string) => {
      const records = authors.filter((element) => element._id !== authorId);
      setAuthors([...records]);
    },
    [authors]
  );

  const filteredAuthors = authors
    .filter((element) => element.name.toLowerCase().includes(filter))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  if (sort === 'old') {
    filteredAuthors.reverse();
  }

  useEffect(() => {
    graphqlErrorException(error, toast);
    console.log(`Checking Data:`, authors);
  }, [authors]);

  return (
    <>
      <Box minH='100vh' height='full' width='full' maxW='6xl' mx='auto' py='28' px='3'>
        <Flex direction='column' justifyContent={{ base: 'center', md: 'flex-start' }} height='full' width='full' p={{ base: 0, sm: 16 }}>
          <Flex direction='column' alignItems='center' width='full' height='full' mx='auto'>
            <CreateAuthorModal
              appendAuthor={appendAuthor}
              author={author}
              showModal={showModal}
              setShowModal={setShowModal}
              isUpdateAuthor={isUpdateAuthor}
              setIsUpdateAuthor={setIsUpdateAuthor}
            />
            <DeleteAuthorAlert authorId={authorId} removeAuthor={removeAuthor} showDelete={showDelete} setShowDelete={setShowDelete} />
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
              <Table display={{ base: 'block', md: 'table' }} overflowX='auto' whiteSpace='nowrap' mx='auto' variant='simple'>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Created By</Th>
                    <Th>Created At</Th>
                    <Th>Updated At</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredAuthors.length === 0 && (
                    <Tr isTruncated>
                      <Td textAlign={`center`} colSpan={5}>
                        No Result ☹️
                      </Td>
                    </Tr>
                  )}
                  {filteredAuthors.map((element, index) => {
                    return (
                      <Tr isTruncated key={`table-data-${index}`}>
                        <Td>{element.name}</Td>
                        <Td>{element.createdBy.name}</Td>
                        <Td>{dayjs(element.createdAt).format('MMM D, YYYY HH:mm')}</Td>
                        <Td>{dayjs(element.updatedAt).format('MMM D, YYYY HH:mm')}</Td>
                        <Td>
                          <HStack>
                            <IconButton
                              onClick={() => {
                                setAuthor(element);
                                setShowModal(true);
                                setIsUpdateAuthor(true);
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
                                setAuthorId(element._id);
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

export default Author;
