import React, { useEffect, ReactElement, useRef, RefObject, Dispatch, SetStateAction } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useToast
} from '@chakra-ui/react';
import { gql, useMutation } from '@apollo/client';

import { graphqlErrorException } from '../../utils/graphql-error-exception.utils';

export const DELETE_AUTHOR = gql`
  mutation DeleteAuthor($input: DeleteAuthorInput!) {
    deleteAuthor(input: $input) {
      _id
      name
    }
  }
`;

interface DeleteAuthorAlertProps {
  authorId: string;
  removeAuthor: (authorId: string) => void;
  showDelete: boolean;
  setShowDelete: Dispatch<SetStateAction<boolean>>;
}

const DeleteAuthorAlert = (props: DeleteAuthorAlertProps): ReactElement => {
  const { authorId, removeAuthor, showDelete, setShowDelete } = props;
  const toast = useToast();
  const onClose = () => setShowDelete(false);
  const cancelRef = useRef() as RefObject<HTMLInputElement> | undefined;

  const [deleteAuthor, { error, data, reset }] = useMutation(DELETE_AUTHOR, {
    onCompleted: () => {
      reset();
    },
    onError: () => null
  });

  const startDeleting = async () => {
    await deleteAuthor({
      variables: {
        input: {
          _id: authorId
        }
      }
    });
  };

  useEffect(() => {
    console.log(`Delete Author Modal`);
    graphqlErrorException(error, toast);

    if (data !== undefined) {
      const { deleteAuthor } = data;
      if (deleteAuthor._id === authorId) {
        removeAuthor(authorId);
        toast({
          title: `${deleteAuthor.name} has been deleted.`,
          status: 'success',
          duration: 3000,
          isClosable: false
        });
      }
    }
    return () => {};
  }, [error, data]);

  return (
    <>
      <AlertDialog isCentered={true} isOpen={showDelete} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Author
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button autoFocus={true} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme='red'
                onClick={() => {
                  startDeleting();
                  onClose();
                }}
                ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DeleteAuthorAlert;
