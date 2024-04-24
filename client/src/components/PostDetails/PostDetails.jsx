import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  CircularProgress,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  IconButton,
  Checkbox,
  Grid,
  FormGroup,
  FormControlLabel,
  TextField,
  Avatar,
  Link,
  Container,
  ButtonGroup,
} from '@material-ui/core';
import {
  FacebookShareButton,
  TwitterShareButton,
  PinterestShareButton,
  FacebookIcon,
  PinterestIcon,
  TwitterIcon,
} from 'react-share';

import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getPost, createReview } from '../../actions/posts';
import {
  getUser,
  changeCollection,
  createCollection,
} from '../../actions/auth';
import parse from 'html-react-parser';
import {
  Add,
  Bookmarks,
  Close,
  Edit,
  Flag,
  LocalOffer,
} from '@material-ui/icons';

import useStyles from './styles';
import { Alert, Rating } from '@material-ui/lab';
import { addReport } from '../../actions/posts';

const PostDetails = () => {
  const { post, isLoading, reviews } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();
  const { id } = useParams();

  const [reportOpen, setReportOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreating, setShowCreating] = useState(false);
  const [createName, setCreateName] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [timer, setTimer] = useState(null);
  const [nutrients, setNutrients] = useState({});
  const [shoppingListOpen, setShoppingListOpen] = useState(false);

  const shareUrl = 'localhost:3000/posts/' + id;
  const shareString = 'Check out this recipe!';

  const jsonLocalStorage = JSON.parse(localStorage.getItem('profile'));
  const userID = jsonLocalStorage?.result._id;

  console.log('shopping List initialized:');
  console.log(shoppingListOpen);

  useEffect(() => {
    dispatch(getPost(id));

    if (userID) dispatch(getUser(userID));
  }, [id]);

  useEffect(() => {
    if (userID) dispatch(getUser(userID));
  }, [location]);

  useEffect(() => {
    console.log(nutrients);
  }, [nutrients]);

  if (!post) return null;
  if (userID && !user) return null;

  /*
  const getNutrientSum = (ingredients) => {
    var nutrient_dict = {}
    console.log(ingredients)
    for (var i = 0; i < ingredients.length; i++) {

      // For each ingredient, get info about it

      var url = `https://api.edamam.com/api/nutrition-data?app_id=cadfaa31&app_key=54828d196f9d4096183481b17727bd89&nutrition-type=logging&ingr=${ingredients[i]}`
      //var url = `https://api.edamam.com/api/food-database/v2/parser?app_id=ebd393e2&app_key=17e5e209df8354111d2a5fc80d75fe12&ingr=rice&nutrition-type=cooking`

      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          //console.log(res);
          //console.log(res.totalNutrients);
          var total_nutrients = res.totalNutrients

          // Add nutrients for each 

          for (var key in total_nutrients) {
            if ((total_nutrients[key]["label"] + " (" + total_nutrients[key]["unit"] + ")") in nutrient_dict) {
              nutrient_dict[(total_nutrients[key]["label"] + " (" + total_nutrients[key]["unit"] + ")")] += total_nutrients[key]["quantity"]
            }
            else {
              nutrient_dict[(total_nutrients[key]["label"] + " (" + total_nutrients[key]["unit"] + ")")] = total_nutrients[key]["quantity"]
            }
            //console.log(key)
            //console.log(total_nutrients[key]["label"] + " (" + total_nutrients[key]["unit"] + ")")
          }
          console.log(nutrient_dict)
          setNutrients(nutrient_dict)
          console.log("___________________________")
        }).then(setNutrients(nutrient_dict))
    }

  };
  */

  async function getNutrientSum(ingredients) {
    var nutrient_dict = {};
    var total_nutrients = [];
    console.log(ingredients);
    for (var i = 0; i < ingredients.length; i++) {
      // For each ingredient, get info about it
      var nutrient = await fetch_nutrient(ingredients[i]);
      console.log(nutrient['totalNutrients']);
      total_nutrients.push(nutrient['totalNutrients']);

      var url = `https://api.edamam.com/api/nutrition-data?app_id=cadfaa31&app_key=54828d196f9d4096183481b17727bd89&nutrition-type=logging&ingr=${ingredients[i]}`;
      //var url = `https://api.edamam.com/api/food-database/v2/parser?app_id=ebd393e2&app_key=17e5e209df8354111d2a5fc80d75fe12&ingr=rice&nutrition-type=cooking`
    }
    console.log(total_nutrients);
    for (var ingredient in total_nutrients) {
      for (var key in total_nutrients[ingredient]) {
        if (
          total_nutrients[ingredient][key]['label'] +
            ' (' +
            total_nutrients[ingredient][key]['unit'] +
            ')' in
          nutrient_dict
        ) {
          nutrient_dict[
            total_nutrients[ingredient][key]['label'] +
              ' (' +
              total_nutrients[ingredient][key]['unit'] +
              ')'
          ] += total_nutrients[ingredient][key]['quantity'];
        } else {
          nutrient_dict[
            total_nutrients[ingredient][key]['label'] +
              ' (' +
              total_nutrients[ingredient][key]['unit'] +
              ')'
          ] = total_nutrients[ingredient][key]['quantity'];
        }
        //console.log(key)
        //console.log(total_nutrients[key]["label"] + " (" + total_nutrients[key]["unit"] + ")")
      }
    }

    if (Object.keys(nutrient_dict).length == 0) {
      await setNutrients({ Error: -1 });
    } else {
      await setNutrients(nutrient_dict);
    }
  }

  function fetch_nutrient(ingredient) {
    var url = `https://api.edamam.com/api/nutrition-data?app_id=cadfaa31&app_key=54828d196f9d4096183481b17727bd89&nutrition-type=logging&ingr=${ingredient}`;
    var result = fetch(url).then((res) => res.json());
    return result;
  }

  const handleReportOpen = () => {
    setReportOpen(true);
  };
  const handleReportClose = () => {
    setReportOpen(false);
  };

  const handleReport = (e) => {
    const date = new Date().toLocaleString();
    const formData = 'User: ' + userID + ' Datetime of report: ' + date;
    console.log(formData);
    dispatch(addReport(formData, post._id));
    handleReportClose();
  };

  const editPost = () => {
    navigate(`/editPost/${post._id}`);
  };

  const handleSaveOpen = () => {
    setSaveOpen(true);
  };

  const handleSaveClose = () => {
    setSaveOpen(false);

    if (isCreating) switchMode();
  };

  const handleSaveCheck = (collection, postID) => {
    const formData = [collection, postID, userID];
    setAlertOpen(true);
    dispatch(changeCollection(formData, navigate));

    setTimer(
      setTimeout(() => {
        setAlertOpen(false);
      }, 4000)
    );
  };

  const isChecked = (collectionName) => {
    for (let i = 0; i < user.collections.length; i++) {
      let currCollection = user.collections[i];

      if (collectionName === currCollection[0]) {
        return !!currCollection[2].includes(id);
      }
    }
  };

  const switchMode = () => {
    setIsCreating((prevIsCreating) => !prevIsCreating);
    setShowCreating(false);
  };

  const handleChange = (e) => {
    setCreateName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createCollection([createName, id, userID], navigate));
    handleSaveClose();
  };

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmitReview = () => {
    const formData = { rating, review, user };
    dispatch(createReview(id, formData, navigate));
    setRating(0);
    setReview('');
  };

  const handleShoppingListOpen = () => {
    setShoppingListOpen(true);
    console.log('shopping List should be true now');
    console.log(shoppingListOpen);
  };

  const handleShoppingListClose = () => {
    setShoppingListOpen(false);
  };

  if (isLoading) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size='7em' />
      </Paper>
    );
  }

  let sum = 0;

  post.reviews.forEach((review) => {
    sum += review.rating;
  });

  const avgRating = sum / post.reviews.length;

  console.log(avgRating);

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <Container style={{ maxWidth: '85%', paddingTop: '5%' }}>
        {alertOpen && (
          <Alert
            variant='filled'
            severity='success'
            color='success'
            className={classes.alert}
          >
            Collection saved successfully
          </Alert>
        )}
        <div className={classes.card}>
          <div className={classes.section}>
            <Typography variant='h3' component='h2'>
              {post.title}
            </Typography>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '10px',
                marginBottom: '10px',
              }}
            >
              <div>
                <Rating defaultValue={avgRating} precision={0.1} readOnly />
              </div>
              <div>
                <Typography
                  variant='body1'
                  style={{ paddingBottom: '0px', marginLeft: '5px' }}
                >
                  <b>
                    {isNaN(avgRating) ? '' : Math.round(avgRating * 10) / 10}
                  </b>{' '}
                  ({reviews.length} ratings)
                </Typography>
              </div>
            </div>
            <Typography gutterBottom variant='body1'>
              {parse(post.message)}
            </Typography>
            <Typography
              gutterBottom
              variant='subtitle2'
              style={{ marginTop: '10px', marginBottom: '20px' }}
            >
              {'Created by '}
              <Link
                underline='always'
                href={`/profile/${post.creatorId}`}
                color='inherit'
              >
                {post.creator}
              </Link>{' '}
              {moment(post.createdAt).fromNow()}
            </Typography>
            <ButtonGroup variant='outlined' aria-label='outlined button group'>
              {userID && (
                <Button
                  onClick={handleSaveOpen}
                  variant='contained'
                  color='primary'
                  className={classes.report}
                  startIcon={<Bookmarks />}
                >
                  Save
                </Button>
              )}
              {userID === post.creatorId && (
                <Button
                  onClick={editPost}
                  variant='contained'
                  color='primary'
                  className={classes.report}
                  startIcon={<Edit />}
                >
                  Edit Post
                </Button>
              )}
              {userID && (
                <Button
                  onClick={handleReportOpen}
                  variant='contained'
                  color='secondary'
                  startIcon={<Flag />}
                  className={classes.report}
                >
                  Report
                </Button>
              )}
            </ButtonGroup>
            {post.selectedFile && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  className={classes.media}
                  src={post.selectedFile}
                  alt={post.title}
                  style={{
                    maxWidth: '85%',
                    height: 'auto',
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}
            {post.video && (
              <video width='750' height='500' controls>
                <source src={post.video} type='video/mp4' />
              </video>
            )}
            <Divider style={{ margin: '20px 0' }} />
            {post.timeCost != null && post.timeCost !== '' ? (
              <Typography variant='body1' component='h3'>
                <b>Time Needed:</b> {post.timeCost}
              </Typography>
            ) : null}
            {post.cuisine != null && post.cuisine !== '' ? (
              <Typography variant='body1' component='h3'>
                <b>Cuisine:</b> {post.cuisine}
              </Typography>
            ) : null}

            {post.foodType != null && post.foodType !== '' ? (
              <Typography variant='body1' component='h3'>
                <b>Food Type:</b> {post.foodType}
              </Typography>
            ) : null}
            {post.mentions != null && post.mentions.length != 0 ? (
              <Typography variant='body1' component='h3'>
                <b>Mentioned Users:</b>{' '}
                {
                  <List>
                    {post.mentions.map((mentioned) => (
                      <ListItem>
                        <a
                          href={
                            'http://localhost:3000/profile/' +
                            mentioned.substring(
                              mentioned.indexOf('(') + 1,
                              mentioned.indexOf(')')
                            )
                          }
                        >
                          {mentioned.substring(1, mentioned.indexOf(']'))}
                        </a>
                      </ListItem>
                    ))}
                  </List>
                }
              </Typography>
            ) : null}
            <Typography
              gutterBottom
              variant='body1'
              color='textSecondary'
              component='h3'
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <LocalOffer fontSize='small' />
                {post.tags.map((tag) => `#${tag} `)}
              </div>
            </Typography>
            <Divider style={{ margin: '20px 0' }} />

            {post.dietaryPrefs.length > 0 ? (
              <Typography gutterBottom variant='h4'>
                Dietary Preference Tags:
              </Typography>
            ) : null}

            {post.dietaryPrefs.length > 0
              ? post.dietaryPrefs.map((pref) => (
                  <Typography gutterBottom variant='body1' component='h3'>
                    {pref}
                  </Typography>
                ))
              : null}
            {post.dietaryPrefs.length > 0 ? (
              <Divider style={{ margin: '20px 0' }} />
            ) : null}

            <Typography variant='h4'>Ingredients</Typography>
            <ul style={{ paddingLeft: '25px' }}>
              {post.ingredients.map((ingredient) => (
                <li>
                  <Typography variant='body1'>{ingredient}</Typography>
                </li>
              ))}
            </ul>
            <div>
              <Button
                onClick={function (e) {
                  setNutrients(getNutrientSum(post.ingredients));
                }}
                variant='contained'
              >
                Get Nutrients
              </Button>
            </div>
            {Object.keys(nutrients).length != 0 ? (
              nutrients['Error'] ? (
                <Typography variant='body2'>
                  Error: No valid ingredients found.
                </Typography>
              ) : (
                <Typography variant='h5' component='h5'>
                  Nutrients:{' '}
                  {Object.keys(nutrients).map((key) => (
                    <Typography variant='body2'>
                      {key}: {Math.round(nutrients[key])}
                    </Typography>
                  ))}
                </Typography>
              )
            ) : null}
            <Divider style={{ margin: '20px 0' }} />
            <Typography variant='ingredients' gutterBottom variant='h4'>
              Shoping for Ingredients:
            </Typography>
            <Button
              variant='contained'
              color='primary'
              onClick={handleShoppingListOpen}
            >
              Online shopping list
            </Button>
            <div className={classes.shoppingList}>
              <Dialog
                onClose={handleShoppingListClose}
                open={shoppingListOpen}
                fullWidth='true'
                maxWidth='xs'
              >
                <DialogTitle id='shopping-list'>Your Shopping List</DialogTitle>
                <Divider style={{ margin: '20px 0' }} />
                <DialogContent>
                  <Grid container className='ingredients' direction='column'>
                    {post.ingredients?.map((ingredient) => (
                      <div
                        key={ingredient}
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '20px',
                        }}
                      >
                        <div>
                          <Typography variant='body2'>{`- ${ingredient}`}</Typography>
                        </div>
                        <div>
                          <Button
                            color='primary'
                            variant='contained'
                            align='center'
                            onClick={() =>
                              window.open(
                                `https://www.walmart.com/search?q=${ingredient}`
                              )
                            }
                          >
                            Walmart
                          </Button>
                          <Button
                            color='primary'
                            variant='contained'
                            onClick={() =>
                              window.open(
                                `https://www.amazon.com/s?k=${ingredient}`
                              )
                            }
                          >
                            Amazon
                          </Button>
                        </div>
                      </div>
                    ))}
                  </Grid>
                </DialogContent>

                <Divider style={{ margin: '20px 0' }} />
                <Button
                  color='primary'
                  variant='contained'
                  onClick={handleShoppingListClose}
                >
                  Close
                </Button>
              </Dialog>
            </div>
            <Divider style={{ margin: '20px 0' }} />
            <Typography variant='h4' style={{ marginBottom: '15px' }}>
              Directions
            </Typography>
            <div style={{ maxWidth: '75%' }}>
              {post.directions.map((direction, index) => (
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ paddingLeft: '5px', marginRight: '15px' }}>
                    <Typography variant='body1'>
                      <b>{index + 1}.</b>
                    </Typography>
                  </div>
                  <div>
                    <Typography variant='body1'>{direction}</Typography>
                  </div>
                </div>
              ))}
            </div>
            <Divider style={{ margin: '20px 0' }} />
            <TwitterShareButton title={shareString} url={shareUrl}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <FacebookShareButton
              title={shareString}
              url={shareUrl}
              style={{ marginLeft: '5px', marginRight: '5px' }}
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <PinterestShareButton title={shareString} url={shareUrl}>
              <PinterestIcon size={32} round />
            </PinterestShareButton>
            <Typography variant='h4' style={{ marginTop: '30px' }}>
              Reviews
            </Typography>
            {!isNaN(avgRating) && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>
                  <Rating defaultValue={avgRating} precision={0.1} readOnly />
                </div>
                <div>
                  <Typography
                    variant='body1'
                    style={{ paddingBottom: '0px', marginLeft: '5px' }}
                  >
                    <b style={{ marginRight: '10px' }}>
                      {Math.round(avgRating * 10) / 10} out of 5
                    </b>
                  </Typography>
                </div>
              </div>
            )}
            <Typography>
              {reviews.length} ratings |{' '}
              {reviews.filter((rev) => rev.review !== '').length} reviews
            </Typography>
            {userID && (
              <Paper elevation={4} style={{ borderRadius: '10px' }}>
                <div className={classes.reviewContainer}>
                  <Typography variant='h5'>{post.title}</Typography>
                  <Typography variant='body1' style={{ marginTop: '10px' }}>
                    Your Rating (required)
                  </Typography>
                  <Rating onChange={handleRatingChange} value={rating} />
                  <Typography variant='body1' style={{ marginTop: '5px' }}>
                    Your review (optional)
                  </Typography>
                  <TextField
                    variant='outlined'
                    placeholder='What did you think about this recipe?'
                    multiline
                    minRows={3}
                    onChange={handleReviewChange}
                    className={classes.review}
                    value={review}
                  />
                  <div className={classes.submitReview}>
                    <Button
                      variant='contained'
                      color='primary'
                      disabled={rating === 0}
                      onClick={handleSubmitReview}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </Paper>
            )}
            {reviews
              .filter((rev) => rev.review !== '')
              .map((rev) => (
                <Paper
                  key={rev._id}
                  className={classes.reviewPaper}
                  elevation={4}
                >
                  <Typography variant='h6'>
                    <Link href={`/profile/${rev.userID}`} color='inherit'>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={rev.userAvatar}
                          className={classes.avatar}
                        />
                        {rev.userUsername}
                      </div>
                    </Link>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '10px',
                        marginBottom: '10px',
                      }}
                    >
                      <Rating defaultValue={rev.rating} readOnly></Rating>
                      <Typography
                        variant='body2'
                        style={{ marginLeft: '15px' }}
                      >
                        {moment(rev.createdAt).fromNow()}
                      </Typography>
                    </div>
                  </Typography>
                  <Typography variant='body1'>{rev.review}</Typography>
                </Paper>
              ))}
          </div>
          <Dialog
            open={reportOpen}
            onClose={handleReportClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>
              {'Are you sure you want to report this post?'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                Reporting this post will flag the website adminstrators. Only do
                this to report inapproriate or malicious content.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleReportClose}>Cancel</Button>
              <Button onClick={handleReport} autoFocus>
                Report
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={saveOpen}
            onClose={handleSaveClose}
            aria-labelledby='save-dialog-title'
            aria-describedby='save-dialog-description'
          >
            <DialogTitle id='save-dialog-id' className={classes.saveTitle}>
              Save to...
              <IconButton
                onClick={handleSaveClose}
                className={classes.saveCloseIcon}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <List>
              {user?.collections.map((collection) => (
                <ListItem
                  key={collection[0]}
                  button
                  style={{ paddingBottom: '0px', marginBottom: '-5px' }}
                >
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          color='primary'
                          checked={isChecked(collection[0])}
                        />
                      }
                      label={collection[0]}
                      onChange={() => handleSaveCheck(collection[0], id)}
                    />
                  </FormGroup>
                </ListItem>
              ))}
              {!isCreating && (
                <ListItem
                  button
                  onClick={switchMode}
                  style={{ marginTop: '10px', marginBottom: '-15px' }}
                >
                  <Add style={{ marginLeft: '-3px', marginRight: '9px' }} />
                  <Typography variant='body1'>Create new collection</Typography>
                </ListItem>
              )}
              {isCreating && (
                <ListItem
                  button
                  style={{ marginTop: '20px', marginBottom: '-5px' }}
                >
                  <TextField
                    label='Name'
                    autoFocus
                    placeholder='Enter collection name...'
                    onChange={handleChange}
                  ></TextField>
                </ListItem>
              )}
            </List>
            <DialogActions>
              {isCreating && <Button onClick={handleSubmit}>Create</Button>}
            </DialogActions>
          </Dialog>
        </div>
      </Container>
    </Paper>
  );
};

export default PostDetails;
