/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
function LinkedInPrefDialog(zimlet) {
	this.zimlet = zimlet;
	this._shell = zimlet.getShell();
}

LinkedInPrefDialog.MY_LINKEDIN_URL = "https://api.linkedin.com/v1/people/~";

LinkedInPrefDialog.prototype.popup =
function() {
	if (this.prefDlg) {
		this.prefDlg.popup();
		return;
	}
	this.prefView = new DwtComposite(this._shell);
	this.prefView.getHtmlElement().innerHTML = this._createPreferenceView();
	this.prefDlg = new ZmDialog({parent:this._shell, title:this.zimlet.getMessage("preferences"), view:this.prefView, standardButtons:[DwtDialog.OK_BUTTON]});
	this._setPreferences();
	this.prefDlg.popup();
};

LinkedInPrefDialog.prototype.popdown =
function() {
	if (this.prefDlg) {
		this.prefDlg.popdown();
	}
};

LinkedInPrefDialog.prototype._setPreferences =
function() {
	this.linkedInZimlet_oauth_token = this.zimlet.getUserProperty("linkedInZimlet_oauth_token");
	this.linkedInZimlet_oauth_token_secret = this.zimlet.getUserProperty("linkedInZimlet_oauth_token_secret");
	this.linkedInZimlet_account_name = this.zimlet.getUserProperty("linkedInZimlet_account_name");
	var accntName = this.zimlet.getMessage("accountNotSet");
	if (this.linkedInZimlet_account_name) {
		accntName = this.linkedInZimlet_account_name;
	}
	document.getElementById("linkedInZimlet_accountName").innerHTML = accntName;

	var btn = new DwtButton({parent:this._shell});
	btn.setText(this.zimlet.getMessage("addLinkedInAccount"));
	btn.setImage("LinkedinZimletIcon");
	btn.addSelectionListener(new AjxListener(this, this._makeOAuthCall));
	document.getElementById("linkedInZimlet_AddAccntBtn").appendChild(btn.getHtmlElement());
};

LinkedInPrefDialog.prototype._createPreferenceView =
function() {
	return AjxTemplate.expand("com_zimbra_linkedin.templates.LinkedIn#PreferenceView");
};

LinkedInPrefDialog.prototype._makeOAuthCall =
function() {
	if (!this._oauth) {
		var oauthResultCallback = new AjxCallback(this, this._handleOAuthResult);
		this._oauth = new LinkedInZimletOAuth(this.zimlet, oauthResultCallback);
	}
	this._oauth.showOAuthDialog();
};

LinkedInPrefDialog.prototype._handleOAuthResult =
function(result) {
	if (!result.success) {
		if (result.httpResponse) {
			this.zimlet.showWarningMsg(result.httpResponse.text);
		} else {
			this.zimlet.showWarningMsg(this.zimlet.getMessage("unknownError"));
		}
		return;
	}
	
	var oauthTokens = result.oauthTokens;
	this.linkedInZimlet_oauth_token = oauthTokens["oauth_token"];
	this.linkedInZimlet_oauth_token_secret = oauthTokens["oauth_token_secret"];
	this._oauth.setAuthTokens({"oauth_token": this.linkedInZimlet_oauth_token, "oauth_token_secret": this.linkedInZimlet_oauth_token_secret});
	//get userName
	var userNameCallback = new AjxCallback(this, this._userNameHandler);
	this._oauth.makeHTTPGet({url: LinkedInPrefDialog.MY_LINKEDIN_URL, callback: userNameCallback});
};


LinkedInPrefDialog.prototype._userNameHandler =
function(result) {
	if (!result.success) {
		if (result.httpResponse) {
			this.zimlet.showWarningMsg(result.httpResponse.text);
		} else {
			this.zimlet.showWarningMsg(this.zimlet.getMessage("unknownError"));
		}
		return;
	}
	
	var xd = new AjxXmlDoc.createFromDom(result.xml).toJSObject(true, false);
	var name = "";
	if (xd["first-name"]) {
		name = xd["first-name"].toString() + " ";
	}
	if (xd["last-name"]) {
		name += xd["last-name"].toString();
	}
	if (document.getElementById("linkedInZimlet_accountName")) {
		document.getElementById("linkedInZimlet_accountName").innerHTML = name;
	}
	this.zimlet.setUserProperty("linkedInZimlet_account_name", name);
	this.zimlet.setUserProperty("linkedInZimlet_oauth_token", this.linkedInZimlet_oauth_token);
	this.zimlet.setUserProperty("linkedInZimlet_oauth_token_secret", this.linkedInZimlet_oauth_token_secret);
	this.zimlet.saveUserProperties();
};