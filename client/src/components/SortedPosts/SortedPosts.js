import React, { useState, useEffect } from 'react';
import useStyles from './styles';
import {
  Button,
  Grid,
  Paper,
  Typography,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import Post from '../Posts/Post/Post';
import { getPostsByCreatorId, getPosts } from '../../actions/posts';
import 'react-dropdown/style.css';

const SortedPosts = () => {
  const { posts } = useSelector((state) => state.posts);
  const classes = useStyles();
  const [sortByOption, setSortByOption] = useState(false);
  const [isShow, setIsShow] = useState(true);
  const dispatch = useDispatch();
  const options = ['Author', 'Cuisine', 'Gluten Free', 'Vegan', 'Kosher', 'Keto', 'Dairy Free', 'Nut Allergy'];
  const defaultOption = options[0];

  const user = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    dispatch(getPosts());
  }, []);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleDropdownCloseAuthor = () => {
    setAnchorEl(null);
    setSortByOption('Author');
    setIsShow(false);
  };

  const handleDropdownCloseCuisine = () => {
    setAnchorEl(null);
    setSortByOption('Cuisine');
    setIsShow(false);
  };

  const handleDropdownCloseGlutenFree = () => {
    setAnchorEl(null);
    setSortByOption('Gluten Free');
    setIsShow(false);
  };

  const handleDropdownCloseVegan= () => {
    setAnchorEl(null);
    setSortByOption('Vegan');
    setIsShow(false);
  };
  const handleDropdownCloseKosher = () => {
    setAnchorEl(null);
    setSortByOption('Kosher');
    setIsShow(false);
  };
  const handleDropdownCloseKeto = () => {
    setAnchorEl(null);
    setSortByOption('Keto');
    setIsShow(false);
  };
  const handleDropdownCloseDairyFree = () => {
    setAnchorEl(null);
    setSortByOption('Dairy Free');
    setIsShow(false);
  };
  const handleDropdownCloseNutAllergy = () => {
    setAnchorEl(null);
    setSortByOption('Nut Allergy');
    setIsShow(false);
  };


  function sortByCreator(valueA, valueB) {
    if (valueA.creator < valueB.creator) return -1;
    if (valueA.creator > valueB.creator) return 1;
    return 0;
  }

  function sortByCuisine(valueA, valueB) {
    if (valueA.cuisine < valueB.cuisine) return -1;
    if (valueA.cuisine > valueB.cuisine) return 1;
    return 0;
  }

  function sortByGlutenFree(valueA, valueB) {
    if (valueA.dietaryPrefs.includes("Gluten Free") && !valueB.dietaryPrefs.includes("Gluten Free")) return -1;
    if (!valueA.dietaryPrefs.includes("Gluten Free") && valueB.dietaryPrefs.includes("Gluten Free")) return 1;
    return 0;
  }

  function sortByVegan(valueA, valueB) {
    if (valueA.dietaryPrefs.includes("Vegan") && !valueB.dietaryPrefs.includes("Vegan")) return -1;
    if (!valueA.dietaryPrefs.includes("Vegan") && valueB.dietaryPrefs.includes("Vegan")) return 1;
    return 0;
  }

  function sortByKosher(valueA, valueB) {
    if (valueA.dietaryPrefs.includes("Kosher") && !valueB.dietaryPrefs.includes("Kosher")) return -1;
    if (!valueA.dietaryPrefs.includes("Kosher") && valueB.dietaryPrefs.includes("Kosher")) return 1;
    return 0;
  }

  function sortByKeto(valueA, valueB) {
    if (valueA.dietaryPrefs.includes("Keto") && !valueB.dietaryPrefs.includes("Keto")) return -1;
    if (!valueA.dietaryPrefs.includes("Keto") && valueB.dietaryPrefs.includes("Keto")) return 1;
    return 0;
  }

  function sortByDairyFree(valueA, valueB) {
    if (valueA.dietaryPrefs.includes("Dairy Free") && !valueB.dietaryPrefs.includes("Dairy Free")) return -1;
    if (!valueA.dietaryPrefs.includes("Dairy Free") && valueB.dietaryPrefs.includes("Dairy Free")) return 1;
    return 0;
  }

  function sortByNutAllergy(valueA, valueB) {
    if (valueA.dietaryPrefs.includes("Nut Allergy") && !valueB.dietaryPrefs.includes("Nut Allergy")) return -1;
    if (!valueA.dietaryPrefs.includes("Nut Allergy") && valueB.dietaryPrefs.includes("Nut Allergy")) return 1;
    return 0;
  }


  return (
    <>
      <div className={classes.profile}>
        <Button
          style={{ marginBottom: '35px' }}
          variant='contained'
          id='sortOption'
          aria-controls={open ? 'sortDropdown' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleDropdownClick}
          color='primary'
        >
          Sort option
        </Button>
        <Menu
          id='sortDropdown'
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: 'bottom' }}
          transformOrigin={{ vertical: 'top' }}
          open={open}
          onClose={handleDropdownClose}
          MenuListProps={{
            'aria-labelledby': 'profile-button',
          }}
        >
          <MenuItem onClick={handleDropdownCloseAuthor}>Author</MenuItem>
          <MenuItem onClick={handleDropdownCloseCuisine}>Cuisine</MenuItem>
          <MenuItem onClick={handleDropdownCloseGlutenFree}>Gluten Free</MenuItem>
          <MenuItem onClick={handleDropdownCloseVegan}>Vegan</MenuItem>
          <MenuItem onClick={handleDropdownCloseKosher}>Kosher</MenuItem>
          <MenuItem onClick={handleDropdownCloseKeto}>Keto</MenuItem>
          <MenuItem onClick={handleDropdownCloseDairyFree}>Dairy Free</MenuItem>
          <MenuItem onClick={handleDropdownCloseNutAllergy}>Nut Allergy</MenuItem>

        </Menu>
      </div>
      {isShow && (
        <Grid
          className={classes.container}
          container
          alignItems='stretch'
          spacing={3}
        >
          {posts.filter((post) => (!user?.result?.blocked.includes(post.creatorId.toString()))).map((post) => (
            <Grid key={post._id} item xs={12} m={12} sm={6} lg={3}>
              <Post post={post} />
            </Grid>
          ))}
        </Grid>
      )}
      {sortByOption === 'Author' && (
        <Grid
          className={classes.container}
          container
          alignItems='stretch'
          spacing={3}
        >
          {posts.sort(sortByCreator).filter((post) => (!user?.result?.blocked.includes(post.creatorId.toString()))).map((post) => (
            <Grid key={post._id} item xs={12} m={12} sm={6} lg={3}>
              <Post post={post} />
            </Grid>
          ))}
        </Grid>
      )}
      {sortByOption === 'Cuisine' && (
        <Grid
          className={classes.container}
          container
          alignItems='stretch'
          spacing={3}
        >
          {posts.sort(sortByCuisine).filter((post) => (!user?.result?.blocked.includes(post.creatorId.toString()))).map((post) => (
            <Grid key={post._id} item xs={12} m={12} sm={6} lg={3}>
              <Post post={post} />
            </Grid>
          ))}
        </Grid>
      )}
        {sortByOption === 'Gluten Free' && (
        <Grid
          className={classes.container}
          container
          alignItems='stretch'
          spacing={3}
        >
          {posts.sort(sortByGlutenFree).filter((post) => (!user?.result?.blocked.includes(post.creatorId.toString()))).map((post) => (
            <Grid key={post._id} item xs={12} m={12} sm={6} lg={3}>
              <Post post={post} />
            </Grid>
          ))}
        </Grid>
      )}

      {sortByOption === 'Vegan' && (
        <Grid
          className={classes.container}
          container
          alignItems='stretch'
          spacing={3}
        >
          {posts.sort(sortByVegan).filter((post) => (!user?.result?.blocked.includes(post.creatorId.toString()))).map((post) => (
            <Grid key={post._id} item xs={12} m={12} sm={6} lg={3}>
              <Post post={post} />
            </Grid>
          ))}
        </Grid>
      )}

      {sortByOption === 'Kosher' && (
        <Grid
          className={classes.container}
          container
          alignItems='stretch'
          spacing={3}
        >
          {posts.sort(sortByKosher).filter((post) => (!user?.result?.blocked.includes(post.creatorId.toString()))).map((post) => (
            <Grid key={post._id} item xs={12} m={12} sm={6} lg={3}>
              <Post post={post} />
            </Grid>
          ))}
        </Grid>
      )}

      {sortByOption === 'Keto' && (
        <Grid
          className={classes.container}
          container
          alignItems='stretch'
          spacing={3}
        >
          {posts.sort(sortByKeto).filter((post) => (!user?.result?.blocked.includes(post.creatorId.toString()))).map((post) => (
            <Grid key={post._id} item xs={12} m={12} sm={6} lg={3}>
              <Post post={post} />
            </Grid>
          ))}
        </Grid>
      )}

      {sortByOption === 'Dairy Free' && (
        <Grid
          className={classes.container}
          container
          alignItems='stretch'
          spacing={3}
        >
          {posts.sort(sortByDairyFree).filter((post) => (!user?.result?.blocked.includes(post.creatorId.toString()))).map((post) => (
            <Grid key={post._id} item xs={12} m={12} sm={6} lg={3}>
              <Post post={post} />
            </Grid>
          ))}
        </Grid>
      )}

      {sortByOption === 'Nut Allergy' && (
        <Grid
          className={classes.container}
          container
          alignItems='stretch'
          spacing={3}
        >
          {posts.sort(sortByNutAllergy).filter((post) => (!user?.result?.blocked.includes(post.creatorId.toString()))).map((post) => (
            <Grid key={post._id} item xs={12} m={12} sm={6} lg={3}>
              <Post post={post} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default SortedPosts;
