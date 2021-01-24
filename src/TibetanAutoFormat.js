import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

const tibetanRegex = /[\u0F00-\u0FFF]/;
const tibetanRegexEndsInSheg = /[\u0F00-\u0FFF]+[་།]/;
const tibetanSpaces = /[་།]/;

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
        /*
		editor.model.document.on( 'change:data', ( evt, batch ) => {
			console.log("evt=", evt);
		});
         */
		const _this = this;
		editor.model.document.on( 'change:data', ( evt, batch ) => {


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

			function textForChange(change) {
				const position = change.position;
				//console.log("change position range: ", position);
				if (position) console.log(`${position.offset}, ${position.offset + entry.length}`);
				if (change.range) {
					const range = change.range;
					let data = range.getItems().next().value.data;
					console.log(`${change.type}(${change.length}) "${data}"`);
					if (data) console.log("unicode="+_this.unicodeLiteral(data))
				}
				else if (change.position) {
					const parent = change.position.parent;
					const range = model.createRange( position, model.createPositionAt( parent, position.offset + change.length) );
					let data = range.getItems().next().value.data;
					console.log(`${change.type}(${change.length}) "${data}"`);
					if (data) console.log("unicode="+_this.unicodeLiteral(data))
				}
			}

			changes.forEach((change, idx) => {
				//console.log("change: "+idx, change);
				textForChange(change);
			})

			// Typing is represented by only a single change.
			if ( entry.type !== 'insert' || entry.name != '$text' ) {
				return;
			}

			const focus = selection.focus;
			const block = focus.parent;
			const position = entry.position;
			const range = model.createRange( position, model.createPositionAt( block, position.offset + entry.length) );
			let string = range.getItems().next().value.data;
			console.log(string);

			/*
			editor.model.change( writer => {
				if (tibetanRegex.test(char)) {
					writer.setAttribute('tibetan', true, range);
				}
				else {
					writer.removeAttribute('tibetan', range);
				}
			} );
			 */


			model.enqueueChange( batch, writer => {

				if (tibetanRegexEndsInSheg.test(string)) {
					console.log("Bam!");
					let nextRange = model.createRange(
						model.createPositionAt( block, position.offset + entry.length-1),
						model.createPositionAt( block, position.offset + entry.length)
					);
					this.walkBackChars(nextRange, block, writer);
				}
				else if (!tibetanRegex.test(string)) {
					writer.removeAttribute('tibetan', range);
				}
			} );

			/*

			model.enqueueChange( writer => {
				if (tibetanSpaces.test(char)) {
					const {text, rangeToSet} = this.getTibetanText(focus, block, model);
					console.log("text from range="+text);
					writer.setAttribute('tibetan', true, rangeToSet);
				}
				else {
					writer.removeAttribute('tibetan', range);
				}
			});

			 */
		} );

    }

    walkBackChars(range, block, writer) {
		const model = writer.model;
		let string = range.getItems().next().value.data;
		if (tibetanRegex.test(string)) {
			writer.setAttribute('tibetan', true, range);
		}
		else {
			return;
		}
		let nextOffset = range.start.offset - 1;
		if (nextOffset < 0) return;
		let nextRange = model.createRange(
			model.createPositionAt( block, nextOffset),
			model.createPositionAt( block, nextOffset+1)
		);
		return this.walkBackChars(nextRange, block, writer);
	}

    fixedHex(number, length){
		var str = number.toString(16).toUpperCase();
		while(str.length < length)
			str = "0" + str;
		return str;
	}

	unicodeLiteral(str){
		var i;
		var result = "";
		for( i = 0; i < str.length; ++i){
			/* You should probably replace this by an isASCII test */
			if(str.charCodeAt(i) > 126 || str.charCodeAt(i) < 32)
				result += "\\u" + this.fixedHex(str.charCodeAt(i),4);
			else
				result += str[i];
		}

		return result;
	}

    getTibetanText( focus, block, model ) {
		let range = model.createRange( model.createPositionAt( block, 0 ), focus );
		let start = range.start;

		const text = Array.from( range.getItems() ).reduce( ( rangeText, node ) => {
			// Trim text to a last occurrence of an inline element and update range start.
			if ( !( node.is( '$text' ) || node.is( '$textProxy' ) ) || tibetanRegex.test(node.data) ) {
				start = model.createPositionAfter( node );

				return '';
			}

			return rangeText + node.data;
		}, '' );

		return { text, range: model.createRange( start, range.end ) };
	}
}
