import React, {useState} from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container, TextField, Checkbox, FormControlLabel, Link as MaterialsLink} from '@material-ui/core';
import { GoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import useStyles from './styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from './Input';
import Icon from './icon';
import { signin, signup } from '../../actions/auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '', username: '', emailUsername: '' };

export const Auth = () => {
    const classes = useStyles();
    const [isSignup, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFromData] = useState(initialState);
    const [tosAccepted, setTosAccepted] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault(); // Don't want default page reload on submit
        // console.log(formData);

        if (isSignup) {
            dispatch(signup(formData, navigate))
        } else {
            dispatch(signin(formData, navigate))
        }
    };

    const handleChange = (e) => {
        setFromData({ ...formData, [e.target.name]: e.target.value })
    };

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
    const switchMode = () => {
        setIsSignUp((prevIsSignUp) => !prevIsSignUp);
        setShowPassword(false);
    }
    const acceptTOS = () => {
        setTosAccepted((acceptTOS) => !acceptTOS);
    }
{/* const googleSuccess = (res) => {
        console.log(res);
    }
    const googleFailure = () => {
        console.log("Google Sign in was unsuccessful. Try again")
    }
*/}

    return (
    <Container component = "main" maxWidth="xs">
        <Paper className={classes.paper} elevation={3}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography variant='h5' className={classes.text}>{isSignup? 'Sign up': 'Sign in'}</Typography>
            <form className='classes.form' onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {
                        isSignup && (
                            <>
                               <Input name = "firstName" label = "First name" handleChange={handleChange} autoFocus half />
                                <Input name = "lastName" label = "Last name" handleChange={handleChange} half />
                            </>
                        )
                    }
                    {!isSignup && <Input name ="emailUsername" label="Email or Username" handleChange={handleChange} />}
                    {isSignup && <Input name="email" label="Email" handleChange={handleChange} type="email" />}
                    {isSignup && <Input name="username" label = "Username" handleChange={handleChange} />}
                    <Input name="password" label = "Password" handleChange={handleChange} type ={showPassword ? "text" : "password"} handleShowPassword = {handleShowPassword} />
                    {isSignup && <Input name = "confirmPassword" label = "Repeat Password" handleChange={handleChange} type="password" />}

                    <FormControlLabel
                        control={isSignup ? <Checkbox/> : <div></div>} 
                        label={
                            isSignup ?
                            <div>
                                <span>Do you agree to our  </span>
                                <Typography component = {Link} 
                                to={'/terms-of-service'}>
                                    Terms of Service?
                                </Typography>
                            </div>
                            :
                            <div></div>
                        }
                        checked={tosAccepted}
                        onChange={acceptTOS}
                            />
                        
                </Grid>
                
                {/*<GoogleLogin 
                    clientId="11227999998-fi43a2sn85ds8ga9mc6t25uat9l8r2mv.apps.googleusercontent.com"
                    render={(renderProps) => (
                        <Button 
                            className = {classes.googleButton} 
                            color="primary" 
                            fullWidth 
                            onClick={renderProps.onClick} 
                            disabled={renderProps.disabled} 
                            startIcon = {<Icon />} 
                            variant="contained">
                                Google Sign In
                            </Button>
                    
                    )}
                    onSuccess={googleSuccess}
                    onFailure={googleFailure}
                    cookiePolicy="single_host_origin"
                    />*/}
                
                {!isSignup && <Button fullWidth component={Link} to="/forgot-password" variant="contained" color="primary" className={classes.forgot}>Forgot Password?</Button>}

                {
                    !isSignup &&
                    <Button type="submit" fullWidth variant="contained" color = "primary" className={classes.submit}>
                        Sign in
                    </Button>
                }
                {
                    isSignup &&
                    <Button type="submit" fullWidth disabled={!tosAccepted} variant="contained" color = "primary" className={classes.submit}>
                        Sign up
                    </Button>
                }

                <Grid container justify="flex-end">
                    <Grid item>
                        <Button onClick={switchMode}>
                            { isSignup ? "Already have an Account? Sign In" : "Don't have an account? Sign up" }
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    </Container>
  )
}
