import React from 'react';
import classes from './Button.module.css'

interface ButtonProps {
    label: string,
    disabled?: boolean
    buttonHandler?: (() => void) | ((e: React.MouseEvent<HTMLElement>)=> Promise<void>) | ((e: React.MouseEvent<HTMLElement>)=> void),
    style?: object
}

const Button = ({ label, disabled = false, buttonHandler, style }: ButtonProps) => {
    return (
        <button className={classes.button} onClick={buttonHandler} style={style} disabled={disabled}>{label}</button>
    );
};

export default Button;