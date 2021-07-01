/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2011, 2013, 2014, 2016 Synacor, Inc.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15
 * have been added to cover use of software over a computer network and provide for limited attribution
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 * The Initial Developer of the Original Code is Zimbra, Inc.  All rights to the Original Code were
 * transferred by Zimbra, Inc. to Synacor, Inc. on September 14, 2015.
 *
 * All portions of the code are Copyright (C) 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/**
 * Zimlet handler class
 */
function ZmExampleEncryptZimlet() {
}

ZmExampleEncryptZimlet.OP = "ENCRYPT_EXAMPLE_ZIMLET";

ZmExampleEncryptZimlet.prototype = new ZmZimletBase();
ZmExampleEncryptZimlet.prototype.constructor = ZmExampleEncryptZimlet;


/**
 * This method gets called by the Zimlet framework when a toolbar is created.
 *
 * @param {ZmApp} app
 * @param {ZmButtonToolBar} toolbar
 * @param {ZmController} controller
 * @param {String} viewId
 *
 */
ZmExampleEncryptZimlet.prototype.initializeToolbar =
		function(app, toolbar, controller, viewId) {
			var viewType = appCtxt.getViewTypeFromId(viewId);
			if (viewType == ZmId.VIEW_COMPOSE) {
				var op = toolbar.getOp(ZmOperation.COMPOSE_OPTIONS);
				if (op) {
					var menu = op.getMenu();
					if (menu) {
						var mi = menu.getMenuItem(ZmExampleEncryptZimlet.OP);
						if (mi) {
							mi.setChecked(false);
							appCtxt.getCurrentView().__encryptZimlet_doEncrypt = false;//reset
						} else {
							mi = menu.createMenuItem(ZmExampleEncryptZimlet.OP, {image:"Padlock", text:this.getMessage("label"), style:DwtMenuItem.CHECK_STYLE});
							mi.addSelectionListener(new AjxListener(this, this._handleEncryptMenuClick, controller, mi));
						}
					}
				}
			}
		};
/**
 * Set some unique variable on the current compose view to "true" so that
 * addCustomMimeHeaders function knows that it needs to add custom header as we are dealing
 * with multiple compose-tabs.
 *
 * @param {ZmComposeController} controller
 * @param {Event}	ev
 */
ZmExampleEncryptZimlet.prototype._handleEncryptMenuClick =
		function(controller, ev) {
			if(!ev)  {
				ev = window.event;
			}
			if(ev && ev.item && ev.item.getChecked)  {
				//set some unique variable ("__encryptZimlet_doEncrypt") on ZmComposeView
				// since we need to deal with multiple compose-tabs.
				appCtxt.getCurrentView().__encryptZimlet_doEncrypt = ev.item.getChecked();
			}
		};

/**
 * Called by the framework just before sending email.
 * @param {array} customMimeHeaders An array of custom-header objects.
 * 				  Each item in the array MUST be an object that has "name" and "_content" properties.
 * 				  This onle works from 7.1.3
 */
ZmExampleEncryptZimlet.prototype.addCustomMimeHeaders =
function(customMimeHeaders) {
	//check if the compose view has __encryptZimlet_doEncrypt set to true (is true when user selects encrypt menu)
	if(appCtxt.getCurrentView().__encryptZimlet_doEncrypt) {
		customMimeHeaders.push({name:"X-Encrypt", _content:this.getConfig("X-Encrypt")});
	}
	appCtxt.getCurrentView().__encryptZimlet_doEncrypt = false;//reset
};



