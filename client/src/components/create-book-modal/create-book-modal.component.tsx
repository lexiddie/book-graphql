import React, { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react';
import {
  Button,
  Modal,
  FormControl,
  FormLabel,
  Input,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  FormErrorMessage,
  Select
} from '@chakra-ui/react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { selectUserId } from '../../redux/user/user.selectors';
import { BookType } from '../../pages/book/book.component';
import { graphqlErrorException } from '../../utils/graphql-error-exception.utils';

export const CREATE_BOOK = gql`
  mutation CreateBook($input: CreateBookInput!) {
    createBook(input: $input) {
      _id
      title
      isbn
      rate
      publisher
      author {
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($input: UpdateBookInput!) {
    updateBook(input: $input) {
      _id
      title
      isbn
      rate
      publisher
      author {
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_AUTHORS = gql`
  {
    authors {
      _id
      name
    }
  }
`;

interface AuthorType {
  _id: string;
  name: string;
}

interface CreateBookModalProps {
  userId: string;
  appendBook: (record: BookType) => void;
  book: BookType | undefined;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  isUpdateBook: boolean;
  setIsUpdateBook: Dispatch<SetStateAction<boolean>>;
}

const CreateBookModel = (props: CreateBookModalProps): ReactElement => {
  const { userId, appendBook, book, showModal, setShowModal, isUpdateBook, setIsUpdateBook } = props;
  const [authors, setAuthors] = useState<AuthorType[]>([]);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  const toast = useToast();

  const onClose = () => {
    reset();
    setShowModal(false);
    setIsUpdateBook(false);
  };

  const [createBook, { error: createError, data: createData, reset: createReset }] = useMutation(CREATE_BOOK, {
    onCompleted: () => {
      createReset();
    },
    onError: () => null
  });

  const [updateBook, { error: updateError, data: updateData, reset: updateReset }] = useMutation(UPDATE_BOOK, {
    onCompleted: () => {
      updateReset();
    },
    onError: () => null
  });

  const { data: getAuthors } = useQuery(GET_AUTHORS, { onError: () => null, fetchPolicy: 'no-cache' });

  const onRecord = async (record: any) => {
    if (!isUpdateBook) {
      await createBook({
        variables: {
          input: {
            ...record,
            rate: Number(record.rate),
            createdBy: userId
          }
        }
      });
    } else {
      await updateBook({
        variables: {
          input: {
            ...record,
            _id: book?._id,
            rate: Number(record.rate),
            createdBy: userId
          }
        }
      });
    }
  };

  useEffect(() => {
    console.log(`Create Book Modal`);
    graphqlErrorException(createError, toast);
    graphqlErrorException(updateError, toast);

    if (createData !== undefined) {
      const { createBook } = createData;
      appendBook(createBook);
      toast({
        title: `${createBook.title} has been created successful`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      onClose();
    }

    if (updateData !== undefined) {
      const { updateBook } = updateData;
      appendBook(updateBook);
      toast({
        title: `${updateBook.title} has been updated successful`,
        status: 'success',
        duration: 3000,
        isClosable: false
      });
      onClose();
    }
    if (getAuthors !== undefined) {
      const { authors } = getAuthors;
      setAuthors(authors);
    }
  }, [book, authors, createError, updateError, createData, updateData]);

  return (
    <>
      <Button mr={{ base: 0, md: 'auto' }} width={{ base: 'full', md: '200px' }} colorScheme='teal' onClick={() => setShowModal(true)}>
        Create Book
      </Button>

      <Modal isCentered={true} isOpen={showModal} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onRecord)}>
            <ModalHeader>{!isUpdateBook ? 'Create a book' : 'Update a book'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isInvalid={errors.title}>
                <FormLabel>Title</FormLabel>
                <Input
                  autoFocus={true}
                  type='text'
                  placeholder='Title'
                  defaultValue={`${isUpdateBook ? book?.title : ''}`}
                  {...register('title', {
                    required: 'Title must be provided.🙄',
                    minLength: { value: 3, message: 'Minimum length should be 3' }
                  })}
                />
                <FormErrorMessage width='full'>{errors.title && errors.title.message}</FormErrorMessage>
              </FormControl>

              <FormControl mt={4} isInvalid={errors.isbn}>
                <FormLabel>ISBN</FormLabel>
                <Input
                  type='text'
                  placeholder='ISBN'
                  defaultValue={`${isUpdateBook ? book?.isbn : ''}`}
                  {...register('isbn', {
                    required: 'ISBN must be provided.🙄',
                    minLength: { value: 5, message: 'Minimum length should be 5' }
                  })}
                />
                <FormErrorMessage width='full'>{errors.isbn && errors.isbn.message}</FormErrorMessage>
              </FormControl>

              <FormControl mt={4} isInvalid={errors.rate}>
                <FormLabel>Rate</FormLabel>
                <Input
                  type='number'
                  step='0.01'
                  placeholder='Rate'
                  defaultValue={`${isUpdateBook ? book?.rate : ''}`}
                  {...register('rate', {
                    required: 'Rate must be provided.🙄',
                    minLength: { value: 1, message: 'Minimum length should be 1' },
                    maxLength: { value: 10, message: 'Maximum length should be 10' }
                  })}
                />
                <FormErrorMessage width='full'>{errors.rate && errors.rate.message}</FormErrorMessage>
              </FormControl>

              <FormControl mt={4} isInvalid={errors.publisher}>
                <FormLabel>Publisher</FormLabel>
                <Input
                  type='text'
                  placeholder='Publisher'
                  defaultValue={`${isUpdateBook ? book?.publisher : ''}`}
                  {...register('publisher', {
                    required: 'Publisher must be provided.🙄',
                    minLength: { value: 3, message: 'Minimum length should be 3' }
                  })}
                />
                <FormErrorMessage width='full'>{errors.publisher && errors.publisher.message}</FormErrorMessage>
              </FormControl>

              <FormControl mt={4} isInvalid={errors.author}>
                <FormLabel>Author</FormLabel>
                <Select
                  placeholder='Select author'
                  variant='outline'
                  defaultValue={`${isUpdateBook ? book?.author._id : ''}`}
                  {...register('author', {
                    required: 'Author must be selected.🙄'
                  })}>
                  {authors.map((element, index) => (
                    <option key={`option-author-${index}`} value={element._id}>
                      {element.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage width='full'>{errors.author && errors.author.message}</FormErrorMessage>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='teal' mr={3} type='submit' isLoading={isSubmitting}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  userId: selectUserId
});

export default connect(mapStateToProps)(CreateBookModel);
