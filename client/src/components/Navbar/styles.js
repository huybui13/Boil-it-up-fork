import {makeStyles} from '@material-ui/core/styles';
import {deepPurple} from '@material-ui/core/colors';

export default makeStyles((theme) => ({
    appBar: {
        borderRadius: 15,
        margin: '30px 0',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 50px',
    },
    heading: {
        color: 'rgba(0,183,255, 1)',
        textDecoration: 'none',
    },
    image: {
        marginLeft: '15px',
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '400px',
    },
    profile: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '400px',
    },
    userName: {
        display: 'flex',
        alignItems: 'center',
        textTransform: 'none',
        marginLeft: '5px',
    },
    logout: {
        marginLeft: '20px',
    },
    brandContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    purple: {
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
    },
    popupPost: {
        width: '400px',
        background: '#fff',
        borderRadius: '6px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        translate: ('-50% -50%'),
        scale: 0.1,
        textAlign: 'center',
        padding: '0 30px 30px',
        color: '#333',
        visibility: 'hidden',
      },
    closePopupPost: {
        width: '0px',
        height: '0px',
        scale: 0.1,
        visibility: 'hidden',
      },
    openPopupPost: {
        width: '400px',
        background: '#fff',
        borderRadius: '6px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        translate: ('-50% -50%'),
        scale: 1,
        textAlign: 'center',
        padding: '0 30px 30px',
        color: '#333', 
        visibility: 'visible',
      },
}));