import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(2),
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  fileInput: {
    width: '97%',
    margin: '10px 0',
  },
  buttonSubmit: {
    marginBottom: 10,
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
    background: '#fff',
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
  },
  title: {
    margin: theme.spacing(1),
  }
}));