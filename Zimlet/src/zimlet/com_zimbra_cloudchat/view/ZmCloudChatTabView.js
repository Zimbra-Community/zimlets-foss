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
function ZmCloudChatTabView (params, app) {
	this.app = app;
	this.zimlet = app.zimlet;
	this.tabkeys = [];
	this._tabBtnIdAndInfoMap = [];
	this._routingKeyAndTabBtnMap = [];//used to update tab's label
	DwtTabView.call(this, params);
}

ZmCloudChatTabView.prototype = new DwtTabView;
ZmCloudChatTabView.prototype.constructor = ZmCloudChatTabView;

ZmCloudChatTabView.prototype.addRemovableTab = function(name, routingKey, chatController, dontShowUsersInTab) {
    var tabPage = new ZmCloudChatTabPage(this.parent, this.zimlet, name,  dontShowUsersInTab);
	var tabKey = this.addTab(name, tabPage);
	var tabButton = this.getTabButton(tabKey);

	//store name & table as well so we can change & highlight when new msg shows up w/o having to search for these
	//elements
	tabButton._originalText = name;//store it
	tabButton._tableRef = tabButton.getHtmlElement().firstChild;
	tabButton._newMsgCounter = 0;

	tabButton.addSelectionListener(new AjxListener(this, this._tabBtnClicked), 0);
	tabButton.setImage("Close");
    this.tabkeys.push(tabKey);
	var btnId = tabButton.getHtmlElement().id;
	this._tabBtnIdAndInfoMap[btnId] = {tabKey: tabKey, chatController: chatController, btnId: btnId, routingKey: routingKey, tabButton: tabButton, tabPage: tabPage};
    this._routingKeyAndTabBtnMap[routingKey] = tabButton;
	this.setSize("510px", "300px");
    tabPage.setSize("510px", "300px");

	 chatController.notifyWhenItemAdded(AjxCallback.simpleClosure(
			this._handleIncomingMsg, this));

    return tabPage;
};

ZmCloudChatTabView.prototype._handleIncomingMsg = function(item) {
   if(item.action == "PUBLISH" && item.routingKey) {
	   var tabButton = this._routingKeyAndTabBtnMap[item.routingKey];
	    if(!tabButton._isSelected) {
			this._setTabBtnAs(tabButton, "ALERT");
		}
   }
};

ZmCloudChatTabView.prototype._setTabBtnAs = function(tabButton, state) {
	if(state == "ALERT"){
		tabButton._newMsgCounter++;
		tabButton.setText(tabButton._originalText + " ("+ tabButton._newMsgCounter + ")");
	   	tabButton._tableRef.style.backgroundColor = "orange";
	} else {
		tabButton._newMsgCounter = 0;
		tabButton.setText(tabButton._originalText);
		tabButton._tableRef.style.backgroundColor = "white";
	}
};

ZmCloudChatTabView.prototype._tabBtnClicked = function(ev) {
	var btnId = ev.dwtObj.getHtmlElement().id;
	if(ev && ev.target && ev.target.className == "ImgClose") {
		this.closeTab(btnId);
	} else {
		this._setTabBtnAs(this._tabBtnIdAndInfoMap[btnId].tabButton , "NORMAL");
		setTimeout(AjxCallback.simpleClosure(this.focusnputFieldByBtnId, this, btnId), 250);
	}
};
//focus input field when we first start chatting (w/ only 1 tab)
//we shouldn't set focus if there are more than one tab
ZmCloudChatTabView.prototype.focusInputFieldOfFirstTab = function() {
	var c = 0;
	var firstBtnId;
	for(var btnId in this._tabBtnIdAndInfoMap) {
		if(c == 0) {
			firstBtnId = btnId;
		}
		c++;
	}
	if(c == 1) {
		setTimeout(AjxCallback.simpleClosure(this.focusnputFieldByBtnId, this, firstBtnId), 250);
	}
};

ZmCloudChatTabView.prototype.focusnputFieldByBtnId = function(btnId) {
	 if(this._tabBtnIdAndInfoMap[btnId] && this._tabBtnIdAndInfoMap[btnId].tabPage) {
		if(this._tabBtnIdAndInfoMap[btnId].tabPage.inputFieldId) {
			 var inputField = document.getElementById(this._tabBtnIdAndInfoMap[btnId].tabPage.inputFieldId);
			if(inputField) {
				inputField.focus();
			}
		}
	 }
};

ZmCloudChatTabView.prototype.closeAllTabs = function() {
	 for(var btnId in this._tabBtnIdAndInfoMap) {
		 this.closeTab(btnId);
	 }
	//reset internal props of DwtTabView when dlg is closed
	this._tabs = [];
	this._tabIx = 1;
};

ZmCloudChatTabView.prototype.closeTab = function(btnId) {
		var info = this._tabBtnIdAndInfoMap[btnId];
		var routingKey = info.routingKey;
		if(!info || !info.tabButton || !info.tabPage) {
			return;
		}
	    if(info.chatController) {
			info.chatController.removeTabListeners();
		}
		info.tabButton.dispose();
		info.tabPage.dispose();
		delete this._tabBtnIdAndInfoMap[btnId];
		delete this._tabBar._buttons[info.tabKey];
		delete this._routingKeyAndTabBtnMap[routingKey];

		//When we splice to remove a tab, the tabKey changes and
		//can no longer be used as index, so get true Index
		//var tabTrueIndx = this._getTabTrueIndex(btnId);
		//if(tabTrueIndx) {
		//	this._tabs.splice(tabTrueIndx, 1);
		//}
		var removedTabIndx = info.tabButton.getData("tabKey");
		var oldNumberOfTabs = this.getNumberOfTabs();
		this._tabs.splice(removedTabIndx, 1);
		this._resetTabKeys(); //reset all tab button's "tabKey"

		//close the dlg when there are no more tabs
		var tabsLen = this.getNumberOfTabs();
	   if(tabsLen == 0) {
		   this.zimlet.chatApp.popdown();
			//reset internal props of DwtTabView when dlg is closed
			this._tabs = [];
			this._tabIx = 1;
	   } else {
		   if(tabsLen == 1) {
			   this.switchToTab(1);
		   } else if(removedTabIndx > 1 && removedTabIndx < oldNumberOfTabs) {
			       this.switchToTab(removedTabIndx);
		   } else if( removedTabIndx == oldNumberOfTabs) {
			  this.switchToTab(removedTabIndx - 1);
		   }
	   }
	this.app.handleTabClose(routingKey);
};

ZmCloudChatTabView.prototype._resetTabKeys = function() {
	for(var i = 1; i < this._tabs.length; i++) {
		var tab = this._tabs[i];
		if(!tab) {
			continue;
		}
		if(tab.button) {
			tab.button.setData("tabKey", i);
		}
	}
	this._tabIx = i;
};

ZmCloudChatTabView.prototype._getTabTrueIndex = function(btnId) {
	for(var i = 0; i < this._tabs.length; i++) {
		var tab = this._tabs[i];
		if(!tab) {
			continue;
		}
		if(tab.button && tab.button._htmlElId == btnId) {
			return i;
		}
	}
};

ZmCloudChatTabView.prototype.getNumberOfTabs = function() {
	var i = 0;
	 for(var btnId in this._tabBtnIdAndInfoMap) {
		 i++;
	 }
	return i;
};