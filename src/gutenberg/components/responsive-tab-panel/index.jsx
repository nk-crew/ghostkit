/**
 * Styles
 */
import './editor.scss';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const { __, sprintf } = wp.i18n;

const {
    Tooltip,
    TabPanel,
} = wp.components;

/**
 * Internal dependencies
 */
import ActiveIndicator from '../active-indicator';
import getIcon from '../../utils/get-icon';

const { ghostkitVariables } = window;

/**
 * Component Class
 */
export default class ResponsiveTabPanel extends Component {
    render() {
        const {
            filledTabs = {},
            activeClass = 'is-active',
            instanceId,
            orientation = 'horizontal',
        } = this.props;

        if ( ! ghostkitVariables || ! ghostkitVariables.media_sizes || ! Object.keys( ghostkitVariables.media_sizes ).length ) {
            return __( 'No media sizes found.', '@@text_domain' );
        }

        const tabs = [];
        const icons = [
            getIcon( 'tabs-mobile' ),
            getIcon( 'tabs-tablet' ),
            getIcon( 'tabs-laptop' ),
            getIcon( 'tabs-desktop' ),
            getIcon( 'tabs-tv' ),
        ];

        [
            ...Object.keys( ghostkitVariables.media_sizes ),
            'all',
        ].forEach( ( mediaName, i ) => {
            tabs.unshift( {
                name: mediaName,
                title: (
                    <Tooltip
                        text={
                            'all' === mediaName ?
                                __( 'All devices', '@@text_domain' ) :
                                sprintf( __( 'Devices with screen width <= %s', '@@text_domain' ), `${ ghostkitVariables.media_sizes[ mediaName ] }px` )
                        }
                    >
                        <span className="ghostkit-control-tabs-icon">
                            { icons[ i ] }
                            { filledTabs && filledTabs[ mediaName ] ? (
                                <ActiveIndicator />
                            ) : '' }
                        </span>
                    </Tooltip>
                ),
                className: 'ghostkit-control-tabs-tab',
            } );
        } );

        return (
            <TabPanel
                className="ghostkit-control-tabs"
                tabs={ tabs }
                activeClass={ activeClass }
                instanceId={ instanceId }
                orientation={ orientation }
            >
                { this.props.children }
            </TabPanel>
        );
    }
}
