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
                <Link to="/manage" style={{marginRight: 20}}>
                    <button>
                        Manage Data
                    </button>
                </Link>
                <Link to="/data2" style={{marginRight: 20}}>
                    <button>
                        Data 2
                    </button>
                </Link>
                <Link to="/data3" >
                    <button>
                        Data 3
                    </button>
                </Link>
            </div>
          
        );
    }
}
