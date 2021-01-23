/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module basic-styles/bold/boldui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import tibetanIcon from '../icons/tibetan-mark-selection.svg'

const TIBETAN_MARK_SELECTION = 'tibetanMarkSelection';

/**
 * The bold UI feature. It introduces the Bold button.
 *
 * @extends module:core/plugin~Plugin
 */

export default class TibetanMarkSelectionUI extends Plugin {

	/**
	 * @inheritDoc
	 */
	init() {

		const editor = this.editor;
		const t = editor.t;

		// Add tibetan button to feature components.
		editor.ui.componentFactory.add( TIBETAN_MARK_SELECTION, locale => {

			const command = editor.commands.get( TIBETAN_MARK_SELECTION );
			const view = new ButtonView( locale );

			view.set( {
				label: 'Tibetan Mark Selection',
				tooltip: 'Marks all Tibetan chars within selection as Tibetan (or over entire document if no selection)',
				icon: tibetanIcon,
				isToggleable: false,
				keystroke: 'CTRL+ALT+Y'
			} );


			this.listenTo( view, 'execute', () => {
				editor.execute( TIBETAN_MARK_SELECTION );
				editor.editing.view.focus();
			});

			return view;
		} );
	}
}
