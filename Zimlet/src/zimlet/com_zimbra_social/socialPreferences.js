/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

function com_zimbra_socialPreferences(zimlet) {
	this.zimlet = zimlet;
	this.shell = this.zimlet.getShell();
	this._fbNeedPermCount = 0;
	this.social_pref_trendsPopularIsOn = this.zimlet.getUserProperty("social_pref_trendsPopularIsOn") == "true";
	this.social_pref_SocialMailUpdateOn = this.zimlet.getUserProperty("social_pref_SocialMailUpdateOn") == "true";
	this.social_pref_dontShowWelcomeScreenOn = this.zimlet.getUserProperty("social_pref_dontShowWelcomeScreenOn") == "true";
	this.social_pref_showTweetAlertsOn = this.zimlet.getUserProperty("social_pref_showTweetAlertsOn") == "true";
	this.social_pref_cardWidthList = this.zimlet.getUserProperty("social_pref_cardWidthList");
	this.social_pref_numberofTweetsToReturn = parseInt(this.zimlet.getUserProperty("social_pref_numberofTweetsToReturn"));
	this.social_pref_numberofTweetsSearchesToReturn = parseInt(this.zimlet.getUserProperty("social_pref_numberofTweetsSearchesToReturn"));
	this.social_pref_autoShortenURLOn = this.zimlet.getUserProperty("social_pref_autoShortenURLOn") == "true";
	this.social_pref_socializeBtnOn = this.zimlet.getUserProperty("social_pref_socializeBtnOn") == "true";
}

com_zimbra_socialPreferences.prototype._showManageAccntsDlg = function() {
	//if zimlet dialog already exists...
	if (this._manageAccntsDlg) {
		this._updateAccountsTable();
		this._updateAllFBPermissions();
		this._manageAccntsDlg.popup();
		return;
	}
	this._manageAccntsView = new DwtComposite(this.shell);
	this._manageAccntsView.setSize(550, 300);
	this._manageAccntsView.getHtmlElement().style.overflow = "auto";
	this._manageAccntsView.getHtmlElement().innerHTML = this._createManageeAccntsView();
	this._manageAccntsDlg = this.zimlet._createDialog({title:this.zimlet.getMessage("addRemoveAccounts"), view:this._manageAccntsView, standardButtons:[DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON]});
	this._manageAccntsDlg.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._manageAccntsOKBtnListener));
	this._addPrefButtons();
	this._updateAccountsTable();
	this._updateAllFBPermissions();

	this._manageAccntsDlg.popup();
};



com_zimbra_socialPreferences.prototype._addPrefButtons =
function() {
	/*var addTwitterBtn = new DwtButton({parent:this.zimlet.getShell()});
	addTwitterBtn.setText(this.zimlet.getMessage("addTwitterAcc"));
	addTwitterBtn.setImage("social_twitterIcon");
	addTwitterBtn.addSelectionListener(new AjxListener(this, this._addTwitterBtnListener));
	document.getElementById("social_pref_addTwitterButtonCell").appendChild(addTwitterBtn.getHtmlElement());

	var addFacebookBtn = new DwtButton({parent:this.zimlet.getShell()});
	addFacebookBtn.setText(this.zimlet.getMessage("addFacebookAcc"));
	addFacebookBtn.setImage("social_facebookIcon");
	addFacebookBtn.addSelectionListener(new AjxListener(this, this._addFacebookBtnListener));
	document.getElementById("social_pref_addFaceBookButtonCell").appendChild(addFacebookBtn.getHtmlElement());
   */
	var btn = new DwtButton({parent:this.zimlet.getShell()});
	btn.setText(this.zimlet.getMessage("addAccounts"));
	btn.setImage("social-panelIcon");
	var menu = new ZmPopupMenu(btn);
	btn.setMenu(menu);
	document.getElementById("social_pref_addAccountsCell").appendChild(btn.getHtmlElement());

	var id = "social_pref_add_twitter_account";
	var mi = menu.createMenuItem(id, {image:"social_twitterIcon", text:this.zimlet.getMessage("addTwitterAcc")});
	mi.addSelectionListener(new AjxListener(this, this._addTwitterBtnListener));

	var id = "social_pref_add_fb_account";
	var mi = menu.createMenuItem(id, {image:"social_facebookIcon", text:this.zimlet.getMessage("addFacebookAcc")});
	mi.addSelectionListener(new AjxListener(this, this._addFacebookBtnListener));


	var deleteAccountBtn = new DwtButton({parent:this.zimlet.getShell()});
	deleteAccountBtn.setText(this.zimlet.getMessage("deleteAcc"));
	deleteAccountBtn.setImage("Trash");
	deleteAccountBtn.addSelectionListener(new AjxListener(this, this._deleteAccountBtnListener));
	document.getElementById("social_pref_deleteAccountCell").appendChild(deleteAccountBtn.getHtmlElement());

	var refreshTableBtn = new DwtButton({parent:this.zimlet.getShell()});
	refreshTableBtn.setText( this.zimlet.getMessage("refreshAcc"));
	refreshTableBtn.setImage("Refresh");
	refreshTableBtn.addSelectionListener(new AjxListener(this, this._refreshTableBtnListener));
	document.getElementById("social_pref_refreshTableCell").appendChild(refreshTableBtn.getHtmlElement());
};

com_zimbra_socialPreferences.prototype._refreshTableBtnListener =
function() {
	this._updateAllFBPermissions();
};

com_zimbra_socialPreferences.prototype._addTwitterBtnListener =
function() {
	this.zimlet.twitter.performOAuth();
};

com_zimbra_socialPreferences.prototype._addFacebookBtnListener =
function() {
	this.showAddFBInfoDlg();
	//this.zimlet.facebook.showFBWindow();
};

com_zimbra_socialPreferences.prototype._deleteAccountBtnListener =
function() {
	var needToUpdateAllAccounts = false;

	var hasAllAccounts = false;
	var newAllAccounts = new Array();
	for (var id in this.zimlet.allAccounts) {
		hasAllAccounts = true;
		if (!document.getElementById("social_pref_accnts_checkbox" + id).checked) {
			newAllAccounts[id] = this.zimlet.allAccounts[id];
		} else {
			needToUpdateAllAccounts = true;
		}
	}
	var newSAAccount = [];
	if (needToUpdateAllAccounts && hasAllAccounts) {
		this.zimlet.allAccounts = newAllAccounts;
		this.zimlet.setUserProperty("social_AllTwitterAccounts", this.zimlet.getAllAccountsAsString());
	}

	if (needToUpdateAllAccounts) {
		this.zimlet.saveUserProperties();
		this._updateAccountsTable();
		this.zimlet._updateAllWidgetItems({updateSearchTree:false, updateSystemTree:true, updateAccntCheckboxes:true, searchCards:false});
	}
};

com_zimbra_socialPreferences.prototype._createManageeAccntsView =
function() {
	var html = new Array();
	var i = 0;
	html[i++] = "<BR/>";
	html[i++] = "<DIV class='social_topWgtClass' >";
	html[i++] = "<table width=400px cellpadding=2 cellspacing=2>";
	html[i++] = "<TR>";
	html[i++] = "<TD>";
	html[i++] = "<label style=\"font-size:12px;color:black;font-weight:bold\">"+ this.zimlet.getMessage("manageAccounts");
	html[i++] = "</label>";
	html[i++] = "</TD>";
	html[i++] = "</TR>";
	html[i++] = "</table>";
	html[i++] = "</DIV>";

	html[i++] = "<DIV class='social_white' id='social_pref_accntsTable'>";
	html[i++] = this._getPrefAccountsTableHTML();
	html[i++] = "</DIV>";
	html[i++] = "<BR>";
	html[i++] = "<BR>";
	html[i++] = "<DIV>";
	html[i++] = "<table align='center'>";
	html[i++] = "<TR>";
	html[i++] = "<TD  id='social_pref_addAccountsCell'>";
	html[i++] = "</TD>";
	html[i++] = "<TD id='social_pref_refreshTableCell'>";
	html[i++] = "</TD>";
	html[i++] = "<TD  id='social_pref_deleteAccountCell'>";
	html[i++] = "</TD>";
	html[i++] = "</TR>";
	html[i++] = "</table>";
	html[i++] = "</DIV>";
	html[i++] = "<BR/>";
	html[i++] = "<DIV id='social_prefDlg_currentStateMessage' class='social_yellowBold' style='display:none'>";
	html[i++] = "</DIV >";
	html[i++] = "<BR/>";
	html[i++] = "<BR/>";
	html[i++] = "<BR/>";
	return html.join("");
};

com_zimbra_socialPreferences.prototype._updateAccountsTable =
function(additionalMsgParams) {
	var table = document.getElementById("social_pref_accntsTable");
	if (!table) {
		return;
	}
	table.innerHTML = this._getPrefAccountsTableHTML();
	for (var i = 0; i < this._authorizeDivIdAndAccountMap.length; i++) {
		var map = this._authorizeDivIdAndAccountMap[i];
		var authBtn = new DwtButton({parent:this.zimlet.getShell()});
		authBtn.setText("Authorize");
		authBtn.addSelectionListener(new AjxListener(this, this._authorizeBtnListener, map));
		document.getElementById(map.divId).appendChild(authBtn.getHtmlElement());
	}
	if (this._fbNeedPermCount != 0) {
		this._setAccountPrefDlgAuthMessage(this.zimlet.getMessage("authorizeZimbraToAccessFacebook"), "blue");
	} else {
		this._setAccountPrefDlgAuthMessage(this.zimlet.getMessage("accountsUpdated"), "green");
	}
};

com_zimbra_socialPreferences.prototype._setAccountPrefDlgAuthMessage =
function (message, color) {
	var msg = document.getElementById("social_prefDlg_currentStateMessage");
	if (!msg) {
		return;
	}
	msg.innerHTML = "<label style='color:" + color + "'>" + message + "</label>";
	document.getElementById("social_prefDlg_currentStateMessage").style.display = "block";
};

com_zimbra_socialPreferences.prototype._updateAllFBPermissions =
function(additionalMsgParams) {
	//this didn't do anything logical. I have no idea what it was trying to do and how it was trying to actually get the answer to whether it has perms and what it is supposed to do with
	//that answer. Also additionalMsgParams is never passed.
	// I don't even understand how _getExtendedPermissionInfo (which I deleted) was not running into an infinate loop of requests, as it was passing itself with same params as callback.
};

 /*
com_zimbra_socialPreferences.prototype._authorizeBtnListener =
function(params) {
	var permName = "";
	if (params.permission == "read_stream")
		permName = "read";
	else if (params.permission == "publish_stream")
		permName = "write/publish";
	else if (params.permission == "offline_access")
			permName = "offline/rememberMe";

	this._addFacebookBtnListener();
};
*/
com_zimbra_socialPreferences.prototype._getPrefAccountsTableHTML =
function() {
	this._authorizeDivIdAndAccountMap = [];
	var html = [];
	var i = 0;
	var noAccountsFound = true;
	this._fbNeedPermCount = 0;
	this._fbNeedPermissions = "";
	html[i++] = "<table width=100% border=1 cellspacing=0 cellpadding=3>";
	html[i++] = "<TR><TH>"+this.zimlet.getMessage("select")+"</TH><TH>"
		+this.zimlet.getMessage("accountType")+
		"</TH><TH>"+this.zimlet.getMessage("accountName")+
		"</TH><TH>"+this.zimlet.getMessage("accountActivated")+
		"</TH>";
	/*"<TH>"+this.zimlet.getMessage("writePermission")+
		"</TH><TH>"+this.zimlet.getMessage("rememberMePermission")+"</TH>";
		*/
	for (var id in this.zimlet.allAccounts) {
		var account = this.zimlet.allAccounts[id];
		var accIcon;
		var statIcon;
		if (account.type == "twitter") {
			accIcon = "social_twitterIcon";
			statIcon = "social_checkIcon";
		} else if(account.type == "facebook") {
			accIcon = "social_facebookIcon";
			statIcon = "social_checkIcon";
		}
		var params = {id:id, type: account.type, accIcon: accIcon, statIcon:statIcon, name:account.name};
		html[i++] = this._getAccountPrefRowHtml(params);
		noAccountsFound = false;
	}
	if (noAccountsFound) {
		html[i++] = "<TR>";
		html[i++] = "<TD colspan=6 align='center' style='font-weight:bold;font-size:12px;color:blue'>";
		html[i++] = this.zimlet.getMessage("noAccountsFound");
		html[i++] = "</TD>";
		html[i++] = "</TR>";
	}
	html[i++] = "</table>";
	return html.join("");
};

com_zimbra_socialPreferences.prototype._getAccountPrefRowHtml = function(params) {
		var html = [];
		var i = 0;
		html[i++] = "<TR>";
		html[i++] = "<TD width=16px>";
		html[i++] = "<input type='checkbox' id='social_pref_accnts_checkbox" + params.id + "' />";
		html[i++] = "</TD>";
		html[i++] = "<TD  align='center'>";
		html[i++] = AjxImg.getImageHtml(params.accIcon);
		html[i++] = "</TD>";
		html[i++] = "<TD align='center'>";
		html[i++] = "<label style=\"font-size:12px;color:black;font-weight:bold\">";
		html[i++] = params.name;
		html[i++] = "</label>";
		html[i++] = "</TD>";
		html[i++] = "<TD  align='center'>";
		html[i++] = AjxImg.getImageHtml(params.statIcon);
		html[i++] = "</TD>";
		html[i++] = "</TR>";
	return html.join("");
};
com_zimbra_socialPreferences.prototype._setNeedPermission =
function(permission) {
	if (this._fbNeedPermissions == "")
		this._fbNeedPermissions = permission;
	else
		this._fbNeedPermissions = this._fbNeedPermissions + "," + permission;
};
com_zimbra_socialPreferences.prototype._manageAccntsOKBtnListener =
function() {
	this.zimlet.setUserProperty("social_AllTwitterAccounts", this.zimlet.getAllAccountsAsString(), true);
	this.zimlet._updateAllWidgetItems({updateSearchTree:false, updateSystemTree:true, updateAccntCheckboxes:true, searchCards:false});
	this._manageAccntsDlg.popdown();

};

com_zimbra_socialPreferences.prototype.getAddFBInfoDlg = function() {
	return this._getFbInfoDialog;
};

com_zimbra_socialPreferences.prototype.hideAddFBInfoDlg = function(obj) {
	if (!this._getFbInfoDialog) {
		return;
	}
	this._getFbInfoDialog.popdown();
};


com_zimbra_socialPreferences.prototype.showAddFBInfoDlg = function(obj) {
	//if zimlet dialog already exists...
	if (this._getFbInfoDialog) {
		this._getFbInfoDialog.popup();
		return;
	}
	this._getFbInfoView = new DwtComposite(this.zimlet.getShell());
	this._getFbInfoView.getHtmlElement().style.overflow = "auto";
	this._getFbInfoView.setSize(590);

	this._getFbInfoView.getHtmlElement().innerHTML = this._createFbInfoView();
	var className = this._getFbInfoView.getHtmlElement().className;
	this._getFbInfoView.getHtmlElement().className = className + " social_fbLoginContainer";
	
	var addFBAccntButtonId = Dwt.getNextId();
	var addFBAccntButton = new DwtDialog_ButtonDescriptor(addFBAccntButtonId, ("Authorized"), DwtDialog.ALIGN_RIGHT);
	this._getFbInfoDialog = this.zimlet._createDialog({title:this.zimlet.getMessage("addFacebookAcc"), view:this._getFbInfoView, standardButtons:[DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON]});
	this._getFbInfoDialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._getFbInfoOKBtnListener));

	this.goButton = new DwtButton({parent:this.zimlet.getShell()});
	this.goButton.setText(this.zimlet.getMessage("goToFacebook"));
	this.goButton.setImage("social_facebookIcon");
	this.goButton.addSelectionListener(new AjxListener(this.zimlet.facebook, this.zimlet.facebook.loginToFB, null));

	document.getElementById("social_goToFacebookPage").appendChild(this.goButton.getHtmlElement());

	this._getFbInfoDialog.popup();
};

com_zimbra_socialPreferences.prototype._getFbInfoOKBtnListener = function() {
	this._refreshTableBtnListener();
	this._getFbInfoDialog.popdown();
};

com_zimbra_socialPreferences.prototype._createFbInfoView =
function() {
	var html = [];
	var i = 0;
	html[i++] = "<DIV>";
	html[i++] =  AjxMessageFormat.format(this.zimlet.getMessage("logoutfirst"), "Facebook")+"<br/><br/>";
	html[i++] = this.zimlet.getMessage("fbSignInLine1") + " <div id='social_goToFacebookPage'> </div>";
	html[i++] = "<br/><br/>";

	html[i++] = "</DIV>";
	return html.join("");
};

com_zimbra_socialPreferences.prototype._showPreferencesDlg = function() {
	//if zimlet dialog already exists...
	if (this._getPrefDialog) {
		this._setPrefCheckboxes();
		this._getPrefDialog.popup();
		return;
	}
	this._getPrefView = new DwtComposite(this.zimlet.getShell());
	this._getPrefView.getHtmlElement().style.overflow = "auto";
	this._getPrefView.getHtmlElement().innerHTML = this._createPrefView();
	this._getPrefDialog = this.zimlet._createDialog({title:this.zimlet.getMessage("socialZimletPreferences"), view:this._getPrefView, standardButtons:[DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON]});
	this._getPrefDialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._okPrefBtnListener));
	this._getPrefDialog.popup();
	this._setPrefCheckboxes();

};

com_zimbra_socialPreferences.prototype._okPrefBtnListener =
function() {
	var save = false;
	var currentVal;
	currentVal = document.getElementById("social_pref_trendsPopularIsOn").checked;
	if (this.social_pref_trendsPopularIsOn != currentVal) {
		this.zimlet.setUserProperty("social_pref_trendsPopularIsOn", currentVal);
		save = true;
	}
	currentVal = document.getElementById("social_pref_socializeBtnOn").checked;
	if (this.social_pref_socializeBtnOn != currentVal) {
		this.zimlet.setUserProperty("social_pref_socializeBtnOn", currentVal);
		save = true;
	}
	
	currentVal = document.getElementById("social_pref_SocialMailUpdateOn").checked;
	if (this.social_pref_SocialMailUpdateOn != currentVal) {
		this.zimlet.setUserProperty("social_pref_SocialMailUpdateOn", currentVal);
		save = true;
	}
	currentVal = document.getElementById("social_pref_showTweetAlertsOn").checked;
	if (this.social_pref_showTweetAlertsOn != currentVal) {
		this.zimlet.setUserProperty("social_pref_showTweetAlertsOn", currentVal);
		save = true;
	}

	currentVal = document.getElementById("social_pref_cardWidthList").value;
	if (this.social_pref_cardWidthList != currentVal) {
		this.zimlet.setUserProperty("social_pref_cardWidthList", currentVal);
		save = true;
	}
	currentVal = document.getElementById("social_pref_numberofTweetsToReturn").value;
	if (this.social_pref_numberofTweetsToReturn != parseInt(currentVal)) {
		this.zimlet.setUserProperty("social_pref_numberofTweetsToReturn", currentVal);
		save = true;
	}
	currentVal = document.getElementById("social_pref_numberofTweetsSearchesToReturn").value;
	if (this.social_pref_numberofTweetsSearchesToReturn != parseInt(currentVal)) {
		this.zimlet.setUserProperty("social_pref_numberofTweetsSearchesToReturn", currentVal);
		save = true;
	}

	if (save) {
		this.zimlet.saveUserProperties(new AjxCallback(this, this.showYesNoDialog));
		appCtxt.getAppController().setStatusMsg(this.zimlet.getMessage("preferencesSaved"), ZmStatusView.LEVEL_INFO);
	}

	this._getPrefDialog.popdown();
};

com_zimbra_socialPreferences.prototype.showYesNoDialog =
function() {
	var dlg = appCtxt.getYesNoMsgDialog();
	dlg.registerCallback(DwtDialog.YES_BUTTON, this._yesButtonClicked, this, dlg);
	dlg.registerCallback(DwtDialog.NO_BUTTON, this._NoButtonClicked, this, dlg);
	dlg.setMessage(this.zimlet.getMessage("browserMustBeRefreshed"), DwtMessageDialog.WARNING_STYLE);
	dlg.popup();
};

com_zimbra_socialPreferences.prototype._yesButtonClicked =
function(dlg) {
	dlg.popdown();
	this._refreshBrowser();
};

com_zimbra_socialPreferences.prototype._NoButtonClicked =
function(dlg) {
	dlg.popdown();
}

com_zimbra_socialPreferences.prototype._refreshBrowser =
function() {
	window.onbeforeunload = null;
	var url = AjxUtil.formatUrl({});
	ZmZimbraMail.sendRedirect(url);
};

com_zimbra_socialPreferences.prototype._setPrefCheckboxes = function() {
	if (this.social_pref_trendsPopularIsOn) {
		document.getElementById("social_pref_trendsPopularIsOn").checked = true;
	}
	if (this.social_pref_socializeBtnOn) {
		document.getElementById("social_pref_socializeBtnOn").checked = true;
	}
	if (this.social_pref_SocialMailUpdateOn) {
		document.getElementById("social_pref_SocialMailUpdateOn").checked = true;
	}
	if (this.social_pref_showTweetAlertsOn) {
		document.getElementById("social_pref_showTweetAlertsOn").checked = true;
	}
	var list = document.getElementById("social_pref_cardWidthList");
	for (var i = 0; i < list.options.length; i++) {
		if (list.options[i].value == this.social_pref_cardWidthList) {
			list.options[i].selected = true;
			break;
		}
	}
	var list = document.getElementById("social_pref_numberofTweetsToReturn");
	for (var i = 0; i < list.options.length; i++) {
		if (list.options[i].value == this.social_pref_numberofTweetsToReturn) {
			list.options[i].selected = true;
			break;
		}
	}
	var list = document.getElementById("social_pref_numberofTweetsSearchesToReturn");
	for (var i = 0; i < list.options.length; i++) {
		if (list.options[i].value == this.social_pref_numberofTweetsSearchesToReturn) {
			list.options[i].selected = true;
			break;
		}
	}

};

com_zimbra_socialPreferences.prototype._createPrefView =
function() {
	var html = new Array();
	var i = 0;
	html[i++] = "<label style='font-weight:bold'>"+this.zimlet.getMessage("socialAppPreferences")+"</label>";
	html[i++] = "<BR/>";
	html[i++] = "<table>";
	html[i++] = "<tr><td><input type='checkbox' id='social_pref_trendsPopularIsOn' /></td><td width=100%>"+this.zimlet.getMessage("showTopTwitterTrendsByDefault")+"</td></tr>";

	html[i++] = "</table>";
	html[i++] = "<table>";
	html[i++] = "<tr><td>"+this.zimlet.getMessage("feedCardWidth") +"</td><td>" + this._createCardWidthList() + "</td></tr>";
	html[i++] = "<tr><td >"+this.zimlet.getMessage("numberOfTweetsToReturn")+"</td><td>" + this._createNumberOfTweetsToReturnList() + "</td></tr>";
	html[i++] = "<tr><td>"+this.zimlet.getMessage("numberOfTwitterSearchesToReturn")+"</td><td>" + this._createNumberOfTweetSearchesToReturnList() + "</td></tr>";
	html[i++] = "</table>";

	html[i++] = "<BR/>";
	html[i++] = "<BR/>";
	html[i++] = "<label style='font-weight:bold'>"+this.zimlet.getMessage("socialZimlbraIntegrationPref")+"</label>";
	html[i++] = "<BR/>";
	html[i++] = "<table>";
	html[i++] = "<tr><td><input type='checkbox' id='social_pref_SocialMailUpdateOn' /></td><td width=100%>"+this.zimlet.getMessage("sendSocialMail")+"</td></tr>";
	html[i++] = "<tr><td><input type='checkbox' id='social_pref_showTweetAlertsOn' /></td><td width=100%>"+this.zimlet.getMessage("showTweetAlert")+"</td></tr>";
	html[i++] = "<tr><td><input type='checkbox' id='social_pref_socializeBtnOn' /></td><td width=100%>"+this.zimlet.getMessage("showSocializeBtn")+"</td></tr>";

	html[i++] = "</table>";
	return html.join("");
};

com_zimbra_socialPreferences.prototype._createCardWidthList =
function() {
	var html = new Array();
	var i = 0;
	html[i++] = "<select id='social_pref_cardWidthList'>";
	var sizes = [
		{
			name:this.zimlet.getMessage("verySmall"),
			val:"300px"
		},
		{
			name:this.zimlet.getMessage("small"),
			val:"350px"
		},
		{
			name:this.zimlet.getMessage("medium"),
			val:"400px"
		},
		{
			name:this.zimlet.getMessage("large"),
			val:"450px"
		},
		{
			name:this.zimlet.getMessage("xl"),
			val:"500px"
		},
		{
			name:this.zimlet.getMessage("2xl"),
			val:"550px"
		},
		{
			name:this.zimlet.getMessage("3xl"),
			val:"600px"
		}
	];
	for (var j = 0; j < sizes.length; j++) {
		html[i++] = "<option value='" + sizes[j].val + "'>" + sizes[j].name + " (" + sizes[j].val + ")</option>";
	}
	html[i++] = "</select>";
	return html.join("");
};

com_zimbra_socialPreferences.prototype._createNumberOfTweetsToReturnList =
function() {
	var html = new Array();
	var i = 0;
	html[i++] = "<select id='social_pref_numberofTweetsToReturn'>";
	var sizes = [
		{
			name:"50",
			val:"50"
		},
		{
			name:"100",
			val:"100"
		},
		{
			name:"150",
			val:"150"
		},
		{
			name:"200",
			val:"200"
		}
	];

	for (var j = 0; j < sizes.length; j++) {
		html[i++] = "<option value='" + sizes[j].val + "'>" + sizes[j].name + "</option>";
	}
	html[i++] = "</select>";
	return html.join("");
};

com_zimbra_socialPreferences.prototype._createNumberOfTweetSearchesToReturnList =
function() {
	var html = new Array();
	var i = 0;
	html[i++] = "<select id='social_pref_numberofTweetsSearchesToReturn'>";
	var sizes = [
		{
			name:"50",
			val:"50"
		},
		{
			name:"100",
			val:"100"
		}
	];

	for (var j = 0; j < sizes.length; j++) {
		html[i++] = "<option value='" + sizes[j].val + "'>" + sizes[j].name + "</option>";
	}
	html[i++] = "</select>";
	return html.join("");
};

com_zimbra_socialPreferences.prototype._setWelCheckboxes = function() {
	if (this.social_pref_dontShowWelcomeScreenOn)
		document.getElementById("social_pref_dontShowWelcomeScreenOn").checked = true;

};

com_zimbra_socialPreferences.prototype._okWelBtnListener =
function() {
	var save = false;
	var currentVal = document.getElementById("social_pref_dontShowWelcomeScreenOn").checked;
	if (this.social_pref_dontShowWelcomeScreenOn != currentVal) {
		this.zimlet.setUserProperty("social_pref_dontShowWelcomeScreenOn", currentVal);
		save = true;
	}
	if (save) {
		this.zimlet.saveUserProperties();
		appCtxt.getAppController().setStatusMsg(this.zimlet.getMessage("preferencesSaved"), ZmStatusView.LEVEL_INFO);
	}
	this._getwelDialog.popdown();
};
com_zimbra_socialPreferences.prototype._showWelcomeDlg = function() {
	if (this._getwelDialog) {
		this._setWelCheckboxes();
		this._getwelDialog.popup();
		return;
	}
	this._getWelView = new DwtComposite(this.zimlet.getShell());
	this._getWelView.getHtmlElement().style.overflow = "auto";
	this._getWelView.getHtmlElement().innerHTML = this._createWelView();
	this._getwelDialog = this.zimlet._createDialog({title:this.zimlet.getMessage("zimbraSocial"), view:this._getWelView, standardButtons:[DwtDialog.OK_BUTTON], id: "SocialZimlet_WelcomeDlg"});
	this._getwelDialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._okWelBtnListener));
	this._getwelDialog.popup();
	this._setWelCheckboxes();
};

com_zimbra_socialPreferences.prototype._createWelView =
function() {
	var html = new Array();
	var i = 0;
	html[i++] = "<DIV  id='SocialZimlet_WelcomeDlgTxt' class='social_yellow'>";
	html[i++] = " <h3 align=center>"+this.zimlet.getMessage("welcome")+"</h3>";
	html[i++] = "<b>"+this.zimlet.getMessage("gettingStarted")+"</b><br/>";
	html[i++] = "<ul>";
	html[i++] = "<li>"+this.zimlet.getMessage("welDlgLine1")+"</li>";
	html[i++] = "</ul><b>"+this.zimlet.getMessage("thingsToDo")+"</b>";
	html[i++] = "<ul>";
	html[i++] = "<li>"+this.zimlet.getMessage("thingsToDo1")+"</li>";
	html[i++] = "<li>"+this.zimlet.getMessage("thingsToDo3")+"</li>";
	html[i++] = "<li>"+this.zimlet.getMessage("thingsToDo4")+"</li>";

	html[i++] = "</ul>";
	html[i++] = this.zimlet.getMessage("takeA")+" <label id='SocialZimlet_takeATourLnk' style=\"color:blue;text-decoration: underline;font-weight:bold\"><a href='http://wiki.zimbra.com/index.php?title=Social' target=\"_blank\">"+
		this.zimlet.getMessage("quickTour")+"</a></label> "+this.zimlet.getMessage("forExtraHelp");
	html[i++] = "<br/><br/><input type='checkbox' id='social_pref_dontShowWelcomeScreenOn' /><b/>"+ this.zimlet.getMessage("dontShowMeThisAgain");
	html[i++] = "</DIV>";
	return html.join("");
};