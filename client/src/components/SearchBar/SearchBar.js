import React, { useState, useEffect } from 'react';
import { Grid, AppBar, TextField, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation, redirect } from 'react-router-dom';

import useStyles from './styles';
import { getPostsBySearch } from '../../actions/posts';
import Post from '../Posts/Post/Post';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const query = useQuery();
  const history = useNavigate();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');
  const [search, setSearch] = useState('');
  const { posts } = useSelector((state) => state.posts);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isCuisine, setIsCuisine] = useState(false);
  const [isFoodType, setIsFoodType] = useState(false);
  const [isShow, setIsShow] = useState(true);

  function showAuthor() {
    setIsAuthor(!isAuthor);
    setIsShow(!isShow);
  }

  function showCuisine() {
    setIsAuthor(!isAuthor);
    setIsCuisine(!isCuisine);
  }

  function showFoodType() {
    setIsCuisine(!isCuisine);
    setIsFoodType(!isFoodType);
  }

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      //getPostsBySearch({ search });
      //history(`/posts/search?searchQuery=${search || 'none'}`);
    }
  };

  useEffect(() => {
    dispatch(getPostsBySearch({ search }));
  }, [search]);

  if (!posts) {
    return null;
  }

  function sortByCreator(valueA, valueB) {
    if (valueA.creator < valueB.creator) return -1;
    if (valueA.creator < valueB.creator) return 1;
    return 0;
  }

  function sortByCuisine(valueA, valueB) {
    if (valueA.cuisine < valueB.cuisine) return -1;
    if (valueA.cuisine < valueB.cuisine) return 1;
    return 0;
  }

  function sortByFoodType(valueA, valueB) {
    if (valueA.foodType < valueB.foodType) return -1;
    if (valueA.foodType < valueB.foodType) return 1;
    return 0;
  }

  return (
    <div>
      <Grid item lg={8}>
        <AppBar
          className={classes.appBarSearch}
          position='static'
          color='inherit'
        >
          <div style={{ display: 'flex' }}>
            <TextField
              name='search'
              variant='outlined'
              label='What are you looking for'
              fullWidth
              onKeyPress={handleKeyPress}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </AppBar>
      </Grid>

      <Grid>
        <Button
          label='Wanna search posts by Tags'
          component={Link}
          to='/SearchTags'
          variant='contained'
          color='primary'
          style={classes.Button}
        >
          Search Posts by Tags
        </Button>
        <Button
          label='Wanna search posts by Ingredients'
          component={Link}
          to='/SearchIngredients'
          variant='contained'
          color='primary'
          style={classes.Button}
        >
          Search Posts by Ingredients
        </Button>
      </Grid>

      {isShow === true && (
        <Grid
          container
          justifyContent='space-between'
          alignItems='stretch'
          spacing={2}
          className={classes.gridContainer}
        >
          {posts.map((post) => (
            <Grid key={post._id} item xs={12} m={12} sm={6} lg={3}>
              <Post post={post} />
            </Grid>
          ))}
        </Grid>
      )}

      <div style={{ marginTop: '20px' }}>
        <Button
          onClick={() => showAuthor()}
          variant='contained'
          color='primary'
          style={classes.Button}
        >
          Author
        </Button>
        {isAuthor === true && (
          <Grid
            className={classes.container}
            container
            alignItems='stretch'
            spacing={3}
          >
            {posts.sort(sortByCreator).map((post) => (
              <Grid key={post._id} item xs={12} m={12} sm={6} lg={3}>
                <Post post={post} />
              </Grid>
            ))}
          </Grid>
        )}

        <Button
          onClick={() => showCuisine()}
          variant='contained'
          color='primary'
          style={classes.Button}
        >
          Cuisine
        </Button>
        {isCuisine === true && (
          <Grid
            className={classes.container}
            container
            alignItems='stretch'
            spacing={3}
          >
            {posts.sort(sortByCuisine).map((post) => (
              <Grid key={post._id} item xs={12} m={12} sm={6} lg={3}>
                <Post post={post} />
              </Grid>
            ))}
          </Grid>
        )}

        <Button
          onClick={() => showFoodType()}
          variant='contained'
          color='primary'
          style={classes.Button}
        >
          foodType
        </Button>
        {isFoodType === true && (
          <Grid
            className={classes.container}
            container
            alignItems='stretch'
            spacing={3}
          >
            {posts.sort(sortByFoodType).map((post) => (
              <Grid key={post._id} item xs={12} m={12} sm={6} lg={3}>
                <Post post={post} />
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
