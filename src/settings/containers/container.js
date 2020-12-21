/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import getPages from '../pages';
import Logo from '../assets/logo.svg';

/**
 * WordPress dependencies
 */
const { Component, Fragment } = wp.element;

const { __ } = wp.i18n;

const $ = window.jQuery;

export default class Container extends Component {
    constructor( props ) {
        super( props );

        // get variable.
        const $_GET = [];
        window.location.href.replace( /[?&]+([^=&]+)=([^&]*)/gi, ( a, name, value ) => {
            $_GET[ name ] = value;
        } );

        const pages = getPages();

        // Set the default states
        this.state = {
            pages,
            activePage: $_GET.sub_page ? $_GET.sub_page : Object.keys( pages )[ 0 ],
        };

        this.updateAdminPageActiveLink = this.updateAdminPageActiveLink.bind( this );
    }

    componentDidMount() {
        this.updateAdminPageActiveLink();
    }

    updateAdminPageActiveLink() {
        const {
            activePage,
        } = this.state;

        // disable active link.
        $( '.toplevel_page_ghostkit .current' ).removeClass( 'current' );

        // find new active link.
        let $link = $( `.toplevel_page_ghostkit [href="admin.php?page=ghostkit&sub_page=${ activePage }"]` );

        if ( ! $link.length ) {
            $link = $( '.toplevel_page_ghostkit [href="admin.php?page=ghostkit"]' );
        }

        $link.parent().addClass( 'current' );

        // change address bar link
        if ( $link.length ) {
            window.history.pushState( document.title, document.title, $link.prop( 'href' ) );
        }
    }

    render() {
        const {
            pages,
            activePage,
        } = this.state;

        const resultTabs = [];
        let resultContent = '';

        Object.keys( pages ).forEach( ( k ) => {
            resultTabs.push(
                <li key={ k }>
                    { /* eslint-disable-next-line react/button-has-type */ }
                    <button
                        className={ classnames( 'ghostkit-admin-tabs-button', activePage === k ? 'ghostkit-admin-tabs-button-active' : '' ) }
                        onClick={ () => {
                            this.setState( {
                                activePage: k,
                            }, () => {
                                this.updateAdminPageActiveLink();
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
                <Fragment>
                    <h2>{ pages[ activePage ].label }</h2>
                    <NewBlock
                        data={ this.props.data }
                        settings={ this.state.settings }
                        updateSettings={ this.updateSettings }
                    />
                </Fragment>
            );
        }

        return (
            <Fragment>
                <div className="ghostkit-admin-head">
                    <div className="ghostkit-admin-head-wrap">
                        { /* eslint-disable-next-line jsx-a11y/control-has-associated-label */ }
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
