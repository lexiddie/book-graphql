import React, { ReactElement, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate } from 'react-router-dom';

import Home from './pages/home/home.component';
import Book from './pages/book/book.component';
import Author from './pages/author/author.component';
import SignInSignUp from './pages/sign-in-sign-up/sign-in-sign-up.component';
import { selectIsSignIn } from './redux/user/user.selectors';

interface AppProp {
  isSignIn: boolean;
}

const App = (props: AppProp): ReactElement => {
  const { isSignIn } = props;
  const navigate = useNavigate();

  const checkSignIn = () => {
    if (!isSignIn) {
      navigate('/sign-in-sign-up');
    }
  };

  useEffect(() => {
    checkSignIn();
  }, [isSignIn]);

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/books' element={<Book />} />
        <Route path='/authors' element={<Author />} />
        <Route path='/sign-in-sign-up' element={<SignInSignUp />} />
        <Route path='*' element={<Navigate to={`${isSignIn ? '/' : '/sign-in-sign-up'}`} />} />
      </Routes>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  isSignIn: selectIsSignIn
});

export default connect(mapStateToProps)(App);
