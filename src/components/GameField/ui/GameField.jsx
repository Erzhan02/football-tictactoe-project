import classes from './GameField.module.scss';

const GameField = () => {
	return (
		<div className={classes.wrapper}>
			<div className={classes.container}>
				<div className={classes.empty}></div>
				<div className={classes.box}></div>
				<div className={classes.box}></div>
				<div className={classes.box}></div>
				<div className={classes.box}></div>
				<div className={classes.box}></div>
				<div className={classes.box}></div>
				<div className={classes.box}></div>
				<div className={classes.box}></div>
				<div className={classes.box}></div>
				<div className={classes.box}></div>
				<div className={classes.box}></div>
				<div className={classes.box}></div>
				<div className={classes.box}></div>
				<div className={classes.box}></div>
				<div className={classes.box}></div>
			</div>
		</div>
	);
};

export default GameField;
