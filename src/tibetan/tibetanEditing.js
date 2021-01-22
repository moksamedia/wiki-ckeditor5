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
import Command from '@ckeditor/ckeditor5-core/src/command';

import {executeFunction} from './tibetanMarkSelectionUi'

const TIBETAN = 'tibetan';

/**
 * The bold editing feature.
 *
 * It registers the `'bold'` command and introduces the `bold` attribute in the model which renders to the view
 * as a `<strong>` element.
 *
 * @extends module:core/plugin~Plugin
 */

class MyCommand extends Command {

	constructor( editor ) {
		super( editor );
		this.attributeCommand = new AttributeCommand( this.editor, TIBETAN );
	}
    execute() {

		const selection = this.editor.model.document.selection;

		console.log("anchor = ", JSON.stringify(selection.anchor));
		console.log("focus = ", JSON.stringify(selection.focus));
		console.log("isCollapsed = " + selection.isCollapsed);

			if (selection.anchor.isEqual(selection.focus)) {
			// Create a range spanning over the entire root content:
			//range = editor.model.createRangeIn( editor.model.document.getRoot() );
			//range = this.editor.model.createRangeIn( selection.focus.parent );
				/*
			let newAnchor = selection.anchor.clone();
			newAnchor.offset = 0;
			let textNode = selection.anchor.textNode;
			console.log("textNode = ", textNode);
			if (!textNode) return;
			let newFocus = selection.focus.clone();
			newFocus.offset = textNode.endOffset;
            */
			this.editor.model.change( writer => {
				const rangeParent = this.editor.model.createRangeIn( selection.focus.parent );
				//const range = writer.createRange( newAnchor, newFocus );
				editor.model.change( writer => {
					writer.setSelection( rangeParent );
					executeFunction(this.editor);
				});
			});

			return;

		}

		this.attributeCommand.execute();
    }
}

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
		editor.commands.add( TIBETAN, new MyCommand(editor));

		// Set the Ctrl+ALT+T keystroke.
		editor.keystrokes.set( 'CTRL+ALT+T', TIBETAN );

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
