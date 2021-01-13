/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module basic-styles/bold/boldediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import AttributeCommand from '@ckeditor/ckeditor5-basic-styles/src/attributecommand'
//import inlineAutoformatEditing from '@ckeditor/ckeditor5-autoformat/src/inlineautoformatediting';

const TIBETAN = 'tibetan';

/**
 * The bold editing feature.
 *
 * It registers the `'bold'` command and introduces the `bold` attribute in the model which renders to the view
 * as a `<strong>` element.
 *
 * @extends module:core/plugin~Plugin
 */
export default class TibetanEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'TibetanEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		// Allow bold attribute on text nodes.
		editor.model.schema.extend( '$text', { allowAttributes: TIBETAN } );
		editor.model.schema.setAttributeProperties( TIBETAN, {
			isFormatting: true,
			copyOnEnter: true
		} );

		// Build converter from model to view for data and editing pipelines.
		editor.conversion.attributeToElement( {
			model: TIBETAN,
			view: {
				name: 'span',
				classes: ['tibetan']
			}
		} );

		// Create tibetan command.
		editor.commands.add( TIBETAN, new AttributeCommand( editor, TIBETAN ) );

		// Set the Ctrl+ALT+T keystroke.
		editor.keystrokes.set( 'CTRL+ALT+T', TIBETAN );

		editor.keystrokes.set( 'CTRL+ALT+1', (data, cancel) => {
			editor.execute( 'heading', { value: 'heading1' } );
		});

		editor.keystrokes.set( 'CTRL+ALT+2', (data, cancel) => {
			editor.execute( 'heading', { value: 'heading2' } );
		});
		editor.keystrokes.set( 'CTRL+ALT+3', (data, cancel) => {
			editor.execute( 'heading', { value: 'heading3' } );
		});
		editor.keystrokes.set( 'CTRL+ALT+4', (data, cancel) => {
			editor.execute( 'heading', { value: 'heading4' } );
		});
		editor.keystrokes.set( 'CTRL+ALT+F1', (data, cancel) => {
			editor.execute( 'heading', { value: 'paragraph' } );
		});
		editor.keystrokes.set( 'CTRL+ALT+F2', (data, cancel) => {
			editor.execute( 'heading', { value: 'paragraphTight' } );
		});


		/*
		inlineAutoformatEditing( this.editor, this, /([\\{])([^*]+)([\\}])$/g,  ( writer, rangesToFormat ) => {

			const command = this.editor.commands.get( TIBETAN );

			if ( !command.isEnabled ) {
				return false;
			}

			const validRanges = this.editor.model.schema.getValidRanges( rangesToFormat, TIBETAN );

			for ( const range of validRanges ) {
				writer.setAttribute( TIBETAN, true, range );
			}

			// After applying attribute to the text, remove given attribute from the selection.
			// This way user is able to type a text without attribute used by auto formatter.
			writer.removeSelectionAttribute( TIBETAN );

		} );
		*/
	}
}
