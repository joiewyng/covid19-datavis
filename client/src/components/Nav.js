import React from 'react';
import { Link } from "react-router-dom";

export default class Nav extends React.Component {
    render() {
        return (
            <div className="Nav" style={{margin: 30}}>
                <Link to="/" style={{marginRight: 20}}>
                    <button>
                        Data
                    </button>
                </Link>
                <Link to="/manage">
                    <button>
                        Manage Data
                    </button>
                </Link>
            </div>
          
        );
    }
}
