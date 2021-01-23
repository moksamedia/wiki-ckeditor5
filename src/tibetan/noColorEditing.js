/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module basic-styles/bold/boldediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import AttributeCommand from '@ckeditor/ckeditor5-basic-styles/src/attributecommand'

const NOCOLOR = 'noColor';

export default class NoColorEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'NoColorEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		// Allow bold attribute on text nodes.
		editor.model.schema.extend( '$text', { allowAttributes: NOCOLOR } );
		editor.model.schema.setAttributeProperties( NOCOLOR, {
			isFormatting: true,
			copyOnEnter: true
		} );

		// Build converter from model to view for data and editing pipelines.
		editor.conversion.attributeToElement( {
			model: NOCOLOR,
			view: {
				name: 'span',
				classes: ['nocolor']
			}
		} );

		// Create tibetan command.
		editor.commands.add( NOCOLOR, new AttributeCommand(editor, NOCOLOR));

		// Set the Ctrl+ALT+T keystroke.
		editor.keystrokes.set( 'CTRL+ALT+U', NOCOLOR );

	}
}
