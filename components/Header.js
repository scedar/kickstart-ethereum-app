import React from 'react';
import { Menu } from 'semantic-ui-react';

import { Link } from '../routes';

export default () => {
    return (
        <Menu style={{ marginTop: '30px', fontSize: '130%' }}>
            <Link route="/">
                <a className="item">
                    CrowdCowin (CCWN)
                </a>
            </Link>
            <Menu.Menu 
                position="right"
            >
                <Link route="/">
                    <a className="item">
                        Campaigns
                    </a>
                </Link>
                <Link route="/campaigns/new">
                <a className="item" style={{ 
                    fontSize: '170%', margin: '0', padding: '15px', 
                    paddingLeft: '25px', paddingRight: '25px' }}
                    >+</a>
                </Link>
            </Menu.Menu>
        </Menu>
    )
}