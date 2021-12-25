import React, { ReactElement, SetStateAction, useEffect, Dispatch } from 'react';
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
  FormErrorMessage,
  useToast
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { gql, useMutation } from '@apollo/client';
import { selectUserId } from '../../redux/user/user.selectors';
import { AuthorType } from '../../pages/author/author.component';
import { graphqlErrorException } from '../../utils/graphql-error-exception.utils';

export const CREATE_AUTHOR = gql`
  mutation CreateAuthor($input: CreateAuthorInput!) {
    createAuthor(input: $input) {
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

export const UPDATE_AUTHOR = gql`
  mutation UpdateAuthor($input: UpdateAuthorInput!) {
    updateAuthor(input: $input) {
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

interface CreateAuthorModalProps {
  userId: string;
  appendAuthor: (record: AuthorType) => void;
  author: AuthorType | undefined;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  isUpdateAuthor: boolean;
  setIsUpdateAuthor: Dispatch<SetStateAction<boolean>>;
}

const CreateAuthorModal = (props: CreateAuthorModalProps): ReactElement => {
  const { userId, appendAuthor, author, showModal, setShowModal, isUpdateAuthor, setIsUpdateAuthor } = props;

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
    setIsUpdateAuthor(false);
  };

  const [createAuthor, { error: createError, data: createData, reset: createReset }] = useMutation(CREATE_AUTHOR, {
    onCompleted: () => {
      createReset();
    },
    onError: () => null
  });
  const [updateAuthor, { error: updateError, data: updateData, reset: updateReset }] = useMutation(UPDATE_AUTHOR, {
    onCompleted: () => {
      updateReset();
    },
    onError: () => null
  });

  const onRecord = async (record: any) => {
    if (!isUpdateAuthor) {
      await createAuthor({
        variables: {
          input: {
            ...record,
            createdBy: userId
          }
        }
      });
    } else {
      await updateAuthor({
        variables: {
          input: {
            ...record,
            _id: author?._id,
            createdBy: userId
          }
        }
      });
    }
  };

  useEffect(() => {
    console.log(`Create Author Modal`);
    graphqlErrorException(createError, toast);
    graphqlErrorException(updateError, toast);

    if (createData !== undefined) {
      const { createAuthor } = createData;
      appendAuthor(createAuthor);
      toast({
        title: `${createAuthor.name} has been created successful`,
        status: 'success',
        duration: 3000,
        isClosable: false
      });
      onClose();
    }

    if (updateData !== undefined) {
      const { updateAuthor } = updateData;
      appendAuthor(updateAuthor);
      toast({
        title: `${updateAuthor.name} has been updated successful`,
        status: 'success',
        duration: 3000,
        isClosable: false
      });
      onClose();
    }
  }, [createError, updateError, createData, updateData]);

  return (
    <>
      <Button mr={{ base: 0, md: 'auto' }} width={{ base: 'full', md: '200px' }} colorScheme='teal' onClick={() => setShowModal(true)}>
        Create Author
      </Button>

      <Modal isCentered={true} isOpen={showModal} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onRecord)}>
            <ModalHeader>{!isUpdateAuthor ? 'Create an author' : 'Update an author'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isInvalid={errors.name}>
                <FormLabel>Full Name</FormLabel>
                <Input
                  autoFocus={true}
                  type='name'
                  placeholder='Full Name'
                  defaultValue={`${isUpdateAuthor ? author?.name : ''}`}
                  {...register('name', {
                    required: 'Name must be provided.🙄',
                    minLength: { value: 3, message: 'Minimum length should be 3' }
                  })}
                />
                <FormErrorMessage width='full'>{errors.name && errors.name.message}</FormErrorMessage>
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

export default connect(mapStateToProps)(CreateAuthorModal);
