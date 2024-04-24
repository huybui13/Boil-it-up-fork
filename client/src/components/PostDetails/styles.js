import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  media: {
    borderRadius: '20px',
    objectFit: 'cover',
    width: '100%',
    maxHeight: '600px',

  },
  card: {
    // display: 'flex',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
      flexDirection: 'column',
    },
  },
  section: {
    borderRadius: '20px',
    margin: '10px',
    flex: 1,
  },
  imageSection: {
    marginLeft: '20px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
  recommendedPosts: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  loadingPaper: {
    display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', borderRadius: '15px', height: '39vh',
  },
  reportSaveSection: {
    marginLeft: '20px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  report: {
    marginBottom: '20px',
  },
  saveTitle: {
    minWidth: '180px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '-20px',
  },
  saveCloseIcon: {
    position: 'absolute',
    left: '78%',
    top: '3%',
  },
  reviewContainer: {
    padding: "15px",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(6),
  },
  review: {
    display: 'flex'
  },
  submitReview: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
  },
  reviewPaper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: "10px",
  },
  avatar: {
    border: "solid",
    borderWidth: "1px",
    width: 30,
    height: 30,
    marginRight: "8px",
  },
  alert: {
    position: "absolute",
  },
  
  timeCost: {
    color: "990000",
  },

  ingredients: {
    position: "absolute",
    color: "999900"
  },

  foodType: {
    position: "absolute",
    color: "009900"
  },

  cuisine: {
    position: "absolute",
    color: "000099"
  }
}));