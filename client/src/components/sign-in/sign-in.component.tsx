import React, { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react';
import { connect } from 'react-redux';
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
import { useLazyQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { CurrentUser } from '../../redux/user/user.types';
import { setCurrentUser } from '../../redux/user/user.actions';
import { selectIsSignIn } from '../../redux/user/user.selectors';

export const LOGIN = gql`
  query Login($input: LoginInput!) {
    login(input: $input) {
      _id
      name
      email
    }
  }
`;

interface SignInType {
  email: string;
  password: string;
}

interface SignInProps {
  dispatchTab: Dispatch<SetStateAction<number>>;
  isSignIn: boolean;
  setCurrentUser: (currentUser: CurrentUser) => void;
}

const SignIn = (props: SignInProps): ReactElement => {
  const { dispatchTab, setCurrentUser, isSignIn } = props;
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm();

  const [show, setShow] = useState(false);

  const handleShow = () => setShow(!show);
  const formBackground = useColorModeValue('gray.100', 'gray.700');
  const formColor = useColorModeValue('gray.900', 'gray.500');

  const [startLogin, { error, data }] = useLazyQuery(LOGIN, {
    onCompleted({ login }) {
      const record = { ...login, id: login._id };
      delete record._id;
      setCurrentUser(record);
      navigate('/');
    },
    onError: () => null
  });

  const checkSignIn = () => {
    if (isSignIn) {
      navigate('/');
    }
  };

  const toast = useToast();

  useEffect(() => {
    checkSignIn();
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
      const { login } = data;
      console.log(`Check Data:`, login);
    }
  }, [error, data, isSignIn]);

  const onRecord = async (record: SignInType) => {
    try {
      console.log(`Checking Value:`, JSON.stringify(record));
      startLogin({
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
            <Heading mb={6}> Sign In 🥺 ✌🏿</Heading>
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
              Sign In
            </Button>
            <ButtonGroup justifyContent='flex-start' size='md' isAttached variant='outline'>
              <Text fontSize='md' textAlign='center' alignItems='center' alignContent='center' lineHeight='2.5rem'>
                Don’t have an account?
              </Text>
              <Button
                onClick={() => dispatchTab(1)}
                variant='filled'
                color='blue.500'
                colorScheme='transparent'
                _focus={{
                  outline: `1px solid transparent`
                }}
                _after={{
                  outline: `1px solid transparent`
                }}>
                Sign up
              </Button>
            </ButtonGroup>
          </Stack>
        </form>
      </Box>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  isSignIn: selectIsSignIn
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (currentUser: CurrentUser) => dispatch(setCurrentUser(currentUser))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
