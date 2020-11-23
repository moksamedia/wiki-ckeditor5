/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module basic-styles/bold
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import TibetanMarkSelectionEditing from './tibetan/tibetanMarkSelectionEditing';
import TibetanMarkSelectionUI from './tibetan/tibetanMarkSelectionUi';

/**
 * The Tibetan feature.
 *
 * @extends module:core/plugin~Plugin
 */
export default class TibetanMarkSelection extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ TibetanMarkSelectionEditing, TibetanMarkSelectionUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'TibetanMarkSelection';
	}
}
