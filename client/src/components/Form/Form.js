import React, { useState, useEffect, useCallback } from 'react';

import {
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  DialogTitle,
  IconButton,
} from '@material-ui/core';
import Select from 'react-select';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import useStyles from './styles';

import { createPost, getPost, updatePost } from '../../actions/posts';

import { MentionsInput, Mention } from 'react-mentions';
import defaultStyle from './defaultStyle';
import defaultMentionStyle from './defaultMentionStyle';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Add, DeleteOutline } from '@material-ui/icons';
import { getAllUsers } from '../../actions/auth';
import axios from 'axios';
//Get the current ID

export const Form = ({ currentId, setCurrentId }) => {
  //console.log(currentId);
  const [postData, setPostData] = useState({
    // creator: "",
    title: '',
    message: '',
    tags: '',
    ingredients: ['', '', ''],
    directions: ['', '', ''],
    foodType: '',
    cuisine: '',
    timeCost: '',
    selectedFile: '',
    video: '',
    dietaryPrefs: [],
    mentions: [],
    //creatorId: '',
  });
  const post = useSelector((state) => (currentId ? state.posts.post : null));
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState([]);

  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('profile'));

  const users = useSelector((state) => state.auth).users;
  const [ingredientErrors, setIngredientErrors] = useState({});
  const [directionErrors, setDirectionErrors] = useState({});
  const [titleError, setTitleError] = useState(false);
  const [timeError, setTimeError] = useState(false);

  const [ingredientErrorText, setIngredientErrorText] = useState('');
  const [directionErrorText, setDirectionErrorText] = useState('');
  const [titleErrorText, setTitleErrorText] = useState('');
  const [timeErrorText, setTimeErrorText] = useState('');

  const exampleIngredients = [
    '2 cups butter, softened',
    '2 tablespoons salt',
    '1 pound ground beef',
    'Add an additional ingredient',
  ];
  const exampleDirections = [
    ' Preheat the oven to 350 degrees F...',
    'Combine all dry ingredients in a large bowl...',
    'Pour into greased trays and bake for 15-20 minutes...',
    'Add another step',
  ];

  useEffect(() => {
    if (post) setPostData(post);
    dispatch(getAllUsers());
  }, [post]);

  useEffect(() => {
    console.log('here');
    if (currentId) {
      dispatch(getPost(currentId));
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(postData.video);

    let isError = checkErrors();

    if (!isError) {
      if (currentId) {
        dispatch(
          updatePost(currentId, {
            ...postData,
            creator: user?.result?.name,
            creatorId: user?.result?._id,
            dietaryPrefs: selectedOptions,
            mentions: postData.mentions,
          })
        );
      } else {
        dispatch(
          createPost({
            ...postData,
            creator: user?.result?.name,
            creatorId: user?.result?._id,
            dietaryPrefs: selectedOptions,
            mentions: postData.mentions,
          })
        );
      }
      //Create notifs
      openPopup();
    }

    users.forEach((you) => {
      try {
        //console.log(you.email);
        //sendUpdate(you.email, postData);
        sendUpdate(you.email);
      } catch (err) {
        console.log(err.message);
      }
    });
  };
  // const sendUpdate = (email, postData) => {
  //   const url = `http://localhost:5000/password-reset/sendUpdate`;
  //   //console.log(post);
  //   const { data } = axios.post(url, { email, postData });
  // };
  const sendUpdate = (email) => {
    const url = `http://localhost:5000/password-reset/sendUpdate`;
    //console.log(post);
    const { data } = axios.post(url, { email });
  };

  const handleIngredientsChange = (e, index) => {
    let arr = postData.ingredients;
    arr[index] = e.target.value;

    setPostData({ ...postData, ingredients: arr });
  };

  const handleAddIngredient = () => {
    let arr = postData.ingredients;
    arr.push('');

    setPostData({ ...postData, ingredients: arr });
  };

  const handleDeleteIngredient = (index) => {
    let arr = postData.ingredients;

    if (arr.length > 1) {
      arr.splice(index, 1);
    }

    setPostData({ ...postData, ingredients: arr });
  };

  const handleDirectionsChange = (e, index) => {
    let arr = postData.directions;
    arr[index] = e.target.value;

    setPostData({ ...postData, directions: arr });
  };

  const handleAddDirection = () => {
    let arr = postData.directions;
    arr.push('');

    setPostData({ ...postData, directions: arr });
  };

  const handleDeleteDirection = (index) => {
    let arr = postData.directions;

    if (arr.length > 1) {
      arr.splice(index, 1);
    }

    setPostData({ ...postData, directions: arr });
  };

  const clear = () => {
    setCurrentId(null);
    setPostData({
      creator: user?.name,
      title: '',
      message: '',
      ingredients: ['', '', ''],
      directions: ['', '', ''],
      foodType: '',
      cuisine: '',
      timeCost: '',
      tags: '',
      selectedFile: '',
      video: '',
      mentions: [],
      value: '',
    });
  };

  const openPopup = () => {
    let popup = document.getElementById('popup');
    popup.className = classes.openPopup;
  };

  const closePopup = () => {
    let popup = document.getElementById('popup');
    popup.className = classes.closePopup;
    navigate(`/posts`);
  };

  const [text, setText] = useState('');

  const options = [
    { value: 'Gluten Free', label: 'Gluten Free' },
    { value: 'Vegan', label: 'Vegan' },
    { value: 'Kosher', label: 'Kosher' },
    { value: 'Keto', label: 'Keto' },
    { value: 'Dairy Free', label: 'Dairy Free' },
    { value: 'Nut Allergy', label: 'Nut Allergy' },
  ];

  const handleSelect = function (selectedItems) {
    const options = [];
    for (let i = 0; i < selectedItems.length; i++) {
      options.push(selectedItems[i].value);
    }
    setSelectedOptions(options);
    console.log(selectedOptions);
  };

  function listHasEmptySlot(list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i] == '') {
        return true;
      }
    }
    return false;
  }

  /*
  if(!user?.result?.creatorId) {
    return (
      <Paper className={classes.paper}>
        <Typography varient="h6" align="center">
          Please Sign In to create your own post.
        </Typography>
      </Paper>
    )
  }
  */
  //function VideoInput(props) {
  //  const { width, height } = props;

  const inputRef = React.useRef();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    console.log(url);
    setPostData({ ...postData, video: url });
    //setSource(url);
  };

  const handleChoose = (event) => {
    inputRef.current.click();
  };

  //   return (
  //     <div className="VideoInput">
  //       <input
  //         ref={inputRef}
  //         className="VideoInput_input"
  //         type="file"
  //         onChange={handleFileChange}
  //         accept=".mov,.mp4"
  //       />
  //       {/* {!source && <button onClick={handleChoose}>Choose</button>} */}
  //       {postData.video && (
  //         <video
  //           className="VideoInput_video"
  //           width="100%"
  //           height={height}
  //           controls
  //           src={postData.video}
  //         />
  //       )}
  //       <div className="VideoInput_footer">{postData.video || "Nothing selectd"}</div>
  //     </div>
  //   );
  // }

  const checkErrors = () => {
    let isError = false;

    postData.ingredients.forEach((ingredient) => {
      if (ingredient.length === 0) {
        isError = true;
        setIngredientErrorText('Please enter missing ingredient');
      }

      ingredientErrors[ingredient] = ingredient.length === 0;
    });

    postData.directions.forEach((direction) => {
      if (direction.length === 0) {
        isError = true;
        setDirectionErrorText('Please enter missing step');
      }

      directionErrors[direction] = direction.length === 0;
    });

    if (postData.title.length === 0) {
      isError = true;
      setTitleError(true);
      setTitleErrorText('Please enter a title');
    }

    if (postData.timeCost.length === 0) {
      isError = true;
      setTimeError(true);
      setTimeErrorText('Please enter the time needed');
    }

    return isError;
  };

  const [value, setValue] = useState('');
  const onChange = (e) => {
    console.log('onChange', e);
    setValue(e.target.value);
    var tags = value.split('@');
    var mentionsArray = [];
    for (var i = 1; i < tags.length; i++) mentionsArray.push(tags[i].trim());
    console.log(mentionsArray);
    setPostData({ ...postData, mentions: mentionsArray });
    console.log({ ...postData });
  };

  function fetchUsers(query) {
    if (!query) return;
    var usersTemp = [];
    users.forEach((u) => {
      var obj = { id: u._id, display: u.name };
      usersTemp.push(obj);
    });

    return usersTemp;
  }
  return (
    <Paper className={classes.paper}>
      <Typography
        variant='h4'
        className={classes.title}
        style={{ marginBottom: '20px' }}
      >
        {currentId ? 'Edit' : 'Add'} a Recipe Post
      </Typography>
      <form
        autoComplete='off'
        noValidate
        className={`${classes.root} ${classes.form}`}
        onSubmit={handleSubmit}
      >
        <div style={{ display: 'flex', width: '100%', margin: '8px' }}>
          <div style={{ width: '50%', marginRight: '8px' }}>
            <Typography style={{ fontWeight: 'bold' }}>Title</Typography>
            <TextField
              name='title'
              error={titleError}
              helperText={titleError && titleErrorText}
              variant='outlined'
              color='error'
              placeholder='Give your recipe a title (Required)'
              value={postData.title}
              onChange={(e) =>
                setPostData({ ...postData, title: e.target.value })
              }
              style={{ width: '100%', margin: '0px' }}
            />
          </div>
          <div style={{ width: '50%', marginLeft: '8px' }}>
            <Typography style={{ fontWeight: 'bold' }}>
              Tags (comma-separated)
            </Typography>
            <TextField
              name='tags'
              variant='outlined'
              placeholder='spicy, soup, serves-many'
              value={postData.tags}
              onChange={(e) =>
                setPostData({ ...postData, tags: e.target.value.split(',') })
              }
              style={{ width: '100%', margin: '0px' }}
            />
          </div>
        </div>
        <div style={{ width: '100%', margin: '8px' }}>
          <Typography style={{ fontWeight: 'bold' }}>Description</Typography>
          <TextField
            name='message'
            variant='outlined'
            placeholder='Tell us something special about your recipe'
            fullWidth
            value={postData.message}
            onChange={(e) =>
              setPostData({ ...postData, message: e.target.value })
            }
            multiline
            minRows={5}
            style={{ margin: '0px' }}
          />
        </div>
        <div style={{ width: '100%', padding: '10px' }}>
          <Divider style={{ margin: '10px 0' }} />
        </div>

        <div style={{ width: '100%', margin: '8px' }}>
          <Typography style={{ fontWeight: 'bold', marginBottom: '20px' }}>
            Ingredients (Required)
          </Typography>
          <Typography style={{ fontSize: '16px', marginBottom: '20px' }}>
            Enter one ingredient per line. Include the quantity (i.e. cups,
            tablespoons) and any special preparation (i.e. sifted, softened,
            chopped). All ingredients must be filled.
          </Typography>
          {postData.ingredients.map((ingredient, index) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '15px',
              }}
            >
              <TextField
                key={index}
                error={ingredientErrors[ingredient]}
                helperText={ingredientErrors[ingredient] && ingredientErrorText}
                name='ingredients'
                variant='outlined'
                placeholder={
                  index < 3 ? exampleIngredients[index] : exampleIngredients[3]
                }
                fullWidth
                value={ingredient}
                onChange={(e) => handleIngredientsChange(e, index)}
                style={{ margin: '0px', marginRight: '10px' }}
              />
              <IconButton
                style={{
                  border: '1px solid',
                  margin: '0px',
                  width: 38,
                  height: 38,
                }}
                onClick={() => handleDeleteIngredient(index)}
                tabIndex='-1' // Prevents button from being accessed using tab
              >
                <DeleteOutline />
              </IconButton>
            </div>
          ))}
          <Button
            variant='contained'
            color='primary'
            startIcon={<Add />}
            style={{ marginTop: '10px' }}
            onClick={handleAddIngredient}
          >
            Add Ingredient
          </Button>
        </div>
        <div style={{ width: '100%', padding: '10px' }}>
          <Divider style={{ margin: '10px 0' }} />
        </div>
        <div style={{ display: 'flex', width: '100%', margin: '8px' }}>
          <div style={{ width: '50%', marginRight: '8px' }}>
            <Typography style={{ fontWeight: 'bold' }}>Food Type</Typography>
            <TextField
              name='foodType'
              variant='outlined'
              placeholder='pastry, sandwich, dumpling'
              value={postData.foodType}
              onChange={(e) =>
                setPostData({ ...postData, foodType: e.target.value })
              }
              style={{ width: '100%', margin: '0px' }}
            />
          </div>
          <div style={{ width: '50%', marginLeft: '8px' }}>
            <Typography style={{ fontWeight: 'bold' }}>Cuisine</Typography>
            <TextField
              name='cuisine'
              variant='outlined'
              placeholder='Mexican, Italian, Indian'
              value={postData.cuisine}
              onChange={(e) =>
                setPostData({ ...postData, cuisine: e.target.value })
              }
              style={{ width: '100%', margin: '0px' }}
            />
          </div>
        </div>
        {/* <CKEditor
          editor={ClassicEditor}
          name="message"
          variant="outlined"
          label="Message"
          data={text}
          onChange={(event, editor) => {
            const data = editor.getData();
            setText(data);
            setPostData({ ...postData, message: text });
          }}
        /> */}

        <div style={{ width: '100%', padding: '10px' }}>
          <Divider style={{ margin: '10px 0' }} />
        </div>
        <div style={{ width: '100%', margin: '8px' }}>
          <Typography style={{ fontWeight: 'bold', marginBottom: '20px' }}>
            Directions (Required)
          </Typography>
          <Typography style={{ fontSize: '16px', marginBottom: '20px' }}>
            Explain how to make your recipe, including oven temperatures, baking
            or cooking times, and pan sizes, etc. All directions must be filled.
          </Typography>
          {postData.directions.map((direction, index) => (
            <div>
              <Typography variant='body2' style={{ fontWeight: 'bold' }}>
                Step {index + 1}
              </Typography>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px',
                }}
              >
                <TextField
                  key={index}
                  error={!!directionErrors[direction]}
                  helperText={
                    !!directionErrors[direction] && directionErrorText
                  }
                  multiline
                  minRows={3}
                  name='directions'
                  variant='outlined'
                  placeholder={
                    index < 3 ? exampleDirections[index] : exampleDirections[3]
                  }
                  fullWidth
                  value={direction}
                  onChange={(e) => handleDirectionsChange(e, index)}
                  style={{ margin: '0px', marginRight: '10px' }}
                />
                <IconButton
                  style={{
                    border: '1px solid',
                    margin: '0px',
                    width: 38,
                    height: 38,
                  }}
                  onClick={() => handleDeleteDirection(index)}
                  tabIndex='-1' // Prevents button from being accessed using tab
                >
                  <DeleteOutline />
                </IconButton>
              </div>
            </div>
          ))}
          <Button
            variant='contained'
            color='primary'
            startIcon={<Add />}
            style={{ marginTop: '10px' }}
            onClick={handleAddDirection}
          >
            Add Direction
          </Button>
        </div>
        <div style={{ width: '100%', padding: '10px' }}>
          <Divider style={{ margin: '10px 0' }} />
        </div>
        <div style={{ width: '100%', margin: '8px' }}>
          <Typography style={{ fontWeight: 'bold' }}>
            Time Needed (Required)
          </Typography>
          <TextField
            name='timeCost'
            error={timeError}
            helperText={timeError && timeErrorText}
            variant='outlined'
            placeholder='30 min, 2 days, 4 hours'
            fullWidth
            value={postData.timeCost}
            onChange={(e) =>
              setPostData({ ...postData, timeCost: e.target.value })
            }
            style={{ margin: '0px', marginBottom: '5px' }}
          />
        </div>

        <DialogTitle id='dietary-pref' align='left'>
          Add Dietary Preferences
        </DialogTitle>
        <Select
          onChange={(e) => {
            handleSelect(e);
          }}
          isMulti
          label='Dietary Preferences'
          options={options}
          className='basic_multi_select'
          classNamePrefix='select'
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: state.isFocused ? 'grey' : 'red',
            }),
          }}
        />

        <div className='single-line' style={{ width: '100%', padding: '10px' }}>
          <Typography style={{ fontWeight: 'bold' }}>Tag Users</Typography>
          <MentionsInput
            value={value}
            onChange={onChange}
            trigger='@'
            placeholder={"Mention people using '@', followed by 2 spaces"}
            a11ySuggestionsListLabel={'Suggested mentions'}
            style={defaultStyle}
          >
            <Mention style={defaultMentionStyle} data={fetchUsers} />
          </MentionsInput>
        </div>

        <div className={classes.fileInput}>
          <Typography style={{ fontWeight: 'bold' }}>Upload Photo</Typography>
          <FileBase
            type='file'
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          />
        </div>
        <div className={classes.fileInput}>
          <Typography style={{ fontWeight: 'bold' }}>
            Upload Video (must be less than 7MB, .mp4 only)
          </Typography>
          <FileBase
            type='file'
            multiple={false}
            onDone={({ base64 }) => setPostData({ ...postData, video: base64 })}
          />
          {postData.video && (
            <video
              className='VideoInput_video'
              width='100%'
              height={300}
              controls
              src={postData.video}
            />
          )}
        </div>

        {/* <div className={classes.fileInput}>
          <p> Upload Video</p>
          <div className="VideoInput">
            <input
              ref={inputRef}
              className="VideoInput_input"
              type="file"
              onChange={handleFileChange}
              accept=".mov,.mp4"
            />
            {postData.video && (
              <video
                className="VideoInput_video"
                width="100%"
                height={300}
                controls
                src={postData.video}
              />
            )}
            <div className="VideoInput_footer">{postData.video || "Nothing selectd"}</div>
          </div>
        </div> */}

        <Button
          className={classes.buttonSubmit}
          variant='contained'
          color='primary'
          type='submit'
          fullWidth
          onClick={openPopup}
          disabled={
            postData.title == '' ||
            listHasEmptySlot(postData.ingredients) ||
            listHasEmptySlot(postData.directions) ||
            postData.timeCost == ''
          }
          style={{ marginTop: '20px' }}
        >
          Submit
        </Button>
        <Button variant='contained' color='secondary' onClick={clear} fullWidth>
          Clear
        </Button>
      </form>
      <div className={classes.popup} id='popup'>
        <h2>Thank You!</h2>
        <p>Success!</p>
        <Button onClick={closePopup}>OK</Button>
      </div>
    </Paper>
  );
};

export default Form;
