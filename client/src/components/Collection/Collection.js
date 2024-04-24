import React, {useEffect, useState} from 'react';
import { useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getCollection, getUser, deleteCollection} from "../../actions/auth"
import {getCollectionPosts} from "../../actions/posts";
import {
	Avatar, Button,
	Dialog, DialogActions, DialogContent, DialogContentText,
	DialogTitle,
	Grid,
	IconButton,
	Link,
	Menu,
	MenuItem,
	Paper,
	Typography
} from "@material-ui/core";
import {Delete, MoreHoriz} from "@material-ui/icons"
import useStyles from "./styles"
import Posts from "../Posts/Posts";

const Collection = () => {
	const {userID, collectionID} = useParams();
	const {user, collection} = useSelector((state) => state.auth);
	const {posts} = useSelector((state) => state.posts);
	const [currentId, setCurrentId] = useState(null);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const open = Boolean(anchorEl);

	const classes= useStyles();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(getCollection(userID, collectionID));
		dispatch(getUser(userID));
		dispatch(getCollectionPosts(userID, collectionID));
	}, [collectionID]);

	if (!user) return null;
	if (!collection) return null;
	if (!posts) return null;

	const handleClick = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleDeleteClick = () => {
		setDialogOpen(true);
	}

	const handleDeleteClose = () => {
		setDialogOpen(false);
	}

	const handleDelete = () => {
		dispatch(deleteCollection(userID, collectionID, navigate));
		handleDeleteClose();
	}

	let deletable = true;

	if (collection[0] === "Bookmarks") {
		deletable = false;
	}

	return (
		<Paper className={classes.paper}>
			<div className={classes.title}>
				<div style={{display: "flex", width: "100%", justifyContent: "space-between"}}>
					<Typography variant="h4">{collection[0]}</Typography>
					{
						deletable &&
						<IconButton
							color="inherit"
							aria-label="more"
							id="more-button"
							aria-controls={open ? 'more-menu' : undefined}
							aria-expanded={open ? 'true' : undefined}
							aria-haspopup="true"
							onClick={handleClick}
						>
							<MoreHoriz/>
						</IconButton>
					}
					<Menu
						id="more-menu"
						MenuListProps={{
							'aria-labelledby': 'more-button',
						}}
						anchorEl={anchorEl}
						getContentAnchorEl={null}
						anchorOrigin={{ vertical: 'bottom' }}
						transformOrigin={{ vertical: 'top', horizontal: 'center' }}
						open={open}
						onClose={handleClose}
					>
						<MenuItem onClick={handleDeleteClick}><Delete/>Delete collection</MenuItem>
					</Menu>
					<Dialog
						open={dialogOpen}
						onClose={handleDeleteClose}
						aria-labelledby="delete-dialog-title"
						aria-describedby="delete-dialog-description"
					>
						<DialogTitle id="delete-dialog-title">
							{"Delete \"" + collection[0] + "\" collection?"}
						</DialogTitle>
						<DialogContent>
							<DialogContentText id="delete-dialog-description">
								Are you sure you want to delete this collection? You will not be able to recover this
								collection after doing so.
							</DialogContentText>
							<DialogActions>
								<Button onClick={handleDeleteClose}>Cancel</Button>
								<Button onClick={handleDelete} autoFocus>
									Delete
								</Button>
							</DialogActions>
						</DialogContent>
					</Dialog>
				</div>
				<Typography variant="h6">
					<Link href={`/profile/${userID}`} color="inherit">
						<div style={{display: "inline-flex", alignItems: "center"}}>
							<Avatar src={user.selectedFile} className={classes.avatar}/>
							{user.username}
						</div>
					</Link>
				</Typography>
			</div>
			<Grid>
				<Grid item lg={12}>
					<Posts setCurrentId={setCurrentId} />
				</Grid>
			</Grid>
		</Paper>
	);
};

export default Collection;
