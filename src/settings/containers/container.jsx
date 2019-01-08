// External Dependencies.
import classnames from 'classnames/dedupe';
import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

// Internal Dependencies.
import './container.scss';
import pages from '../pages/index.jsx';
import Logo from '../assets/logo.svg';

const { __ } = wp.i18n;

export default class Container extends Component {
    constructor( props ) {
        super( props );

        // Set the default states
        this.state = {
            activePage: Object.keys( pages )[ 0 ],
            blocks: {},
        };
    }

    render() {
        const {
            activePage,
        } = this.state;

        const resultTabs = [];
        let resultContent = '';

        Object.keys( pages ).forEach( ( k ) => {
            resultTabs.push(
                <li key={ k }>
                    <button
                        className={ classnames( 'ghostkit-admin-tabs-button', activePage ? 'ghostkit-admin-tabs-button-active' : '' ) }
                        onClick={ () => {
                            this.setState( {
                                activePage: k,
                            } );
                        } }
                    >
                        { pages[ k ].label }
                    </button>
                </li>
            );
        } );

        if ( activePage && pages[ activePage ] ) {
            const NewBlock = pages[ activePage ].block;
            resultContent = (
                <NewBlock
                    data={ this.props.data }
                    settings={ this.state.settings }
                    updateSettings={ this.updateSettings }
                />
            );
        }

        return (
            <Fragment>
                <div className="ghostkit-admin-head">
                    <div className="ghostkit-admin-head-wrap">
                        <a href="https://ghostkit.io/"><Logo /></a>
                        <h1>{ __( 'Ghost Kit' ) }</h1>
                        <ul className="ghostkit-admin-tabs">
                            { resultTabs }
                        </ul>
                    </div>
                </div>
                <div className="ghostkit-admin-content">
                    { resultContent }
                </div>
            </Fragment>
        );
    }
}

Container.propTypes = {
    data: PropTypes.object,
};
