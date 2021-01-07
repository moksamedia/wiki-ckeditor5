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
				tooltip: 'Marks all Tibetan chars within selection as Tibetan (or over entire document if no selection)',
				icon: tibetanIcon,
				isToggleable: false,
			} );

			//view.bind( 'isEnabled' ).to( command );

			// Execute command.
			this.listenTo( view, 'execute', () => {

				const selection = editor.model.document.selection;
				let range = selection.getFirstRange();

 				if (selection.isCollapsed) {
					// Create a range spanning over the entire root content:
					range = editor.model.createRangeIn( editor.model.document.getRoot() );
				}

				console.log("selected range = ", JSON.stringify(range));

				editor.model.change( writer => {

					// Iterate over all items in this range:
					for ( const value of range.getWalker() ) {

						// get the item
						const item = value.item;

						// is it a text node of some type?
						if (item.is( '$textProxy' ) || item.is('$text') || item.is( 'textProxy' ) || item.is('text')) {

							// save the item and parent in local vars
							// - not sure why this is necessary, but they are going out of scope
							//   if not saved locally
							const _item = item;
							const _parent = _item.parent;
							const pathToItem = item.getPath();

							// log the text we're matching
							console.log("text="+_item.data);

							// get the regex matches
							const matches = _item.data.matchAll(tibetanRegex);

							// iterate over the matches
							for (const match of matches) {

								// start and end indexes of match
								const startIndex = match.index;
								const endIndex = match.index + match[0].length;

								// logging for troubleshooting
								console.log(`Found '${match[0]}' start=${startIndex} end=${endIndex}.`);
								console.log(`_item=${JSON.stringify(_item, null, 2)}`);
								console.log(`pathToItem=${pathToItem.toString()}`);
								console.log(`_parent=${JSON.stringify(_parent, null, 2)}`);

								let rangeTib = writer.createRangeIn(_parent);
								rangeTib.start = writer.createPositionAt(_parent, pathToItem[1] + startIndex);
								rangeTib.end = writer.createPositionAt(_parent, pathToItem[1] + endIndex);
								console.log(JSON.stringify(rangeTib));
								writer.setAttribute( TIBETAN, true, rangeTib);

							}

						}
					}
				});

			});

			return view;
		} );
	}
}
