/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module basic-styles/bold/boldui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

const NOCOLOR = 'noColor';

/**
 * The bold UI feature. It introduces the Bold button.
 *
 * @extends module:core/plugin~Plugin
 */
export default class NoColorUI extends Plugin {

	/**
	 * @inheritDoc
	 */
	init() {

		const editor = this.editor;
		const t = editor.t;

		// Add tibetan button to feature components.
		editor.ui.componentFactory.add( NOCOLOR, locale => {
			const command = editor.commands.get( NOCOLOR );
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'No Color' ),
				keystroke: 'CTRL+ALT+U',
				tooltip: 'No Color (CTRL+ALT+U)',
				isToggleable: true
			} );

			view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			// Execute command.
			this.listenTo( view, 'execute', () => {
				editor.execute( NOCOLOR );
				editor.editing.view.focus();
			});

			return view;
		} );


	}
}
