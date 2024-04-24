import React from 'react';
import { Container } from '@material-ui/core';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PostDetails from './components/PostDetails/PostDetails';
import NavBar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import { Auth } from './components/Auth/Auth';
import EditProfile from './components/EditProfile/EditProfile';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import About from './components/About/About';
import TermsOfService from './components/TermsOfService/TermsOfService';
import SortedPosts from './components/SortedPosts/SortedPosts';
import Profile from './components/Profile/Profile';
import SearchBar from './components/SearchBar/SearchBar';
import Newpost from './components/Newpost/Newpost';
import SearchTagBar from './components/SearchBar/SearchTagBar/SearchTagBar';
import Collection from './components/Collection/Collection';
import SearchIngedientsBar from './components/SearchBar/SearchIngredientsBar/SearchIngredientsBar';

const App = () => {
  //const user = JSON.parse(localStorage.getItem('profile'));

  return (
    <BrowserRouter>
      <Container maxidth='xl'>
        <NavBar />
        <Routes>
          <Route path='/' element={<Navigate replace to='/posts' />} />
          <Route path='/posts' element={<Home />} />
          <Route path='/posts/search' element={<Home />} />
          <Route path='/posts/:id' element={<PostDetails />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/about' element={<About />} />
          <Route path='/profile/:id' element={<Profile />} />
          <Route path='/edit-profile' element={<EditProfile />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/terms-of-service' element={<TermsOfService />} />
          <Route path='/newPost' element={<Newpost />} />
          <Route path='/editPost/:id' element={<Newpost />} />
          <Route
            path='/password-reset/:id/:token'
            element={<ResetPassword />}
          />
          <Route path='/login' element={<Auth />}/>
          <Route path='/sorted' element={<SortedPosts />} />
          <Route path='/Search' element={<SearchBar />} />
          <Route path='/SearchTags' element={<SearchTagBar />} />
          <Route path='/SearchIngredients' element={<SearchIngedientsBar />} />
          <Route
            path='profile/:userID/collection/:collectionID'
            element={<Collection />}
          />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;
