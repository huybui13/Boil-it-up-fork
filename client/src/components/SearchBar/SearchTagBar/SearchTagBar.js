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
const SearchTagBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const query = useQuery();
  const history = useNavigate();
  const [search, setSearch] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);

  const searchPost = () => {
    if (tags) {
      dispatch(getPostsBySearch({ tags: tags.join(',') }));
      history(
        `/posts/search?searchQuery=${'none'}
        &tags=${tags.join(',')}`
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

  const handleAdd = (tag) => setTags([...tags, tag]);

  const handleDel = (tagToDel) =>
    setTags(tags.filter((tag) => tag !== tagToDel));

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
            value={tags}
            onAdd={handleAdd}
            onDelete={handleDel}
            label='Search Posts by Tag'
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

export default SearchTagBar;
