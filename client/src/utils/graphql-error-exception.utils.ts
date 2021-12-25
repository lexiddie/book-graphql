import { ApolloError } from '@apollo/client';
import { ToastId, UseToastOptions } from '@chakra-ui/react';

export const graphqlErrorException = (error: ApolloError | undefined, toast: (options?: UseToastOptions | undefined) => ToastId | undefined) => {
  if (error !== undefined) {
    const errorException = error?.graphQLErrors.map(({ message }) => message)[0];
    toast({
      title: errorException,
      status: 'error',
      duration: 3000,
      isClosable: false
    });
  }
};
