/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/*
* @author Raja Rao DV (rrao@zimbra.com)
*/

function com_zimbra_linkedin_handlerObject() {
};

com_zimbra_linkedin_handlerObject.prototype = new ZmZimletBase();
com_zimbra_linkedin_handlerObject.prototype.constructor = com_zimbra_linkedin_handlerObject;

var LinkedInZimlet = com_zimbra_linkedin_handlerObject;

//static variables
LinkedInZimlet.SEARCH_BASE_QUERY = "https://api.linkedin.com/v1/people-search:(people:(relation-to-viewer,id,first-name,last-name,picture-url,public-profile-url,headline,api-standard-profile-request))";
LinkedInZimlet.PEOPLE_BASE_QUERY = "http://api.linkedin.com/v1/people/~/mailbox";

/**
 * This method is called by Email Zimlet notifying this Zimlet(LinkedIn) to add LinkedIn slide to the tooltip
 */
LinkedInZimlet.prototype.onEmailHoverOver =
function(emailZimlet) {
	emailZimlet.addSubscriberZimlet(this, false);
	this.emailZimlet = emailZimlet;
	this._initializeZimlet();
	this._addSlide();
};

LinkedInZimlet.prototype._initializeZimlet =
function() {
	if(!this._oauth) {
		var oauthResultCallback = new AjxCallback(this, this._handleOAuthResult);
		this._oauth = new LinkedInZimletOAuth(this, oauthResultCallback);
	}
	this.linkedInZimlet_oauth_token = this.getUserProperty("linkedInZimlet_oauth_token");
	this.linkedInZimlet_oauth_token_secret = this.getUserProperty("linkedInZimlet_oauth_token_secret");
	this.linkedInZimlet_account_name = this.getUserProperty("linkedInZimlet_account_name");
	this._oauth.setAuthTokens({"oauth_token": this.linkedInZimlet_oauth_token, "oauth_token_secret": this.linkedInZimlet_oauth_token_secret});
};

LinkedInZimlet.prototype._addSlide =
function() {
	var tthtml = this._getTooltipBGHtml();
	var selectCallback =  new AjxCallback(this, this._handleSlideSelect);
	this._slide = new EmailToolTipSlide(tthtml, true, "LinkedinZimletIcon", selectCallback, this.getMessage("label"));
	this.emailZimlet.slideShow.addSlide(this._slide);
	this._slide.setCanvasElement(document.getElementById("linkedInZimlet_searchResultsDiv"));

	this._addSearchHandlers();
};

LinkedInZimlet.prototype._handleSlideSelect =
function() {
	if(this._slide.loaded) {
		return;
	}
	document.getElementById("linkedInZimlet_MainDiv").style.height = document.getElementById(this._slide.id).offsetHeight;
	if(!this.linkedInZimlet_oauth_token || !this.linkedInZimlet_oauth_token_secret || !this.linkedInZimlet_account_name) {
		this._showJoinLinkedInAccount();
		return;
	}
	var q = this._getDefaultQuery();
	this._searchLinkedIn(null, null, null, q);
	this._setSearchFieldValue(q);
	if(this._slide) {
		this._slide.loaded = true;	
	}
};

LinkedInZimlet.prototype._getDefaultQuery = function() {
	var name = "";
	if(this.emailZimlet.fullName != "") {
		name = this.emailZimlet.fullName;
	}
	var tmpArry = this.emailZimlet.emailAddress.split("@");
	var part1 = tmpArry[0] ?  tmpArry[0] : "";
	var part2 = "";
	if(tmpArry.length == 2) {
		var tmpArry2 = tmpArry[1].split(".");
		part2 = tmpArry2[0]? tmpArry2[0] : "";		
	}
	if(name != "") {
		return ["\"", name, "\"", " OR ", part1, " OR ", part2].join("");
	} else {
		return [part1, " OR ", part2].join("");
	}
};

/**
 * This method is called when the panel item is double-clicked.
 *
 */
LinkedInZimlet.prototype.doubleClicked = function() {
	this.singleClicked();
};

/**
 * Called by the Zimbra framework when a menu item is selected
 * dispatch the call, ensuring the webex configuration is set.
 *
 */
LinkedInZimlet.prototype.menuItemSelected = function(itemId) {
	switch (itemId) {
		case "linkedin_preferences":
			this.singleClicked();
			break;
	}
};

/**
 * This method is called when the panel item is single-clicked.
 *
 */
LinkedInZimlet.prototype.singleClicked = function() {
	if(!this.prefDialog) {
		this.prefDialog = new LinkedInPrefDialog(this);
	}
	this.prefDialog.popup();
};

LinkedInZimlet.prototype._searchLinkedIn =
function(firstName, lastName, companyName, keywords) {
	this._slide.setInfoMessage(this.getMessage("searching"));
	var callback = new AjxCallback(this, this._searchHandler);
	var components = [];
	if(firstName) {
		components["first-name"] = firstName;
	}
	if(lastName) {
		components["last-name"] = lastName;
	}
	if(companyName) {
		components["company-name"] = companyName;
	}
	if(keywords) {
		components["keywords"] = keywords;
	}
	//components["facets"] = "network";
	this._oauth.makeHTTPGet({url: LinkedInZimlet.SEARCH_BASE_QUERY, components: components, callback: callback});
};

LinkedInZimlet.prototype._searchHandler =
function(response) {
	if(!response.success) {
		this.showWarningMsg(response.text);
		return;
	};
	var list = new AjxXmlDoc.createFromDom(response.xml).toJSObject(true, false);
	this._createSlideContent(list);

};

LinkedInZimlet.prototype._createSlideContent =
function(list) {
	var personList = [];
	this._inviteLinkAndAuthMap = [];
	if(list.people && list.people.person) {
		personList = list.people.person;
	}
	if(personList.length ==0) {
		this._slide.setErrorMessage(this.getMessage("noResultsFound"));
		return;
	}
	var html = [];
	for(var i =0; i < personList.length; i++) {
		var person = personList[i];
		html.push(this._getPersonHtml(person));
	}
	this._appendToSlide(html.join(""));
};

LinkedInZimlet.prototype._appendToSlide =
function(html) {
	document.getElementById("linkedInZimlet_searchResultsDiv").innerHTML = html;
	document.getElementById("linkedInZimlet_searchResultsDiv").onclick =  AjxCallback.simpleClosure(this._handleClickInSearchResults, this);
};

LinkedInZimlet.prototype._showJoinLinkedInAccount =
function() {
	var html = [];
	html.push("<br/><br/>", this.getMessage("noAccount"), " <a href='javascript:void(0)' id='LinkedInZimlet_ShowPreferences'>",this.getMessage("clickHere"),"</a>");
	document.getElementById("linkedInZimlet_searchResultsDiv").innerHTML = html.join("");
	document.getElementById("LinkedInZimlet_ShowPreferences").onclick = AjxCallback.simpleClosure(this._showLinkedInPrefFromTooltip, this); 
};
LinkedInZimlet.prototype._showLinkedInPrefFromTooltip =
function() {
	this._setTooltipSticky(false);
	this.singleClicked();
};

LinkedInZimlet.prototype._handleClickInSearchResults =
function(ev) {
	if (!ev){
		var ev = window.event;
	}
	var dwtev = DwtShell.mouseEvent;
	dwtev.setFromDhtmlEvent(ev);
	var targ = dwtev.target;
	var id = targ.id;
	if(this._inviteLinkAndAuthMap[id]) {
		this._showInviteAsFriendDialog(this._inviteLinkAndAuthMap[id], id);
	}
};

LinkedInZimlet.prototype._getPersonHtml =
function(person) {
	var pUrl = person["picture-url"];
	var fName = person["first-name"];
	var lName = person["last-name"];
	var headline = person["headline"];
	var inviteLnkId = person["id"];
	var profileUrl = person["public-profile-url"];
	var relationToViewer = person["relation-to-viewer"];
	var relationDistance = -1;
	var allowInvite = true;
	if(relationToViewer) {
		relationDistance = relationToViewer["distance"] ? relationToViewer["distance"].toString() : -1;
		if(relationDistance == "1") {
			allowInvite = false;
		}
	}
	if(inviteLnkId) {
		inviteLnkId = inviteLnkId.toString();
	}
	var profileHdr = person["api-standard-profile-request"];
	var httpHeader = {};
	if(profileHdr) {
		var headers = profileHdr["headers"];
		if(headers) {
			 httpHeader = headers["http-header"];
		}
	}
	if(!pUrl) {
		if(!this._imageNotAvailableImg) {
			this._imageNotAvailableImg = this.getResource("img/linkedin_noImageAvailable.png");
		}
		pUrl = this._imageNotAvailableImg;
	}
	this._inviteLinkAndAuthMap[inviteLnkId] = httpHeader;
	if(!this._inviteStr) {
		this._inviteStr = this.getMessage("invite");
	}
	if(!this._viewStr) {
		this._viewStr = this.getMessage("view");
	}
	var subs = {
		pUrl: pUrl,
		fName: fName,
		lName: lName,
		headline: headline,
		inviteLnkId: inviteLnkId,
		profileUrl: profileUrl,
		allowInvite: allowInvite, 
		viewStr: this._viewStr,
		inviteStr: this._inviteStr
	};
	return AjxTemplate.expand("com_zimbra_linkedin.templates.LinkedIn#RowItem", subs);
};

LinkedInZimlet.prototype._getTooltipBGHtml =
function() {
	return AjxTemplate.expand("com_zimbra_linkedin.templates.LinkedIn#Frame");
};

LinkedInZimlet.prototype._setTooltipSticky =
function(sticky) {
	if(sticky) {
		this.emailZimlet.tooltip._poppedUp = false;//set this to make tooltip sticky
	} else {
		this.emailZimlet.tooltip._poppedUp = true;
	}
};


LinkedInZimlet.prototype._setSearchFieldValue =
function(val) {
	document.getElementById("linkdeInZimlet_seachField").value = val;
};

LinkedInZimlet.prototype._makeLinkedinSearch =
function(val) {
	var  val = document.getElementById("linkdeInZimlet_seachField").value;
	if(val == "") {
		return;
	}
	this._searchLinkedIn(null, null, null, val);
};

LinkedInZimlet.prototype._addSearchHandlers =
function() {
	document.getElementById("linkedInZimlet_MainDiv").onmouseover =  AjxCallback.simpleClosure(this._setTooltipSticky, this, true);
	document.getElementById("linkedInZimlet_MainDiv").onmouseout =  AjxCallback.simpleClosure(this._setTooltipSticky, this, false);
	var btn = new DwtButton({parent:this.getShell()});
	btn.setText("Search");
	btn.setImage("LinkedinZimletIcon");
	btn.addSelectionListener(new AjxListener(this, this._makeLinkedinSearch));
	document.getElementById("linkdeInZimlet_seachBtnCell").appendChild(btn.getHtmlElement());
};

LinkedInZimlet.prototype._showInviteAsFriendDialog =
function(authParams, profileId) {
	if(this.emailZimlet._linkedInZimlet_inviteFriendDlg) {
		this._inviteFriendsDlg = this.emailZimlet._linkedInZimlet_inviteFriendDlg;
	}
	this._setTooltipSticky(false);
	if (this._inviteFriendsDlg) {
		this._inviteFriendsDlg.authParams = authParams;
		this._inviteFriendsDlg.profileId = profileId;
		this._setDefaultInviteBody();
		this._inviteFriendsDlg.popup();
		return;
	}
	this._inviteFriendsView = new DwtComposite(this.getShell());
	this._inviteFriendsView.getHtmlElement().innerHTML = "<div><textarea id='linkedInZimlet_inviteBodyArea' COLS=100 ROWS=2></textarea></div>";
	this._inviteFriendsDlg = new ZmDialog({parent:this.getShell(), title:this.getMessage("inviteLinkedInMemeber"), view:this._inviteFriendsView, standardButtons:[DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON]});
	this._inviteFriendsDlg.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._sendInviteOkBtnListener));
	this._inviteFriendsDlg.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(this, this._sendInviteCancelBtnListener));
	this.emailZimlet._linkedInZimlet_inviteFriendDlg  = this._inviteFriendsDlg;//store this on emailZimlet so we dont have to recreate this dialog for every mouseOver
	this._inviteFriendsDlg.authParams = authParams;
	this._inviteFriendsDlg.profileId = profileId;
	this._setDefaultInviteBody();
	this._inviteFriendsDlg.popup();
};

LinkedInZimlet.prototype._setDefaultInviteBody =
function() {
	document.getElementById("linkedInZimlet_inviteBodyArea").value = this.getMessage("join");	
};

LinkedInZimlet.prototype._sendInviteOkBtnListener =
function() {
	this._inviteFriendsDlg.popdown();
	this._setTooltipSticky(true);
	this.emailZimlet.tooltip.popup();
	var callback = new AjxCallback(this, this._friendInviteHandler);
	var components = [];
	var postBody = this._getInviteXML();
	var contentType = "text/xml";
	this._oauth.makeHTTPPost({ url: LinkedInZimlet.PEOPLE_BASE_QUERY, components: components, contentType:contentType, postBody:postBody, callback: callback});
};

LinkedInZimlet.prototype._friendInviteHandler =
function(response) {
	if(!response.success) {
		this.showWarningMsg(response.text);
		return;
	}
};

LinkedInZimlet.prototype._sendInviteCancelBtnListener =
function() {
	this._inviteFriendsDlg.popdown();
	this._setTooltipSticky(true);
	this.emailZimlet.tooltip.popup();
};

LinkedInZimlet.prototype._getInviteXML =
function() {
	var authObj = this._inviteFriendsDlg.authParams.value.toString();
	var inviteBody = document.getElementById("linkedInZimlet_inviteBodyArea").value;
	var authArray = authObj.split(":");
	if(!authArray || authArray.length != 2) {
		this.showWarningMsg(this.getMessage("didNotGetAuthEnvelopeForThisUser"));
		return;
	}
	var html = [];
	html.push("<?xml version='1.0' encoding='UTF-8'?><mailbox-item><recipients><recipient><person path=\"/people/id=",this._inviteFriendsDlg.profileId,"\" />",
				"</recipient></recipients><subject>Invitation to Connect</subject><body>",inviteBody,"</body>",
				"<item-content><invitation-request><connect-type>friend</connect-type><authorization><name>",authArray[0],"</name><value>",authArray[1],"</value>",
				"</authorization></invitation-request></item-content></mailbox-item>");

	return html.join("");
};

LinkedInZimlet.prototype.showWarningMsg = function(message) {
	if(message.length > 1000) {
		message = message.substring(0, 999) + "...";
	}
	var style = DwtMessageDialog.WARNING_STYLE;
	var dialog = appCtxt.getMsgDialog();
	this.warningDialog = dialog;
	dialog.setMessage(message, style);
	dialog.popup();
};