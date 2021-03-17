import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import './styles.scss';
import FormInput from './../forms/FormInput';
import Button from './../forms/Button';
import AuthWrapper from './../AuthWrapper';

import { auth, handleUserProfile } from "./../../firebase/utils";

const Signup = props => {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState('');

    const resetForm = () => {
        setDisplayName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('')
        setErrors([]);
    }

    const handlFormSubmit = async event => {
        event.preventDefault();

        // validate if password matches 
        if (password !== confirmPassword) {
            const err = ['Passwords Dont\'t match'];
            setErrors(err);
            return;
        }

        // Create a user name using auth on firestore with username and passowrd
        // The returned user profile is used to login and route to home page (handle from router)\
        // Once account is created the user is signed in automatically
        // We have added a listener in App.js on auth, so the app automatically understands that user has signed in

        try {
            const { user } = await auth.createUserWithEmailAndPassword(email, password);
            await handleUserProfile(user, { displayName });
            resetForm();
            props.history.push('/');

        } catch (err) {
            console.log(err);
        }
    }

    const configAuthWrapper = {
        headline: "Register"
    }
    return (
        <AuthWrapper {...configAuthWrapper}>
            <div className="formWrap">
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
                <form onSubmit={handlFormSubmit}>
                    <FormInput
                        type="text"
                        name="displayName"
                        value={displayName}
                        placeholder="Full name"
                        onChange={e => setDisplayName(e.target.value)}
                    />

                    <FormInput
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Email"
                        onChange={e => setEmail(e.target.value)}
                    />

                    <FormInput
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Password"
                        onChange={e => setPassword(e.target.value)}
                    />

                    <FormInput
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        placeholder="Confirm Password"
                        onChange={e => setConfirmPassword(e.target.value)}
                    />

                    <Button type="submit">
                        Register
                    </Button>
                </form>
            </div>
        </AuthWrapper>
    );
}


export default withRouter(Signup);