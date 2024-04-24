import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  ButtonBase,
  Grid
} from "@material-ui/core";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import moment from "moment";
import useStyles from "./styles";
import parse from "html-react-parser";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deletePost } from "../../../actions/posts";
import {Rating} from "@material-ui/lab";

const Post = ({ post, setCurrentId }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));

  const openPost = () => navigate(`/posts/${post._id}`);

  const jsonLocalStorage = JSON.parse(localStorage.getItem('profile'));
  const userID = jsonLocalStorage?.result._id;

  const makeCommaSeparatedList = (list) => {
    var str = ""
    for (var i = 0; i < list.length; i++) {
      if (i == list.length - 1) {
        str += list[i]
      }
      else {
        str += list[i] + ", "
      }
    }
    return str
  };

  return (
    <Card className={classes.card}>
      <ButtonBase className={classes.cardAction} onClick={openPost}>
        <CardMedia
          className={classes.media}
          image={post.selectedFile}
          title={post.title}
        />
        <div className={classes.overlay}>
          <Typography varient="h6">{post.creator}</Typography>
          <Typography varient="body2">
            {moment(post.createdAt).fromNow()}
          </Typography>
        </div>
      </ButtonBase>

      <ButtonBase className={classes.cardAction} onClick={openPost}>
        <Typography className={classes.title} variant="h6" gutterBottom>
          {post.title}
        </Typography>
        <CardContent>
          <Typography>{parse(post.message.replace(/(.{90})..+/, "$1&hellip;"))}</Typography>
        </CardContent>

        <Grid container className={classes.timeCost} columns = {1} >
          {
                <Typography variant="body2" margin={50}>
                  {makeCommaSeparatedList(post.dietaryPrefs)}
                </Typography>
          }
        </Grid>


        {post.reviews.length !== 0 && (
          <div style={{ padding: "16px" }} >
              <Rating defaultValue={post.avgRating} precision={0.1} readOnly/>
              <Typography variant="body2">
                {post.reviews.length} ratings
              </Typography>
          </div>
          )
        }
      </ButtonBase>
      <CardActions className={classes.cardActions}>
        {/* <Button size="small" color="primary" onClick={() => { }}>
          <ThumbUpAltIcon fontSize="small" />
          Like
          {post.likeCount}
        </Button> */}

        { post.creatorId === userID &&
        <Button
          size="small"
          color="primary"
          onClick={() => dispatch(deletePost(post._id))}
        >
          <DeleteIcon fontSize="small" />
          Delete
        </Button>
        }
      </CardActions>
    </Card>
  );
};

export default Post;
