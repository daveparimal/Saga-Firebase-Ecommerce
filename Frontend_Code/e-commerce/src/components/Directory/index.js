import React from 'react';
import './styles.scss';

import shopMens from '../../assets/shopMens.jpg';
import shopWomens from '../../assets/shopWomens.jpg';

const Directory = props => {
    return (
        <div className="directory">
            <div className="wrap">
            <div className="item"
                style={{
                backgroundImage: `url(${shopWomens})`
            }}>
                <a>Shop Womens</a>
            </div>

            <div className="item" 
                style={{
                backgroundImage: `url(${shopMens})`
            }}>
                <a>Shop Mens</a>
            </div>
            </div>
        </div>

    )
}

export default Directory;
