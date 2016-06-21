/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2007, 2008, 2009, 2010, 2012, 2013, 2014 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2012, 2013, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */

function Com_Zimbra_YMEmoticons() {
	this.re = Com_Zimbra_YMEmoticons.REGEXP;
    this.reCaseSensitive = Com_Zimbra_YMEmoticons.REGEXP_CASE_SENSITIVE;
	this.hash = Com_Zimbra_YMEmoticons.SMILEYS;
	this._isEnabled = true;
};

Com_Zimbra_YMEmoticons.prototype = new ZmZimletBase;
Com_Zimbra_YMEmoticons.prototype.constructor = Com_Zimbra_YMEmoticons;

Com_Zimbra_YMEmoticons.prototype.init =
function(){
	var smileyObj;
	for (var smiley in this.hash) {
		smileyObj = this.hash[smiley];
		smileyObj.alt = this.getMessage(smileyObj.alt);
	}
};
Com_Zimbra_YMEmoticons.prototype.createComposeButton =
function(toolbar) {
	var htmlEditor = toolbar.parent;
	var button = new YMEmoticonsPickerButton({parent: toolbar, className: "ZToolbarButton"}, true);
	button.dontStealFocus();
	button.setToolTipContent(ZmMsg.emoticons);
	button.setEmoticon(":)");
	button.addSelectionListener(new AjxListener(this, this._composeToolbarSmileyListener, [htmlEditor]));
};

Com_Zimbra_YMEmoticons.prototype.on_htmlEditor_createToolbar2 =
function(app, toolbar) {
	this.createComposeButton(toolbar);
};

Com_Zimbra_YMEmoticons.prototype.onFindMsgObjects =
function(msg, manager) {
	if (!this.enableInMail) {
		this.enableInMail = Boolean(this.getUserProperty("yemoticons_enableInMail"));
	}

	if (msg && msg.folderId == ZmOrganizer.ID_CHATS) {
		manager.addHandler(this);
		manager.sortHandlers();
		manager.__hasSmileysHandler = true;
	}
	else { // for other mail folders
		if (!manager.__hasSmileysHandler && this._isEnabled && this.enableInMail) {
			manager.addHandler(this);
			manager.sortHandlers();
			manager.__hasSmileysHandler = true;
		}

		if (manager.__hasSmileysHandler && (!this._isEnabled || !this.enableInMail)) {
			manager.removeHandler(this);
			manager.sortHandlers();
			manager.__hasSmileysHandler = false;
		}
	}
};

Com_Zimbra_YMEmoticons.prototype.match =
function(line, startIndex) {
    this.re.lastIndex = this.reCaseSensitive.lastIndex = startIndex;
    var m =  this.re.exec(line) || this.reCaseSensitive.exec(line) ;

	if (m) {
		m.context = this.hash[m[1].toLowerCase()];
		// preload
		var img = new Image();
		img.src = m.context.src;
		m.context.img = img;
	}
	return m;
};

Com_Zimbra_YMEmoticons.prototype.generateSpan =
function(html, idx, obj, spanId, context) {

	var h = context.height / 2;
	if (AjxEnv.isIE) {
		h = "0px"; // IE uses non-standard box model
	}
	html[idx++] = [
		"<span style='height:", context.height,
		";width:", context.width,
		";padding:", h,
		"px ", context.width,
		"px ", h,
		"px 0; " +
		"background:url(", context.img.src, ") no-repeat 0 50%;'",
		' title="', AjxStringUtil.xmlAttrEncode(context.text), ' - ',
		AjxStringUtil.xmlAttrEncode(context.alt), '"',
		// bug 72304 in IE and Chrome, an empty span with only background
		// image's position doesn't follow the element before, so add a
		// invisible character
		"><span style=\"visibility:hidden\">a</span></span>"
		
	].join("");

	return idx;
};

Com_Zimbra_YMEmoticons.prototype._smileyListener =
function(widget, ev){
	this._composeToolbarSmileyListener(widget.getEditor(), ev);
};

Com_Zimbra_YMEmoticons.prototype._composeToolbarSmileyListener =
function(editor, ev){
	if (!editor) { return; }

	var smiley = ev.item.getSelectedSmiley();
	if (smiley) {
		editor.insertText(smiley.text);
		editor.focus();
	}
};

Com_Zimbra_YMEmoticons.prototype.menuItemSelected =
function(itemId) {
	switch (itemId) {
		case "YE_TEMP_DISABLE":	this.temporarilyDisable(); break;
		case "YE_PREFERENCES":	this._showPreferenceDlg(); break;
	}
};

Com_Zimbra_YMEmoticons.prototype.doubleClicked =
function() {
	this.singleClicked();
};

Com_Zimbra_YMEmoticons.prototype.singleClicked =
function() {
	this._showPreferenceDlg();
};

Com_Zimbra_YMEmoticons.prototype.temporarilyDisable =
function() {
	this._isEnabled = false;
	var transitions = [ZmToast.FADE_IN, ZmToast.PAUSE, ZmToast.FADE_OUT];
	appCtxt.getAppController().setStatusMsg(this.getMessage("yahoo_emoticons_toaster_temporarily_disabled"), ZmStatusView.LEVEL_INFO, null, transitions);
};

Com_Zimbra_YMEmoticons.prototype._showPreferenceDlg =
function() {
	//if zimlet dialog already exists...
	if (this._preferenceDialog) {
		this._preferenceDialog.popup();
		return;
	}
	this._preferenceView = new DwtComposite(this.getShell());
	this._preferenceView.getHtmlElement().style.overflow = "auto";
	this._preferenceView.getHtmlElement().innerHTML = this._createPrefView();
	this._preferenceDialog = this._createDialog({title: this.getMessage("yahoo_emoticons_pref_dialog_title"), view: this._preferenceView, standardButtons: [DwtDialog.OK_BUTTON], id: "YahooEmoticonsPrefs"});
	this._preferenceDialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._okPreferenceBtnListener));

	if (!this.enableInMail) {
		this.enableInMail = Boolean(this.getUserProperty("yemoticons_enableInMail"));
	}

	document.getElementById("yemoticons_enableInMail_div").checked = this.enableInMail;
	this._preferenceDialog.popup();
};

Com_Zimbra_YMEmoticons.prototype._createPrefView =
function() {
	return [
		"<div class='ymemoticonsPrefDialog'>",
		"<input id='yemoticons_enableInMail_div' type='checkbox'/>",
		this.getMessage("enableInMail"),
		"</div>"
	].join("");
};

Com_Zimbra_YMEmoticons.prototype._okPreferenceBtnListener =
function() {
	this._preferenceDialog.popdown();
	var domVal = document.getElementById("yemoticons_enableInMail_div").checked;
	if (domVal != this.enableInMail) {
		this.setUserProperty("yemoticons_enableInMail", domVal, true);
		this.enableInMail = domVal;
		var ed = domVal ? this.getMessage("yahoo_emoticons_toaster_enabled") : this.getMessage("yahoo_emoticons_toaster_disabled");
		var transitions = [ZmToast.FADE_IN, ZmToast.PAUSE, ZmToast.FADE_OUT];
		appCtxt.getAppController().setStatusMsg(ed, ZmStatusView.LEVEL_INFO, null, transitions);
	} 
};
