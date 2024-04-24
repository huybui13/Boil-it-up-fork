import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Avatar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';
import memories from '../../images/memories.png';
import BellIcon from 'react-bell-icon';

const Navbar = () => {
  const classes = useStyles();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const { posts, isLoading } = useSelector((state) => state.posts);
  const [notifi, setNotifi] = React.useState(null);
  const open = Boolean(anchorEl);
  const openNotification = Boolean(notifi);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleProfileCloseAccount = () => {
    setAnchorEl(null);
    navigate(`/profile/${user.result._id}`);
  };

  const handleProfileCloseLogout = () => {
    setAnchorEl(null);
    logout();
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });

    navigate('/posts');

    setUser(null);
  };

  const openPopup = () => {
    let popup = document.getElementById("popupPost");
    popup.className = classes.openPopupPost;
  };

  const closePopup = () => {
    let popup = document.getElementById("popupPost");
    popup.className = classes.closePopupPost;
    navigate(`/auth`);
  };

  const handleNewPost = () => {
    if (user) {
      //console.log("checkhere");
    }
    else { openPopup() };
  };

  const handleNotificationClick = (event) => {
    setNotifi(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotifi(null);
  };

  function handleNotificationCloseAccount(postid) {
    setNotifi(null);
    navigate(`/posts/${postid}`);
  }

  useEffect(() => {
    // const token = user?.token;

    // Add logic for logging out when time runs out

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  return (
    <AppBar className={classes.appBar} position='static' color='inherit'>
      <div className={classes.brandContainer}>
        <Typography
          component={Link}
          to='/'
          className={classes.heading}
          variant='h2'
          align='center'
        >
          Boil-it Up
        </Typography>
        <img
          className={classes.image}
          src={memories}
          alt='memories'
          height='60'
        />
      </div>
      <Button component={Link} to='/About' variant='contained' color='primary'>
        About
      </Button>
      <Button
        component={Link}
        to={user ? '/newPost' : '/auth'}
        onClick={handleNewPost}
        variant='contained'
        color='primary'
      >
        New Post
      </Button>

      <Button component={Link} to='/Search' variant='contained' color='primary'>
        <SearchIcon />
      </Button>

      <Toolbar className={classes.toolbar}>
        {user ? (
          <div className={classes.profile}>
            <Button
              id='notifications'
              aria-controls={openNotification ? 'notifications' : undefined}
              aria-haspopup='true'
              aria-expanded={openNotification ? 'true1' : undefined}
              onClick={handleNotificationClick}
            >
              {(user.result.notifications.length != 0) ?
                <BellIcon width='25' active={true} animate={false} /> :
                <BellIcon width='25' active={false} animate={false} />}
            </Button>
            <Menu
              id='notifications'
              anchorEl={notifi}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: 'bottom' }}
              transformOrigin={{ vertical: 'top' }}
              open={openNotification}
              onClose={handleNotificationClose}
              MenuListProps={{
                'aria-labelledby': 'notifications',
              }}
            >
              {user.result.notifications.map(notifications =>
                posts.map(post => (notifications.includes("Title: " + post.title)) ?
                  <MenuItem onClick={() => handleNotificationCloseAccount(post._id)}>{notifications} </MenuItem> : ""
                )
              )}
            </Menu>
            <Button
              variant='outlined'
              id='profile-button'
              aria-controls={open ? 'profile-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
              onClick={handleProfileClick}
            >
              <Avatar alt={user.result.name} src={user.result.selectedFile} style={{ border: 'solid', borderWidth: '1px' }} />
              <Typography className={classes.userName} variant='h6'>
                {user?.result.username}
              </Typography>
            </Button>
            <Menu
              id='profile-menu'
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: 'bottom' }}
              transformOrigin={{ vertical: 'top' }}
              open={open}
              onClose={handleProfileClose}
              MenuListProps={{
                'aria-labelledby': 'profile-button',
              }}
            >
              <MenuItem onClick={handleProfileCloseAccount}>My profile</MenuItem>
              <MenuItem onClick={handleProfileCloseLogout}>Logout</MenuItem>
            </Menu>
          </div>
        ) : (
          <Button
            component={Link}
            to='/auth'
            variant='contained'
            color='primary'
          >
            Sign in
          </Button>
        )}
      </Toolbar>
      <div className={classes.popupPost} id="popupPost">
        <h2>Please sign in before making a post!</h2>
        <p></p>
        <Button onClick={closePopup}>OK</Button>
      </div>
    </AppBar>
  );
};

export default Navbar;
