import React, { useState, useEffect } from 'react';
import { Grid, AppBar, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import ChipInput from 'material-ui-chip-input';

import useStyles from './styles';
import { getPostsBySearch } from '../../../actions/posts';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const SearchIngedientsBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const query = useQuery();
  const history = useNavigate();
  const [search, setSearch] = useState('');
  const [content, setContent] = useState('');
  const [ingredients, setIngrdients] = useState([]);

  const searchPost = () => {
    if (search.trim() || ingredients || content.trim()) {
      dispatch(
        getPostsBySearch({
          search,
          content,
          ingredients: ingredients.join(','),
        })
      );
      history(
        `/posts/search?searchQuery=${'none'}
        &ingredients=${ingredients.join(',')}`
      );
    } else {
      history('/');
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      //13:enter
      searchPost();
    }
  };

  const handleAdd = (tag) => setIngrdients([...ingredients, tag]);

  const handleDel = (tagToDel) =>
    setIngrdients(ingredients.filter((tag) => tag !== tagToDel));

  return (
    <div>
      <Grid item xs={12} sm={6} md={3}>
        <AppBar
          className={classes.appBarSearch}
          position='static'
          color='inherit'
        >
          <ChipInput
            style={{ margin: '10px 0' }}
            value={ingredients}
            onAdd={handleAdd}
            onDelete={handleDel}
            label='Search Posts by Ingredients'
            variant='outlined'
          />
          <Button
            onClick={searchPost}
            className={classes.searchButton}
            variant='contained'
            color='primary'
          >
            <SearchIcon />
          </Button>
          <div>Press Enter after each search input</div>
        </AppBar>
      </Grid>
    </div>
  );
};

export default SearchIngedientsBar;
