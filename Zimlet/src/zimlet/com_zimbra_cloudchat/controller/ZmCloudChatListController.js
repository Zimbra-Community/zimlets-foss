/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2011, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
function ZmCloudChatListController(app, model, socket, routingKey, users) {
	this.routingKey = routingKey;
	this.app = app;
	this.users = users;
	this.isGroupChat = users.length > 1;
	ZmCloudChatController.call(this, app.zimlet, model, socket);
	this.app.onPresenceEvent.attach(AjxCallback.simpleClosure(this.updateItemPresence, this), "tab_presence_" + routingKey);
	this.currentUsersEmailOrAliasForThisChat = this._getMyEmailOrAlias();
}

ZmCloudChatListController.prototype = new ZmCloudChatController;
ZmCloudChatListController.prototype.constructor = ZmCloudChatListController;

ZmCloudChatListController.prototype.updateItemPresence = function (item) {
	this.model.updateItemPresence(item);
};

ZmCloudChatListController.prototype.reconnectWithUser = function () {
	this.app.sendReconnectChatRequest({routingKey: this.routingKey, users:this.users});
};

ZmCloudChatListController.prototype.sendUserIsTyping = function () {
	this.app.sendUserIsTyping({routingKey: this.routingKey, user:this.currentUsersEmailOrAliasForThisChat});
};

ZmCloudChatListController.prototype.handleUserIsTyping = function (jsonObj) {
	this.view.handleUserIsTyping(jsonObj);
};

ZmCloudChatListController.prototype.notifyWhenItemAdded = function (callback) {
	this.model.itemAdded.attach(callback, "tab_item_added_" + this.routingKey);
};

ZmCloudChatListController.prototype.removeTabListeners = function () {
	this.app.onPresenceEvent.removeListener("tab_presence_" + this.routingKey);
	this.model.itemAdded.removeListener("tab_item_added_" + this.routingKey);
};

ZmCloudChatListController.prototype._getMyEmailOrAlias = function () {
	for(var i = 0; i < this.app.currentUserEmails.length; i++) {
		var cEmail = this.app.currentUserEmails[i];
		for(var j = 0; j < this.users.length; j++) {
			var user = this.users[j];
			if(user == cEmail) {
				return user;
			}
		}
	}
	return this.app.currentUserName;
};



