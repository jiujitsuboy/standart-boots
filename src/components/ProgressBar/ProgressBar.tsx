import classes from './ProgressBar.module.css'

interface ProgressBarProps {
    porcentage: number
}

const ProgressBar = ({ porcentage }: ProgressBarProps) => {
    return (
        <div className={classes.bar_container}><span className={classes.bar_progress_value}>{porcentage.toFixed(0)}%</span>
            <div className={classes.bar_progress} style={{ width: porcentage >= 0 && porcentage <= 100 ? `${porcentage.toFixed(2)}%` : "0%" }}></div>
        </div>
    );
};

export default ProgressBar;