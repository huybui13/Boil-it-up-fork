import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
	paper: {
		padding: theme.spacing(4),
		borderRadius: "15px",
	},
	title: {
		marginBottom: "20px",
	},
	avatar: {
		border: "solid",
		borderWidth: "1px",
		width: 30,
		height: 30,
		marginRight: "8px",
	}
}));