import React, { Component } from 'react';
import './styles.scss';
import FormInput from './../forms/FormInput';
import Button from './../forms/Button';

import { auth, handleUserProfile } from "./../../firebase/utils";

const initialState = {
    displayName:'',
    email:'',
    password:'',
    confirmPassword:'',
    errors:[]
}

class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        }

        this.handleChange = this.handleChange.bind(this);
    }


    handleChange(e) {
        const { name, value} = e.target;

        this.setState({
            [name]: value
        })
    }

    handlFormSubmit = async event => {
        event.preventDefault();
        const {displayName, email, password, confirmPassword} = this.state;

        // validate if password matches 
        if(password !== confirmPassword) {
            const err = ['Passwords Dont\'t match'];
            this.setState({
                errors:err
            });
            return;
        }

        // Create a user name using auth on firestore with username and passowrd
        // The returned user profile is used to login and route to home page (handle from router)\
        // Once account is created the user is signed in automatically
        // We have added a listener in App.js on auth, so the app automatically understands that user has signed in

        try{
            const { user } = await auth.createUserWithEmailAndPassword(email, password);
            await handleUserProfile (user, {displayName});

            this.setState({
                ...initialState
            })

        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const { displayName, email, password, confirmPassword, errors } = this.state;
        return(
            <div className="signup">
                <div className="wrap">
                    <h2>
                        Signup
                    </h2>
                    {errors.length > 0 && (
                        <ul>
                            {
                            errors.map((err, index) => {
                                return (
                                    <li key={index}>
                                        {err}
                                    </li>
                                )
                            })
                            }
                        </ul>
                        
                    )}
                    <div className="formWrap">
                        <form onSubmit={this.handlFormSubmit}>
                        <FormInput
                        type="text"
                        name="displayName"
                        value={displayName}
                        placeholder = "Full name"
                        onChange={this.handleChange}
                        />

                        <FormInput
                        type="email"
                        name="email"
                        value={email}
                        placeholder = "Email"
                        onChange={this.handleChange}
                        />

                        <FormInput
                        type="password"
                        name="password"
                        value={password}
                        placeholder = "Password"
                        onChange={this.handleChange}
                        />

                        <FormInput
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        placeholder = "Confirm Password"
                        onChange={this.handleChange}
                        />

                        <Button type="submit">
                            Register
                        </Button>
                    </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Signup;