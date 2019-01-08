import { Component } from 'react';

import './info.scss';

export default class Info extends Component {
    render() {
        return (
            <div className="ghostkit-settings-info">
                { this.props.children }
            </div>
        );
    }
}
