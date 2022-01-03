import React from 'react'
import {Link} from 'react-router-dom'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    return (
        <div>
        I am from other PGDATABASE
        <Link to='/'>GO back to home</Link>
        </div>
    );
};