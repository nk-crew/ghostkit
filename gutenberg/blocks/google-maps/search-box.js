/**
 * External dependencies
 */
import { withScriptjs } from 'react-google-maps';
import { compose, withHandlers, withProps, withState } from 'recompose';

const {
	StandaloneSearchBox,
} = require( 'react-google-maps/lib/components/places/StandaloneSearchBox' );

/**
 * WordPress dependencies
 */
import { TextControl } from '@wordpress/components';

/*
 * Search Box Component.
 */
export default compose(
	withState( 'value', 'setValue', ( props ) => props.value ),
	withProps( {
		loadingElement: <div />,
		containerElement: <div />,
	} ),
	withHandlers( () => {
		const refs = {
			searchBox: undefined,
		};

		return {
			onSearchBoxMounted: () => ( ref ) => {
				refs.searchBox = ref;
			},
			onPlacesChanged: ( props ) => () => {
				const places = refs.searchBox.getPlaces();

				if ( props.onChange ) {
					props.onChange( places );

					if ( places && places[ 0 ] ) {
						props.setValue( places[ 0 ].formatted_address );
					}
				}
			},
		};
	} ),
	withScriptjs
)( ( props ) => (
	<div data-standalone-searchbox="" className={ props.className }>
		<StandaloneSearchBox
			ref={ props.onSearchBoxMounted }
			bounds={ props.bounds }
			onPlacesChanged={ props.onPlacesChanged }
		>
			<TextControl
				label={ props.label }
				placeholder={ props.placeholder }
				value={ props.value }
				onChange={ ( val ) => {
					props.setValue( val );
				} }
			/>
		</StandaloneSearchBox>
	</div>
) );
