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
 * Constructor.
 * 
 * @author Raja Rao DV (rrao@zimbra.com)
 */
function ZmAboutZimlet() {
}

ZmAboutZimlet.prototype = new ZmZimletBase();
ZmAboutZimlet.prototype.constructor = ZmAboutZimlet;

ZmAboutZimlet.prototype._getContent = function() {
	var subs = {
			version : appCtxt.getSettings().getInfoResponse.version,
			userAgent : [this.getMessage("userAgent"), " ", navigator.userAgent].join(""),
			copyright: this.getMessage("copyright")
		};
		return AjxTemplate.expand(
				"com_zimbra_about.templates.About#DialogView", subs);

};

/**
 * Called when user single-clicks on the panel
 */
ZmAboutZimlet.prototype.singleClicked = function() {
	var dlg = appCtxt.getMsgDialog();
	dlg.reset();
	var content = this._getContent();
	dlg.setTitle(this.getMessage("label"));
	dlg.setContent(content);
	dlg.popup();
};

/**
 * Called when user double-clicks on the panel
 */
ZmAboutZimlet.prototype.doubleClicked = function() {
	this.singleClicked();
};
