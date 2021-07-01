/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

////////////////////////////////////////////////////////////////
///  Zimlet to handle integration with SalesForce            ///
///  @author Raja Rao DV, <rrao@zimbra.com>	[V 3.0]			 ///
///  @author Mihai Bazon, <mihai@zimbra.com>                 ///
///  @author Kevin Henrikson, <kevinh@zimbra.com>            ///
////////////////////////////////////////////////////////////////
function Com_Zimbra_SForce() {
}

/// Zimlet handler objects, such as Com_Zimbra_SForce, must inherit from
/// ZmZimletBase.  The 2 lines below achieve this.
Com_Zimbra_SForce.prototype = new ZmZimletBase();
Com_Zimbra_SForce.prototype.constructor = Com_Zimbra_SForce;

Com_Zimbra_SForce.SFORCE = "SFORCE";
Com_Zimbra_SForce.SFORCE_MAIL = "SFORCE_MAIL_TB_BTN";
Com_Zimbra_SForce.SFORCE_CONTACT_TB_BTN = "SFORCE_CONTACT_TB_BTN";

Com_Zimbra_SForce.prototype.init = function() {
	this.LOGIN_SERVER = this.getUserProperty("sforce_logindlg_apiURL");
	if(!this.LOGIN_SERVER || this.LOGIN_SERVER == "") {
		this.LOGIN_SERVER = this.getConfig("SF_API_URL");
	}
	this.SERVER = this.LOGIN_SERVER;
	this.XMLNS = "urn:enterprise.soap.sforce.com";
	this._shell = this.getShell();
	this.loginToSFOnLaunch = this.getUserProperty("loginToSFOnLaunch") == "true";
	this.sforce_linkNamesInSalesForceStartsWith = this.getUserProperty("sforce_linkNamesInSalesForceStartsWith");
	this.sforce_taskType = this.getUserProperty("sforce_taskType");
	this._force_show_salesforceBar = false;
	this.loadLoginInfo = false;//used to ensure people has entered valid user/pwd 
	this._loadingSalesForceHtml = ["<table align=center><tr><td><div style='padding:10px'><img   src=\"", this.getResource("img/sf_busy.gif") , "\"  /> <b> Searching SalesForce..</b></div></td></tr></table>"].join("");
	if (this.loginToSFOnLaunch) {
		this.login();
	}
	this.sForceSearchDlg = new Com_Zimbra_SForceSearchDlg(this);
};

//-------------------------------------------------------------------------------------------
//UI Handlers (START)
//-------------------------------------------------------------------------------------------
/// Called by the Zimbra framework upon an accepted drag'n'drop
Com_Zimbra_SForce.prototype.doDrop = function(obj) {
	switch (obj.TYPE) {
		case "ZmMailMsg":
			if (obj instanceof Array) {
				obj = obj[0];
			}
			var msg = obj.srcObj;
			this.noteDropped(msg);
			break;
		case "ZmConv":
			if (obj instanceof Array) {
				obj = obj[0];
			}
			var msg = obj.srcObj.getFirstHotMsg();
			this.noteDropped(msg);
			break;
		case "ZmContact":
			this.contactDropped(obj);
			break;

		case "ZmAppt":
			this.apptDropped(obj);
			break;

		default:
			this.displayErrorMessage("You somehow managed to drop a \"" + obj.TYPE
					+ "\" but however the SForce Zimlet does't support it for drag'n'drop.");
	}
};

/// Called by the Zimbra framework when the SForce panel item was clicked
Com_Zimbra_SForce.prototype.singleClicked = function() {
	//this.login();
	this._displayLoginDialog();
};

Com_Zimbra_SForce.prototype.doubleClicked = function() {
	this.singleClicked();
};

/// Called by the Zimbra framework when some menu item that doesn't have an
/// <actionURL> was selected
Com_Zimbra_SForce.prototype.menuItemSelected = function(itemId, val) {
	switch (itemId) {
		case "PREFERENCES":
			this._displayLoginDialog();
			break;
		case "LOGIN":
			this.login();
			break;
		case "SFORCE_CASE_OPENCASE":
			this._openCaseOnLaunchInEditMode = false;
			this.clicked("", this._actionObject, null, "open");
			break;
		case "SFORCE_CASE_EDITCASE":
			this._openCaseOnLaunchInEditMode = true;
			this.clicked("", this._actionObject, null, "edit");
			break;
		case "SFORCE_SHOW_SALESFORCE_BAR":
			this._force_show_salesforceBar = true;
			this._addSForceBar({cRecords:[], lRecords:[]});
			break;
		case "SFORCE_CASE_CLOSE":
			var caseNumber = this._getTooltipData(this._actionObject);
			var callback = new AjxCallback(this, this._closeCase);
			this._getCaseId(caseNumber, callback);
			break;
		case "SFORCE_CASE_CHANGE":
			var caseNumber = this._getTooltipData(this._actionObject);
			this._loadCaseDescriptionObject();
			this._getCurrentValuesForQuickUpdateDlg(caseNumber);
			break;
	}
};

Com_Zimbra_SForce.prototype.getActionMenu =
function(obj, span, context) {
	if (this._zimletContext._contentActionMenu instanceof AjxCallback) {
		this._zimletContext._contentActionMenu = this._makeMenu(this._zimletContext._contentActionMenu.args);
		//this._zimletContext._contentActionMenu = this._zimletContext._contentActionMenu.run();

	}
	this._actionObject = obj;
	this._actionSpan = span;
	this._actionContext = context;
	return this._zimletContext._contentActionMenu;
};

Com_Zimbra_SForce.prototype._makeMenu =
function(obj) {
	var items = obj[0];
	var menu = new ZmActionMenu({parent:DwtShell.getShell(window), menuItems:ZmOperation.NONE});
	for (var i = 0; i < items.length; ++i) {
		var data = items[i];
		if (!data.id) {
			menu.createSeparator();
			continue;
		}
		var subMenuItems = data.subMenuItems;
		var params = {image:data.icon, text:this._zimletContext.process(data.label),disImage:data.disabledIcon,style:data.style};
		if (data.id == "SFORCE_CASE_CHANGE") {
			params.style = DwtMenuItem.CASCADE_STYLE;
			var mainMenuItem = menu.createMenuItem(data.id, params);
			mainMenuItem.setData("xmlMenuItem", data);
			var subMenu = new ZmPopupMenu(mainMenuItem); //create submenu
			mainMenuItem.setMenu(subMenu);//add submenu to menuitem
			for (var k = 0; k < this.__dynamicMenuItems.length; k++) {
				var dmi_data = this.__dynamicMenuItems[k];
				if(k > 10) {//only show upto 10 items
					break;
				}
				var params = {image:dmi_data.icon, text:this._zimletContext.process(dmi_data.label),disImage:dmi_data.disabledIcon,style:dmi_data.style};
				var subMenuItem = subMenu.createMenuItem(dmi_data.id, params);
				subMenuItem.setData("xmlMenuItem", dmi_data);
				var subsubMenu = new ZmPopupMenu(subMenuItem); //create submenu
				subMenuItem.setMenu(subsubMenu);//add submenu to menuitem
				var sssMIs = dmi_data.subMenuItems;
				for (var j = 0; j < sssMIs.length; j++) {
					var smiObj = sssMIs[j];
					if (smiObj == "") {
						continue;
					}
					try{
						var obj = eval("(" + smiObj + ")");
					} catch (e) {
						continue;
					}
					var label = obj.label;
					var id = [dmi_data.itemName,"=::=",label].join("");
					var subsubMenuItem = subsubMenu.createMenuItem(id, {image:"SFORCE-panelIcon", text:label});
					subsubMenuItem.addSelectionListener(new AjxListener(this, this._handleDynamicMenuItemClick, id));
				}
			}
		} else if (data.id == "SFORCE_CASE_OPEN_LINK") {
			var mainMenuItem = menu.createMenuItem(data.id, params);
			mainMenuItem.setData("xmlMenuItem", data);
			var subMenu = new ZmPopupMenu(mainMenuItem); //create submenu
			mainMenuItem.setMenu(subMenu);//add submenu to menuitem
			for (var k = 0; k < this.__dynamicMenuItems_links.length; k++) {
				var dmi_data = this.__dynamicMenuItems_links[k];
				var id = [dmi_data.itemName,"=::=",label].join("");
				var params = {image:"Shortcut", text:this._zimletContext.process(dmi_data.label),disImage:dmi_data.disabledIcon,style:dmi_data.style};
				var subMenuItem = subMenu.createMenuItem(id, params);
				subMenuItem.setData("xmlMenuItem", dmi_data);
				subMenuItem.addSelectionListener(new AjxListener(this, this._handleDynamicMenuItemLinks, id));
			}
		} else {
			var mainMenuItem = menu.createMenuItem(data.id, params);
			mainMenuItem.setData("xmlMenuItem", data);
			mainMenuItem.addSelectionListener(this._zimletContext._handleMenuItemSelected);
		}
	}
	return menu;
};

Com_Zimbra_SForce.prototype._handleDynamicMenuItemLinks =
function(id) {
	var caseNumber = this._getTooltipData(this._actionObject);
	var arry = id.split("=::=");
	var callback = new AjxCallback(this, this._openSFLink);
	this._getCaseLink(arry[0], caseNumber, callback);
};

Com_Zimbra_SForce.prototype._openSFLink =
function(url) {
	if (url == "") {
		appCtxt.getAppController().setStatusMsg("Salesforce Link/URL was empty", ZmStatusView.LEVEL_WARNING);
		return;
	}
	window.open(url);
};

Com_Zimbra_SForce.prototype._handleDynamicMenuItemClick =
function(id) {
	var caseNumber = this._getTooltipData(this._actionObject);
	var arry = id.split("=::=");
	var callback = new AjxCallback(this, this._updateCase, [arry[0], arry[1]]);
	this._getCaseId(caseNumber, callback);
};

Com_Zimbra_SForce.prototype._updateCase =
function(field, val, id) {
	var props = {};
	var params = [];
	props[field] = val;
	props["Id"] = id;
	params.push(props);
	var callback = AjxCallback.simpleClosure(this._handleUpdateCase, this);
	this.updateSFObject(params, "Case", callback, true);
};

Com_Zimbra_SForce.prototype._closeCase =
function(id) {
	this._updateCase("Status", "Close", id);
};

Com_Zimbra_SForce.prototype._handleUpdateCase =
function(response) {
	if (response.success) {
		appCtxt.getAppController().setStatusMsg("Support Case updated successfully", ZmStatusView.LEVEL_INFO);
	} else {
		appCtxt.getAppController().setStatusMsg("Problem contacting Salesforce. Please try again", ZmStatusView.LEVEL_WARNING);
	}

};

Com_Zimbra_SForce.prototype._loadCaseDescriptionObject = function() {
	if (this._caseObjectLoaded) {
		return;
	}
	if (!this.sForceObject) {
		this.sForceObject = new Com_Zimbra_SForceObject(this);
	}
	this._sforceCaseObject = this.sForceObject.getFieldMap("describeSObject", "Case");
	//var hasItem = false;
	//	for(var item in map) {
	//		hasItem = true;
	//		break;
	//	}
	this._sforceCaseObjectNameLabelMap = [];
	for (var el in this._sforceCaseObject) {
		var obj = this._sforceCaseObject[el];
		this._sforceCaseObjectNameLabelMap[el] = obj.label;
	}
	this._caseObjectLoaded = true;

};

Com_Zimbra_SForce.prototype._displayQuickUpdateDialog =
function(result) {
	if (this.quDialog) {
		this.quView.getHtmlElement().innerHTML = this._createQuickUpdateView(result);
		this.quDialog.result = result;
		this._addCaseOwnerLookupBtn();
		this.quDialog.popup();
		return;
	}
	this.quView = new DwtComposite(this.getShell());
	this.quView.setSize("410", "240");
	this.quView.getHtmlElement().style.overflow = "auto";
	this.quView.getHtmlElement().innerHTML = this._createQuickUpdateView(result);
	this.quDialog = this._createDialog({title:"Quick Edit Case", view:this.quView, standardButtons:[DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON]});
	this.quDialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._quOKBtnListner));
	this.quDialog.result = result;
	this._addCaseOwnerLookupBtn();
	this.quDialog.popup();
};

Com_Zimbra_SForce.prototype._quOKBtnListner =
function() {
	var props = {};
	for (var i = 0; i < this._quickUpdateSelectMenuList.length; i++) {
		var obj = this._quickUpdateSelectMenuList[i];
		var prevVal = obj.currentValue;
		var val = document.getElementById(obj.id).value;
		if ((prevVal != undefined && prevVal != val) && (val != "None")) {
			props[obj.elName] = val;
		}
	}
	if (!this.quDialog.result.Id) {
		appCtxt.setStatusMsg("Case ID not found, Aborting updating Case", ZmStatusView.LEVEL_WARNING);
		return;
	}
	var id = this.quDialog.result.Id.toString();
	props["Id"] = id;
	var ownerId = document.getElementById("sforce_quickUpdate_changeOwner").refObjIdValue;
	if (ownerId != undefined && ownerId != "") {
		props["OwnerId"] = ownerId;
	}
	var params = [];
	params.push(props);
	var callback = AjxCallback.simpleClosure(this._handleQuickUpdateCase, this);
	this.updateSFObject(params, "Case", callback, true);
};

Com_Zimbra_SForce.prototype._handleQuickUpdateCase =
function(result) {
	if (!result.errors) {
		appCtxt.setStatusMsg("Support Case Updated", ZmStatusView.LEVEL_INFO);
		this.quDialog.popdown();
	} else {
		var msg = "";
		if (result.errors && result.errors.message) {
			msg = result.errors.message.toString();
		}
		appCtxt.setStatusMsg("Could not update Case: " + msg, ZmStatusView.LEVEL_WARNING);

	}
};

Com_Zimbra_SForce.prototype._createQuickUpdateView =
function(result) {
	var ownerName = "";
	var ownerId = "";
	if (result && result.Owner) {
		ownerName = result.Owner.Name.toString();
	}
	if (result && result.OwnerId) {
		ownerId = result.OwnerId.toString();
	}
	var html = new Array();
	var i = 0;
	html[i++] = "<table  width=100% cellpadding=4 class='SForce_table'>";
	html[i++] = "<tr ><td width=120px align=right><strong>Case Owner:</strong></td>";
	html[i++] = "<td><div>";
	html[i++] = "<table>";
	html[i++] = ["<td><div id='sforce_quickUpdate_changeOwner'  refObjIdValue='",ownerId,"'>",ownerName,"</div></td>"].join("");
	html[i++] = "<td><div id='sforce_quickUpdate_changeOwnerLookupBtn'></div></td>";
	html[i++] = "<td><div id='sforce_quickUpdate_changeOwnerClearDiv' style='display:none;'><a href='javascript:void(0)' id='sforce_quickUpdate_changeOwnerClearLink'>clear</a></div></td></tr>";
	html[i++] = "</table>";
	html[i++] = "</div></td></tr>";
	for (var el in this._allQuickUpdatePickLists) {
		var obj = this._allQuickUpdatePickLists[el];
		var items = obj.items;

		html[i++] = this._getQuickUpdateListHtml(el, obj.label, items, obj.currentValue);
	}
	html[i++] = "</table>";
	html[i++] = "</DIV>";
	return html.join("");
};

Com_Zimbra_SForce.prototype._addCaseOwnerLookupBtn = function() {
	var btn = new DwtButton({parent:this._shell});
	btn.setText("Change");
	btn.setImage("Search");
	btn.addSelectionListener(new AjxListener(this, this._changeCaseOwnerBtnHdlr, [ btn]));
	document.getElementById("sforce_quickUpdate_changeOwnerLookupBtn").appendChild(btn.getHtmlElement());
};

Com_Zimbra_SForce.prototype._changeCaseOwnerBtnHdlr = function() {
	this.sForceSearchDlg.setProperties("User", "sforce_quickUpdate_changeOwner", null, "sforce_quickUpdate_changeOwnerClearLink");
	this.sForceSearchDlg.displaySearchDialog();
};

Com_Zimbra_SForce.prototype._getQuickUpdateListHtml =
function(elName, label, items, currentValue) {
	var html = new Array();
	var i = 0;
	var id = ["sforce_quickUpdateMenu_",elName].join("");
	var hideLinkId = ["sforce_quickUpdateMenu_hideLink_",elName].join("");

	if (!this._quickUpdateSelectMenuList) {
		this._quickUpdateSelectMenuList = [];
	}
	this._quickUpdateSelectMenuList.push({elName:elName, id:id, currentValue:currentValue, hideLinkId:hideLinkId});
	html[i++] = ["<tr ><td width=120px align=right><strong>",label,":</strong></td><td width=200px><select id='",id,"'>"].join("");
	html[i++] = "<option value='None'>None</option>";
	for (var j = 0; j < items.length; j++) {
		try {
			var item = items[j];
			if (item == "") {
				continue;
			}
			var obj = eval("(" + item + ")");
			var label = obj.label;
			if (currentValue == label) {
				html[i++] = ["<option  value='",label,"' selected>",label,"</option>"].join("");
			} else {
				html[i++] = ["<option  value='",label,"'>",label,"</option>"].join("");
			}
		} catch(e) {
		}
	}
	html[i++] = ["</select></td></tr>"].join("");
	return html.join("");
};


//-------------------------------------------------------------------------------------------
//UI Handlers (END)
//-------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------------------
//Login dialog related (START)
//-------------------------------------------------------------------------------------------
Com_Zimbra_SForce.prototype._displayLoginDialog =
function(callback, errorMsg) {
	//if zimlet dialog already exists...
	if (callback) {
		this._loginOkCallback = callback;
	}
	if (this.loginDlg) {
		this._setLoginValues();
		this._setErrorMsgToLoginDlg(errorMsg);
		this.loginDlg.popup();//simply popup the dialog
		return;
	}
	this._loginDlgView = new DwtComposite(this._shell);
	this._loginDlgView.setSize("500", "350");
	this._loginDlgView.getHtmlElement().style.overflow = "auto";
	this._loginDlgView.getHtmlElement().innerHTML = this._createLoginDlgView();

	this.loginDlg = this._createDialog({title:"Salesforce Preferences", view:this._loginDlgView, standardButtons:[DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON]});
	this.loginDlg.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._loginDlgOKBtnListener));
	this.loginDlg.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(this, this._loginDlgCancelBtnListener));

	this._setLoginValues();
	this._setErrorMsgToLoginDlg(errorMsg);
	this.loginDlg.popup();
};

Com_Zimbra_SForce.prototype._setErrorMsgToLoginDlg =
function(errorMsg) {
	if (errorMsg) {
		document.getElementById("sforce_logindlg_errorDiv").innerHTML = errorMsg;
		document.getElementById("sforce_logindlg_errorDiv").style.display = "block";
	} else {
		document.getElementById("sforce_logindlg_errorDiv").innerHTML = "";
		document.getElementById("sforce_logindlg_errorDiv").style.display = "none";
	}
};

Com_Zimbra_SForce.prototype._setLoginValues =
function() {	//show the checkbox checked if needed
	var user = this.getUserProperty("user");
	var passwd = this.getUserProperty("passwd");
	this.sforce_ignoreDomainsList = this.getUserProperty("sforce_ignoreDomainsList");
	this.sforce_logindlg_sbarShowOnlyOnResult = this.getUserProperty("sforce_logindlg_sbarShowOnlyOnResult") == "true";
	if (user) {
		document.getElementById("sforce_logindlg_userNamefield").value = user;
	}
	if (passwd) {
		document.getElementById("sforce_logindlg_passwordfield").value = passwd;
	}
	if (this.sforce_ignoreDomainsList) {
		document.getElementById("sforce_logindlg_ignoreDomainsfield").value = this.sforce_ignoreDomainsList;
	}
	if(this.LOGIN_SERVER) {
		document.getElementById("sforce_logindlg_apiURL").value = this.LOGIN_SERVER;
	}
	if (this.loginToSFOnLaunch) {
		document.getElementById("sforce_logindlg_loginToSFOnLaunch").checked = true;
	}
	if (this.sforce_logindlg_showSendAndAddBtn) {
		document.getElementById("sforce_logindlg_showSendAndAddBtn").checked = true;
	}
	if (this.sforce_logindlg_sbarShowOnlyOnResult) {
		document.getElementById("sforce_logindlg_sbarShowOnlyOnResult").checked = true;
	}
};

Com_Zimbra_SForce.prototype._createLoginDlgView =
function() {
	var html = new Array();
	var i = 0;
	html[i++] = "<DIV class='SForce_yellow' id='sforce_logindlg_errorDiv' style='display:none;color:red;font-weight:bold;'></DIV>";
	html[i++] = "<DIV>";
	html[i++] = "<TABLE class='SForce_table'  width='100%'><TR><TD style='font-weight:bold'>Salesforce User Name:</TD><TD><INPUT type='text' id='sforce_logindlg_userNamefield' /></TD></TR>";
	html[i++] = "<TR><TD  style='font-weight:bold'>Password + SecurityToken*:</TD><TD><INPUT type='password' id='sforce_logindlg_passwordfield' /></TD></TR>";
	html[i++] = "<TR><TD style='font-weight:bold'>Ignore emails with following domain(s):<br/><label style=\"font-size: 10px; color: gray;\">(Separate multiple domains by comma)</label></TD><TD><INPUT type='text' id='sforce_logindlg_ignoreDomainsfield' /></TD></TR>";
	html[i++] = "<TR><TD style='font-weight:bold'>Salesforce API URL:</TD><TD><INPUT type='text' id='sforce_logindlg_apiURL' /></TD></TR>";

	html[i++] = "</TABLE></DIV><BR/>";
	html[i++] = "<DIV>";
	html[i++] = "<TABLE class='SForce_table' width='100%'>";
	html[i++] = "<TR><TD width=18px><INPUT type='checkbox' id='sforce_logindlg_sbarShowOnlyOnResult' /></TD><TD  style='font-weight:bold'>Show Salesforce Bar only when there are Salesforce contacts<TD></TD></TR>";
	html[i++] = "</TABLE></DIV>";
	html[i++] = "<DIV>";
	html[i++] = "<TABLE class='SForce_table' width='100%'>";
	html[i++] = "<TR><TD width=18px><INPUT type='checkbox' id='sforce_logindlg_showSendAndAddBtn'/></TD><TD  style='font-weight:bold'>Show 'Send & Add' button in mail compose toolbar<TD></TD></TR>";
	html[i++] = "</TABLE></DIV>";
	html[i++] = "<DIV>";
	html[i++] = "<TABLE class='SForce_table' width='100%'>";
	html[i++] = "<TR><TD width=18px><INPUT type='checkbox' id='sforce_logindlg_loginToSFOnLaunch' /></TD><TD  style='font-weight:bold'>Login to Salesforce when Zimbra is launched<TD></TD></TR>";
	html[i++] = "</TABLE></DIV>";
	html[i++] = "<BR/>";
	html[i++] = "<DIV class='SForce_yellow'>";
	html[i++] = "<B>NOTES:</B><BR/>1. If your <b><i>Salesforce password</i></b> is <label style='font-weight:bold;color:red'>mypassword</label>, and your <b><i>Salesforce security token</i></b> is <label style='font-weight:bold;color:blue'>XXXXXXXXXX</label>";
	html[i++] = " then you must enter <label style='font-weight:bold;color:red'>mypassword</label><label style='font-weight:bold;color:blue'>XXXXXXXXXX</label> in <i>Password + SecuritToken</i> field. <BR/><BR/>2. <b> Steps to get Security token</b>:";
	html[i++] = "<BR/>- Login to Salesforce,<BR/>- Click on <b>Setup</b> near top-right corner,<BR/>- Click on <b>Reset your Security Token</b> link and reset it<br/>";
	html[i++] = "After you have reset security token, Salesforce will send you an email with new security token.";
	html[i++] = "</DIV>";
	return html.join("");
};

Com_Zimbra_SForce.prototype._loginDlgOKBtnListener =
function() {
	var needRefresh = false;
	var user = AjxStringUtil.trim(document.getElementById("sforce_logindlg_userNamefield").value);
	var passwd = AjxStringUtil.trim(document.getElementById("sforce_logindlg_passwordfield").value);
	var sfApiUrl =  AjxStringUtil.trim(document.getElementById("sforce_logindlg_apiURL").value);
	if (user == "" || passwd == "" || sfApiUrl == "") {
		this._setErrorMsgToLoginDlg("Please fill your Salesforce credentials");
		return;
	}
	this.sforce_ignoreDomainsList = AjxStringUtil.trim(document.getElementById("sforce_logindlg_ignoreDomainsfield").value);
	var loginToSFOnLaunch = document.getElementById("sforce_logindlg_loginToSFOnLaunch").checked;
	this.sforce_logindlg_sbarShowOnlyOnResult = document.getElementById("sforce_logindlg_sbarShowOnlyOnResult").checked;
	var showSendandAddBtnVal = document.getElementById("sforce_logindlg_showSendAndAddBtn").checked;
	this.SERVER = sfApiUrl;
	if (showSendandAddBtnVal != this.sforce_logindlg_showSendAndAddBtn) {
		needRefresh = true;
		this.sforce_logindlg_showSendAndAddBtn = showSendandAddBtnVal;
	}

	this.loadLoginInfo = false;
	this._ignoreDomainList = false;
	this.loginDlg.popdown();//hide the dialog

	this.setUserProperty("user", user);
	this.setUserProperty("passwd", passwd);
	this.setUserProperty("sforce_ignoreDomainsList", this.sforce_ignoreDomainsList);
	this.setUserProperty("sforce_logindlg_sbarShowOnlyOnResult", this.sforce_logindlg_sbarShowOnlyOnResult);
	this.setUserProperty("sforce_logindlg_showSendAndAddBtn", this.sforce_logindlg_showSendAndAddBtn);
	this.setUserProperty("loginToSFOnLaunch", loginToSFOnLaunch);
	this.setUserProperty("sforce_logindlg_apiURL", this.SERVER);
	var callback = new AjxCallback(this, this._handleSaveProperties, needRefresh);

	this.saveUserProperties(callback);
	this.login(this._loginOkCallback, user, passwd);
};

Com_Zimbra_SForce.prototype._loginDlgCancelBtnListener =
function() {
	if (this.sForceViewManager) {
		this.sForceViewManager.hideAllViewsIfBusy();
	}
	this.loginDlg.popdown();
};

Com_Zimbra_SForce.prototype._handleSaveProperties =
function(needRefresh) {
	appCtxt.setStatusMsg("Preferences Saved", ZmStatusView.LEVEL_INFO);
	if (needRefresh) {
		this.showYesNoDialog();
	}
};

Com_Zimbra_SForce.prototype.showYesNoDialog =
function() {
	var dlg = appCtxt.getYesNoMsgDialog();
	dlg.registerCallback(DwtDialog.YES_BUTTON, this._yesButtonClicked, this, dlg);
	dlg.registerCallback(DwtDialog.NO_BUTTON, this._NoButtonClicked, this, dlg);
	dlg.setMessage("The browser must be refreshed for the changes to take effect.  Continue?", DwtMessageDialog.WARNING_STYLE);
	dlg.popup();
};

Com_Zimbra_SForce.prototype._yesButtonClicked =
function(dlg) {
	dlg.popdown();
	this._refreshBrowser();
};

Com_Zimbra_SForce.prototype._NoButtonClicked =
function(dlg) {
	dlg.popdown();
}

Com_Zimbra_SForce.prototype._refreshBrowser =
function() {
	window.onbeforeunload = null;
	var url = AjxUtil.formatUrl({});
	ZmZimbraMail.sendRedirect(url);
};

//-------------------------------------------------------------------------------------------
//Login dialog related (END)
//-------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------
//Salesforce Bar related(START)
//-------------------------------------------------------------------------------------------
Com_Zimbra_SForce.prototype.onMsgView =
function(msg, oldMsg, msgView) {
	this._handleMsgSelection(msg, oldMsg, msgView);
};

Com_Zimbra_SForce.prototype.onConvView =
function(msg, oldMsg, msgView) {
	this._handleMsgSelection(msg, oldMsg, msgView);
};

Com_Zimbra_SForce.prototype._handleMsgSelection =
function(msg, oldMsg, msgView) {
	this._initializeSalesForceForThisMsg(msg);
	if (this.user && this.user != "" && this.passwd && this.passwd != "") {
		this.noteDropped(msg, true, msgView);
	}
};

Com_Zimbra_SForce.prototype._initializeSalesForceForThisMsg =
function(msg) {
	this._currentSelectedMsg = msg;
	this.sforce_bar_expanded = false;
	this._emailsInSalesforce = [];
	this.sforce_bar_recordsForThisMsgParsed = false;

	if (!this.loadLoginInfo) {
		this.user = this.getUserProperty("user");
		this.passwd = this.getUserProperty("passwd");
		this.sforce_ignoreDomainsList = this.getUserProperty("sforce_ignoreDomainsList");
		this.sforce_logindlg_sbarShowOnlyOnResult = this.getUserProperty("sforce_logindlg_sbarShowOnlyOnResult") == "true";
		this.sforce_logindlg_showSendAndAddBtn = this.getUserProperty("sforce_logindlg_showSendAndAddBtn") == "true";
		this.loadLoginInfo = true;
	}
	this._emailsForCurrentNote = this._getValidAddressesForCurrentNote(msg);
};

Com_Zimbra_SForce.prototype._addSForceBar =
function(recordsObj, msgView) {
	this._parseAndSetRecordsObj(recordsObj);
	if (appCtxt.getCurrentViewType() === ZmId.VIEW_CONVLIST && appCtxt.getSettings().getSetting("READING_PANE_LOCATION").value === "off") {
		setTimeout(AjxCallback.simpleClosure(this._do_addSForceBar, this, [msgView]), 1000);
	} else {
		this._do_addSForceBar(msgView);
	}
};

Com_Zimbra_SForce.prototype._parseAndSetRecordsObj =
function(recordsObj) {
	this.cRecords = [];
	this.lRecords = [];
	this.allRecords = [];
	var cRecords = recordsObj.cRecords;
	var lRecords = recordsObj.lRecords;
	var allRecords = [];
	if (cRecords && cRecords instanceof Array) {
		this.cRecords = cRecords;
		allRecords = cRecords;
	} else {
		this.cRecords = [];
	}

	if (lRecords && lRecords instanceof Array) {
		this.lRecords = lRecords;
		allRecords = allRecords.concat(lRecords);
	} else {
		this.lRecords = [];
	}
	this.allRecords = allRecords;
};

Com_Zimbra_SForce.prototype._do_addSForceBar =
function(msgView) {
	if (this.sforce_logindlg_sbarShowOnlyOnResult && this.allRecords.length == 0 && !this._force_show_salesforceBar) {
		return;
	}

	if (!msgView) {
		return;
	}
	if (msgView._mode === ZmId.VIEW_CONV2 || msgView._mode === ZmId.VIEW_CONVLIST) {
		var infoBar = document.getElementById(msgView._viewId + "__header");
	} else {
		infoBar = document.getElementById(msgView._hdrTableId);
	}

	if (!infoBar) {
		return;
	}
	if (this._previousParentNode && document.getElementById("sforce_bar_frame")) {
		this._previousParentNode.removeChild(document.getElementById("sforce_bar_frame"));
	}
	this._previousParentNode = infoBar.parentNode;
	var newNode = document.createElement("div");
	newNode.style.width = "100%";
	newNode.id = "sforce_bar_frame";
	newNode.innerHTML = this._getSFBarWidgetHtml();
	infoBar.parentNode.insertBefore(newNode, infoBar.nextSibling);

	this.changeOpac(0, newNode.style);
	this.opacity("sforce_bar_frame", 0, 100, 500);
	this._addWidgetsToSFBar();

	var doc = document.getElementById("sforce_bar_msgCell");
	if (doc) {
		if (this.allRecords.length > 0) {
			var hasContact = true;
			var hasLead = true;
			var contacts;
			if (this.cRecords.length == 1) {
				contacts = [this.cRecords.length, " contact"].join("");
			} else if(this.cRecords.length > 1) {
				contacts = [this.cRecords.length, " contacts"].join("");
			} else {
				hasContact =false;
				contacts = "";
			}
			var leads;
			if (this.lRecords.length == 1) {
				leads = [this.lRecords.length, " lead"].join("");
			} else if(this.lRecords.length > 1) {
				leads = [this.lRecords.length, " leads"].join("");
			} else {
				hasLead = false;
				leads = "";
			}
			var andStr = " & ";
			if(!hasLead || !hasContact) {
				andStr = "";
			}
			doc.innerHTML = [contacts,andStr,leads," found"].join("");
			doc.style.color = "#0033FF";
			//doc.style.fontWeight = "bold";
		} else {
			doc.innerHTML = "";
		}
	}
	var callback = AjxCallback.simpleClosure(this._sforceBarMainOnClickHdlr, this);
	document.getElementById("sforce_bar_resultsMainDiv").onclick = callback;
	this._searchAllContacts = false;//set this before calling noteDropped
};

Com_Zimbra_SForce.prototype.opacity =
function(id, opacStart, opacEnd, millisec) {
	//speed for each frame
	var speed = Math.round(millisec / 100);
	var timer = 0;
	var styleObj = document.getElementById(id).style;
	//determine the direction for the blending, if start and end are the same nothing happens
	if (opacStart > opacEnd) {
		for (i = opacStart; i >= opacEnd; i--) {
			setTimeout(AjxCallback.simpleClosure(this.changeOpac, this, i, styleObj), (timer * speed));
			timer++;
		}
	} else if (opacStart < opacEnd) {
		for (i = opacStart; i <= opacEnd; i++)
		{
			setTimeout(AjxCallback.simpleClosure(this.changeOpac, this, i, styleObj), (timer * speed));
			timer++;
		}
	}
};

//change the opacity for different browsers
Com_Zimbra_SForce.prototype.changeOpac =
function(opacity, styleObj) {
	styleObj.opacity = (opacity / 100);
	styleObj.MozOpacity = (opacity / 100);
	styleObj.KhtmlOpacity = (opacity / 100);
	styleObj.filter = "alpha(opacity=" + opacity + ")";
};

Com_Zimbra_SForce.prototype._getSFBarWidgetHtml =
function() {
	var html = new Array();
	var i = 0;
	if (!this._sforceImage_14) {
		this._sforceImage_14 = ["<img  height=14px width=14px src=\"", this.getResource("img/sforce.gif") , "\"  />"].join("");
	}
	html[i++] = "<div><table width=100%><tr><td width='500'>";
	html[i++] = ["<div style='cursor:pointer' id='sforce_bar_mainHandler'><table cellpadding=0 cellspacing=0><tr><td width=2px></td>",
		"<td width=11px><div id='sforce_expandCollapseIconDiv' class='ImgHeaderCollapsed'></div></td><td width=2px></td>",
		"<td>",this._sforceImage_14,"</td>",
		"<td width=2px></td><td width='100'><label style='color:rgb(45, 45, 45);cursor:pointer'>Salesforce Bar</label></td>",
		"<td id='sforce_bar_msgCell'></td></tr></table></div></td>"].join("");
	html[i++] = "<td>";
	html[i++] = "<div id='sforce_bar_generalToolbar' style='display:none'>";
	html[i++] = "<table class='SForce_table'>";
	html[i++] = "<tr><td><input type=text id='sforce_bar_searchField' /></td><td id='sforce_bar_searchBtn' width=80%></td>";
	html[i++] = "<td id='sforce_bar_addNotesBtn'></td><td id='sforce_bar_email2CaseBtn'></td><td><div id='sforce_bar_createNewMenuDiv'></div></td></tr></table></div>";
	html[i++] = "</td></tr></table>";
	html[i++] = "</DIV>";
	html[i++] = "<DIV  class='SForce_bar_yellow'  id='sforce_bar_resultsMainDiv'>";
	html[i++] = this._getNoSearchResultsFoundHtml();
	html[i++] = "</DIV>";
	return html.join("");
};

Com_Zimbra_SForce.prototype._getNoSearchResultsFoundHtml =
function() {
	return "<table align=center width=100%><td align=center>No search result or Salesforce information to display<td></table>";
};
Com_Zimbra_SForce.prototype._getSearchingHtml =
function() {
	return "<table align=center width=100%><td align=center>Searching..<td></table>";
};

Com_Zimbra_SForce.prototype._addWidgetsToSFBar =
function() {
	var callback = AjxCallback.simpleClosure(this._sforceBarExpandBtnListener, this);
	document.getElementById("sforce_bar_mainHandler").onclick = callback;

	Dwt.setHandler(document.getElementById("sforce_bar_searchField"), DwtEvent.ONKEYPRESS, AjxCallback.simpleClosure(this._searchFieldKeyHdlr, this));

	var btn = new DwtButton({parent:this._shell});
	btn.setText("Add Notes");
	btn.setImage("SFORCE-panelIcon");
	btn.addSelectionListener(new AjxListener(this, this._sforceAddNotesHandler));
	document.getElementById("sforce_bar_addNotesBtn").appendChild(btn.getHtmlElement());

	btn = new DwtButton({parent:this._shell});
	btn.setText("Search");
	btn.setImage("Search");
	btn.addSelectionListener(new AjxListener(this, this._sforceBarSearchHandler));
	document.getElementById("sforce_bar_searchBtn").appendChild(btn.getHtmlElement());


	btn = new DwtButton({parent:this._shell});
	btn.setText("Email2Case");
	btn.setImage("Doc");
	btn.addSelectionListener(new AjxListener(this, this._sforceBarEmailToCaseHdlr));
	document.getElementById("sforce_bar_email2CaseBtn").appendChild(btn.getHtmlElement());

	btn = new DwtButton({parent:this._shell});
	btn.setText("New");
	btn.setImage("NewFolder");
	var menu = new ZmPopupMenu(btn); //create menu
	btn.setMenu(menu);//add menu to button
	document.getElementById("sforce_bar_createNewMenuDiv").appendChild(btn.getHtmlElement());

	var items = ["Account", "Case", "Contact", "Lead", "Opportunity", "Solution","Report", "Campaign", "Product"];
	for (var i = 0; i < items.length; i++) {
		var itemName = items[i];
		var mi = menu.createMenuItem(itemName, {image:"SFORCE-panelIcon", text:itemName});
		mi.addSelectionListener(new AjxListener(this, this._createNewMenuListener, itemName));
	}
};

Com_Zimbra_SForce.prototype._searchFieldKeyHdlr =
function(ev) {
	var event = ev || window.event;
	if (event.keyCode != undefined && event.keyCode != 13) {//if not enter key
		return;
	}
	this._sforceBarSearchHandler();
};

Com_Zimbra_SForce.prototype._sforceBarSearchHandler =
function() {
	var sq = document.getElementById("sforce_bar_searchField").value;
	if (sq.length <= 1) {
		this.displayErrorMessage("Search query must have at least 2 characters");
		return;
	}
	document.getElementById("sforce_bar_resultsMainDiv").innerHTML = this._loadingSalesForceHtml; //this._getSearchingHtml();

	var callback = AjxCallback.simpleClosure(this._sforceBarSearchResultHandler, this);
	var q = ["FIND {",sq,"} RETURNING Account(Id,Name limit 5),Contact(Id,Name, Email Limit 10),Lead(Id,Name, Email Limit 10),Opportunity(Id,Name Limit 5),Case(Id,Subject,caseNumber Limit 5)"].join("");
	this.search(q, 10, callback, true, true);
};

Com_Zimbra_SForce.prototype._sforceBarSearchResultHandler =
function(result) {
	var records = result.getDoc().getElementsByTagName("record");
	if (records.length == 0) {
		document.getElementById("sforce_bar_resultsMainDiv").innerHTML = this._getNoSearchResultsFoundHtml();
	}
	;
	var html = new Array();
	var i = 0;
	html[i++] = "<div  style='font-weight:bold;font-size:12px;background-color:#EFE7D4;padding:4px' width=100%>Search Result:</div>";
	html[i++] = "<div  style='font-weight:bold;font-size:14px;' width=100%>";
	html[i++] = "<table class='SForce_table SForce_hoverTable' cellpadding=2 cellspacing=2 border=0 width=100%>";
	html[i++] = "<tr align=left><th width=15%>Action</th><th width=10%>Type</th><th width=75%%>Details</th></tr>";
	var idStr = "sf:Id";
	var nameStr = "sf:Name";
	var subjectStr = "sf:Subject";
	var emailStr = "sf:Email";
	var caseNumberStr = "sf:CaseNumber";
	if (AjxEnv.isChrome || AjxEnv.isSafari) {
		idStr = "Id";
		nameStr = "Name";
		subjectStr = "Subject";
		emailStr = "Email";
		caseNumberStr = "CaseNumber";
	}
	for (var j = 0; j < records.length; j++) {
		var rec = records[j];
		var type = rec.attributes[0].nodeValue.replace("sf:", "");
		var idObjArry = rec.getElementsByTagName(idStr);
		if (idObjArry.length == 0) {
			continue;
		}
		var idObj = idObjArry[0];
		var details = [];
		if (idObj.textContent) {
			var id = idObj.textContent;
			if (type != "Case") {
				var obj = rec.getElementsByTagName(nameStr);
				if (obj.length > 0) {
					details.push(["<strong>", obj[0].textContent,"</strong>"].join(""));
				}
			} else if (type == "Case") {
				var obj = rec.getElementsByTagName(subjectStr);
				if (obj.length > 0) {
					details.push(["<strong>", obj[0].textContent,"</strong>"].join(""));
				}
				obj = rec.getElementsByTagName(caseNumberStr);
				if (obj.length > 0) {
					details.push(obj[0].textContent);
				}
			}

			if (type == "Contact" || type == "Lead") {
				var obj = rec.getElementsByTagName(emailStr);
				if (obj.length > 0) {
					details.push(obj[0].textContent);
				}
			}

		} else {//IE..
			var id = idObj.text;
			if (type != "Case") {
				var obj = rec.getElementsByTagName(nameStr);
				if (obj.length > 0) {
					details.push(obj.text);
				}
			} else if (type == "Case") {
				var obj = rec.getElementsByTagName(subjectStr);
				if (obj.length > 0) {
					details.push(obj[0].text);
				}
				obj = rec.getElementsByTagName(caseNumberStr);
				if (obj.length > 0) {
					details.push(obj[0].text);
				}
			}

			if (type == "Contact" || type == "Lead") {
				var obj = rec.getElementsByTagName(emailStr);
				if (obj.length > 0) {
					details.push(obj[0].text);
				}
			}
		}

		html[i++] = ["<tr><td>", this._getSFViewEditLinks(id), "</td>"].join("");
		html[i++] = ["<td >",type,"</td>"].join("");
		html[i++] = ["<td>",details.join(" "),"</td></tr>"].join("");
	}
	html[i++] = "</table>";
	html[i++] = "</div>";
	document.getElementById("sforce_bar_resultsMainDiv").innerHTML = html.join("");
};


Com_Zimbra_SForce.prototype._sforceAddNotesHandler =
function() {
	if (this._currentSelectedMsg) {
		this._searchAllContacts = false;//set this before calling noteDropped
		this.noteDropped(this._currentSelectedMsg);
	}
};

Com_Zimbra_SForce.prototype._sforceBarEmailToCaseHdlr =
function() {
	var contactName = "";
	var subject = this._currentSelectedMsg.subject;
	var body = this.getMailBodyAsText(this._currentSelectedMsg);
	var fromEmailObj = this._currentSelectedMsg.getAddress(AjxEmailAddress.FROM);
	var sfName = this._emailExistsInSF(fromEmailObj.address);
	if (sfName) {
		var contactName = sfName;
	} else {
		var arry = this._currentSelectedMsg.participants.getArray();
		for (var i = 0; i < arry.length; i++) {
			var emailObj = arry[i];
			var sfName = this._emailExistsInSF(emailObj.address);
			if (sfName) {
				contactName = sfName;
				break;
			}
		}
	}
	if (!this.sforceInstanceName) {
		this.sforceInstanceName = (this.SERVER.split(".")[0]).split("//")[1];
	}

	var url = ["https://", this.sforceInstanceName, ".salesforce.com/500/e?retURL=/500/o",
		AjxStringUtil.urlEncode("?cas3="),  AjxStringUtil.urlEncode(contactName),
		AjxStringUtil.urlEncode("&cas14="),   AjxStringUtil.urlComponentEncode(subject),
		AjxStringUtil.urlEncode("&cas15="),  AjxStringUtil.urlComponentEncode(AjxStringUtil.htmlDecode(this._getCurrentAddressAndDateStr() + body))].join("");

	var callback = new AjxCallback(this, this._openSFLink, url);
	this.login(callback, null, null, true);
};

Com_Zimbra_SForce.prototype._emailExistsInSF =
function(email) {
	var len = this._emailsInSalesforce.length;
	for (var i = 0; i < len; i++) {
		var sfEmail = this._emailsInSalesforce[i].email;
		if (AjxStringUtil.trim(email.toLowerCase()) == AjxStringUtil.trim(sfEmail.toLowerCase())) {
			return this._emailsInSalesforce[i].name;
		}
	}
	return false;
};

Com_Zimbra_SForce.prototype._getCurrentAddressAndDateStr =
function() {
	if (!this._currentSelectedMsg) {
		return;
	}
	var frmAdd = this._currentSelectedMsg.getAddresses(AjxEmailAddress.FROM);
	var toAdd = this._currentSelectedMsg.getAddresses(AjxEmailAddress.TO);
	var ccAdd = this._currentSelectedMsg.getAddresses(AjxEmailAddress.CC);
	if (frmAdd) {
		frmAdd = frmAdd.getArray();
	}
	if (toAdd) {
		toAdd = toAdd.getArray();
	}
	if (ccAdd) {
		ccAdd = ccAdd.getArray();
	}
	var str = "From: ";
	for (var i = 0; i < frmAdd.length; i++) {
		str = [str, frmAdd[i].address, ";"].join("");
	}
	if (toAdd.length > 0) {
		str = [str, "\r\n", "To: "].join("");
	}
	for (var i = 0; i < toAdd.length; i++) {
		str = [str, toAdd[i].address, ";"].join("");
	}
	if (ccAdd.length > 0) {
		str = [str, "\r\n",  "Cc: "].join("");
	}
	for (var i = 0; i < ccAdd.length; i++) {
		str = [str, ccAdd[i].address, ";"].join("");
	}
	var dateFormatter = AjxDateFormat.getDateTimeInstance(AjxDateFormat.LONG, AjxDateFormat.SHORT);
	var dateString = this._currentSelectedMsg.sentDate ? dateFormatter.format(new Date(this._currentSelectedMsg.sentDate)) : dateFormatter.format(new Date(this._currentSelectedMsg.date));
	str = [str, "\r\nDate: ",dateString,"\r\n"].join("");

	return str + "-----------------------------------\r\n\r\n";
};


Com_Zimbra_SForce.prototype._createNewMenuListener =
function(itemName) {
	var itemCode = "";
	switch (itemName) {
		case "Account":
			itemCode = "001";
			break;
		case "Lead":
			itemCode = "00Q";
			break;
		case "Opportunity":
			itemCode = "006";
			break;
		case "Case":
			itemCode = "500";
			break;
		case "Solution":
			itemCode = "501";
			break;
		case "Contact":
			itemCode = "003";
			break;
		case "Account":
			itemCode = "001";
			break;
		case "Report":
			itemCode = "00O";
			break;		case "Account":
		itemCode = "001";
		break;
		case "Campaign":
			itemCode = "701";
			break;
		case "Product":
			itemCode = "01t";
			break;

	}
	if (!this.sforceInstanceName) {
		this.sforceInstanceName = (this.SERVER.split(".")[0]).split("//")[1];
	}
	var completeUrl = ["https://",this.sforceInstanceName,".salesforce.com/secur/frontdoor.jsp?sid=",
		AjxStringUtil.urlEncode(this.sessionId), "&retURL=/", itemCode, "/e?retURL=/",itemCode,"/o"].join("");

	window.open(completeUrl);
};


Com_Zimbra_SForce.prototype._sforceBarExpandBtnListener =
function() {
	if (!this.sforce_bar_recordsForThisMsgParsed) {
		this._setResultsToSForceBar();
	}
	if (!this.sforce_bar_expanded) {
		document.getElementById("sforce_expandCollapseIconDiv").className = "ImgHeaderExpanded";
		document.getElementById("sforce_bar_generalToolbar").style.display = "block";

		//this.changeOpac(0, document.getElementById("sforce_bar_resultsMainDiv").style);
		//this.opacity("sforce_bar_resultsMainDiv", 0, 100, 500);
		document.getElementById("sforce_bar_resultsMainDiv").style.display = "block";

		document.getElementById("sforce_bar_msgCell").style.display = "none";
		this.sforce_bar_expanded = true;
	} else {
		document.getElementById("sforce_expandCollapseIconDiv").className = "ImgHeaderCollapsed";
		document.getElementById("sforce_bar_generalToolbar").style.display = "none";
		document.getElementById("sforce_bar_resultsMainDiv").style.display = "none";
		document.getElementById("sforce_bar_msgCell").style.display = "block";

		this.sforce_bar_expanded = false;
	}
};

Com_Zimbra_SForce.prototype._setResultsToSForceBar =
function() {
	this.sforce_bar_recordsForThisMsgParsed = true;
	if (this.allRecords.length == 0) {
		return;
	}
	var len = this.cRecords.length;
	var html = new Array();
	var i = 0;
	for (var k = 0; k < len; k++) {
		var c = this.cRecords[k];
		var email = c.Email ? c.Email.toString() : "";
		var name = c.Name ? c.Name.toString() : "";
		this._emailsInSalesforce.push({email:email, name:name});

		var phone = c.Phone ? c.Phone.toString() : "";
		var accountName = c.Account ? (c.Account.Name ? c.Account.Name.toString() : "") : "";
		var accountOwnerName = "";
		var accountOwnerId = "";
		var editLinksHtml_AccntOwner = "";
		if(accountName != "") {
			accountOwnerName = c.Account.Owner ? (c.Account.Owner.Name ? c.Account.Owner.Name.toString() : "") : "";
			accountOwnerId = c.Account.OwnerId ? c.Account.OwnerId.toString() : "";
			if (accountOwnerId != "") {
				editLinksHtml_AccntOwner = this._getSFViewEditLinks(accountOwnerId);
			}
		}
		var editLinksHtml_accnt = "";
		if (accountName != "") {
			var accId = c.Account ? (c.Account.Id ? c.Account.Id.toString() : "") : "";
			if (accId != "") {
				editLinksHtml_accnt = this._getSFViewEditLinks(accId, [
					{name:"add participants", id:("sforce__addContacts___" + accountName + "___" + accId)}
				]);
			}
		}
		var editLinksHtml_owner = "";
		var ownerName = c.Owner ? (c.Owner.Name ? c.Owner.Name.toString() : "") : "";
		if (ownerName != "") {
			var ownerId = c.OwnerId ? c.OwnerId : "";
			if (ownerId != "") {
				editLinksHtml_owner = this._getSFViewEditLinks(ownerId);
			}
		}

		var address = [(c.MailingStreet ? c.MailingStreet.toString() : "")," ",
			(c.MailingState ? c.MailingState.toString() : ""), " ",
			(c.MailingCity ? c.MailingCity.toString() : ""), " ",
			(c.MailingPostalCode ? c.MailingPostalCode.toString() : ""), " ",
			(c.MailingCountry ? c.MailingCountry.toString() : "")].join("");

		var title = (c.Title ? c.Title.toString() : "");
		html[i++] = "<br/>";
		html[i++] = "<DIV  class='SForce_lightyellow SForce_hoverTable' style='width:94%; position:relative; left:3%;'>";
		html[i++] = ["<div class='overviewHeader' width=100%><table><tr><td><label style='font-weight:bold;font-size:14px;padding:4px' >Contact: "
			,name,"</td><td><label style='font-size:11px;font-weight:normal'>",this._getSFViewEditLinks(c.Id.toString()),"</label></td></tr></table></div>"].join("");
		html[i++] = "<div  style='font-weight:bold;' width=100%>";
		html[i++] = "<table  class='SForce_table'  cellpadding=2 cellspacing=0 border=0 width=100%>";
		if (title != "") {
			html[i++] = ["<tr align=left><td><strong>Title:</strong></td><td>",title,"</td></tr>"].join("");
		}
		if (accountName != "") {
			html[i++] = ["<tr align=left><td width=150px><strong>Account:</strong></td><td>",accountName," ", editLinksHtml_accnt,"</td></tr>"].join("");
		}
		if (accountOwnerName != "") {
			html[i++] = ["<tr align=left><td width=150px><strong>Account Owner:</strong></td><td>",accountOwnerName," ", editLinksHtml_AccntOwner,"</td></tr>"].join("");
		}
		if (ownerName != "") {
			html[i++] = ["<tr align=left><td width=150px><strong>Contact Owner:</strong></td><td>",ownerName," ", editLinksHtml_owner,"</td></tr>"].join("");
		}
		if (email != "") {
			html[i++] = ["<tr align=left><td width=150px> <strong>Email:</strong></td><td>",email,"</td></tr>"].join("");
		}
		if (phone != "") {
			html[i++] = ["<tr align=left><td width=150px><strong>Phone:</strong></td><td>",phone,"</td></tr>"].join("");
		}
		if (AjxStringUtil.trim(address) != "") {
			html[i++] = ["<tr align=left><td width=150px><strong>Address:</strong></td><td>",address,"</td></tr>"].join("");
		}

		html[i++] = "</table>";
		html[i++] = "</div>";
		var cases = c.Cases;
		if (cases) {
			var records = cases.records;
			if (records && !(records instanceof Array)) {
				records = [records];
			}
			if (records.length > 0) {
				html[i++] = "<br/>";
			}
			if (records) {
				html[i++] = "<div  style='font-weight:bold;font-size:12px;background-color:#EFE7D4;padding:3px' width=100%>Cases:</div>";
				html[i++] = "<div  style='font-weight:bold;font-size:14px;' width=100%>";
				html[i++] = "<table class='SForce_table' cellpadding=2 cellspacing=0 border=0 width=100%>";
				html[i++] = "<tr><th width=15%>Action</th><th width=15%>Case Number</th><th width=15%>Case Owner</th><th width=15%>Status</th><th width=55%>Subject</th></tr>";
				for (var j = 0; j < records.length; j++) {
					var rec = records[j];
					var caseNumber = rec.CaseNumber ? rec.CaseNumber.toString() : "";
					var subject = rec.Subject ? rec.Subject.toString() : "";
					var status = rec.Status ? rec.Status.toString() : "";
					var id = rec.Id ? rec.Id.toString() : "";
					var ownerName = rec.Owner ? (rec.Owner.Name ? rec.Owner.Name.toString() : "") : "";
					var editLinksHtml = "";
					if (id != "") {
						editLinksHtml = this._getSFViewEditLinks(id);
					}
					html[i++] = ["<tr><td>", editLinksHtml, "</td>"].join("");
					html[i++] = ["<td>",caseNumber,"</td>"].join("");
					html[i++] = ["<td>",ownerName,"</td>"].join("");
					html[i++] = ["<td>",status,"</label></td>"].join("");
					html[i++] = ["<td>",subject,"</td></tr>"].join("");
				}
				html[i++] = "</table>";
				html[i++] = "</div>";
			}
		}

		var op = c.OpportunityContactRoles;
		if (op) {
			var records = op.records;
			if (records && !(records instanceof Array)) {
				records = [records];
			}
			if (records.length > 0) {
				html[i++] = "<br/>";
			}
			if (records) {
				html[i++] = "<div  style='font-weight:bold;font-size:12px;padding:3px;background-color:#EFE7D4;' width=100%>Opportunities:</div>";
				html[i++] = "<div  style='font-weight:bold;font-size:14px;' width=100%>";
				html[i++] = "<table   class='SForce_table' cellpadding=2 cellspacing=0 border=0 width=100%>";
				html[i++] = "<tr><th width=15%>Action</th><th width=15%>Role</th><th>Name</th></tr>";
				for (var j = 0; j < records.length; j++) {
					var rec = records[j];
					var oppName = rec.Opportunity ? (rec.Opportunity.Name ? rec.Opportunity.Name.toString() : "") : "";
					var role = "";
					if (rec.Role) {
						role = rec.Role.toString();
					}
					var id = rec && rec.Opportunity && rec.Opportunity.Id ? rec.Opportunity.Id.toString() : "";
					var editLinksHtml = "";
					if (id != "") {
						editLinksHtml = this._getSFViewEditLinks(id);
					}
					html[i++] = ["<tr><td>", editLinksHtml, "</td>"].join("");
					html[i++] = ["<td >",role,"</td><td>",oppName,"</td></tr>"].join("");
				}
				html[i++] = "</table>";
				html[i++] = "</div>";
			}
		}
		html[i++] = "</DIV>";
	}
	html[i++] = "<br/>";
	var len = this.lRecords.length;
	if (len > 0) {
		var records = this.lRecords;
		for (var j = 0; j < records.length; j++) {
			var rec = records[j];
			var address = [(rec.Street ? rec.Street.toString() : "")," ",
				(rec.City ? rec.City.toString() : ""), " ",
				(rec.State ? rec.State.toString() : ""), " ",
				(rec.PostalCode ? rec.PostalCode.toString() : ""), " ",
				(rec.Country ? rec.Country.toString() : "")].join("");

			var id = rec.Id ? rec.Id.toString() : "";
			var editLinksHtml = "";
			if (id != "") {
				editLinksHtml = this._getSFViewEditLinks(id);
			}
			var name = (rec.Name ? rec.Name.toString() : "");
			var wSite = (rec.Website ? rec.Website.toString() : "");
			if (wSite!="" && wSite.toLowerCase().indexOf("http://") == -1) {
				wSite = ["http://", wSite].join("");
			}
			var title = (rec.Title ? rec.Title.toString() : "");
			var email = (rec.Email ? rec.Email.toString() : "");
			var phone = (rec.Phone ? rec.Phone.toString() : "");
			var status = (rec.Status ? rec.Status.toString() : "");
			var NumberOfEmployees = (rec.NumberOfEmployees ? rec.NumberOfEmployees.toString() : "");

			html[i++] = "<DIV  class='SForce_lightyellow SForce_hoverTable' style='width:94%; position:relative; left:3%;'>";
			html[i++] = ["<div class='overviewHeader' width=100%><table><tr><td><label style='font-weight:bold;font-size:14px;padding:4px' >Lead: "
				,name,"</td><td><label style='font-size:11px;font-weight:normal'>",editLinksHtml,"</label></td></tr></table></div>"].join("");

			//html[i++] = ["<div class='overviewHeader' style='font-weight:bold;font-size:14px;padding:4px' width=100%>Lead: ",name,"<span style='font-size:11px;font-weight:normal'>",editLinksHtml,"</span></div>"].join("");
			html[i++] = "<div width=\"100%\" style=\"font-weight: bold; \">";
			html[i++] = "<table class='SForce_table' cellpadding=2 cellspacing=0 border=0 width=100%>";
			if (title != "") {
				html[i++] = ["<tr align=left><td width=150px><strong>Title:</strong></td><td>",title,"</td></tr>"].join("");
			}
			if (email != "") {
				html[i++] = ["<tr align=left><td width=150px><strong>Email:</strong></td><td>",email,"</td></tr>"].join("");
			}			
			if (phone != "") {
				html[i++] = ["<tr align=left><td width=150px><strong>Phone:</strong></td><td>",phone,"</td></tr>"].join("");
			}
			if (status != "") {
				html[i++] = ["<tr align=left><td width=150px><strong>Status:</strong></td><td>",status,"</td></tr>"].join("");
			}
			if (NumberOfEmployees != "") {
				html[i++] = ["<tr align=left><td width=150px><strong>#Employees:</strong></td><td>",NumberOfEmployees,"</td></tr>"].join("");
			}
			if (AjxStringUtil.trim(address) != "") {
				html[i++] = ["<tr align=left><td width=150px><strong>Address:</strong></td><td>",address,"</td></tr>"].join("");
			}
			if (wSite != "") {
				html[i++] = ["<tr align=left><td width=150px><strong>Website:</strong></td><td><a target=_blank  href='",wSite,"'>",wSite,"</a></td></tr>"].join("");
			}
			html[i++] = "</table>";
			html[i++] = "</div>";
			html[i++] = "</div>";
			html[i++] = "<br/>";
		}
	}
	document.getElementById("sforce_bar_resultsMainDiv").innerHTML = html.join("");
};


Com_Zimbra_SForce.prototype._getSFViewEditLinks =
function(id, otherLinksArry) {
	var lnks = ["<a id='sforce_view_",id,"'  style='color: #385495; font-size: 11px;text-decoration:underline'  href='javascript:void(0)'>view</a>&nbsp;",
		"<a id='sforce_edit_",id,"' style='color: #385495; font-size: 11px;text-decoration:underline' href='javascript:void(0)'>edit</a>&nbsp;",
		"<a id='sforce_clone_",id,"'  style='color: #385495; font-size: 11px;text-decoration:underline'  href='javascript:void(0)'>clone</a>"];

	if (otherLinksArry == undefined) {
		return lnks.join("");
	}
	for (var i = 0; i < otherLinksArry.length; i++) {

		lnks.push(["&nbsp;<a id='",otherLinksArry[i].id,"'  style='color: #385495; font-size: 11px;text-decoration:underline'  href='javascript:void(0)'>",otherLinksArry[i].name,"</a>"].join(""));
	}
	return lnks.join("");
};

Com_Zimbra_SForce.prototype._sforceBarMainOnClickHdlr =
function(ev) {
	if (AjxEnv.isIE) {
		ev = window.event;
	}
	var dwtev = DwtShell.mouseEvent;
	dwtev.setFromDhtmlEvent(ev);
	var el = dwtev.target;
	var origTarget = dwtev.target;
	if (origTarget.nodeName.toLowerCase() != "a") {
		return;
	}
	var origTargetId = origTarget.id;
	if (origTargetId.indexOf("sforce__addContacts") == 0) {
		var arry = origTargetId.split("___");
	} else {
		var arry = origTarget.id.split("_");
	}
	if (arry.length != 3 || arry.length[2] == "") {
		appCtxt.setStatusMsg("Unknown Link", ZmStatusView.LEVEL_WARNING);
		return;
	}
	var id = arry[2];
	var mode = arry[1].toLowerCase();
	if (arry[0].indexOf("sforce__addContacts") == 0) {
		this._showCreateNewContactOrLeadDlg({id:id, name:arry[1]}, false);
	} else {
		var callback = new AjxCallback(this, this._openFrontDoorUrl, [mode, id]);
		this.login(callback, null, null, true);
	}
};

Com_Zimbra_SForce.prototype._openFrontDoorUrl =
function(mode, id) {
	if (!this.sforceInstanceName) {
		this.sforceInstanceName = (this.SERVER.split(".")[0]).split("//")[1];
	}
	var baseUrl = ["https://",this.sforceInstanceName,".salesforce.com/secur/frontdoor.jsp?sid=", AjxStringUtil.urlEncode(this.sessionId), "&retURL="].join("");
	var part = ""
	if (mode == "view") {
		part = AjxStringUtil.urlEncode(["/",id].join(""));
	} else if (mode == "edit") {
		part = AjxStringUtil.urlEncode(["/", id, "/e?retURL=/", id].join(""));
	} else if (mode == "clone") {
		part = AjxStringUtil.urlEncode(["/", id, "/e?clone=1&retURL=/", id].join(""));
	}
	window.open(baseUrl + part);
};


//-------------------------------------------------------------------------------------------
//.....Salesforce Bar related (END)
//-------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------------------
// Support Case Link in mail related...
//-------------------------------------------------------------------------------------------

Com_Zimbra_SForce.prototype._getCaseId =
function(caseNumber, callback) {
	var q = ["Select Id from  Case where CaseNumber='",caseNumber,"'"].join("");
	var callback = AjxCallback.simpleClosure(this._handleGetCaseId, this, callback);
	this.query(q, 10, callback);
};

Com_Zimbra_SForce.prototype._handleGetCaseId =
function(callback, result) {
	if (result.length == 0) {
		appCtxt.setStatusMsg("Unknown case or you are not authorized to view this case", ZmStatusView.LEVEL_WARNING);
		return;
	}
	var id = result[0].Id.toString();
	if (callback) {
		callback.run(id);
	}
};

Com_Zimbra_SForce.prototype._getCaseLink =
function(linkFieldName, caseNumber, callback) {
	var q = ["Select ",linkFieldName," from  Case where CaseNumber='",caseNumber,"'"].join("");
	var callback = AjxCallback.simpleClosure(this._handleGetCaseLink, this, linkFieldName, callback);
	this.query(q, 10, callback);
};

Com_Zimbra_SForce.prototype._handleGetCaseLink =
function(linkFieldName, callback, result) {
	if (result.length == 0) {
		appCtxt.setStatusMsg("Unknown case or you are not authorized to view this case", ZmStatusView.LEVEL_WARNING);
		return;
	}
	var data = result[0][linkFieldName];
	var link = "";
	if (data != undefined) {
		var link = data.toString();
	}
	if (callback) {
		callback.run(link);
	}
};

Com_Zimbra_SForce.prototype._getCurrentValuesForQuickUpdateDlg =
function(caseNumber) {
	this._allQuickUpdatePickLists = [];
	var pickListNames = [];
	for (var el in this._sforceCaseObject) {
		var obj = this._sforceCaseObject[el];
		if(!obj.picklistValues) {
			continue;
		}
		try {
			var items = obj.picklistValues.split("=::=");
			this._allQuickUpdatePickLists[el] = ({name:el, label:obj.label, items:items});
			pickListNames.push(el);
		} catch(e) {

		}

	}
	var q = ["Select Id,Owner.Name,OwnerId,",pickListNames.join(",")," from  Case where CaseNumber='",caseNumber,"'"].join("");
	var callback = AjxCallback.simpleClosure(this._handleGetCurrentValuesFoQuickUpdateDlg, this);
	this.query(q, 10, callback);

};
Com_Zimbra_SForce.prototype._handleGetCurrentValuesFoQuickUpdateDlg =
function(result) {
	var result = result[0];
	if (!result) {
		appCtxt.setStatusMsg("Could not create Quick Edit Dialog.", ZmStatusView.LEVEL_WARNING);
		return;
	}
	for (var item in result) {
		if (this._allQuickUpdatePickLists[item]) {
			this._allQuickUpdatePickLists[item]["currentValue"] = result[item].toString();
		}
	}
	this._displayQuickUpdateDialog(result);
};

Com_Zimbra_SForce.prototype.clicked =
function(element, caseNumber, parts, mode) {
	if (!mode) {
		mode = "open";
	}
	var caseNumber = this._getTooltipData(caseNumber);
	var callback = new AjxCallback(this, this._handleCaseContextmenu, mode);
	this._getCaseId(caseNumber, callback);
};

Com_Zimbra_SForce.prototype._handleCaseContextmenu =
function(mode, id) {
	if (!this.sforceInstanceName) {
		this.sforceInstanceName = (this.SERVER.split(".")[0]).split("//")[1];
	}
	var baseUrl = ["https://",this.sforceInstanceName,".salesforce.com/secur/frontdoor.jsp?sid=", AjxStringUtil.urlEncode(this.sessionId), "&retURL="].join("");
	var viewPart = AjxStringUtil.urlEncode(["/",id].join(""));
	var editPart = AjxStringUtil.urlEncode(["/", id, "/e?retURL=/", id].join(""));
	if (mode == "edit") {
		window.open(baseUrl + editPart);
	} else {
		window.open(baseUrl + viewPart);
	}
};


Com_Zimbra_SForce.prototype.toolTipPoppedUp =
function(spanElement, caseNumber, matchContext, canvas) {
	caseNumber = this._getTooltipData(caseNumber);
	var customFields = [];


	if (this._caseObjectLoaded) {
		for (var itemName in this._sforceCaseObject) {
			var obj = this._sforceCaseObject[itemName];
			if (itemName.indexOf("__c") > 0) {
				customFields.push(itemName);
			}
		}
	}

	this._sCaseTooltipFields = "Owner.Name,Subject,Priority,Status,Reason,Contact.Name,Contact.Phone,Contact.Email,Account.Name";
	var cF = customFields.join(",");
	if (cF != "") {
		this._sCaseTooltipFields = [this._sCaseTooltipFields, ",",cF].join("");
	}
	var q = ["Select ",this._sCaseTooltipFields," from  Case where CaseNumber='",caseNumber,"'"].join("");
	this._setCaseTooltipHtml(canvas);

	var callback = AjxCallback.simpleClosure(this._setCaseTooltipHtml, this, canvas);
	this.query(q, 10, callback);
};


Com_Zimbra_SForce.prototype._getTooltipData =
function(objData) {
	objData = objData.toLowerCase();
	objData = objData.replace("case", "").replace(":", "");
	objData = AjxStringUtil.trim(objData);
	return objData;
};

Com_Zimbra_SForce.prototype._setCaseTooltipHtml =
function(canvas, obj) {
	if (!obj) {
		canvas.innerHTML = "Loading..";
		return;
	}
	var props = obj[0];
	if (!props) {
		canvas.innerHTML = "Case Details could not be retrieved";
		return;
	}
	var html = new Array();
	var i = 0;
	var fields = this._sCaseTooltipFields.split(",");
	var len = fields.length;
	//html[i++] = "<DIV style='height: 200px; width:150px; overflow: auto;'>";
	html[i++] = "<table  cellpadding=2 cellspacing=0 border=0>";
	var itemsCount = 0;
	for (var j = 0; j < len; j++) {
		var name = fields[j];
		var val = this._getVal(name, props);
		if (val == "") {
			continue;
		}
		if(itemsCount > 14) {
			break;
		}
		if (this._sforceCaseObjectNameLabelMap[name]) {
			name = this._sforceCaseObjectNameLabelMap[name];
		} else {
			name = name.replace(".", " ");
		}
		if (val == "High" && name == "Priority") {
			html[i++] = ["<tr align='right'><td><strong>",name, ": </strong></td><td align='left'><label style='color:red;font-weight:bold;'>",val,"</label></td></tr>"].join("");
		} else {
			html[i++] = ["<tr align='right'><td><strong>",name, ": </strong></td><td align='left'>",val,"</td></tr>"].join("");
		}
		itemsCount++;
	}
	html[i++] = ["</table>"].join("");
	//html[i++] = "</DIV>";
	canvas.innerHTML = html.join("");
};

Com_Zimbra_SForce.prototype._getVal =
function(colName, ConProps) {
	try {
		var cObj = null;
		if (colName.indexOf(".") == -1) {
			cObj = ConProps[colName];
		} else {
			var objs = colName.split(".");
			for (var i = 0; i < objs.length; i++) {
				if (i == 0) {
					cObj = ConProps[objs[i]];
				} else {
					if (!cObj) {
						return "";
					}
					cObj = cObj[objs[i]];
				}
			}
		}
		if (!cObj) {
			return "";
		}
		return cObj.__msh_content;
	} catch (e) {
	}
	return "";
};

//-------------------------------------------------------------------------------------------
//... Support Case Link in mail related (END)
//-------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------
//Notes dropped... (START)
//--------------------------------------------------------------------------------------------------------
Com_Zimbra_SForce.prototype. noteDropped = function(note, showInBar, msgView) {
	if (!note) {
		return;
	}
	if (showInBar == undefined) {
		showInBar = false;
	}
	if (!showInBar) {
		this._showNotesDlg(note);
	}

	if (!this._emailsForCurrentNote) {
		this._emailsForCurrentNote = this._getValidAddressesForCurrentNote(note);
	}
	if (this._emailsForCurrentNote.length == 0) {
		if (!showInBar) {
			this._handleAddNotesRecords(showInBar, this, []);
		}
	} else {
		var q = ["Select c.Id,c.Name,c.Email,c.Phone,c.OtherPhone,c.Title,c.MailingStreet,c.MailingCity, c.MailingState,c.MailingCountry,c.MailingPostalCode,c.Account.name,c.Account.Owner.Name,c.Owner.Name,c.Account.OwnerId,c.OwnerId,c.Account.Id,",
			"(select id,role,opportunity.owner.Name,opportunity.name,Opportunity.Id from opportunitycontactroles where opportunity.stagename !='Closed Won' AND opportunity.stagename != 'Closed Lost'   limit 5),",
			"(select id,Owner.Name,subject,caseNumber,Status from Cases Where Status !='Closed' limit 5)",
			//"(Select id,subject from ActivityHistories) ",
			" from contact c where Email='", this._emailsForCurrentNote.join("' or Email='"), "'"].join("");

		var callback = new AjxCallback(this, this._queryForLeadDetails, [showInBar, msgView]);
		this.query(q, 10, callback);
	}
};

Com_Zimbra_SForce.prototype._queryForLeadDetails =
function (showInBar, msgView, zimlet, cRecords) {
	var q = ["Select l.Id, l.Name,l.Title,l.Email,l.Phone,l.Company,l.Status,l.Street,l.State,l.PostalCode,l.Country, l.NumberOfEmployees,l.Website from Lead l where Email='", this._emailsForCurrentNote.join("' or Email='"), "'"].join("");

	//var callback = new AjxCallback(this, this._handleAddNotesRecords, [showInBar]);
	var callback = new AjxCallback(this, this._mergeLeadAndContactRecords, [showInBar, cRecords, msgView]);
	this.query(q, 10, callback);
};

Com_Zimbra_SForce.prototype._mergeLeadAndContactRecords =
function (showInBar, cRecords, msgView, zimlet, lRecords) {
	var recordsObj = {cRecords:cRecords, lRecords:lRecords}
	this._handleAddNotesRecords(showInBar, this, {cRecords:cRecords, lRecords:lRecords}, msgView);
};

Com_Zimbra_SForce.prototype._getValidAddressesForCurrentNote =
function (note) {
	var emails = [];
	if (note._addrs) {
		for (var i = 0; i < ZmMailMsg.ADDRS.length; i++) {
			var type = ZmMailMsg.ADDRS[i];
			var a = note._addrs[type];
			if (a) {
				var emls = a._array;
				if (emls instanceof Array) {
					if (emls.length < 10) {//skip checking for emails if # is >9
						emails = emails.concat(this._addEmails(emls));
					}
				} else {
					emails = emails.concat(this._addEmails(emls));
				}
			}
		}
	} else {
		if (note.participants.length < 10) {
			emails = emails.concat(this._addEmails(note.participants));
		} else {
			emails = emails.concat(this._addEmails(note.from));
		}
	}
	emails = sforce_unique(emails);
	return	 emails;
};

Com_Zimbra_SForce.prototype._addEmails =
function (a) {
	var emails = [];
	if (!a) {
		return;
	}
	if (typeof a == "string") {
		if (!this._ignoreThisEmail(a)) {
			emails.push(a);
		}
	} else if (a instanceof Array) {
		for (var i = 0; i < a.length; ++i) {
			var address = a[i].address;
			if (address && !this._ignoreThisEmail(address)) {
				emails.push(a[i].address);
			}
		}
	}
	return emails;
};


Com_Zimbra_SForce.prototype._ignoreThisEmail =
function(email) {
	email = email.toLowerCase();
	if (!this._ignoreDomainList) {
		this._ignoreDomainList = [];
		var igd = this.getUserProperty("sforce_ignoreDomainsList");
		if (igd != "" && igd != undefined) {
			igd = AjxStringUtil.trim(igd);
			if (igd.indexOf(",") >= 0) {
				this._ignoreDomainList = igd.toLowerCase().split(",");
			} else {
				this._ignoreDomainList.push(igd.toLowerCase());
			}
		}
	}
	for (var i = 0; i < this._ignoreDomainList.length; i++) {
		if (email.indexOf(this._ignoreDomainList[i]) >= 0) {
			return true;
		}
	}
	return false;
};

Com_Zimbra_SForce.prototype._handleAddNotesRecords =
function(showInBar, zimlet, recordsObj, msgView) {
	if (!showInBar) {
		this._parseAndSetRecordsObj(recordsObj);
		this._setRecordsToNotesDlg();
		this._setAddNotesHandlers();
	} else {
		this._addSForceBar(recordsObj, msgView);
	}
};

Com_Zimbra_SForce.prototype.call_internalFunc = function(callback, param) {
	callback.call(this, param);
};

Com_Zimbra_SForce.prototype._setAddNotesHandlers = function() {
	var callback = AjxCallback.simpleClosure(this._sfItemSelectionHandler, this, "sforce_contactLead_lookupMenu", "sforce_contactLead_selectionMenu");
	document.getElementById("sforce_contactLead_lookupMenu").onchange = callback;
	callback = AjxCallback.simpleClosure(this._sfItemSelectionHandler, this, "sforce_relatedTo_lookupMenu", "sforce_relatedTo_selectionMenu");
	document.getElementById("sforce_relatedTo_lookupMenu").onchange = callback;

	callback = AjxCallback.simpleClosure(this._showCreateNewContactOrLeadDlg, this, "Contact", true);
	document.getElementById("sforce_quickCreateContactLnk").onclick = callback;

	callback = AjxCallback.simpleClosure(this._showCreateNewContactOrLeadDlg, this, "Lead", true);
	document.getElementById("sforce_quickCreateLeadLnk").onclick = callback;
};

Com_Zimbra_SForce.prototype._showCreateNewContactOrLeadDlg =
function(typeOrObj, setResultToAddNotesMenus) {
	//var val = document.getElementById("sforce_contactLead_createMenu").value;
	//if zimlet dialog already exists...
	var radioType = "Contact";
	if (typeOrObj instanceof String) {
		radioType = typeOrObj;
	}

	if (this._sforceCreateNewObjsDlg) {
		this._sforceCreateNewObjsDlg.setResultToAddNotesMenus = setResultToAddNotesMenus;
		this._sforceCreateNewView.getHtmlElement().innerHTML = "";
		this._sforceCreateNewView.getHtmlElement().innerHTML = this._createNewContactOrLeadView(typeOrObj, setResultToAddNotesMenus);
		this._addAccountLookupBtn();
		this._showHideFields(typeOrObj);

		this._sforceCreateNewObjsDlg.popup();
		return;
	}
	this._sforceCreateNewView = new DwtComposite(this.getShell());
	this._sforceCreateNewView.setSize("400", "350");
	this._sforceCreateNewView.getHtmlElement().style.overflow = "auto";
	this._sforceCreateNewView.getHtmlElement().innerHTML = this._createNewContactOrLeadView(typeOrObj, setResultToAddNotesMenus);

	this._sforceCreateNewObjsDlg = this._createDialog({title:" Quick Create new Contact(s) or Lead(s)", view:this._sforceCreateNewView, standardButtons:[DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON]});
	this._sforceCreateNewObjsDlg.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._createNewContactOrLeadOKBtnListner));
	this._sforceCreateNewObjsDlg.setResultToAddNotesMenus = setResultToAddNotesMenus;

	this._addAccountLookupBtn();
	this._showHideFields(typeOrObj);
	this._addCreateNewContactOrLeadHdlrs();
	this._sforceCreateNewObjsDlg.popup();
};

Com_Zimbra_SForce.prototype._createNewContactOrLeadView =
function(typeOrObj, setResultToAddNotesMenus) {
	this._quickCreateContactObjIds = [];
	this._quickCreateContactAccntRefIdsMap = [];

	var html = new Array();
	var i = 0;
	html[i++] = "<DIV>";
	html[i++] = "<table class='SForce_table' width=100% cellpadding=2><tr><td colspan=3><tr><td><input type='radio' id='sforce_contactOrLeadC' name='sforce_contactOrLead' />Create Contact(s)</td>";
	html[i++] = "<td colspan=3><input  id='sforce_contactOrLeadL' type='radio' name='sforce_contactOrLead' />Create Lead(s)</td></tr></table>";
	html[i++] = "</DIV>";
	html[i++] = "<table width=96% align=center><tr><td>";
	if (!setResultToAddNotesMenus) {
		var arry = this._currentSelectedMsg.participants.getArray();
		for (var j = 0; j < arry.length; j++) {
			var email = arry[j].address;
			html[i++] = this._getNewContactOrLeadViewHtml(typeOrObj, j, email);
		}
	} else {
		html[i++] = this._getNewContactOrLeadViewHtml(typeOrObj, 0, "");
	}
	html[i++] = "</td></tr></table>";
	return html.join("");
};

Com_Zimbra_SForce.prototype._getNewContactOrLeadViewHtml =
function(typeOrObj, indx, email) {
	var html = new Array();
	var i = 0;
	var accName = typeOrObj.name ? typeOrObj.name : "";
	var refObjId = typeOrObj.id ? typeOrObj.id : "";
	this._quickCreateContactAccntRefIdsMap["sforce_contactOrLeadAcc" + indx] = refObjId;

	html[i++] = "<DIV class='SForce_lightyellow'>";
	html[i++] = "<table class='SForce_table' width=100% cellpadding=2><tr><td colspan=3><input type='checkbox' id='sforce_ignoreQuickCreateCheckbox" + indx + "' />Ignore creating this contact or lead.</td></tr>";

	html[i++] = "<tr><td>First Name:</td><td colspan=3><input type='text' id='sforce_contactOrleadFN" + indx + "'></input></td></tr>";
	html[i++] = "<tr><td>Last Name<span style='color:red;font-weight:bold;'>*</span>:</td><td colspan=3><input type='text' id='sforce_contactOrleadLN" + indx + "'></input></td></tr>";
	html[i++] = "<tr  id='sforce_contactOrLeadAccTR" + indx + "'><td>Account:</td><td><div id='sforce_contactOrLeadAcc" + indx + "'  refObjIdValue='" + refObjId + "'>" + accName + "</div></td>";
	html[i++] = "<td><div id='sforce_contactOrLeadAccLookupBtn" + indx + "'></div></td>";
	html[i++] = "<td><div id='sforce_contactOrLeadAccClearDiv" + indx + "' style='display:none;'><a href='javascript:void(0)' id='sforce_contactOrLeadAccClearLnk" + indx + "'>clear</a></div></td></tr>";
	html[i++] = "<tr id='sforce_contactOrLeadCompTR" + indx + "'><td>Company<span style='color:red;font-weight:bold;'>*</span>:</td>";
	html[i++] = "<td colspan=3><input type='text' id='sforce_contactOrleadComp" + indx + "'></input></td></tr>";
	html[i++] = "<tr><td>Phone:</td><td colspan=3><input type='text' id='sforce_contactOrleadPH" + indx + "'></input></td></tr>";
	html[i++] = "<tr><td>Email:</td><td colspan=3><input type='text' value='" + email + "' id='sforce_contactOrleadEm" + indx + "'></input></td></tr>";
	html[i++] = "</table>";
	html[i++] = "</DIV>";
	html[i++] = "<BR/>";

	var params = {
		sforce_contactOrleadFN:"sforce_contactOrleadFN" + indx, sforce_contactOrleadLN:"sforce_contactOrleadLN" + indx,
		sforce_contactOrLeadAccTR:"sforce_contactOrLeadAccTR" + indx,sforce_contactOrLeadAcc:"sforce_contactOrLeadAcc" + indx,
		sforce_contactOrLeadAccLookupBtn:"sforce_contactOrLeadAccLookupBtn" + indx,sforce_contactOrLeadAcc:"sforce_contactOrLeadAcc" + indx,
		sforce_contactOrLeadAccLookupBtn: "sforce_contactOrLeadAccLookupBtn" + indx,sforce_contactOrLeadAccClearDiv:"sforce_contactOrLeadAccClearDiv" + indx,
		sforce_contactOrLeadCompTR:"sforce_contactOrLeadCompTR" + indx,sforce_contactOrleadComp:"sforce_contactOrleadComp" + indx,
		sforce_contactOrleadPH:"sforce_contactOrleadPH" + indx, sforce_contactOrleadEm:"sforce_contactOrleadEm" + indx,
		sforce_contactOrLeadAccClearLnk:"sforce_contactOrLeadAccClearLnk" + indx, sforce_contactOrLead:"sforce_contactOrLead" + indx};

	this._quickCreateContactObjIds.push(params);
	return html.join("");
}

Com_Zimbra_SForce.prototype._createNewContactOrLeadOKBtnListner =
function() {
	var params = [];
	var isLead = document.getElementById("sforce_contactOrLeadL").checked == true;
	for (var i = 0; i < this._quickCreateContactObjIds.length; i++) {
		if (document.getElementById("sforce_ignoreQuickCreateCheckbox" + i).checked) {
			continue;
		}
		var ln = document.getElementById("sforce_contactOrleadLN" + i).value;
		if (ln == "") {
			appCtxt.setStatusMsg("'Last Name' cannot be empty", ZmStatusView.LEVEL_WARNING);
			return;
		}

		if (isLead) {
			var company = document.getElementById("sforce_contactOrleadComp" + i).value;
			if (company == "") {
				appCtxt.setStatusMsg("'Company' cannot be empty for a lead", ZmStatusView.LEVEL_WARNING);
				return;
			}
		} else {//contact..
			var accountId = document.getElementById("sforce_contactOrLeadAcc" + i).refObjIdValue;
			if(accountId == undefined) {//check if it was pre-populated
				accountId = this._quickCreateContactAccntRefIdsMap["sforce_contactOrLeadAcc" + i]; 
			}
		}

		var fn = document.getElementById("sforce_contactOrleadFN" + i).value;
		var ph = document.getElementById("sforce_contactOrleadPH" + i).value;
		var em = document.getElementById("sforce_contactOrleadEm" + i).value;

		var props = {};
		props["FirstName"] = fn;
		props["LastName"] = ln;
		if (isLead) {
			props["Company"] = company;
		} else {
			if(accountId != undefined && accountId != "") {
				props["AccountId"] = accountId;
			}
		}
		props["Phone"] = ph;
		props["Email"] = em;
		params.push(props);
	}
	if (params.length == 0) {
		appCtxt.getAppController().setStatusMsg("There was no Contact or Lead to create", ZmStatusView.LEVEL_WARNING);
		return;
	}
	var type = "Contact";
	if (isLead) {
		type = "Lead";
	}
	if (this._sforceCreateNewObjsDlg.setResultToAddNotesMenus) {
		var callback = AjxCallback.simpleClosure(this._updateSelectMenuInNotesDlg, this, type, "sforce_contactLead_selectionMenu", params);
	} else {
		var callback = AjxCallback.simpleClosure(this._handleCreateContactOrLeadCB, this, params);
	}

	this.createSFObject(params, type, callback, true);
	this._sforceCreateNewObjsDlg.popdown();//hide the dialog
};

Com_Zimbra_SForce.prototype._handleCreateContactOrLeadCB =
function(params, result) {
	if (params.length == 1) {
		if (result.success.toString() != "true") {
			appCtxt.getAppController().setStatusMsg("Could not create Contact or Lead", ZmStatusView.LEVEL_WARNING);
		} else {
			appCtxt.getAppController().setStatusMsg("Contact or Lead was created successfully", ZmStatusView.LEVEL_INFO);
		}
	} else {
		if (!result instanceof Array) {
			appCtxt.getAppController().setStatusMsg("Could not create 1 or more Contacts or Leads", ZmStatusView.LEVEL_WARNING);
			return;
		} else if (params.length != result.length) {
			appCtxt.getAppController().setStatusMsg("Could not create 1 or more Contacts or Leads", ZmStatusView.LEVEL_WARNING);
		} else {
			appCtxt.getAppController().setStatusMsg(params.length + " Contacts or Leads were created successfully", ZmStatusView.LEVEL_INFO);
		}
	}
};

Com_Zimbra_SForce.prototype._createNewContactOrLeadClearLinkHdlr =
function(i) {
	document.getElementById("sforce_contactOrLeadAcc" + i).innerHTML = "";
	document.getElementById("sforce_contactOrLeadAcc" + i).refObjIdValue = "";//set custom parameter
	document.getElementById("sforce_contactOrLeadAccClearDiv" + i).style.display = "none";
};

Com_Zimbra_SForce.prototype._showHideFields =
function(typeOrObj, indx) {
	var type = "Contact";
	if (typeOrObj.indexOf instanceof Object) {
		type = typeOrObj;
	}

	if (type == "Contact") {
		document.getElementById("sforce_contactOrLeadC").checked = true;
	} else {
		document.getElementById("sforce_contactOrLeadL").checked = true;
	}
	for (var i = 0; i < this._quickCreateContactObjIds.length; i++) {
		this._do_showHideFields(type, i);
	}
};

Com_Zimbra_SForce.prototype._do_showHideFields =
function(type, indx) {
	if (indx == undefined) {
		indx = 1;
	}
	if (type.indexOf("Contact") >= 0) {
		document.getElementById("sforce_contactOrLeadAccTR" + indx).style.display = "";
		document.getElementById("sforce_contactOrLeadCompTR" + indx).style.display = "none";
	} else {
		document.getElementById("sforce_contactOrLeadAccTR" + indx).style.display = "none";
		document.getElementById("sforce_contactOrLeadCompTR" + indx).style.display = "";
	}
};

Com_Zimbra_SForce.prototype._addCreateNewContactOrLeadHdlrs =
function() {
	var callback = AjxCallback.simpleClosure(this._showHideFields, this, "Contact", i);
	document.getElementById("sforce_contactOrLeadC").onclick = callback;

	var callback = AjxCallback.simpleClosure(this._showHideFields, this, "Lead", i);
	document.getElementById("sforce_contactOrLeadL").onclick = callback;
	for (var i = 0; i < this._quickCreateContactObjIds.length; i++) {
		var callback = AjxCallback.simpleClosure(this._createNewContactOrLeadClearLinkHdlr, this, i);
		document.getElementById("sforce_contactOrLeadAccClearLnk" + i).onclick = callback;
	}
};


Com_Zimbra_SForce.prototype._addAccountLookupBtn = function() {
	for (var i = 0; i < this._quickCreateContactObjIds.length; i++) {
		var btn = new DwtButton({parent:this._shell});
		btn.setText("Lookup");
		btn.setImage("Search");
		btn.addSelectionListener(new AjxListener(this, this._accountlookupBtnHdlr, i));
		document.getElementById("sforce_contactOrLeadAccLookupBtn" + i).appendChild(btn.getHtmlElement());
	}
};

Com_Zimbra_SForce.prototype._accountlookupBtnHdlr = function(i) {
	this.sForceSearchDlg.setProperties("Account", "sforce_contactOrLeadAcc" + i, null, "sforce_contactOrLeadAccClearDiv" + i);
	this.sForceSearchDlg.displaySearchDialog();
};


Com_Zimbra_SForce.prototype._updateSelectMenuInNotesDlg =
function(objName, selectMenuId, props, response) {
	var props = props[0];
	var name = "";
	if (props.FirstName) {
		name = props.FirstName;
	}
	if (props.LastName) {
		name = [name, " ", props.LastName].join("");
	}
	if (props.Email) {
		name = [name, "(", props.Email, ")"].join("");
	}
	var id = response.id.__msh_content;
	var elSel = document.getElementById(selectMenuId);
	var elOptNew = document.createElement('option');
	elOptNew.text = [objName, "-", name].join("");
	elOptNew.value = [objName, "_", id].join("");

	var elOptOld = elSel.options[0];
	if (AjxEnv.isIE) {
		elSel.add(elOptNew, 0);
	} else {
		elSel.add(elOptNew, elOptOld);
	}
	elOptNew.selected = true;
	elOptNew.style.color = "blue";
	this.showInfo(["New ", objName, " [",name,"] has been added to the menu"].join(""));
};


Com_Zimbra_SForce.prototype._sfItemSelectionHandler = function(selectId, objSelectId) {
	var tmp = document.getElementById(selectId).value;
	var arry = tmp.split("_");
	var objName = arry[0];
	this.sForceSearchDlg.setProperties(objName, null, objSelectId);
	this.sForceSearchDlg.displaySearchDialog();
};

Com_Zimbra_SForce.prototype._addLookupButtons = function() {
	this._shell = this._shell;
	this.lookupBtnIdandBtnObjMap = {};
	for (var lookupBtnDivId in this._lookupBtnDivIdAndObjsMap) {
		var obj = this._lookupBtnDivIdAndObjsMap[lookupBtnDivId];
		var btn = new DwtButton({parent:this._shell});
		btn.setText("Lookup");
		btn.setImage("Search");
		this.lookupBtnIdandBtnObjMap[lookupBtnDivId] = btn;
		btn.addSelectionListener(new AjxListener(this, this._lookupBtnHdlr, [obj, btn]));
		document.getElementById(lookupBtnDivId).appendChild(btn.getHtmlElement());
	}
};

Com_Zimbra_SForce.prototype._lookupBtnHdlr = function(obj, btn) {
	var selectId = obj.selectId;
	var objName = this._selectidAndObjNameMap[selectId];
	this.sForceSearchDlg.setProperties(objName, null, selectId);
	var callback = new AjxCallback(this, this._associationMenuChangedHdlr, [btn]);
	this.sForceSearchDlg.setAssociationMenuCallback(callback);
	this.sForceSearchDlg.displaySearchDialog();
};

Com_Zimbra_SForce.prototype._associationMenuChangedHdlr = function(btn) {
	btn.setEnabled(false);
};


Com_Zimbra_SForce.prototype._cleanMainAccountsInfoDiv = function() {
	document.getElementById("SForce_mainAccountsInfoDiv").innerHTML = "";
};

Com_Zimbra_SForce.prototype._showNotesDlg = function(note) {
	var subject = AjxStringUtil.htmlEncode(note.subject);
	var addrDate = this._getCurrentAddressAndDateStr();
	var body = AjxStringUtil.htmlEncode(this.getMailBodyAsText(note));
	body = [addrDate, body].join("");
	if (this._addNotesDialog) {//if dialog already exists..
		this._setNotesDlgSubjectAndBody(subject, body);
		this._setNotesDlgAccountsDivAsLoading();
		if (!this._searchAllContacts) {
			this._hideAlertMsgForNotesDlg();
		}
		this._addNotesDialog.popup();
		return;
	}
	var view = new DwtComposite(this._shell);
	var el = view.getHtmlElement();
	var h3 = document.createElement("h3");

	var div = document.createElement("div");
	div = document.createElement("div");
	div.id = "SForce_MessageInfoDiv";
	div.className = "SForce_infoMsg";
	div.height = "14px";
	div.style.display = "none";
	el.appendChild(div);


	div = document.createElement("div");
	div.id = "SForce_mainAccountsInfoDiv";

	div.style.height = "270px";
	div.style.overflow = "auto";
	div.style.background = "white";

	el.appendChild(div);

	h3 = document.createElement("h3");
	h3.className = "SForce-sec-label";
	h3.innerHTML = "Note details";
	el.appendChild(h3);

	var div = document.createElement("div");


	div.innerHTML =
	[ "<table><tbody>",
		"<tr>",
		"<td align='right'><label for='sforce_notes_subjectField'>Subject:</td>",
		"<td>",
		"<input style='width:35em' type='text' id='sforce_notes_subjectField' value='",
		subject, "' autocomplete='off' />",
		"</td>",
		"</tr>",
		"<td colspan='2'>",
		"<textarea style='width:50em;height:110px' id='sforce_notes_MessageField'>",
		body, "</textarea>",
		"</td>",
		"<tr>",
		"</tr></tbody></table>" ].join("");
	el.appendChild(div);

	var dialog_args = {
		view  : view,
		title : "Adding note(s) to Salesforce"
	};
	this._addNotesDialog = this._createDialog(dialog_args);
	this._hideAlertMsgForNotesDlg();
	this._addNotesDialog.popup();

	el = document.getElementById("sforce_notes_subjectField");
	el.select();
	el.focus();
	this._setNotesDlgAccountsDivAsLoading();
	this._addNotesDialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._addNotesOKButtonListener, this._addNotesDialog));
	this._addNotesDialog.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(this, this._addNotesCancelButtonListener, this._addNotesDialog));
};

Com_Zimbra_SForce.prototype._setNotesDlgSubjectAndBody = function(subject, body) {
	document.getElementById("sforce_notes_subjectField").value = AjxStringUtil.htmlDecode(subject);
	document.getElementById("sforce_notes_MessageField").value = AjxStringUtil.htmlDecode(body);
};

Com_Zimbra_SForce.prototype._setNotesDlgAccountsDivAsLoading = function() {
	document.getElementById("SForce_mainAccountsInfoDiv").innerHTML = this._loadingSalesForceHtml;
};

Com_Zimbra_SForce.prototype._setAlertMsgForNotesDlg = function(msg) {
	document.getElementById("SForce_MessageInfoDiv").innerHTML = ["<label style='font-weight:bold;font-size:12px;color:white;'>", msg, "</label>"].join("");
	document.getElementById("SForce_MessageInfoDiv").style.display = "block";
};

Com_Zimbra_SForce.prototype._hideAlertMsgForNotesDlg = function(msg) {
	document.getElementById("SForce_MessageInfoDiv").style.display = "none";
};

Com_Zimbra_SForce.prototype._addNotesOKButtonListener = function(dlg) {
	var ids = [];
	var indx = 0;
	var hasAtleastOneItem = false;
	var clMenuOptions = document.getElementById("sforce_contactLead_selectionMenu").options;
	var rtMenuOptions = document.getElementById("sforce_relatedTo_selectionMenu").options;


	for (var j = 0; j < clMenuOptions.length; j++) {
		var clOption = clMenuOptions[j];
		var hasRelatedToItemForThisContact = false;
		if (clOption.selected) {
			var tmpArry = clOption.value.split("_");
			var whoId = tmpArry[1];

			//if its a lead, ignore relatedTo selection
			if (tmpArry[0] == "Lead") {
				if (!ids[indx]) {
					ids[indx] = {};
				}
				ids[indx].WhoId = whoId;
				hasAtleastOneItem = true;
				indx++;
				continue;
			}

			//check if relatedTo is associated.. if so, add all of them one-by-one
			for (var k = 0; k < rtMenuOptions.length; k++) {
				var rtOption = rtMenuOptions[k];
				if (rtOption.selected) {
					if (!ids[indx]) {
						ids[indx] = {};
					}
					var tmpArry = rtOption.value.split("_");
					var whatId = tmpArry[1];
					ids[indx].WhoId = whoId;
					ids[indx].WhatId = whatId;
					indx++;
					hasAtleastOneItem = true;
					hasRelatedToItemForThisContact = true;
				}
			}
			//if there is no relatedTo items, just add contacts
			if (!hasRelatedToItemForThisContact) {
				if (!ids[indx]) {
					ids[indx] = {};
				}
				ids[indx].WhoId = whoId;
				hasAtleastOneItem = true;
				indx++;
			}
		}

	}
	//allow just selecting relatedTo(without contacts)
	if (!hasAtleastOneItem) {
		for (var k = 0; k < rtMenuOptions.length; k++) {
			var rtOption = rtMenuOptions[k];
			if (clOption.selected) {
				if (!ids[indx]) {
					ids[indx] = {};
					indx++;
				}
				var tmpArry = rtOption.value.split("_");
				var whatId = tmpArry[1];
				ids[indx].WhatId = whatId;
				hasAtleastOneItem = true;
			}
		}
	}

	if (!hasAtleastOneItem) {
		this.displayErrorMessage("You must select at least one Item!");
	} else {
		var props = {
			Title : document.getElementById("sforce_notes_subjectField").value,
			Body  : document.getElementById("sforce_notes_MessageField").value
		};
		for (i = 0; i < ids.length; ++i) {
			ids[i].Subject = props.Title;
			ids[i].Description = props.Body;
			ids[i].Status = 'Completed';
			ids[i].ActivityDate = Com_Zimbra_SForce.toIsoDateTime(new Date());

			// bug 74118, force to set a type of Task
			if (this.sforce_taskType) {
				ids[i].Type = this.sforce_taskType;
			}
		}

		this.createSFObject(ids, "Task", function() {
			this.displayStatusMessage("Saved " + ids.length + " notes.");
		});
		dlg.popdown();
	}
};

Com_Zimbra_SForce.prototype._addNotesCancelButtonListener = function(dlg) {
	dlg.popdown();
};

Com_Zimbra_SForce.prototype._setRecordsToNotesDlg = function() {
	var html = [];
	var i = 0;
	var contactsSelectId = Dwt.getNextId();
	var relatedToSelectId = Dwt.getNextId();
	html[i++] = "<table class='SForce_table' width=100%>";
	html[i++] = "<tr><td><strong>Contact/Lead Name:</strong></td><td><strong>Related to:</strong></TD></TR>";

	html[i++] = "<tr>";
	html[i++] = "<td><select id='sforce_contactLead_selectionMenu' multiple size='10'>";
	var records = this.cRecords;
	for (var m = 0; m < this.cRecords.length; m++) {
		var contact = this.cRecords[m];
		var name = "";
		if (contact.Name) {
			name = contact.Name.toString();
		}
		var email = "";
		if (contact.Email) {
			email = contact.Email.toString();
		}
		var id = contact.Id.toString();
		var val = [name," ", email].join("");
		html[i++] = ["<option title='",val,"' value='Contact_", id, "' selected>Contact: ",val, "</option>"].join("");
	}
	for (var m = 0; m < this.lRecords.length; m++) {
		var lead = this.lRecords[m];
		var name = "";
		if (lead.Name) {
			name = lead.Name.toString();
		}
		var email = "";
		if (lead.Email) {
			email = lead.Email.toString();
		}
		var id = lead.Id.toString();
		var val = [name," ", email].join("");
		html[i++] = ["<option title='",val,"' value='Lead_", id, "' selected>Lead: ",val, "</option>"].join("");
	}

	html[i++] = "</select></td>";
	html[i++] = ["<td><select id='sforce_relatedTo_selectionMenu' multiple size='10'>"].join("");
	for (var m = 0; m < this.cRecords.length; m++) {
		var contact = this.cRecords[m];
		//add Account
		var account = contact.Account;
		if (account) {
			var id = account.Id.toString();
			var name = account.Name.toString();

			html[i++] = ["<option title='",name,"' value='Account_", id, "'>Account: ", name, "</option>"].join("");
		}
		//add opportunities
		var ocRoles = contact.OpportunityContactRoles;
		if (ocRoles) {
			var list = ocRoles.records;
			if (list && !(list instanceof Array)) {
				list = [list];
			}
			for (var n = 0; n < list.length; n++) {
				var item = list[n];
				var id = item.Opportunity.Id.toString();
				var name = item.Opportunity.Name.toString();
				var role = "";
				if (item.Role) {
					role = item.Role.toString();
				}
				var val = [name," ", role].join("");
				html[i++] = ["<option title='",val,"' value='Opportunity_", id, "' selected>Opportunity: ", val, "</option>"].join("");
			}
		}
		//add cases
		var cases = contact.Cases;
		if (cases) {
			var list = cases.records;
			if (list && !(list instanceof Array)) {
				list = [list];
			}
			for (var n = 0; n < list.length; n++) {
				var item = list[n];
				var id = item.Id.toString();
				var subject = item.Subject.toString();
				var caseNumber = item.CaseNumber.toString();
				var val = [caseNumber," ", subject].join("");
				html[i++] = ["<option title='",val,"' value='Cases_", id, "'>Case: ",val, "</option>"].join("");
			}
		}

	}
	html[i++] = "</select></td>";
	html[i++] = "</tr>";
	html[i++] = "<tr><td><strong>Lookup Contacts or Leads:</strong></td><td><strong>Lookup Related to Items:</strong></TD></TR>";

	html[i++] = "<tr><td><select id='sforce_contactLead_lookupMenu'>";
	html[i++] = "<option value='item_lookUp'>------------------------- Lookup -------------------------</option>";
	html[i++] = "<option value='Contact_lookUp'>Contact [lookup]</option>";
	html[i++] = "<option value='Lead_lookUp'>Lead [lookup]</option>";
	html[i++] = "</select></td>";

	html[i++] = "<td><select  id='sforce_relatedTo_lookupMenu'>";
	html[i++] = "<option value='item_lookUp'>------------------------- Lookup -------------------------</option>";
	html[i++] = "<option value='Account_lookUp'>Account [lookup]</option>";
	html[i++] = "<option value='Asset_lookUp'>Asset [lookup] </option>";
	html[i++] = "<option value='Campaign_lookUp'>Campaign [lookup] </option>";
	html[i++] = "<option value='Case_lookUp'>Case [lookup] </option>";
	html[i++] = "<option value='Contract_lookUp'>Contract [lookup] </option>";
	html[i++] = "<option value='Opportunity_lookUp'>Opportunity [lookup] </option>";
	html[i++] = "<option value='Product_lookUp'>Product [lookup] </option>";
	html[i++] = "<option value='Solution_lookUp'>Solution [lookup] </option>";
	html[i++] = "</select></td>";
	html[i++] = "</tr>";
	html[i++] = "<tr><td>Quick create: <a href='javascript:void(0)' id='sforce_quickCreateContactLnk'>Contact</a> or <a href='javascript:void(0)' id='sforce_quickCreateLeadLnk'>Lead</a></td></tr>";
	html[i++] = "</table>";
	document.getElementById("SForce_mainAccountsInfoDiv").innerHTML = html.join("");
};
//--------------------------------------------------------------------------------------------------------
//Notes dropped (end)
//--------------------------------------------------------------------------------------------------------



//--------------------------------------------------------------------------------------------------------
// Toolbar related..(START)
//--------------------------------------------------------------------------------------------------------
Com_Zimbra_SForce.prototype.initializeToolbar = function(app, toolbar, controller, viewId) {
	if (this.sforce_logindlg_showSendAndAddBtn == undefined) {
		this.sforce_logindlg_showSendAndAddBtn = this.getUserProperty("sforce_logindlg_showSendAndAddBtn") == "true";
	}

	var viewType = appCtxt.getViewTypeFromId(viewId);
	if (viewType == ZmId.VIEW_COMPOSE && this.sforce_logindlg_showSendAndAddBtn) {
		this._initComposeSFToolbar(toolbar, controller);
	}
};

Com_Zimbra_SForce.prototype._initContactSFToolbar = function(toolbar, controller) {
	if (!toolbar.getButton(Com_Zimbra_SForce.SFORCE_CONTACT_TB_BTN)) {
		//get the index of View menu so we can display it after that.
		var buttonIndex = -1;
		for (var i = 0, count = toolbar.opList.length; i < count; i++) {
			if (toolbar.opList[i] == ZmOperation.VIEW_MENU) {
				buttonIndex = i + 1;
				break;
			}
		}
		if (buttonIndex == -1) {
			buttonIndex = i + 1;
		}
		ZmMsg.salesforce = "Sync with Salesforce";
		ZmMsg.sforceMailTooltip = "Syncs a contact with salesforce";
		var btn = toolbar.createOp(Com_Zimbra_SForce.SFORCE, {text:ZmMsg.salesforce, tooltip:ZmMsg.sforceMailTooltip, index:buttonIndex, image:"SFORCE-panelIcon"});
		toolbar.addOp(Com_Zimbra_SForce.SFORCE_CONTACT_TB_BTN, buttonIndex);
		btn.addSelectionListener(new AjxListener(this, this._sfContactTbButtonHdlr, controller));
	}
};

Com_Zimbra_SForce.prototype._sfContactTbButtonHdlr = function(controller) {
	var contact = controller.getListView().getSelection()[0];
	this.contactDropped(contact);//should really show a dialog with two sections to sync

};

Com_Zimbra_SForce.prototype._initComposeSFToolbar = function(toolbar, controller) {
	if (!toolbar.getButton(Com_Zimbra_SForce.SFORCE)) {
		ZmMsg.sforceAdd = "Send & Add";
		ZmMsg.sforceTooltip = "Send and add to Salesforce.";
		var btn = toolbar.createOp(Com_Zimbra_SForce.SFORCE, {text:ZmMsg.sforceAdd, tooltip:ZmMsg.sforceTooltip, index:1, image:"SFORCE-panelIcon"});
		toolbar.addOp(Com_Zimbra_SForce.SFORCE, 2);
		this._composerCtrl = controller;
		this._composerCtrl._sforce = this;
		btn.addSelectionListener(new AjxListener(this._composerCtrl, this._sendAddSForce));
	}
};

Com_Zimbra_SForce.prototype._sendAddSForce = function(ev) {
	this._send();
};

Com_Zimbra_SForce.prototype.onSendMsgSuccess = function(controller, msg) {
	if (msg == undefined) {
		appCtxt.getAppController().setStatusMsg("Sorry, could not grab email", ZmStatusView.LEVEL_WARNING);
		return;
	}
	this._initializeSalesForceForThisMsg(msg);
	if (this.user && this.user != "" && this.passwd && this.passwd != "") {
		this.noteDropped(msg);
	}
	//this._sforce.noteDropped(msg);
};

//--------------------------------------------------------------------------------------------------------
// Toolbar related..(END)
//--------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------
// Salesforce AJAX functionalities..(START)
//--------------------------------------------------------------------------------------------------------
/// Store the default SOAP server.  Note that after a successful login, the URL
/// may change--which is why we store it in an object instance too (this.SERVER)
//Com_Zimbra_SForce.LOGIN_SERVER = "https://www.salesforce.com/services/Soap/c/17.0";

Com_Zimbra_SForce._RECENT = {};

// SOAP utils

/// Utility function that creates a SOAP envelope.  This will also insert the
/// session header if we already have a session.
Com_Zimbra_SForce.prototype._makeEnvelope = function(method, limit, dontUseSessionId) {
	var soap = AjxSoapDoc.create(
			method, this.XMLNS, null,
			"http://schemas.xmlsoap.org/soap/envelope/");
	var envEl = soap.getDoc().firstChild;
	// Seems we need to set these or otherwise will get a "VersionMismatch"
	// message from SForce
	envEl.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
	envEl.setAttribute("xmlns:xsd", "http://www.w3.org/2001/XMLSchema");

	if (this.sessionId && !dontUseSessionId) {
		var header = soap.ensureHeader();
		if (limit) {
			var qo = soap.getDoc().createElement("sh:QueryOptions");
			qo.setAttribute("xmlns:sh", "SoapService");
			qo.setAttribute("soap:mustUnderstand", "0");
			header.appendChild(qo);

			var el = soap.getDoc().createElement("sh:batchSize");
			el.setAttribute("xmlns:sh", this.XMLNS);
			el.appendChild(soap.getDoc().createTextNode(200));//always use 200
			qo.appendChild(el);
		}
		var shEl = soap.getDoc().createElement("sh:SessionHeader");
		shEl.setAttribute("xmlns:sh", this.XMLNS);
		header.appendChild(shEl);

		var sessionEl = soap.getDoc().createElement("sh:sessionId");
		sessionEl.setAttribute("xsi:type", "xsd:string");
		shEl.appendChild(sessionEl);

		var txtEl = soap.getDoc().createTextNode(this.sessionId);
		sessionEl.appendChild(txtEl);

	}
	return soap;
};

Com_Zimbra_SForce.prototype.xmlToObject = function(result, dontConvertToJSObj) {
	try {
		if (dontConvertToJSObj) {
			var xd = new AjxXmlDoc.createFromDom(result.xml);
		} else {
			var xd = new AjxXmlDoc.createFromDom(result.xml).toJSObject(true, false);
		}
		this.__retriedLoginAtLeastOnce = false;
		return xd;
	} catch(ex) {
		appCtxt.getAppController().setStatusMsg("Problem contacting Salesforce. Please try again", ZmStatusView.LEVEL_WARNING);
		if(!this.__retriedLoginAtLeastOnce) {
			this.__retriedLoginAtLeastOnce = true;
			this.login(function() {}, null, null, true);
		}
	}
	return xd;
};

/// Utility function that calls the SForce server with the given SOAP data
Com_Zimbra_SForce.prototype.rpc = function(soap, callback, passErrors) {
	this.sendRequest(soap, this.SERVER, {SOAPAction: "m", "Content-Type": "text/xml"}, callback, false, passErrors);
};

Com_Zimbra_SForce.prototype.logout =
function() {
	var soap = this._makeEnvelope("logout");

	this.rpc(soap, new AjxCallback(this, this.done_logout), true);
};

Com_Zimbra_SForce.prototype.done_logout =
function(response) {
	appCtxt.setStatusMsg("Logged out of Salesforce", ZmStatusView.LEVEL_INFO);
};
// SOAP METHOD: login

/// Login to SForce.  The given callback will be called in the case of a
/// successful login.  Note that callback is a plain function (not AjxCallback)
Com_Zimbra_SForce.prototype.login = function(callback, user, passwd, dontUseSessionId) {
	if (!callback) {
		callback = false;
	}
	if (!user || !passwd) {
		user = this.getUserProperty("user");
		passwd = this.getUserProperty("passwd");
		this.sforce_ignoreDomainsList = this.getUserProperty("sforce_ignoreDomainsList");
		this.sforce_logindlg_sbarShowOnlyOnResult = this.getUserProperty("sforce_logindlg_sbarShowOnlyOnResult") == "true";
		this.sforce_logindlg_showSendAndAddBtn = this.getUserProperty("sforce_logindlg_showSendAndAddBtn") == "true";
	}
	if (!user || !passwd || user == "" || passwd == "") {
		var errMsg = "Please fill your Salesforce credentials";
		this._displayLoginDialog(callback, errMsg);
	} else {
		this._do_login(callback, user, passwd, dontUseSessionId);
	}
};

Com_Zimbra_SForce.prototype._do_login = function(callback, user, passwd, dontUseSessionId) {
	this.SFuserName = user;//store username

	var soap = this._makeEnvelope("login", null, dontUseSessionId);
	soap.set("username", user);
	soap.set("password", passwd);
	if (callback == null) {
		callback = false;
	}
	this.rpc(soap, new AjxCallback(this, this.done_login, [ callback ]), true);
};

Com_Zimbra_SForce.prototype.done_login = function(callback, result) {
	var ans = this.xmlToObject(result);
	if (ans && ans.Body && ans.Body.loginResponse) {
		ans = ans.Body.loginResponse.result;
		this.SERVER = String(ans.serverUrl);
		this.sessionId = String(ans.sessionId);
		this.userId = String(ans.userId);
		this.userInfo = ans.userInfo;
		if (this.loginDlg) {//popdown login dialog on successful login
			this.loginDlg.popdown();
		}
		if (!this._caseObjectLoaded) {
			this.__dynamicMenuItems = [];
			this.__dynamicMenuItems_links = [];
			this._loadCaseDescriptionObject();
			for (var itemName in this._sforceCaseObject) {
				var obj = this._sforceCaseObject[itemName];
				if (itemName.indexOf(this.sforce_linkNamesInSalesForceStartsWith) == 0) {
					this.__dynamicMenuItems_links.push({id:Dwt.getNextId(),icon:"SFORCE-panelIcon", label:obj.label, itemName:itemName});
					continue;
				}
				if (!obj.picklistValues) {
					continue;
				}
				var subMenuItems = obj.picklistValues.split("=::=");
				this.__dynamicMenuItems.push({id:Dwt.getNextId(),icon:"SFORCE-panelIcon", label:obj.label,
					style:DwtMenuItem.CASCADE_STYLE, subMenuItems:subMenuItems, itemName:itemName});
			}
		}
		if (!this._loginTimerStarted) {
			appCtxt.setStatusMsg("Logged on to salesforce as " + this.userInfo.userFullName.toString(), ZmStatusView.LEVEL_INFO);
			//login every 10 minutes to keep the session alive
			setInterval(AjxCallback.simpleClosure(this.login, this, (function() {
			}), null, null, true), 60 * 1000 * 10);
			this._loginTimerStarted = true;
		}

		if (callback instanceof AjxCallback) {
			callback.run(this);
		} else if (callback) {
			callback.call(this);
		}
	} else {
		var fault = "";
		if (ans && ans.Body && ans.Body.Fault && ans.Body.Fault.faultstring) {
			fault = ans.Body.Fault.faultstring + "<br />";
		}
		var errorMsg = ["<b>Login to Salesforce failed</b><br />&nbsp;&nbsp;", fault].join("");
		if (this.loginDlg && this.loginDlg.isPoppedUp()) {
			this._displayLoginDialog(callback, errorMsg);
		} else {
			appCtxt.getAppController().setStatusMsg(errorMsg, ZmStatusView.LEVEL_WARNING);
		}
	}
};


Com_Zimbra_SForce.prototype.queryMore = function(queryLocator, limit, callback, returnEntireResponse) {
	if (!this.sessionId) {
		this.login(function() {
			this._do_queryMore(queryLocator, limit, callback, returnEntireResponse);
		});
	} else {
		this._do_queryMore(queryLocator, limit, callback, returnEntireResponse);
	}
};

Com_Zimbra_SForce.prototype._do_queryMore = function(queryLocator, limit, callback, returnEntireResponse) {
	if (!limit || limit < 1) {
		limit = 1;
	}
	var soap = this._makeEnvelope("queryMore", limit);
	var doc = soap.getDoc();
	var query = soap.set("queryLocator", queryLocator);
	query.setAttribute("xmlns", this.XMLNS);
	// we sure have a lot of indirection going on..
	this.rpc(soap, new AjxCallback(this, this.done_queryMore, [ callback, returnEntireResponse ]));
};

Com_Zimbra_SForce.prototype.done_queryMore = function(callback, returnEntireResponse, result) {
	var xd = this.xmlToObject(result);
	var resultObj = xd.Body.queryMoreResponse.result;
	this._parseResultObjAndCallback(resultObj, callback, returnEntireResponse);
};


Com_Zimbra_SForce.prototype.search = function(query, limit, callback, returnEntireResponse, returnResultAsXML) {
	if (!this.sessionId) {
		this.login(function() {
			this._do_search(query, limit, callback, returnEntireResponse, returnResultAsXML);
		});
	} else {
		this._do_search(query, limit, callback, returnEntireResponse, returnResultAsXML);
	}
};

Com_Zimbra_SForce.prototype._do_search = function(query, limit, callback, returnEntireResponse, returnResultAsXML) {
	if (!limit || limit < 1) {
		limit = 1;
	}
	var soap = this._makeEnvelope("search", limit);
	var doc = soap.getDoc();
	var query = soap.set("queryString", query);
	query.setAttribute("xmlns:sh", this.XMLNS);
	// we sure have a lot of indirection going on..
	this.rpc(soap, new AjxCallback(this, this.done_search, [ callback, returnEntireResponse, returnResultAsXML ]));
};

Com_Zimbra_SForce.prototype.done_search = function(callback, returnEntireResponse, returnResultAsXML, result) {
	if (returnResultAsXML) {
		var xd = this.xmlToObject(result, true);
		var resultObj = xd;
	} else {
		var xd = this.xmlToObject(result);
		var resultObj = xd.Body.searchResponse.result;
	}
	this._parseResultObjAndCallback(resultObj, callback, returnEntireResponse);
};


// SOAP METHOD: query

/// Executes a SOQL (SalesForce Object Query Language) and calls the given
/// callback upon successful execution.
Com_Zimbra_SForce.prototype.query = function(query, limit, callback, returnEntireResponse, errorCallback) {
	if (!errorCallback) {
		var errorCallback = new AjxCallback(this, this._generalQueryErrorHdlr);
	}
	if (!this.sessionId) {
		this.login(function() {
			this._do_query(query, limit, callback, returnEntireResponse, errorCallback);
		});
	} else {
		this._do_query(query, limit, callback, returnEntireResponse, errorCallback);
	}
};

Com_Zimbra_SForce.prototype._generalQueryErrorHdlr = function() {
	var response = arguments[1];
	if (response) {
		if (response.text.indexOf("INVALID_SESSION_ID") >= 0 || response.text.indexOf("HTTP header missing") >= 0) {
			appCtxt.getAppController().setStatusMsg("Salesforce session had expired. Please try again", ZmStatusView.LEVEL_WARNING);
			this.login(function() {
			}, null, null, true);
		} else {
			this.displayErrorMessage("Error querying Salesforce<br/>Error code: " + response.status, response.text);
		}
	}
};


Com_Zimbra_SForce.prototype._do_query = function(query, limit, callback, returnEntireResponse, errorCallback) {
	if (!limit || limit < 1) {
		limit = 1;
	}
	var soap = this._makeEnvelope("query", limit);
	var doc = soap.getDoc();
	var query = soap.set("queryString", query);
	query.setAttribute("xmlns:sh", this.XMLNS);
	// we sure have a lot of indirection going on..
	this.rpc(soap, new AjxCallback(this, this.done_query, [ callback, returnEntireResponse, errorCallback ]), true);
};


Com_Zimbra_SForce.__query_result_get = function() {
	for (var i = 0; i < arguments.length; ++i) {
		var attr = arguments[i];
		if (this[attr] != null) {
			return this[attr].toString();
		}
	}
	return "";
};

Com_Zimbra_SForce.prototype.done_objQuery = function(callback, result) {
	var xd = this.xmlToObject(result);
	callback.call(this, xd.Body.describeSObjectResponse.result);
};

Com_Zimbra_SForce.prototype.done_query = function(callback, returnEntireResponse, errorCallback, result) {
	if (!result.success) {
		if (errorCallback) {
			if (errorCallback instanceof AjxCallback) {
				errorCallback.run(this, result);
			} else {
				errorCallback.call(this, result);
			}
		} else {
			this.displayErrorMessage("An error was returned.<br />Error code: " + result.status, result.text);
		}
		return;
	}
	var xd = this.xmlToObject(result);
	var resultObj = xd.Body.queryResponse.result;
	this._parseResultObjAndCallback(resultObj, callback, returnEntireResponse);
};

Com_Zimbra_SForce.prototype._parseResultObjAndCallback = function(resultObj, callback, returnEntireResponse) {
	//if returnEntireResponse Object is true..
	if (returnEntireResponse) {
		if (callback instanceof AjxCallback) {
			callback.run(this, resultObj);
		} else {
			callback.call(this, resultObj);
		}
		return;
	}


	var qr = resultObj.records;
	if (qr != null) {
		if (!(qr instanceof Array))
			qr = [ qr ];
		// sometimes SForce returns a duplicate <Id> tag
		for (var i = qr.length; --i >= 0;) {
			if (qr[i].Id && (qr[i].Id instanceof Array))
				qr[i].Id = qr[i].Id[0];
			qr[i].get = Com_Zimbra_SForce.__query_result_get;
		}
	} else {
		qr = [];
	}
	if (callback instanceof AjxCallback) {
		callback.run(this, qr);
	} else {
		callback.call(this, qr);
	}
};


// SOAP METHOD: create

Com_Zimbra_SForce.prototype.createSFObject = function(props, type, callback, returnEntireResponse) {
	if (!callback) {
		callback = false;
	}
	// make sure we are logged in first
	if (!this.sessionId)
		this.login(function() {
			this._actOnSFObject("create", props, type, callback, returnEntireResponse);
		});
	else
		this._actOnSFObject("create", props, type, callback, returnEntireResponse);
};

Com_Zimbra_SForce.prototype.updateSFObject = function(props, type, callback, returnEntireResponse) {
	if (!callback) {
		callback = false;
	}
	// make sure we are logged in first
	if (!this.sessionId)
		this.login(function() {
			this._actOnSFObject("update", props, type, callback, returnEntireResponse);
		});
	else
		this._actOnSFObject("update", props, type, callback, returnEntireResponse);
};

Com_Zimbra_SForce.prototype.deleteSFObject = function(props, type, callback, returnEntireResponse) {
	if (!callback) {
		callback = false;
	}
	// make sure we are logged in first
	if (!this.sessionId)
		this.login(function() {
			this._actOnSFObject("delete", props, type, callback, returnEntireResponse);
		});
	else
		this._actOnSFObject("delete", props, type, callback, returnEntireResponse);
};


Com_Zimbra_SForce.prototype._actOnSFObject = function(action, props, type, callback, returnEntireResponse) {
	if (!callback) {
		callback = false;
	}
	var soap = this._makeEnvelope(action);
	var a = props;
	if (!(a instanceof Array)) {
		a = [ a ];
	}
	if (action == "delete") {
		for (var j = 0; j < a.length; ++j) {
			props = a[j];
			for (var i in props) {
				soap.set("Ids", props[i]);
			}
		}
	} else {
		for (var j = 0; j < a.length; ++j) {
			var createData = {};
			props = a[j];
			for (var i in props) {
				if (props[i] != null && props[i] != "undefined" && i != "undefined") {
					if (i.indexOf(":") == -1)
						createData["ns3:" + i] = props[i];
					else
						createData[i] = props[i];
				}
			}
			var el = soap.set("sObjects", createData);

			el.setAttribute("xsi:type", "ns3:" + type);
			el.setAttribute("xmlns:ns3", this.XMLNS);
		}
	}
	if (action == "create") {
		var respCallback = new AjxCallback(this, this.done_createSFObject, [ callback, returnEntireResponse ]);
	} else if (action == "update") {
		var respCallback = new AjxCallback(this, this.done_updateSFObject, [ callback,returnEntireResponse ]);
	} else if (action == "delete") {
		var respCallback = new AjxCallback(this, this.done_deleteSFObject, [ callback,returnEntireResponse ]);
	}

	this.rpc(soap, respCallback);
};

Com_Zimbra_SForce.prototype.done_createSFObject = function(callback, returnEntireResponse, result) {
	var xd = this.xmlToObject(result);
	if (xd && callback) {
		result = xd.Body.createResponse.result;
		if (returnEntireResponse) {//returnEnhtireResult Object
			callback.call(this, result);
			return;
		}
		var id;
		if (result instanceof Array) {
			id = [];
			for (var i = 0; i < result.length; ++i)
				id.push(result[i].id.toString());
		} else {
			id = result.id.toString();
		}
		callback.call(this, id);
	}
};


Com_Zimbra_SForce.prototype.done_updateSFObject = function(callback, returnEntireResponse, result) {
	var xd = this.xmlToObject(result);
	if (xd && callback) {
		result = xd.Body.updateResponse.result;
		if (returnEntireResponse) {//returnEnhtireResult Object
			callback.call(this, result);
			return;
		}
		if (result.success) {
			callback.call(this, result.success.toString());
		} else {
			callback.call(this, "false");
		}

	}
};
Com_Zimbra_SForce.prototype.done_deleteSFObject = function(callback, returnEntireResponse, result) {
	var xd = this.xmlToObject(result);
	if (xd && callback) {
		result = xd.Body.deleteResponse.result;
		if (returnEntireResponse) {//returnEnhtireResult Object
			callback.call(this, result);
			return;
		}
		if (result.success) {
			callback.call(this, result.success.toString());
		} else {
			callback.call(this, "false");
		}

	}
};
//--------------------------------------------------------------------------------------------------------
// Salesforce AJAX functionalities..(END)
//--------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------
//Misc/Supporting functions (START)
//--------------------------------------------------------------------------------------------------------
Com_Zimbra_SForce.prototype.showWarningDlg =
function(msg) {
	var dlg = appCtxt.getMsgDialog();
	dlg.reset();//reset dialog since we could be using it
	dlg.setMessage(msg, DwtMessageDialog.WARNING_STYLE);
	dlg.popup();
};

Com_Zimbra_SForce.arrayContainsElement =
function(array, val) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] == val) {
			return true;
		}
	}
	return false;
}

function sforce_unique(b) {
	var a = [], i, l = b.length;
	for (i = 0; i < l; i++) {
		if (!Com_Zimbra_SForce.arrayContainsElement(a, b[i])) {
			a.push(b[i]);
		}
	}
	return a;
}


Com_Zimbra_SForce.prototype.getMailBodyAsText = function(note) {
	var body = "";
	if (note.body) {
		body = AjxStringUtil.htmlEncode(note.body);
	} else if (note._topPart && note._topPart.getContentForType) {
		body = AjxStringUtil.htmlEncode(note._topPart.getContentForType(ZmMimeTable.TEXT_PLAIN));
	} else {
		body = "";
	}

	if (!body || body == "") {//If we dont have body, try using getBodyContent api
		if (!note.isHtmlMail()) {
			return note.getBodyContent();
		}
		var div = document.createElement("div");
		div.innerHTML = note.getBodyContent();
		return AjxStringUtil.convertHtml2Text(div);
	} else {
		return body;
	}
};

Com_Zimbra_SForce.prototype.showInfo =
function(msg) {
	var transitions = [ ZmToast.FADE_IN, ZmToast.PAUSE, ZmToast.PAUSE, ZmToast.FADE_OUT ];
	appCtxt.getAppController().setStatusMsg(msg, ZmStatusView.LEVEL_INFO, null, transitions);
};

Com_Zimbra_SForce.toIsoDate = function(theDate) {
	return AjxDateFormat.format("yyyy-MM-dd", theDate);
};

Com_Zimbra_SForce.toIsoDateTime = function(theDate) {
	var zDate = new Date(theDate.getTime());
	zDate.setMinutes(zDate.getMinutes() + zDate.getTimezoneOffset());
	var ret = AjxDateFormat.format("yyyy-MM-ddTHH:mm:ss'Z'", zDate);
	DBG.println(AjxDebug.DBG3, "ret: " + ret);
	return ret;
};

//--------------------------------------------------------------------------------------------------------
//Misc/Supporting functions (END)
//--------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------
//MailboxMetadata API
//--------------------------------------------------------------------------------------------------------
//"zwc:com_zimbra_sforce"
//Usage: Pass the sectionName, eg. getMailboxMetaData("zwc:<sectioname>", callback);
Com_Zimbra_SForce.prototype.getMailboxMetaData =
function(sectionName, callback) {
	var soapDoc = AjxSoapDoc.create("GetMailboxMetadataRequest", "urn:zimbraMail");//request name and urn(always zimbraMail)
	var secNode = soapDoc.set("meta");
	secNode.setAttribute("section", sectionName);
	var asyncMode = true;
	if (!callback) {
		asyncMode = false;
	}
	return appCtxt.getAppController().sendRequest({soapDoc:soapDoc, asyncMode:asyncMode, callback:callback});
};

Com_Zimbra_SForce.prototype.deleteMailboxMetaData =
function(sectionName, keyName, callback) {
	var _attrs = null;
	var keyValArray = [];
	if (keyName) {
		try {
			var matchFound = false;
			var response = this.getToMailboxMetaData(sectionName).GetMailboxMetadataResponse.meta[0];
			if (response._attrs) {
				_attrs = response._attrs;
				for (var oKey in _attrs) {
					if (keyName != oKey) {
						keyValArray.push({key:oKey, val:_attrs[oKey]});
					}
				}
			}
			if (!matchFound) {
				return "Key(" + keyName + ") not found in section(" + sectionName + ")";
			}
		} catch(e) {
			//consume
		}
	}
	return this._doSetMailboxMetaData(sectionName, keyValArray, callback);
};

//Allows us to save random data in DB (upto 10kb per section)
//Automatically keeps old data and merges old data w/in a section with new one if 'override' isn't true
//@sectionName Name of the section; must start with zwc: ex: zwc:com_zimbra_sforce_AccListViews
//@keyValArray An array of key-val objects: ex: [{key:key1, val:val1}, {key:key2:val:val2}]
//@callback AjxCallback[optional] - if null,JS will wait for this operation to complete 
//@override - Boolean; If true, *entire section* will be overwritten with new set of key-val pairs
Com_Zimbra_SForce.prototype.setMailboxMetaData =
function(sectionName, keyValArray, callback, override) {
	if (!keyValArray) {//dont allow deleting section using this function
		return "No key=value pair sent. To delete section, use 'deleteMailboxMetaData' API";
	}
	var _attrs = null;
	if (!override) {
		try {
			var response = this.getMailboxMetaData(sectionName).GetMailboxMetadataResponse.meta[0];
			if (response._attrs) {
				_attrs = response._attrs;
				var oldKeyValArray = [];
				for (var oKey in _attrs) {
					var ignore = false;
					for (var i = 0; i < keyValArray.length; i++) {
						var keyVal = keyValArray[i];
						if (keyVal.key == oKey) {
							ignore = true;
						}
					}
					if (!ignore) {
						oldKeyValArray.push({key:oKey, val:_attrs[oKey]});
					}
				}
				keyValArray = keyValArray.concat(oldKeyValArray);
			}
		} catch(e) {
			appCtxt.setStatusMsg("There was an exception saving data: " + e, ZmStatusView.LEVEL_WARNING);

		}
	}
	return this._doSetMailboxMetaData(sectionName, keyValArray, callback);
};

//internal - dont call directly
Com_Zimbra_SForce.prototype._doSetMailboxMetaData =
function(sectionName, keyValArray, callback) {
	if (sectionName.indexOf("zwc:") == -1 && sectionName.indexOf("zd:") == -1) {
		return "sectionName must have namespace. send: 'zwc:<sectionName>'";
	}
	var soapDoc = AjxSoapDoc.create("SetMailboxMetadataRequest", "urn:zimbraMail");
	var doc = soapDoc.getDoc();
	var secNode = soapDoc.set("meta");// property name
	secNode.setAttribute("section", sectionName);
	for (var i = 0; i < keyValArray.length; i++) {
		var keyVal = keyValArray[i];
		var el = doc.createElement("a");
		el.setAttribute("n", keyVal.key);
		el.appendChild(doc.createTextNode(keyVal.val));
		secNode.appendChild(el);
	}

	var asyncMode = true;
	if (!callback) {
		asyncMode = false;
	}
	return appCtxt.getAppController().sendRequest({soapDoc:soapDoc, asyncMode:asyncMode, callback:callback});
};


//--------------------------------------------------------------------------------------------------------
//MailboxMetadata API (END)
//--------------------------------------------------------------------------------------------------------
