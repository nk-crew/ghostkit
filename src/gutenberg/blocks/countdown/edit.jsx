/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const {
    moment,
} = window;

const {
    applyFilters,
} = wp.hooks;

const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const {
    PanelBody,
    SelectControl,
    RangeControl,
    DateTimePicker,
    Toolbar,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
    BlockControls,
} = wp.editor;

const {
    compose,
} = wp.compose;

const {
    withSelect,
} = wp.data;

/**
 * Internal dependencies
 */
import ColorPicker from '../../components/color-picker';
import countDownApi from './api';

const TIMEZONELESS_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    constructor( props ) {
        super( props );

        this.parseData = this.parseData.bind( this );
        this.updateDate = this.updateDate.bind( this );
        this.runInterval = this.runInterval.bind( this );

        this.state = {
            date: props.date,
            dateData: props.date ? this.parseData( props.attributes.date, props.attributes.units ) : false,
        };
    }

    componentDidMount() {
        const {
            date,
            units,
        } = this.props.attributes;

        // generate date.
        if ( ! date ) {
            const today = new Date();
            const newDate = new Date();
            newDate.setDate( today.getDate() + 1 );

            this.updateDate( newDate, units );
        } else {
            this.updateDate( date, units );
        }
    }

    parseData( date, units ) {
        const momentData = moment( date );
        const formattedDate = momentData.format( TIMEZONELESS_FORMAT );

        const apiData = countDownApi( momentData.toDate(), moment().toDate(), units, 0 );

        return {
            momentData,
            formattedDate,
            delay: countDownApi.getDelay( units ),
            ...apiData,
        };
    }

    updateDate( date, units ) {
        const {
            setAttributes,
            attributes,
        } = this.props;

        const data = this.parseData( date, units );

        this.setState( {
            dateData: data,
        }, () => {
            this.runInterval();
        } );

        if ( data.formattedDate !== attributes.date ) {
            setAttributes( {
                date: data.formattedDate,
            } );
        }
    }

    runInterval() {
        clearInterval( this.interval );

        const {
            dateData,
        } = this.state;

        if ( ! dateData ) {
            return;
        }

        this.interval = setInterval( () => {
            const {
                date,
                units,
            } = this.props.attributes;

            if ( ! date || ! units || ! units.length ) {
                return;
            }

            const data = this.parseData( date, units );

            this.setState( {
                dateData: data,
            } );
        }, dateData.delay );
    }

    render() {
        const {
            attributes,
            setAttributes,
            isSelectedBlockInRoot,
        } = this.props;

        const {
            dateData,
        } = this.state;

        let { className = '' } = this.props;

        const {
            date,
            units,
            unitsAlign,
            numberFontSize,
            labelFontSize,
            numberColor,
            labelColor,
        } = attributes;

        className = classnames(
            'ghostkit-countdown',
            unitsAlign ? `ghostkit-countdown-units-align-${ unitsAlign }` : '',
            className
        );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
                        <DateTimePicker
                            label={ __( 'End Date' ) }
                            currentDate={ date }
                            onChange={ ( value ) => this.updateDate( value, units ) }
                            is12Hour={ false }
                        />
                        <SelectControl
                            label={ __( 'Display Units' ) }
                            value={ units }
                            onChange={ ( value ) => {
                                setAttributes( { units: value } );
                                this.updateDate( date, value );
                            } }
                            multiple
                            options={ [
                                {
                                    label: __( 'Years' ),
                                    value: 'years',
                                }, {
                                    label: __( 'Months' ),
                                    value: 'months',
                                }, {
                                    label: __( 'Weeks' ),
                                    value: 'weeks',
                                }, {
                                    label: __( 'Days' ),
                                    value: 'days',
                                }, {
                                    label: __( 'Hours' ),
                                    value: 'hours',
                                }, {
                                    label: __( 'Minutes' ),
                                    value: 'minutes',
                                }, {
                                    label: __( 'Seconds' ),
                                    value: 'seconds',
                                },
                            ] }
                        />
                    </PanelBody>
                    <PanelBody>
                        <RangeControl
                            label={ __( 'Font Size' ) }
                            value={ numberFontSize }
                            onChange={ ( value ) => setAttributes( { numberFontSize: value } ) }
                            beforeIcon="editor-textcolor"
                            afterIcon="editor-textcolor"
                        />
                        <RangeControl
                            label={ __( 'Label Font Size' ) }
                            value={ labelFontSize }
                            onChange={ ( value ) => setAttributes( { labelFontSize: value } ) }
                            beforeIcon="editor-textcolor"
                            afterIcon="editor-textcolor"
                        />
                        <ColorPicker
                            label={ __( 'Number Color' ) }
                            value={ numberColor }
                            onChange={ ( val ) => setAttributes( { numberColor: val } ) }
                            alpha={ true }
                        />
                        <ColorPicker
                            label={ __( 'Label Color' ) }
                            value={ labelColor }
                            onChange={ ( val ) => setAttributes( { labelColor: val } ) }
                            alpha={ true }
                        />
                    </PanelBody>
                </InspectorControls>
                <BlockControls>
                    <Toolbar controls={ [
                        {
                            icon: 'align-left',
                            title: __( 'Units Align Left' ),
                            onClick: () => setAttributes( { unitsAlign: 'left' } ),
                            isActive: unitsAlign === 'left',
                        },
                        {
                            icon: 'align-center',
                            title: __( 'Units Align Center' ),
                            onClick: () => setAttributes( { unitsAlign: 'center' } ),
                            isActive: unitsAlign === 'center',
                        },
                        {
                            icon: 'align-right',
                            title: __( 'Units Align Right' ),
                            onClick: () => setAttributes( { unitsAlign: 'right' } ),
                            isActive: unitsAlign === 'right',
                        },
                    ] } />
                </BlockControls>
                <div className={ className }>
                    { units.map( ( unitName ) => {
                        let formattedUnit = false;

                        if ( dateData && typeof dateData[ unitName ] !== 'undefined' ) {
                            const isEnd = dateData.value >= 0;

                            formattedUnit = countDownApi.formatUnit( isEnd ? 0 : dateData[ unitName ], unitName );
                        }

                        return (
                            <div
                                key={ unitName }
                                className={ classnames( 'ghostkit-countdown-unit', `ghostkit-countdown-unit-${ unitName }` ) }
                            >
                                <span className="ghostkit-countdown-unit-number">
                                    { formattedUnit ? formattedUnit.number : '00' }
                                </span>
                                <span className="ghostkit-countdown-unit-label">
                                    { formattedUnit ? formattedUnit.label : unitName }
                                </span>
                            </div>
                        );
                    } ) }
                </div>
                { isSelectedBlockInRoot ? (
                    <div className="ghostkit-countdown-expire-action">
                        <div className="ghostkit-countdown-expire-action-label">
                            { __( 'Display content after expiration:' ) }
                        </div>

                        <div className="ghostkit-countdown-expire-action-content">
                            <InnerBlocks
                                template={ [ [ 'core/paragraph', { content: __( 'This countdown has been ended already!' ) } ] ] }
                                templateLock={ false }
                            />
                        </div>
                    </div>
                ) : '' }
            </Fragment>
        );
    }
}

export default compose( [
    withSelect( ( select, ownProps ) => {
        const {
            isBlockSelected,
            hasSelectedInnerBlock,
        } = select( 'core/editor' );

        const { clientId } = ownProps;

        return {
            isSelectedBlockInRoot: isBlockSelected( clientId ) || hasSelectedInnerBlock( clientId, true ),
        };
    } ),
] )( BlockEdit );
