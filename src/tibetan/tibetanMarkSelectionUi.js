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
const TIBETAN = 'tibetan';

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
		const tibetanRegex = /[\u0F00-\u0FFF]+/g;

		const editor = this.editor;
		const t = editor.t;

		// Add tibetan button to feature components.
		editor.ui.componentFactory.add( TIBETAN_MARK_SELECTION, locale => {

			const command = editor.commands.get( TIBETAN_MARK_SELECTION );
			const view = new ButtonView( locale );

			view.set( {
				label: 'Tibetan Mark Selection',
				tooltip: true,
				icon: tibetanIcon,
				isToggleable: false,
			} );

			//view.bind( 'isEnabled' ).to( command );

			// Execute command.
			this.listenTo( view, 'execute', async () => {

				const selection = editor.model.document.selection;
				let range = selection.getFirstRange();

 				if (selection.isCollapsed) {
					// Create a range spanning over the entire root content:
					range = editor.model.createRangeIn( editor.model.document.getRoot() );
				}

				console.log(JSON.stringify(range));

				// Iterate over all items in this range:
				for ( const value of range.getWalker() ) {
					const item = value.item;
					if (item.is( '$textProxy' ) || item.is('$text') || item.is( 'textProxy' ) || item.is('text')) {
						const text = item.data;
						const _item = item;
						console.log("text="+text);
						const matches = text.matchAll(tibetanRegex);
						for (const match of matches) {
							const matchedText = match[0];
							const startIndex = match.index;
 							const endIndex = match.index + match[0].length;
							const matchLength = match[0].length;
							console.log(`Found '${match[0]}' start=${match.index} end=${match.index + match[0].length}.`);
							console.log(`item=${JSON.stringify(item, null, 2)}`);
							console.log(`item.parent=${JSON.stringify(_item.parent, null, 2)}`);
							await editor.model.change( async (writer) => {
								let rangeTib = writer.createRangeIn(_item.parent);
								rangeTib.start = writer.createPositionAt(_item.parent, _item.startOffset + startIndex);
								rangeTib.end = writer.createPositionAt(_item.parent, _item.startOffset + endIndex);
								console.log(JSON.stringify(rangeTib));
								await writer.setAttribute( TIBETAN, true, rangeTib);
							} );
						  }
					}
				}
			});

			return view;
		} );
	}
}
