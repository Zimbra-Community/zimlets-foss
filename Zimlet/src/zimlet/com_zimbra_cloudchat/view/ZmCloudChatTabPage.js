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
function ZmCloudChatTabPage(parent, zimlet, name, dontShowUsersInTab) {
    DwtTabViewPage.call(this, parent);
    this.zimlet = zimlet;
    this.name = name;
    this._dontShowUsersInTab = dontShowUsersInTab;
    this.postsDiv = "cloudChatpostsDiv" + Dwt.getNextId();
    this.userListViewId = "cloudChatUsersListDiv" + Dwt.getNextId();
    this._sendBtnDiv = "cloudChat_sendBtnDiv" + Dwt.getNextId();
    this.inputFieldId = "cloudChatinputFieldId" + Dwt.getNextId();
    this._usersCellId = "cloudChatUsersListTD" + Dwt.getNextId();
    this._postsCell = "cloudChatPostsTD" + Dwt.getNextId();
    this.chatInfoDivId = "cloudChatInfo" + Dwt.getNextId();
    this._createHTML(name);
    this._doTranslate = false;
    this._doText2Speech = false;
}

ZmCloudChatTabPage.prototype = new DwtTabViewPage;
ZmCloudChatTabPage.prototype.constructor = ZmCloudChatTabPage;

ZmCloudChatTabPage.prototype._createHTML = function(name) {
    var html = [];
    var displayStr = "";
    var postCellStyle = "word-wrap:break-word;border-right: 1px solid gray; width:410px; border-style: solid; border-width: 0 1px 0 0;";
    var userCellStyle = "width:90px;word-wrap:break-word;display:block";
    if (this._dontShowUsersInTab) {
        postCellStyle = "word-wrap:break-word;width:510px; ";
        userCellStyle = "width:0px;word-wrap:break-word;display:none";
    }
    html.push("<div style='background:white'>",
    "<table cellpadding=1px>",
    "<td id='", this._postsCell, "'  style='", postCellStyle, "' valign=top>",
    "<div style='overflow:auto;height:225px;' id='", this.postsDiv,
    "' style='overflow:auto;background:white'></div></td>",
    "<td id='", this._usersCellId, "' style='", userCellStyle, "' valign=top>",
    "<div style='overflow:auto;height:225px;background:white;' id='",
    this.userListViewId, "'></div></td></table></div>",
    "<div><table><tr><td><input id='",
    this.inputFieldId, "' type=text style='width:430px;height:25px;'></input></td><td id='",
    this._sendBtnDiv, "'></td>"
    , "</tr></table></div><div id='", this.chatInfoDivId, "' ></div>");

    this.getHtmlElement().innerHTML = html.join("");

    this._appendWidgets();
};

ZmCloudChatTabPage.prototype._appendWidgets = function() {
    this.sendBtn = new DwtButton({
        parent: this.shell
    });
    this.sendBtn.setText(this.zimlet.getMessage("send"));
    document.getElementById(this._sendBtnDiv).appendChild(
    this.sendBtn.getHtmlElement());
};



ZmCloudChatTabPage.prototype._handleText2SpeechMenuClick = function() {
    this._doText2Speech = !this._doText2Speech;
};

ZmCloudChatTabPage.prototype._handleTranslateMenuClick = function() {
    this._doTranslate = !this._doTranslate;
};


ZmCloudChatTabPage.prototype.showMe = function() {
    //!important just override to ensure tab-sizes are intact
    };

