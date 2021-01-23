/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module basic-styles/bold/boldediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Command from '@ckeditor/ckeditor5-core/src/command';

const TIBETAN_MARK_SELECTION = 'tibetanMarkSelection';
const TIBETAN = 'tibetan';
const tibetanRegex = /[\u0F00-\u0FFF]+/g;

class TibetanMarkSelectionCommand extends Command {

	constructor( editor ) {
		super( editor );
		this.editor = editor;
	}
	execute() {

		const editor = this.editor;
		const selection = editor.model.document.selection;
		let range = selection.getFirstRange();

		console.log("anchor = ", JSON.stringify(selection.anchor));
		console.log("focus = ", JSON.stringify(selection.focus));

		if (selection.anchor.isEqual(selection.focus)) {
			// Create a range spanning over the entire root content:
			//range = editor.model.createRangeIn( editor.model.document.getRoot() );
			range = editor.model.createRangeIn( selection.focus.parent );

		}

		console.log("selected range = ", JSON.stringify(range));

		editor.model.change( writer => {

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
					const startOffset = item.startOffset !== null ? item.startOffset : 0;

					// log the text we're matching
					console.log("text="+_item.data);
					console.log("startOffset = " + startOffset);
					// get the regex matches
					const matches = _item.data.matchAll(tibetanRegex);

					// iterate over the matches
					for (const match of matches) {

						// start and end indexes of match
						const startIndex = match.index;
						const endIndex = match.index + match[0].length;

						// logging for troubleshooting
						console.log(`Found '${match[0]}' start=${startIndex} end=${endIndex}.`);
						console.log(`pathToItem=${pathToItem.toString()}`);
						console.log(`_item=${JSON.stringify(_item, null, 2)}`);
						console.log(`_parent=${JSON.stringify(_parent, null, 2)}`)

						let rangeTib = writer.createRangeIn(_parent);
						rangeTib.start = writer.createPositionAt(_parent, startOffset + startIndex);
						rangeTib.end = writer.createPositionAt(_parent, startOffset + endIndex);
						console.log("rangeTib = " + JSON.stringify(rangeTib));

						const safeRanges = Array.from(editor.model.schema.getValidRanges( [rangeTib], TIBETAN ));
						console.log("safeRanges = " + JSON.stringify(safeRanges));

						for (const safeRange of safeRanges) {
							writer.setAttribute( TIBETAN, true, safeRange);
						}

					}

				}
			}

		});
	}
}

export default class TibetanEditing extends Plugin {

	static get pluginName() {
		return 'TibetanMarkSelectionEditing';
	}

	init() {
		const editor = this.editor;
		editor.commands.add( TIBETAN_MARK_SELECTION, new TibetanMarkSelectionCommand(editor));
		this.editor.keystrokes.set( 'CTRL+ALT+Y', TIBETAN_MARK_SELECTION );
	}

}
