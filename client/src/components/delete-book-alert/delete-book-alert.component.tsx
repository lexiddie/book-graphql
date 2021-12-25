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

export const DELETE_BOOK = gql`
  mutation DeleteBook($input: DeleteBookInput!) {
    deleteBook(input: $input) {
      _id
      title
    }
  }
`;

interface DeleteBookAlertProps {
  bookId: string;
  removeBook: (bookId: string) => void;
  showDelete: boolean;
  setShowDelete: Dispatch<SetStateAction<boolean>>;
}

const DeleteBookAlert = (props: DeleteBookAlertProps): ReactElement => {
  const { bookId, removeBook, showDelete, setShowDelete } = props;
  const toast = useToast();
  const onClose = () => setShowDelete(false);
  const cancelRef = useRef() as RefObject<HTMLInputElement> | undefined;

  const [deleteBook, { error, data, reset }] = useMutation(DELETE_BOOK, {
    onCompleted: () => {
      reset();
    },
    onError: () => null
  });

  const startDeleting = async () => {
    await deleteBook({
      variables: {
        input: {
          _id: bookId
        }
      }
    });
  };

  useEffect(() => {
    console.log(`Delete Book Modal`);
    graphqlErrorException(error, toast);

    if (data !== undefined) {
      const { deleteBook } = data;
      if (deleteBook._id === bookId) {
        removeBook(bookId);
        toast({
          title: `${deleteBook.title} has been deleted.`,
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
              Delete Book
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

export default DeleteBookAlert;
