import React, { ReactElement, useState, Dispatch, SetStateAction, useEffect } from 'react';
import {
  Box,
  Text,
  FormControl,
  InputGroup,
  Input,
  InputRightElement,
  Stack,
  Button,
  useColorModeValue,
  Heading,
  FormErrorMessage,
  ButtonGroup,
  useToast
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useMutation, gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation RegisterUser($input: CreateUserInput!) {
    registerUser(input: $input) {
      _id
      name
      email
    }
  }
`;

interface SignUpType {
  name: string;
  email: string;
  password: string;
}

interface SignUpProps {
  dispatchTab: Dispatch<SetStateAction<number>>;
}

const SignUp = (props: SignUpProps): ReactElement => {
  const { dispatchTab } = props;
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm();

  const [show, setShow] = useState(false);

  const handleShow = () => setShow(!show);
  const formBackground = useColorModeValue('gray.100', 'gray.700');
  const formColor = useColorModeValue('gray.900', 'gray.500');

  const [registerUser, { error, data }] = useMutation(REGISTER_USER, { onError: () => null });

  const toast = useToast();

  useEffect(() => {
    const errorException = error?.graphQLErrors.map(({ message }) => message)[0];
    if (errorException !== undefined) {
      toast({
        title: errorException,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
    if (data !== undefined) {
      console.log(`Check Data:`, data);
    }
    return () => {};
  }, [error, data]);

  const onRecord = async (record: SignUpType) => {
    try {
      console.log(`Checking Value:`, JSON.stringify(record));
      await registerUser({
        variables: {
          input: { ...record }
        }
      });
    } catch (err) {
      console.log(`Error: `, err);
    }
  };

  return (
    <>
      <Box width={{ base: 'full', sm: 'sm', md: 'md' }} mx={{ base: 10, lg: 35 }} mt={{ base: 15, md: 0 }}>
        <form onSubmit={handleSubmit(onRecord)}>
          <Stack spacing={3}>
            <Heading mb={6}> Sign Up 😬 ✌🏿</Heading>
            <FormControl isInvalid={errors.name}>
              <InputGroup background={formBackground}>
                <Input
                  focusBorderColor='teal.500'
                  borderColor='gray.300'
                  type='name'
                  placeholder='Name'
                  variant='outline'
                  defaultValue={`benz`}
                  {...register('name', {
                    required: 'This is required',
                    minLength: { value: 4, message: 'Minimum length should be 4' }
                  })}
                />
              </InputGroup>
              <FormErrorMessage width='full'>{errors.name && errors.name.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.email}>
              <InputGroup background={formBackground}>
                <Input
                  focusBorderColor='teal.500'
                  borderColor='gray.300'
                  type='email'
                  placeholder='Email'
                  variant='outline'
                  defaultValue={`benz@gmail.com`}
                  {...register('email', {
                    required: 'It must be an email.',
                    minLength: { value: 4, message: 'Minimum length should be 4' }
                  })}
                />
              </InputGroup>
              <FormErrorMessage width='full'>{errors.email && errors.email.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.password}>
              <InputGroup mb={6} background={formBackground}>
                <Input
                  focusBorderColor='teal.500'
                  borderColor='gray.300'
                  pr='4.5rem'
                  type={show ? 'text' : 'password'}
                  placeholder='Password'
                  variant='outline'
                  defaultValue={`benz#132`}
                  {...register('password', {
                    required: 'Password must be filled',
                    minLength: { value: 4, message: 'Minimum length should be 4' }
                  })}
                />
                <InputRightElement width='4.5rem'>
                  <Button color={formColor} h='1.75rem' size='sm' onClick={handleShow}>
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage width='full'>{errors.password && errors.password.message}</FormErrorMessage>
            </FormControl>
            <Button type='submit' colorScheme='teal' isLoading={isSubmitting}>
              Sign Up
            </Button>
            <ButtonGroup justifyContent='flex-start' size='md' isAttached variant='outline'>
              <Text fontSize='md' textAlign='center' alignItems='center' alignContent='center' lineHeight='2.5rem'>
                Already have an account?
              </Text>
              <Button
                onClick={() => dispatchTab(0)}
                variant='filled'
                color='blue.500'
                colorScheme='transparent'
                _focus={{
                  outline: `1px solid transparent`
                }}
                _after={{
                  outline: `1px solid transparent`
                }}>
                Sign In
              </Button>
            </ButtonGroup>
          </Stack>
        </form>
      </Box>
    </>
  );
};

export default SignUp;
