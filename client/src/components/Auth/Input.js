import React from 'react'
import { TextField, Grid, InputAdornment, IconButton } from '@material-ui/core'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

const Input = ({ half, name, label, handleChange, required, autoFocus, type, handleShowPassword, placeholder, defaultValue, value, minRows, multiline}) => (
    <Grid item xs={12} sm={half ? 6:12}>
        <TextField 
            name = {name}
            onChange = {handleChange}
            variant="outlined"
            required = {required}
            fullWidth
            label={label}
            autoFocus={autoFocus}
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            value={value}
            minRows={minRows}
            multiline={multiline}
            InputProps={ name==='password' && {
                endAdornment : (
                    <InputAdornment position="end">
                        <IconButton onClick={handleShowPassword}>
                            {type === "password" ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                ),
            }} 
        />
    </Grid>
);

export default Input;