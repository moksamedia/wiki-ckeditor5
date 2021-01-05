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
				keystroke: 'CTRL+ALT+T',
				tooltip: 'Marks selection as Tibetan (CTRL+ALT+T)',
				icon: tibetanIcon,
				isToggleable: true
			} );

			view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			// Execute command.
			this.listenTo( view, 'execute', () => {
				editor.execute( TIBETAN );
				editor.editing.view.focus();
			});

			/*
			editor.model.document.registerPostFixer( writer => {
				const changes = editor.model.document.differ.getChanges();

				for ( const entry of changes ) {
					if ( entry.type == 'insert' && entry.name == '$text' ) {
						console.log("entry=",entry);
						let root = entry.position.root;
						let path = entry.position.path;
						let node = root.getNodeByPath(path);
						console.log("node=",node);
						if (path.length !== 2) return;
						let indexOfLastChar = path[1];
						if (!node.data || node.data.length < indexOfLastChar) return;
						let char = node.data.charAt(indexOfLastChar);
						console.log("char="+char);
						if (tibetanRegex.test(char)) {
							console.log("Tibetan!");
							let parent = node.parent;
							console.log("parent=",parent);
							let rangeTib = writer.createRangeIn(parent);
							rangeTib.start = writer.createPositionAt(parent, indexOfLastChar);
							rangeTib.end = writer.createPositionAt(parent, indexOfLastChar+1);
							console.log("range=",rangeTib);
							writer.setAttribute( TIBETAN, true, rangeTib);
						}
					}
				}
			} );
			*/

			return view;
		} );


	}
}
