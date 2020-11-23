/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module basic-styles/bold/boldui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import tibetanIcon from '../icons/tibetan.svg'

const TIBETAN = 'tibetan';

/**
 * The bold UI feature. It introduces the Bold button.
 *
 * @extends module:core/plugin~Plugin
 */
export default class TibetanUI extends Plugin {

	/**
	 * @inheritDoc
	 */
	init() {
		const tibetanRegex = /[\u0F00-\u0FFF]+/g;

		const editor = this.editor;
		const t = editor.t;

		// Add tibetan button to feature components.
		editor.ui.componentFactory.add( TIBETAN, locale => {
			const command = editor.commands.get( TIBETAN );
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'Tibetan' ),
				keystroke: 'CTRL+T',
				tooltip: true,
				icon: tibetanIcon,
				isToggleable: true
			} );

			view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			// Execute command.
			this.listenTo( view, 'execute', () => {
				editor.execute( TIBETAN );
				editor.editing.view.focus();
			});

			return view;
		} );
	}
}
