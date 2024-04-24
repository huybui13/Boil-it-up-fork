import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    avatar: {
        width: theme.spacing(20),
        height: theme.spacing(20),
        border: 'solid',
        marginBottom: '5px'
    },
    editProfile: {
        marginTop: '5px',
        width: '170px',
    },
    username: {
        color: '#6d7075',
        marginTop: '-8px',
        marginBottom: '5px'
    },
    follow: {
        marginTop: '10px',
        verticalAlign: 'middle',
    },
    followIcon: {
        verticalAlign: 'text-bottom',
        fontSize: '18px',
    },
    followAvatar: {
        border: 'solid',
        borderWidth: '1px',
    },
    container: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    cardDetails: {
        justifyContent: 'space-between',
        margin: '10px',
    }
}));
