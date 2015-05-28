/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2011, 2014 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */
function ZmCloudChatBuddyList() {
    this._items = [];
    this.itemAdded = new ZmCloudChatEvent(this);
    this.itemRemoved = new ZmCloudChatEvent(this);
	this.itemPresenceUpdated = new ZmCloudChatEvent(this);
	this.allItemsRemoved = new ZmCloudChatEvent(this);
}

ZmCloudChatBuddyList.prototype.getItems = function () {
	return this._items;
};

ZmCloudChatBuddyList.prototype.addItem = function (item) {
	if(this._items[item.email]) {
		//see if we need to update presence
		if(this._items[item.email].presence != item.presence) {
			this._items[item.email].presence = item.presence;
			this.itemPresenceUpdated.notify(item);
		}
	} else {
		this._items[item.email] = item;
		this.itemAdded.notify(item);
	}
};

ZmCloudChatBuddyList.prototype.updateItemPresence = function (item) {
	this._items[item.email] = item;
	this.itemPresenceUpdated.notify(item);
};

ZmCloudChatBuddyList.prototype.removeAllItems = function () {
  	this._items = [];
	this.allItemsRemoved.notify();
};


ZmCloudChatBuddyList.prototype.removeEmailParticipants = function () {
	for(var email in this._items) {
		if(this._items[email].isEmailParticipant) {
			this.removeItem(this._items[email]);
		}
	}
};

ZmCloudChatBuddyList.prototype.removeItem = function (item) {
  	delete this._items[item.email];
	this.itemRemoved.notify(item);
};