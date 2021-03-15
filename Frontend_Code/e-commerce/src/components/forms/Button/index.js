import React from 'react';
import './styles.scss';

// children props to pass custom html
const Buttons = ({children, ...otherProps }) => {
    return (
        <button className="btn" {...otherProps}>
            {children}
        </button>
    )

}

export default Buttons;