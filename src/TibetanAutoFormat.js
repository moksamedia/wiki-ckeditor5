import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import tibetanIcon from './icons/tibetan-auto.svg'

const tibetanRegex = /[\u0F00-\u0FFF]/;
const tibetanRegexEndsInSheg = /[\u0F00-\u0FFF]+[་།]/;
const onlyTibetanEndsInTsheg = /^[\u0F00-\u0FFF]+[་།]$/
const tibetanSpaces = /[་།]/;

export default class TibetanAutoFormat extends Plugin {

	constructor(props) {
		super(props);
		this.enabled = false;
	}

	static get pluginName() {
		return 'TibetanAutoFormat';
	}

    init() {

        const editor = this.editor;
		const t = editor.t;

        editor.ui.componentFactory.add( 'tibetanAutoFormat', locale => {

			const command = editor.commands.get( 'tibetanAutoFormat' );
			const view = new ButtonView( locale );

            view.set( {
                label: t('Tibetan AutoFormat'),
                icon: tibetanIcon,
                tooltip: true,
				isToggleable: true,
				isOn: false
            } );

            view.on( 'execute', () => {
				this.enabled = !this.enabled;
				view.isOn = this.enabled;
				console.log("enabled = " + this.enabled);
            } );

            return view;

        } );


		const _this = this;
		editor.model.document.on( 'change:data', ( evt, batch ) => {


			if (!this.enabled) return;

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

			if ( entry.type !== 'insert' || entry.name != '$text' ) {
				return;
			}

			function getDataFromRange(range) {
				return range.getItems().next().value.data;
			}

			function getRangeShiftedBackOneChar(range) {
				let nextOffset = range.start.offset - 1;
				if (nextOffset < 0) return null;
				let nextRange = model.createRange(
					model.createPositionAt(block, range.start.offset - 1),
					model.createPositionAt(block, range.start.offset)
				);
				return nextRange;
			}

			function walkBackChars(currentRange, block, writer) {

				let string = getDataFromRange(currentRange);

				console.log(`${JSON.stringify(currentRange)} - "${string}"`);
				if (tibetanRegex.test(string)) {
					writer.setAttribute('tibetan', true, currentRange);
				}
				else {
					return;
				}

				let nextRange = getRangeShiftedBackOneChar(currentRange);
				if (nextRange == null) return;
				return walkBackChars(nextRange, block, writer);
			}

			const focus = selection.focus;
			const block = focus.parent;
			const position = entry.position;
			// make a range for the current change (may be more than 1 char bc of ligatures combining)
			const range = model.createRange( position, model.createPositionAt( block, position.offset + entry.length) );
			// get the string value of the current change
			let string = range.getItems().next().value.data;
			//console.log(string);


			model.enqueueChange( batch, writer => {

				// does the current change end in a tsheg
				if (onlyTibetanEndsInTsheg.test(string)) {
					let nextRange = model.createRange(
						model.createPositionAt(block, range.end.offset - 1),
						model.createPositionAt(block, range.end.offset)
					);
					walkBackChars(nextRange, block, writer);
				}
				else if (!tibetanRegex.test(string)) {
					writer.removeAttribute('tibetan', range);
				}

			} );

		} );

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
}
