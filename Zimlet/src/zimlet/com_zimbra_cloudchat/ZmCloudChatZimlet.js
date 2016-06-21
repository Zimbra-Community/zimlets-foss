/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2011, 2013, 2014 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at: http://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 
 * have been added to cover use of software over a computer network and provide for limited attribution 
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B. 
 * 
 * Software distributed under the License is distributed on an "AS IS" basis, 
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. 
 * See the License for the specific language governing rights and limitations under the License. 
 * The Original Code is Zimbra Open Source Web Client. 
 * The Initial Developer of the Original Code is Zimbra, Inc. 
 * All portions of the code are Copyright (C) 2011, 2013, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */

/**
 * Defines the Zimlet handler class.
 * 
 */
function ZmCloudChatZimlet() {
    }

/**
 * Makes the Zimlet class a subclass of ZmZimletBase.
 * 
 */
ZmCloudChatZimlet.prototype = new ZmZimletBase();
ZmCloudChatZimlet.prototype.constructor = ZmCloudChatZimlet;

/**
 * This method gets called by the Zimlet framework when the zimlet loads.
 * 
 */

ZmCloudChatZimlet.prototype.init = function() {
    this.chatApp = new ZmCloudChatApp(this);
};

ZmCloudChatZimlet.prototype.onMsgView = function(msg) {
	if(this.chatApp.isLoggedIn && this.chatApp.showEmailParticipants){
		this.chatApp.displayEmailParticipantsList(msg.participants);
	}
};

//support only from Z8 D2 onwards
ZmCloudChatZimlet.prototype.initializeToolbar = function(app, toolbar, controller, viewId) {
	if(!appCtxt.getViewTypeFromId) {
		return;
	}
	var viewType = appCtxt.getViewTypeFromId(viewId);
	if (viewType == ZmId.VIEW_CONVLIST || viewType == ZmId.VIEW_CONV || viewType == ZmId.VIEW_TRAD
			|| viewType == ZmId.VIEW_CONTACT_SIMPLE || viewType == ZmId.VIEW_CAL_DAY) {

		var op = toolbar.getOp(ZmId.OP_ACTIONS_MENU);
		if(op) {
			var menu = op.getMenu();
			if(menu) {
				if(menu.getMenuItem("DOLPHIN_CHAT_BUTTON")) {
					return;
				}
				var mi = menu.createMenuItem("DOLPHIN_CHAT_BUTTON", {image:"cloudchat-icon", text:this.getMessage("cloudChat")});
				mi.addSelectionListener(new AjxListener(this, this._handleToolbarBtnClick, controller));
			}
		}
	}
};

ZmCloudChatZimlet.prototype._handleToolbarBtnClick = function(controller) {
 	var items = controller.getSelection();

	var type = items[0].type;
	var obj;
	var emails = [];
	var params = {};
	if (type == ZmId.ITEM_CONV) {
		obj = items[0].getFirstHotMsg();
		emails = obj.getEmails().getArray();
	} else if(type == ZmId.ITEM_MSG) {
		obj = items[0];
		emails = obj.getEmails().getArray();
	} else if(type == ZmId.ITEM_CONTACT) {
		emails = this._getEmailsFromContacts(items);
	}
	var routingKey  = obj.messageId;
	if(routingKey) {
		routingKey = routingKey.replace("<", "").replace(">", "");
	} else {
		routingKey = "" + (new Date()).getTime();
	}
	params.users = (emails instanceof Array) ?  emails : [emails];
	params.routingKey =  routingKey;
	this.chatApp.sendChatRequest(params);
};


