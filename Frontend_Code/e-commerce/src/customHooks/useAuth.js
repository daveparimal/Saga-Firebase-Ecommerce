// Hooks name should always start with use

// useSelector - function to allow to map state from redux store
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const mapState = ({ user }) => ({
    currentUser: user.currentUser
})

// here props is used only to access the history object of react router DOM
// HOC is wrapped with withRouter and HOC calls this custom hooks
// so the props of HOC has access to history and that history is passed to this custom hook component.

const useAuth = props => {
    const { currentUser } = useSelector(mapState);

    useEffect(() => {
        if(!currentUser) {
            props.history.push('/login');
        }
    }, [currentUser])

    return currentUser;
}

export default useAuth;