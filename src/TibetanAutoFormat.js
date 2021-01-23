import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

const tibetanRegex = /[\u0F00-\u0FFF]/;

export default class TibetanAutoFormat extends Plugin {

	constructor(props) {
		super(props);
		this.enabled = true;
	}

    init() {

        const editor = this.editor;

        editor.ui.componentFactory.add( 'insertImage', locale => {
            const view = new ButtonView( locale );

            view.set( {
                label: 'Tibetan AutoFormat',
                icon: imageIcon,
                tooltip: true
            } );

            // Callback executed once the image is clicked.
            view.on( 'execute', () => {
				this.enabled = !this.enabled;
            } );

            return view;

        } );

		editor.model.document.on( 'change:data', ( evt, batch ) => {

			return;

			if ( batch.type == 'transparent' || !this.enabled ) {
				return;
			}

			const model = editor.model;
			const selection = model.document.selection;

			// Do nothing if selection is not collapsed.
			if ( !selection.isCollapsed ) {
				return;
			}

			const changes = Array.from( model.document.differ.getChanges() );
			const entry = changes[ 0 ];

			// Typing is represented by only a single change.
			if ( changes.length != 1 || entry.type !== 'insert' || entry.name != '$text' || entry.length != 1 ) {
				return;
			}

			const focus = selection.focus;
			const block = focus.parent;
			const range = model.createRange( model.createPositionAt( block, focus.offset - 1 ), focus );
			let char = range.getItems().next().value.data;
			console.log(char);
			console.log(focus);
			console.log("focus.offset="+focus.offset);
			const previousCharOffset = focus.offset-2;
			if (previousCharOffset < 0) {
				return;
			}
			console.log("previousCharOffset="+previousCharOffset);
			const previousCharRange = model.createRange( model.createPositionAt( block, previousCharOffset ), model.createPositionAt( block, previousCharOffset+1 ) );
			let previousChar = previousCharRange.getItems().next().value.data;
			console.log(previousChar);

			model.enqueueChange( writer => {
				if (tibetanRegex.test(char) && tibetanRegex.test(previousChar)) {
					const twoCharRange = model.createRange( model.createPositionAt( block, previousCharOffset ), focus);
					writer.setAttribute('tibetan', true, twoCharRange);
				}
				else {
					writer.removeAttribute('tibetan', range);
				}
			});
		} );
    }
}
