
// HOC to handle - restrict access to routes
// call custom react hook to return the current user object from redux
// if user available then only return the page

import { useAuth } from './../customHooks';
import {  withRouter } from 'react-router-dom';

// check if current user is available through custom hooks
// if not available, routed to login, else the children that is rest of component is loaded
const WithAuth = props => useAuth(props) && props.children;

export default withRouter(WithAuth);