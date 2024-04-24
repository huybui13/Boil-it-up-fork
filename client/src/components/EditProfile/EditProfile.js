import React, {useState, useEffect} from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import Input from '../Auth/Input';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import FileBase from 'react-file-base64';

import useStyles from './styles';

import { editprofile, deleteprofile } from '../../actions/auth';



const initialState = { firstName: '', lastName: '', email: '', id: '', introduction: '', selectedFile: '', username: '' };

const EditProfile = () => {
    const classes = useStyles();
    const [formData, setFromData] = useState(initialState);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    
    const initialStateStr = JSON.parse(localStorage.getItem('profile'));
    const existingID = initialStateStr.result._id;
    const nameArr = initialStateStr.result.name.split(" ");
    initialState.firstName = nameArr[0];
    initialState.lastName = nameArr[1];
    initialState.email = initialStateStr.result.email;
    initialState.introduction = initialStateStr.result.introduction;
    initialState.selectedFile = initialStateStr.result.selectedFile;
    initialState.username = initialStateStr.result.username;
    // console.log(initialState.selectedFile);
    // console.log(existingID);
    // console.log(nameArr[0]);
    // console.log(nameArr[1]);
    //  console.log('INITIAL STATE');
    //  console.log(initialState.result.name);

    const handleSubmit = (e) => {
        e.preventDefault();
        formData.id = existingID;
        // console.log(formData);
        openPopup();
        dispatch(editprofile(formData, navigate));
    };

    const handleChange = (e) => {
        setFromData({ ...formData, [e.target.name]: e.target.value })
    };

    const handleDeleteOpen = () => {
        setOpen(true);
    };

    const handleDeleteClose = () => {
        setOpen(false);
    };

    const handleDelete = (e) => {
        e.preventDefault();
        formData.id = existingID;
        dispatch(deleteprofile(formData, navigate));
        handleDeleteClose();
    };

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('profile')))
    }, [location]);

    const openPopup = () => {
        let popup = document.getElementById("popup");
        popup.className = classes.openPopup;
    };

    const closePopup = () => {
        let popup = document.getElementById("popup");
        popup.className = classes.closePopup;
    };

    return (
        <div>
            <Container component="main" maxWidth="sm">
                <Paper className={classes.paper} elevation={3}>
                    <Avatar className={classes.avatar}>
                        <EditIcon />
                    </Avatar>
                    <Typography variant='h5'>Edit Profile</Typography>
                    <form className='classes.form' onSubmit={handleSubmit}>
                        <Avatar alt='pfp' src={initialState.selectedFile}>
                            {nameArr[0][0]}
                        </Avatar>
                        <div className={classes.fileInput}>
                            <FileBase
                                type='file'
                                multiple={false}
                                onDone={({ base64 }) => setFromData({ ...formData, selectedFile: base64 })}
                            />
                        </div>
                        <Grid container spacing={2}>
                            <Input name='firstName' label='First name' required={true} defaultValue={nameArr[0]} placeholder={nameArr[0]} handleChange={handleChange} half />
                            <Input name='lastName' label='Last name' required={true} defaultValue={nameArr[1]} placeholder={nameArr[1]} handleChange={handleChange} half/>
                            <Input name='email' label='Email address' required={true} defaultValue={initialStateStr.result.email} placeholder={initialStateStr.result.email} handleChange={handleChange} />
                            <Input name='username' label='Username' required={true} defaultValue={initialStateStr.result.username} placeholder={initialStateStr.result.username} handleChange={handleChange} />
                        </Grid>

                        <Grid container spacing={2}>
                            <Input name='introduction' required={false} multiline={true} minRows='8' label='Introduction' defaultValue={initialState.introduction} handleChange={handleChange} ></Input>
                        </Grid>

                        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                            Save Changes
                        </Button>
                        <div>
                            <Button onClick={handleDeleteOpen} fullWidth variant='contained' color='secondary'>
                                Delete account
                            </Button>
                            <Dialog open={open} onClose={handleDeleteClose} aria-labelledby='alert-dialog-title' aria-describedby="alert-dialog-description">
                                <DialogTitle id="alert-dialog-title">
                                    {"Are you sure you want to delete your account?"}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        Deleting your account will be permanent. You will not be able to recover your account after doing this.
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleDeleteClose}>Cancel</Button>
                                    <Button onClick={handleDelete} autoFocus>
                                        Delete
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </form>
                    <div className={classes.popup} id="popup">
                        <h2>Changes saved!</h2>
                        <p>Your profile has successfully been updated!</p>
                        <Button onClick={closePopup}>OK</Button>
                    </div>
                </Paper>
            </Container>
        </div>
    );
};

export default EditProfile;