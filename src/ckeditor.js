/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import DecoupledDocumentEditor from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor.js';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment.js';
//import AutoImage from '@ckeditor/ckeditor5-image/src/autoimage.js';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat.js';
//import Autolink from '@ckeditor/ckeditor5-link/src/autolink.js';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code.js';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor.js';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor.js';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily.js';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize.js';
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js';
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight.js';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline.js';
import HtmlEmbed from '@ckeditor/ckeditor5-html-embed/src/htmlembed.js';
import Image from '@ckeditor/ckeditor5-image/src/image.js';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption.js';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize.js';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle.js';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar.js';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload.js';
import Indent from '@ckeditor/ckeditor5-indent/src/indent.js';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import List from '@ckeditor/ckeditor5-list/src/list.js';
import ListStyle from '@ckeditor/ckeditor5-list/src/liststyle.js';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed.js';
import MediaEmbedToolbar from '@ckeditor/ckeditor5-media-embed/src/mediaembedtoolbar.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat.js';
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters.js';
import SpecialCharactersArrows from '@ckeditor/ckeditor5-special-characters/src/specialcharactersarrows.js';
import SpecialCharactersCurrency from '@ckeditor/ckeditor5-special-characters/src/specialcharacterscurrency.js';
import SpecialCharactersEssentials from '@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials.js';
import SpecialCharactersLatin from '@ckeditor/ckeditor5-special-characters/src/specialcharacterslatin.js';
import SpecialCharactersMathematical from '@ckeditor/ckeditor5-special-characters/src/specialcharactersmathematical.js';
import SpecialCharactersText from '@ckeditor/ckeditor5-special-characters/src/specialcharacterstext.js';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough.js';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript.js';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript.js';
import Table from '@ckeditor/ckeditor5-table/src/table.js';
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar.js';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation.js';
import TodoList from '@ckeditor/ckeditor5-list/src/todolist';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline.js';
import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount.js';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import linkToPageIcon from './icons/link-to-page.svg';

import Tibetan from './TibetanPlugin'
import TibetanMarkSelection from './TibetanMarkSelectionPlugin'
import NoColorPlugin from "./NoColorPlugin";
//import TibetanAutoFormat from './TibetanAutoFormat'
//import LineHeight from 'ckeditor5-line-height-plugin/src/lineheight';

//import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
//import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';

import './custom.css';

class DecoupledEditor extends DecoupledDocumentEditor {}

/* global WIKI */

class LinkToPage extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'linkToPage', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: 'Insert Link to Page',
				icon: linkToPageIcon,
				tooltip: true
			} );

			view.on( 'execute', () => {
				WIKI.$emit( 'editorLinkToPage' );
			} );

			return view;
		} );
	}
}

class InsertAsset extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'insertAsset', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: 'Insert Assets',
				icon: imageIcon,
				tooltip: true
			} );

			view.on( 'execute', () => {
				WIKI.$store.set( 'editor/activeModal', 'editorModalMedia' );
			} );

			return view;
		} );
	}
}


class DoImage extends Plugin {
    init() {
      const editor = this.editor;

        editor.ui.componentFactory.add( 'doImage', locale => {

            const view = new ButtonView( locale );

            view.set( {
                label: 'Do image',
                icon: imageIcon,
                tooltip: true
            } );

            // Callback executed once the image is clicked.
            view.on( 'execute', () => {
            });

            return view;
        } );
    }
}

class Keystrokes extends Plugin {
    init() {
		const editor = this.editor;
		editor.keystrokes.set( 'CTRL+ALT+1', (data, cancel) => {
			editor.execute( 'heading', { value: 'heading1' } );
		});
		editor.keystrokes.set( 'CTRL+ALT+2', (data, cancel) => {
			editor.execute( 'heading', { value: 'heading2' } );
		});
		editor.keystrokes.set( 'CTRL+ALT+3', (data, cancel) => {
			editor.execute( 'heading', { value: 'heading3' } );
		});
		editor.keystrokes.set( 'CTRL+ALT+4', (data, cancel) => {
			editor.execute( 'heading', { value: 'heading4' } );
		});
		editor.keystrokes.set( 'CTRL+ALT+Q', (data, cancel) => {
			editor.execute( 'heading', { value: 'paragraph' } );
		});
		editor.keystrokes.set( 'CTRL+ALT+W', (data, cancel) => {
			editor.execute( 'heading', { value: 'paragraph-tight' } );
		});
		editor.keystrokes.set( 'CTRL+ALT+E', (data, cancel) => {
			editor.execute( 'heading', { value: 'paragraph-less-tight' } );
		});
		editor.keystrokes.set( ['CTRL','ALT',39], (data, cancel) => {
			editor.execute( 'indentBlock' );
		});
		editor.keystrokes.set( 'CTRL+ALT+TAB', (data, cancel) => {
			editor.execute( 'indentBlock' );
		});
		editor.keystrokes.set( ['CTRL','ALT',37], (data, cancel) => {
			editor.execute( 'outdentBlock');
		});
		editor.keystrokes.set( 'CTRL+ALT+H', (data, cancel) => {
			editor.execute( 'highlight', { value: 'yellowOutline' } );
		});
		editor.keystrokes.set( ['CTRL','ALT',37], (data, cancel) => {
			editor.execute( 'outdentBlock');
		});
		/*
		editor.editing.view.document.on( "keydown", ( eventInfo, keyEventData ) => {
			console.log(eventInfo);
			console.log(keyEventData);
		});
		*/
	}
}

// Plugins to include in the build.
DecoupledEditor.builtinPlugins = [
	Alignment,
	//AutoImage,
	Autoformat,
	//Autolink,
	BlockQuote,
	Bold,
	Code,
	CodeBlock,
	Essentials,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	Heading,
	Highlight,
	HorizontalLine,
	HtmlEmbed,
	Image,
	ImageCaption,
	//ImageInsert,
	ImageResize,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Indent,
	IndentBlock,
	Italic,
	Link,
	List,
	//ListStyle,
	MediaEmbed,
	//MediaEmbedToolbar,
	Paragraph,
	PasteFromOffice,
	RemoveFormat,
	SpecialCharacters,
	SpecialCharactersArrows,
	SpecialCharactersCurrency,
	SpecialCharactersEssentials,
	SpecialCharactersLatin,
	SpecialCharactersMathematical,
	SpecialCharactersText,
	Strikethrough,
	Subscript,
	Superscript,
	Table,
	TableCellProperties,
	TableProperties,
	TableToolbar,
	TextTransformation,
	TodoList,
	Underline,
	WordCount,
	//UploadAdapter,
	//CKFinder,
	InsertAsset,

	LinkToPage,
	Tibetan,
	TibetanMarkSelection,
	Keystrokes,
	NoColorPlugin,
	//TibetanAutoFormat
];

// Editor configuration.
DecoupledEditor.defaultConfig = {
	toolbar: {
		shouldNotGroupWhenFull: false,
		items: [
			'tibetan',
			'tibetanMarkSelection',
			//'tibetanAutoFormat',
			'|',
			'heading',
			'|',
			'fontSize',
			'fontFamily',
			'fontColor',
			'fontBackgroundColor',
			'|',
			'bold',
			'italic',
			'underline',
			'strikethrough',
			'highlight',
			'|',
			'alignment',
			'|',
			'numberedList',
			'bulletedList',
			'|',
			'indent',
			'outdent',
			'|',
			'horizontalLine',
			'removeFormat',
			'specialCharacters',
			'link',
			'linkToPage',
			'blockQuote',
			//'imageUpload',
			'insertAsset',
			'htmlEmbed',
			'|',
			'undo',
			'redo',
			'|',
			'code',
			'codeBlock',
			'todoList',
			'subscript',
			'superscript'
		]
	},
	heading: {
		options: [
			{ model: 'paragraph', title: 'Paragraph', class: '' },
			{
				model: 'paragraph-tight',
				view: {
					name: 'p',
					classes: 'tighter'
				},
				title: 'Paragraph (tight)',
				class: '',

				// It needs to be converted before the standard 'heading2'.
				converterPriority: 'high'
			},
			{
				model: 'paragraph-less-tight',
				view: {
					name: 'p',
					classes: 'less-tighter'
				},
				title: 'Paragraph (less tight)',
				class: '',

				// It needs to be converted before the standard 'heading2'.
				converterPriority: 'high'
			},
			{ model: 'heading1', view: 'h1', title: 'Heading 1', class: '' },
			{ model: 'heading2', view: 'h2', title: 'Heading 2', class: '' },
			{ model: 'heading3', view: 'h3', title: 'Heading 3', class: '' },
			{ model: 'heading4', view: 'h4', title: 'Heading 4', class: '' },
			{ model: 'heading5', view: 'h5', title: 'Heading 5', class: '' },
			{ model: 'heading6', view: 'h6', title: 'Heading 6', class: '' },
			{
				model: 'big-but-not-header',
				view: {
					name: 'p',
					classes: 'big-not-headers'
				},
				title: 'Big Not Header',
				class: '',
			},
			{
				model: 'click-to-show',
				view: {
					name: 'p',
					classes: 'click-to-show'
				},
				title: 'Click To Show',
				class: '',
			},
		]
	},
	image: {
		styles: [
			'full',
			'alignLeft',
			'alignRight'
		],
		toolbar: [
			'imageStyle:alignLeft',
			'imageStyle:full',
			'imageStyle:alignRight',
			'|',
			'imageTextAlternative'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells',
			'tableCellProperties',
			'tableProperties'
		]
	},
	highlight: {
		options: [
			{ model: 'yellowOutline', class: 'marker-outline-yellow', title: 'Yellow Outline', color: 'transparent', type: 'marker' },
			{ model: 'yellowMarker', class: 'marker-yellow', title: 'Yellow Marker', color: 'var(--ck-highlight-marker-yellow)', type: 'marker' },
			{ model: 'greenMarker', class: 'marker-green', title: 'Green marker', color: 'var(--ck-highlight-marker-green)', type: 'marker' },
			{ model: 'pinkMarker', class: 'marker-pink', title: 'Pink marker', color: 'var(--ck-highlight-marker-pink)', type: 'marker' },
			{ model: 'blueMarker', class: 'marker-blue', title: 'Blue marker', color: 'var(--ck-highlight-marker-blue)', type: 'marker' },
			{ model: 'redPen', class: 'pen-red', title: 'Red pen', color: 'var(--ck-highlight-pen-red)', type: 'pen' },
			{ model: 'greenPen', class: 'pen-green', title: 'Green pen', color: 'var(--ck-highlight-pen-green)', type: 'pen' }

		]
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en'
};


export default DecoupledEditor;
