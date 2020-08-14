import React from 'react';
import { Link } from 'react-router-dom';

import './Notfound.css'

class NotFoundPage extends React.Component{
    render(){
        return <div id="notfound">
        <div class="notfound">
            <div class="notfound-404">
                <h1>404</h1>
            </div>
            <h2>Oops! This Page Could Not Be Found</h2>
            <p>Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable</p>
            <Link to="/">Go to Home </Link>
        </div>
        </div>;

    }
}
export default NotFoundPage;