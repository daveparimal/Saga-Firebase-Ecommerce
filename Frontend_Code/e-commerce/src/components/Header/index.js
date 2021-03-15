import React from 'react';
import './styles.scss';
import { Link } from 'react-router-dom';
import { auth } from './../../firebase/utils';

import logo from './../../assets/logo.png';

const Header = props => {
    const { currentUser } = props;

    return (
        <header className="header">
            <div className="wrap">
                <div className="logo">
                    <Link to="/">
                        <img src={logo} alt="Ecommerce Logo" />
                    </Link>
                </div>
                
                <div className="callToActions">

                    {currentUser && (
                        <span onClick={() => auth.signOut()}>Logout</span>
                    )}
                    {!currentUser && (
                        <ul>
                        <li>
                            <Link to="/registration">
                                Register
                            </Link>
                        </li>
                        <li>
                            <Link to="/login">
                                Login
                            </Link>
                        </li>
                    </ul>
                    )}
                </div>
            </div>

        </header>
    )
}

Header.defaultProps = {
    currentUser : null
}

export default Header;