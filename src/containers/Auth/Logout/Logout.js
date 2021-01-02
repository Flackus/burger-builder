import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';

const logout = (props) => {
    useEffect(() => {
        props.onLogout();
    }, []);

    return <Redirect to="/" />;
}

const mapDispatchToDrops = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout())
    };
}

export default connect(null, mapDispatchToDrops)(logout);
