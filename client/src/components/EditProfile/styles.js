import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(2),
    },
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    fileInput: {
        width: '97%',
        margin: '10px 0',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    googleButton: {
        marginBottom: theme.spacing(2),
    },
    popup: {
        width: '400px',
        background: '#fff',
        borderRadius: '6px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        translate: ('-50% -50%'),
        scale: 0.1,
        textAlign: 'center',
        //padding: '0 30px 30px',
        color: '#333',
        visibility: 'hidden',
    },
    closePopup: {
        width: '0px',
        height: '0px',
        scale: 0.1,
        visibility: 'hidden',
    },
    openPopup: {
        width: '400px',
        background: '#eee',
        borderRadius: '6px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        translate: ('-50% -50%'),
        scale: 1,
        textAlign: 'center',
        // padding: '0 30px 30px',
        color: '#333',
        visibility: 'visible',
    }
}));