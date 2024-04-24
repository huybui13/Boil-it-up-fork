import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  getUser,
  followUser,
  unfollowUser,
  addDietaryPref,
  blockUser,
  unblockUser,
  clearDietaryPref,
} from '../../actions/auth';

import { getPostsByCreatorId } from '../../actions/posts';
import {
  Paper,
  Typography,
  Grid,
  Avatar,
  Divider,
  Button,
  Link,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  Card,
  CardMedia,
  ButtonBase,
  CardActionArea,
  IconButton,
  Menu,
  MenuItem,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import useStyles from './styles';
import { Block, Edit, MoreVert, PeopleAlt } from '@material-ui/icons';
import Posts from '../Posts/Posts';
import Select from 'react-select';

const Profile = () => {
  const { user, collections } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const classes = useStyles();
  const [currentId, setCurrentId] = useState(null);
  const [followerOpen, setFollowerOpen] = React.useState(false);
  const [followingOpen, setFollowingOpen] = React.useState(false);
  const [dietaryPrefOpen, setdietaryPrefOpen] = React.useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const open = Boolean(anchorEl);

  const options = [
    { value: 'glutenFree', label: 'Gluten Free' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'kosher', label: 'Kosher' },
    { value: 'keto', label: 'Keto' },
    { value: 'dairyFree', label: 'Dairy Free' },
    { value: 'nutAllergy', label: 'Nut Allergy' },
  ];

  const local = JSON.parse(localStorage.getItem('profile'));
  const existingID = local.result._id;

  // console.log(id);
  // console.log(posts);

  useEffect(() => {
    dispatch(getPostsByCreatorId(id));
    dispatch(getUser(id));
  }, [id]);

  useEffect(() => {
    dispatch(getUser(id));
  }, [location]);

  const follow = () => {
    // console.log('follower ID: ' + existingID);
    // console.log('following ID: ' + id);
    dispatch(followUser(existingID, id, navigate));
  };

  const unfollow = () => {
    dispatch(unfollowUser(existingID, id, navigate));
  };

  const handleDietaryPrefOpen = () => {
    setdietaryPrefOpen(true);
  };
  const handleDietaryPrefClose = () => {
    setdietaryPrefOpen(false);
  };

  const handleFollowerClose = () => {
    setFollowerOpen(false);
  };

  const handleFollowingClose = () => {
    setFollowingOpen(false);
  };

  const handleClose = (id) => {
    setFollowerOpen(false);
    setFollowingOpen(false);
    navigate(`/profile/${id}`);
  };

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBlockClick = () => {
    setDialogOpen(true);
  };

  const handleBlockClose = () => {
    setDialogOpen(false);
  };

  const handleBlock = () => {
    dispatch(blockUser(local?.result?._id, user._id, navigate));
    handleBlockClose();
  };

  const handleUnblockClick = () => {
    dispatch(unblockUser(local?.result?._id, user._id, navigate));
    handleMenuClose();
  };
  const handleDeleteDietaryPrefs = () => {
    dispatch(clearDietaryPref(user._id, navigate));
    handleDietaryPrefClose();
  };

  const handleSubmit = (e) => {
    selectedOptions.push(user._id);
    dispatch(addDietaryPref(navigate, selectedOptions));
    handleDietaryPrefClose();
  };

  const handleSelect = function (selectedItems) {
    console.log(selectedItems);
    const options = [];
    for (let i = 0; i < selectedItems.length; i++) {
      options.push(selectedItems[i].value);
    }
    setSelectedOptions(options);
  };

  const openCollection = (userID, collectionID) => {
    navigate(`/profile/${userID}/collection/${collectionID}`);
  };

  if (!user) return null;
  if (!posts) return null;

  let same = false;
  let unfollowButton = false;
  if (existingID === id) {
    same = true;
  } else {
    if (user.followerList.some((row) => row.includes(existingID))) {
      unfollowButton = true;
    }
  }

  const blockable = local?.result?._id !== user._id;
  const isBlocked = local?.result?.blocked.includes(user._id);

  const sendUpdate = () => {
    const url = `http://localhost:5000/password-reset/sendUpdate`;
    const email = user.email;
    // get the count of totoal post
    // if that thing mod 2 === 0
    // call axios

    const { data } = axios.post(url, { email });
  };
  console.log(posts);
  console.log(user.email);
  //console.log(posts.length);

  return (
    <Grid container spacing={2} alignItems='stretch'>
      <Grid item lg={4}>
        <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Avatar src={user.selectedFile} className={classes.avatar} />
            {blockable && (
              <div>
                <IconButton
                  color='inherit'
                  aria-label='more'
                  id='more-button'
                  aria-controls={open ? 'more-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup='true'
                  onClick={handleMenuClick}
                >
                  <MoreVert />
                </IconButton>
                <Menu
                  id='more-menu'
                  MenuListProps={{
                    'aria-labelledby': 'more-button',
                  }}
                  anchorEl={anchorEl}
                  getContentAnchorEl={null}
                  anchorOrigin={{ vertical: 'center' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  open={open}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    onClick={isBlocked ? handleUnblockClick : handleBlockClick}
                  >
                    {/*<Block/>&nbsp;Block*/}
                    {isBlocked && <div>Unblock</div>}
                    {!isBlocked && (
                      <div style={{ display: 'flex' }}>
                        <Block />
                        &nbsp;Block
                      </div>
                    )}
                  </MenuItem>
                </Menu>
                <Dialog
                  open={dialogOpen}
                  onClose={handleBlockClose}
                  aria-labelledby='delete-dialog-title'
                  aria-describedby='delete-dialog-description'
                >
                  <DialogTitle id='delete-dialog-title'>
                    {'Block ' + user.username + '?'}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id='delete-dialog-description'>
                      Are you sure you want to block <b>{user.username}</b>?
                      Doing so means you won't be able to view their posts.
                    </DialogContentText>
                    <DialogActions>
                      <Button onClick={handleBlockClose}>Cancel</Button>
                      <Button onClick={handleBlock} autoFocus>
                        Block
                      </Button>
                    </DialogActions>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
          <Typography variant='h4' component='h3'>
            {user.name}
          </Typography>
          <Typography variant='h6' component='h3' className={classes.username}>
            {user.username}
          </Typography>
          {same && (
            <Button
              href='/edit-profile'
              variant='contained'
              className={classes.editProfile}
              startIcon={<Edit />}
            >
              Edit Profile
            </Button>
          )}
          {!same && !unfollowButton && (
            <Button
              variant='contained'
              className={classes.editProfile}
              onClick={follow}
            >
              Follow
            </Button>
          )}
          {!same && unfollowButton && (
            <Button
              variant='contained'
              className={classes.editProfile}
              onClick={unfollow}
            >
              Unfollow
            </Button>
          )}
          <div className={classes.follow}>
            <Link
              component='button'
              variant='body1'
              color='inherit'
              underline='hover'
              onClick={() => setFollowerOpen(true)}
            >
              {<PeopleAlt className={classes.followIcon} />}
              &nbsp;<strong>{user.followerList.length}</strong> followers
            </Link>
            &nbsp;·&nbsp;
            <Link
              component='button'
              variant='body1'
              color='inherit'
              underline='hover'
              onClick={() => setFollowingOpen(true)}
            >
              <strong>{user.followingList.length}</strong> following
            </Link>
            <Dialog
              onClose={handleFollowerClose}
              open={followerOpen}
              fullWidth='true'
              maxWidth='xs'
            >
              <DialogTitle id='followers-title'>Followers</DialogTitle>
              <List>
                {user.followerList.map((follower) => (
                  <ListItem
                    key={follower[0]}
                    button
                    onClick={() => handleClose(follower[0])}
                  >
                    <div style={{ display: 'flex' }}>
                      <Avatar
                        src={follower[3]}
                        className={classes.followAvatar}
                      />
                      <div style={{ marginLeft: '10px' }}>
                        <Typography variant='body1'>{follower[1]}</Typography>
                        <Typography variant='body2'>{follower[2]}</Typography>
                      </div>
                    </div>
                  </ListItem>
                ))}
              </List>
            </Dialog>
            <Dialog
              onClose={handleFollowingClose}
              open={followingOpen}
              fullWidth='true'
              maxWidth='xs'
            >
              <DialogTitle id='following-title'>Following</DialogTitle>
              <List>
                {user.followingList.map((following) => (
                  <ListItem
                    key={following[0]}
                    button
                    onClick={() => handleClose(following[0])}
                  >
                    <div style={{ display: 'flex' }}>
                      <Avatar
                        src={following[3]}
                        className={classes.followAvatar}
                      />
                      <div style={{ marginLeft: '10px' }}>
                        <Typography variant='body1'>{following[1]}</Typography>
                        <Typography variant='body2'>{following[2]}</Typography>
                      </div>
                    </div>
                  </ListItem>
                ))}
              </List>
            </Dialog>
            <Dialog
              onClose={handleDietaryPrefClose}
              open={dietaryPrefOpen}
              fullWidth='true'
              maxWidth='md'
              maxHeight='lg'
            >
              <DialogTitle id='dietary-pref'>
                Edit Dietary Prefernces
              </DialogTitle>
              <div>
                <Select
                  onChange={(e) => {
                    handleSelect(e);
                  }}
                  isMulti
                  name='colors'
                  options={options}
                  className='basic-multi-select'
                  classNamePrefix='select'
                />
              </div>
              <Grid item lg={15}>
                <Button
                  color='primary'
                  variant='contained'
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
                <Button
                  color='primary'
                  variant='contained'
                  onClick={handleDeleteDietaryPrefs}
                >
                  {' '}
                  Clear Dietary Preferences
                </Button>
              </Grid>
            </Dialog>
          </div>
          <Divider style={{ margin: '10px 0' }} />
          <Typography variant='body1'>{user.introduction}</Typography>
        </Paper>
        {same && (
          <Grid item lg={12}>
            <Paper
              style={{
                padding: '20px',
                borderRadius: '15px',
                marginTop: '20px',
              }}
              elevation={6}
            >
              Dietary Prefrences:
              <Grid item>{user.dietaryPreferences.join(',')}</Grid>
              <Button
                variant='contained'
                color='primary'
                onClick={handleDietaryPrefOpen}
              >
                Edit dietary prefrences
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
      <Grid item lg={8}>
        <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
          <Typography variant='h5' style={{ marginBottom: '10px' }}>
            Posts:
          </Typography>
          <Grid item>
            <Posts setCurrentId={setCurrentId} />
          </Grid>
        </Paper>
        <Paper
          style={{ padding: '20px', marginTop: '20px', borderRadius: '15px' }}
          elevation={6}
        >
          <Typography variant='h5' style={{ marginBottom: '10px' }}>
            Collections:
          </Typography>
          <Grid
            container
            alignItems='stretch'
            spacing={3}
            className={classes.container}
          >
            {collections.map((collection) => (
              <Grid key={collection[0]} item xs={12} m={12} sm={6} lg={3}>
                <Card>
                  <CardActionArea
                    onClick={() => openCollection(user._id, collection[3])}
                  >
                    <CardMedia
                      component='img'
                      height='120'
                      image='https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'
                    />
                    <div className={classes.cardDetails}>
                      <Typography variant='h6'>{collection[0]}</Typography>
                      <Typography variant='body2' color='textSecondary'>
                        {collection[2].length} items
                      </Typography>
                    </div>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Profile;
