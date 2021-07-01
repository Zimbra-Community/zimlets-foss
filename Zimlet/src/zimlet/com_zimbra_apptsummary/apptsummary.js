/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 * @author Raja Rao DV
 */

/**
 * Inserts email with current day's appointments on first login.
 * 
 */
com_zimbra_apptsummary_HandlerObject = function() {
};

com_zimbra_apptsummary_HandlerObject.prototype = new ZmZimletBase;
com_zimbra_apptsummary_HandlerObject.prototype.constructor = com_zimbra_apptsummary_HandlerObject;

/**
 * Simplify Zimlet handler name
 */
var ApptSummaryZimlet = com_zimbra_apptsummary_HandlerObject;

/**
 * Defines the "regular only" type for appointment summary HTML.
 */
ApptSummaryZimlet.TYPE_SHOW_REGULAR_ONLY = "SHOW_REGULAR_ONLY";
/**
 * Defines the "free declined" type for appointment summary HTML.
 */
ApptSummaryZimlet.TYPE_SHOW_FREE_DECLINED = "SHOW_FREE_DECLINED";

/**
 * Defines the "last update date" user property.
 */
ApptSummaryZimlet.USER_PROP_LAST_UPDATE = "apptSummary_emailLastUpdateDate";
/**
 * Defines the "only when appointments exist" user property.
 */
ApptSummaryZimlet.USER_PROP_ONLY_SEND_APPTS = "apptSummary_onlySendSummaryWhenThereAreAppts";

/**
 * Defines the "only when appointments exist" element ID.
 */
ApptSummaryZimlet.ELEMENT_ONLY_SEND_APPTS = "apptSummary_onlySendSummaryWhenThereAreAppts";

/**
 * Initializes the zimlet.
 */
ApptSummaryZimlet.prototype.init =
function() {
	//check immediately after login..
	this._checkDateAndSendApptSummary();
	//check every 3 hours so it sends summary immediately
	setInterval(AjxCallback.simpleClosure(this._checkDateAndSendApptSummary, this), 3*60*60*1000);

};

/**
 * Check everytime a mail is sent, just to make sure setInterval doesnt miss it(if the pc is asleep)
 */
 
ApptSummaryZimlet.prototype.onSendMsgSuccess = 
function() {
	if((this._todayStr == undefined) || (this._todayStr && this._todayStr != this._getTodayStr())) {
		this._checkDateAndSendApptSummary();
	}
};

/**
 * Sends Appointment Summary if the date is different
 */
ApptSummaryZimlet.prototype._checkDateAndSendApptSummary =
function() {
	var emailLastUpdateDate = this.getUserProperty(ApptSummaryZimlet.USER_PROP_LAST_UPDATE);
	this._todayStr = this._getTodayStr();
	if (emailLastUpdateDate != this._todayStr){
		this.apptSummary_onlySendSummaryWhenThereAreAppts = this.getUserProperty(ApptSummaryZimlet.USER_PROP_ONLY_SEND_APPTS) == "true";
		this._getAppts(new Date());
	}
};

ApptSummaryZimlet.prototype._handleAppts =
function(appts) {
    this._parseApptsAndSendEmail(appts);
    this.setUserProperty(ApptSummaryZimlet.USER_PROP_LAST_UPDATE, this._todayStr, true);
};

/**
 * Gets the appointments.
 * 
 * @param	{Date}	date	the date
 * @param	{boolean}	noheader		not used
 * @return	{AjxVector} an array of {@link ZmAppt} objects or an empty array for none
 */
ApptSummaryZimlet.prototype._getAppts =
function(date, noheader) {
	try {
		this._startDate = new Date(date.getTime());
		this._startDate.setHours(0, 0, 0, 0);
		var startTime = this._startDate.getTime();
		var end = this._startDate.getTime() + AjxDateUtil.MSEC_PER_DAY;
        var params = {start:startTime, end:end, fanoutAllDay:true, callback: new AjxCallback(this, this._handleAppts)};
        this._calController = AjxDispatcher.run("GetCalController");
        this._calController.getApptSummaries(params);		
	} catch (ex) {
		DBG.println(ex);
		return new AjxVector();
	}
};

/**
 * Parses the appointment array and sends an email summary.
 * 
 * @param	{AjxVector}	appts		an array of {@link ZmAppt} objects
 */
ApptSummaryZimlet.prototype._parseApptsAndSendEmail =
function(appts) {
	var hasError = false;
	var bodyHtml = "";
	var bodyText = "";
	if (appts instanceof AjxVector) {
		if (appts.size() == 0 && this.apptSummary_onlySendSummaryWhenThereAreAppts) {
			return;
		}
		bodyHtml = this._getApptsSummaryBody(this._startDate, appts, this._calController);
		bodyText = this._getApptsSummaryBody(this._startDate, appts, this._calController, null, null, true);

	} else {
		hasError = true;
		bodyHtml = this.getMessage("ApptSummary_error_unabletogetappointments");
		bodyText = bodyHtml;
	}
	this._sendEmail(bodyHtml,bodyText, hasError);
};

/**
 * Gets the appointments summary email body.
 * 
 * @param	{date}		date	the date
 * @param	{AjxVector}	list	an array of {@link ZmAppt} objects
 * @param	{ZmCalViewController}	controller		the calendar view controller
 * @param	{boolean}	noheader	not used
 * @param	{string}	emptyMsg	the empty message body
 * @param	{boolean}	textBody	If true, returns Text-body
 * @return	{string}	the appointment summary email body
 */
ApptSummaryZimlet.prototype._getApptsSummaryBody =
function(date, list, controller, noheader, emptyMsg, textBody) {
	this.__apptCount = 0;
	if (!emptyMsg) {
		emptyMsg = ZmMsg.noAppts;
	}
	var html = new AjxBuffer();
	var formatter = DwtCalendar.getDateFullFormatter();
	var title = formatter.format(date);
	if(!textBody) {
		html.append(this._getApptsHtml(date, list, controller, noheader, emptyMsg, ApptSummaryZimlet.TYPE_SHOW_REGULAR_ONLY));
		html.append("<br/>");
		html.append(this._getApptsHtml(date, list, controller, noheader, emptyMsg, ApptSummaryZimlet.TYPE_SHOW_FREE_DECLINED));
	} else {
		html.append(this._getApptsText(date, list, controller, noheader, emptyMsg, ApptSummaryZimlet.TYPE_SHOW_REGULAR_ONLY));
		html.append("\n\n");
		html.append(this._getApptsText(date, list, controller, noheader, emptyMsg, ApptSummaryZimlet.TYPE_SHOW_FREE_DECLINED));
	}
	return html.toString();
};

/**
 * Gets the appointments summary as HTML.
 * 
 * @param	{date}		date	the date
 * @param	{AjxVector}	list	an array of {@link ZmAppt} objects
 * @param	{ZmCalViewController}	controller		the calendar view controller
 * @param	{boolean}	noheader	not used
 * @param	{string}	emptyMsg	the empty message body
 * @param	{constant}	type		the summary type (see <code>TYPE_*</code> constants)
 * @return	{string}	the appointment summary email body
 */
ApptSummaryZimlet.prototype._getApptsHtml =
function(date, list, controller, noheader, emptyMsg, type) {
	var html = new AjxBuffer();
	var apptsFound = false;
	if (type == ApptSummaryZimlet.TYPE_SHOW_REGULAR_ONLY) {
		var title = this.getMessage("ApptSummary_header_apts");
	} else {
		var title = this.getMessage("ApptSummary_header_notbusy");
	}
	var hdrDivStyle = " style='background-color:#D7CFBE;border-bottom:1px solid #A7A194;'";
	html.append("<table cellpadding='0' cellspacing='0' border='0' width=94% align=center><tr><td>");
	html.append("<div style='border-bottom:1px solid #A7A194;border-right:1px solid #A7A194;border-left:1px solid #CFCFCF'>");

	html.append("<table cellpadding='0' cellspacing='0' border='0' width=100% align=center>");
	html.append("<tr><td><div ", hdrDivStyle, ">");
	html.append("<table cellpadding='3' cellspacing='0' border='0' width=100% align=center>");
	html.append("<tr align=left><th><strong>", title, "</strong></th></tr></table>");
	html.append("</div>");
	html.append("</td></tr></table>");

	html.append("<table cellpadding='3' cellspacing='0' border='0' width=100% align=center>");
	html.append("<tr ", hdrDivStyle, " align=left><th width=15px  align=center valign=middle>#</th><th width=150px>", this.getMessage("ApptSummary_calendar"), "</th>");
	html.append("<th width=100px>", this.getMessage("ApptSummary_label_from"), "</th>");
	html.append("<th width=100px>", this.getMessage("ApptSummary_label_to"), "</th>");
	html.append("<th>", this.getMessage("ApptSummary_label_details"), "</th></tr>");
	var formatter_med = AjxDateFormat.getTimeInstance(AjxDateFormat.SHORT);
	var formatter_long = AjxDateFormat.getTimeInstance(AjxDateFormat.LONG);
	var isRowOdd = true;
	var size = list ? list.size() : 0;
	var freeDecCounter = 0;
	for (var i = 0; i < size; i++) {
		var ao = list.get(i);
		if (type == ApptSummaryZimlet.TYPE_SHOW_REGULAR_ONLY) {
			if (ao.ptst == "DE" || ao.fba == "F" || ao.fba == "O") {//ignore declined and/or free appointments
				continue;
			}
			var counter = ++this.__apptCount;
		} else if (type == ApptSummaryZimlet.TYPE_SHOW_FREE_DECLINED) {
			if (ao.ptst != "DE" && ao.fba != "F" && ao.fba != "O") {//only free/declined appts are allowed
				continue;
			}
			var counter = ++freeDecCounter;
		}
		apptsFound = true;
		var color = ZmCalendarApp.COLORS[controller.getCalendarColor(ao.folderId)];
		var bgColor = ao.getFolder().rgb || ZmOrganizer.COLOR_VALUES[ao.getFolder().color];
		if (isRowOdd) {
			html.append("<tr align=left style='background-color:#FBF9F4;border-top-color:#FBF9F4;'>");
		} else {
			html.append("<tr align=left>");
		}

		html.append("<td  align=center valign=middle style='background-color:", bgColor, ";'>", counter, "</td>");
		html.append("<td>", controller.getCalendarName(ao.folderId), "</td>");
		if (!ao.isAllDayEvent()) {
			if (ao.isMultiDay()) {
				var startTime = formatter_long.format(ao.startDate);
				var endTime = formatter_long.format(ao.endDate);
			} else {
				var startTime = formatter_med.format(ao.startDate);
				var endTime = formatter_med.format(ao.endDate);
			}
		} else {
			var startTime = this.getMessage("ApptSummary_allday");
			var endTime = this.getMessage("ApptSummary_allday");
		}

		var dur = "<td>" + startTime + "&nbsp;" + "</td><td width=100px>" + endTime;
		html.append(dur);
		if (dur != "") {
			html.append("&nbsp;");
		}
		html.append("</td><td>");
		var isNew = ao.ptst == ZmCalBaseItem.PSTATUS_NEEDS_ACTION;
		if (isNew) {
			html.append("<span style='color:red;font-weight:bold;font-size:11px'>[", this.getMessage("ApptSummary_apt_new"), "]</span>&nbsp;");
		} else if (ao.ptst == "DE") {
			html.append("<span style='color:gray;font-size:11px'>[", this.getMessage("ApptSummary_apt_declined"), "]</span>&nbsp;");
		} else if (ao.fba == "F") {
			html.append("<span style='color:gray;font-size:11px'>[", this.getMessage("ApptSummary_apt_free"), "]</span>&nbsp;");
		} else if (ao.fba == "O") {
			html.append("<span style='color:gray;font-size:11px'>[", this.getMessage("ApptSummary_apt_ooo"), "]</span>&nbsp;");
		}
		html.append(AjxStringUtil.htmlEncode(ao.getName()));
		var loc = AjxStringUtil.htmlEncode(ao.getLocation());
		if (loc != "") {
			html.append("&nbsp; <span style='color:gray;font-size:11px'> ", this.getMessage("ApptSummary_label_location"), " - ", loc, "</span>");
		}

		html.append("</td></tr>");
		isRowOdd = !isRowOdd;
	}
	if (size == 0) {
		html.append("<tr align=left><td colspan=3>" + emptyMsg + "</td></tr>");
	}
	html.append("</table>");

	html.append("</div>");
	html.append("</td></tr></table>");
	if (apptsFound) {
		return html.join("");
	} else {
		return "";
	}
};

/**
 * Gets the appointments summary as Text.
 * @params @see this._getApptsHtml
 */
ApptSummaryZimlet.prototype._getApptsText =
function(date, list, controller, noheader, emptyMsg, type) {
	var html = new AjxBuffer();
	var apptsFound = false;
	if (type == ApptSummaryZimlet.TYPE_SHOW_REGULAR_ONLY) {
		var title = this.getMessage("ApptSummary_header_apts");
	} else {
		var title = this.getMessage("ApptSummary_header_notbusy");
	}

	html.append(title, "\n");
	html.append("--------------------------------------------------------------------------------------------------------------------\n");
	html.append("#", " ", this.getMessage("ApptSummary_calendar"),  "\t\t", this.getMessage("ApptSummary_label_from"),"\t\t",
		this.getMessage("ApptSummary_label_to"),"\t", this.getMessage("ApptSummary_label_details"), "\n");
	html.append("--------------------------------------------------------------------------------------------------------------------\n");

	var formatter_med = AjxDateFormat.getTimeInstance(AjxDateFormat.SHORT);
	var formatter_long = AjxDateFormat.getTimeInstance(AjxDateFormat.LONG);
	var isRowOdd = true;
	var size = list ? list.size() : 0;
	var freeDecCounter = 0;
	for (var i = 0; i < size; i++) {
		var ao = list.get(i);
		if (type == ApptSummaryZimlet.TYPE_SHOW_REGULAR_ONLY) {
			if (ao.ptst == "DE" || ao.fba == "F" || ao.fba == "O") {//ignore declined and/or free appointments
				continue;
			}
			var counter = ++this.__apptCount;
		} else if (type == ApptSummaryZimlet.TYPE_SHOW_FREE_DECLINED) {
			if (ao.ptst != "DE" && ao.fba != "F" && ao.fba != "O") {//only free/declined appts are allowed
				continue;
			}
			var counter = ++freeDecCounter;
		}
		apptsFound = true;
		var calName = controller.getCalendarName(ao.folderId);
		if(calName.length > 17) {
			calName = calName.substr(0, 15) + "..";
		}
		html.append(counter, " ", calName);
		if (!ao.isAllDayEvent()) {
			if (ao.isMultiDay()) {
				var startTime = formatter_long.format(ao.startDate);
				var endTime = formatter_long.format(ao.endDate);
			} else {
				var startTime = formatter_med.format(ao.startDate);
				var endTime = formatter_med.format(ao.endDate);
			}
		} else {
			var startTime = this.getMessage("ApptSummary_allday");
			var endTime = this.getMessage("ApptSummary_allday");
		}
		var tab = "\t\t";
		if(calName.length > 10) {
			tab = "\t";
		}
		html.append(tab, startTime, "\t", endTime, "\t");

		var isNew = ao.ptst == ZmCalBaseItem.PSTATUS_NEEDS_ACTION;
		if (isNew) {
			html.append("[", this.getMessage("ApptSummary_apt_new"), "]");
		} else if (ao.ptst == "DE") {
			html.append("[", this.getMessage("ApptSummary_apt_declined"), "]");
		} else if (ao.fba == "F") {
			html.append("[", this.getMessage("ApptSummary_apt_free"), "]");
		} else if (ao.fba == "O") {
			html.append("[", this.getMessage("ApptSummary_apt_ooo"), "]");
		}
		html.append(AjxStringUtil.htmlEncode(ao.getName()));
		var loc = AjxStringUtil.htmlEncode(ao.getLocation());
		if (loc != "") {
			html.append(this.getMessage("ApptSummary_label_location"), " - ", loc);
		}
		html.append("\n");
	}
	if (size == 0) {
		html.append(emptyMsg);
	}
	if (apptsFound) {
		return html.join("");
	} else {
		return "";
	}
};

/**
 * Sends the email.
 * 
 * @param	{string}	bodyHtml		the message body in HTML
 * @param	{string}	bodyText		the message body in text
 * @param	{boolean}	hasError	if <code>true</code>, the email contains an error message
 */
ApptSummaryZimlet.prototype._sendEmail =
function(bodyHtml, bodyText, hasError) {
	if (hasError) {
		var subject = this.getMessage("ApptSummary_subject_error");
	} else {
		var subject = this.getMessage("ApptSummary_subject_success").replace("{0}", this.__apptCount);
		if (this.__apptCount != 1) {
			subject = subject.replace("{1}", this.getMessage("ApptSummary_appointments"));
		} else {
			subject = subject.replace("{1}", this.getMessage("ApptSummary_appointment"));
		}
	}
	var jsonObj = {SendMsgRequest:{_jsns:"urn:zimbraMail"}};
	var request = jsonObj.SendMsgRequest;
	request.suid = (new Date()).getTime();
	var msgNode = request.m = {};
	var identity = appCtxt.getIdentityCollection().defaultIdentity;
	msgNode.idnt = identity.id;

	var isPrimary = identity == null || identity.isDefault;
	var mainAcct = appCtxt.accountList.mainAccount.getEmail();
	var addr = identity.sendFromAddress || mainAcct;
	var displayName = identity.sendFromDisplay;
	var addrNodes = msgNode.e = [];
	var f_addrNode = {t:"f", a:addr};
	if (displayName) {
		f_addrNode.p = displayName;
	}
	addrNodes.push(f_addrNode);

	var t_addrNode = {t:"t", a:addr};
	if (displayName) {
		t_addrNode.p = displayName;
	}
	addrNodes.push(t_addrNode);
	msgNode.su = {_content: subject};
	var topNode = {ct: "multipart/alternative"};
	msgNode.mp = [topNode];
	var partNodes = topNode.mp = [];

	//text part..
	var content = bodyText;
	var partNode = {ct:"text/plain"};
	partNode.content = {_content:content};
	partNodes.push(partNode);

	//html part..
	var content = ["<html><head><style type='text/css'>p { margin: 0; }</style></head>",
		"<body><div style='font-family: Times New Roman; font-size: 12pt; color: #000000'>",
		bodyHtml,"</div></body></html>"].join("");

	var partNode = {ct:"text/html"};
	partNode.content = {_content:content};
	partNodes.push(partNode);
	var callback = new AjxCallback(this, this._sendEmailCallack);
	var errCallback = new AjxCallback(this, this._sendEmailErrCallback);
	return appCtxt.getAppController().sendRequest({jsonObj:jsonObj, asyncMode:true, noBusyOverlay:true, errorCallback:errCallback, callback:callback});
};

/**
 * Send email callback.
 * 
 * @see		_sendEmail
 */
ApptSummaryZimlet.prototype._sendEmailCallack =
function(param1, param2) {
	//do nothing on success
};

/**
 * Send email error callback.
 * 
 * @see		_sendEmail
 */
ApptSummaryZimlet.prototype._sendEmailErrCallback =
function(param1, param2) {
	appCtxt.getAppController().setStatusMsg(this.getMessage("ApptSummary_error_calendarparse"), ZmStatusView.LEVEL_WARNING);
};


/*
 * -------------------------------------
 * Preference Dialog related functions
 * -------------------------------------
 */

/**
 * This method is called when the panel is double-clicked.
 * 
 */
ApptSummaryZimlet.prototype.doubleClicked = function() {
	this.singleClicked();
};

/**
 * This method is called when the panel is single-clicked.
 * 
 */
ApptSummaryZimlet.prototype.singleClicked = function() {
	this._displayPrefDialog();
};

/**
 * Displays the preferences dialog.
 * 
 */
ApptSummaryZimlet.prototype._displayPrefDialog =
function() {
	//if zimlet dialog already exists...
	if (this.pbDialog) {
		this.pbDialog.popup();//simply popup the dialog
		return;
	}
	this.pView = new DwtComposite(this.getShell());
	//this.pView.setSize("150", "25");
	this.pView.getHtmlElement().style.overflow = "auto";
	this.pView.getHtmlElement().innerHTML = this._createPreferenceView();
	
	var dialog_args = {
			title	: this.getMessage("ApptSummary_dialog_preferences_title"),
			view	: this.pView,
			standardButtons : [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON],
			parent	: this.getShell()
		};
	
	this.pbDialog = new ZmDialog(dialog_args);
	this.pbDialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._okBtnListner));
	this._setPreferencesChkBoxVal();
	this.pbDialog.popup();
};

/**
 * Sets the preferences.
 */
ApptSummaryZimlet.prototype._setPreferencesChkBoxVal =
function() {
	if (this.getUserProperty(ApptSummaryZimlet.USER_PROP_ONLY_SEND_APPTS) == "true") {
		document.getElementById(ApptSummaryZimlet.ELEMENT_ONLY_SEND_APPTS).checked = true;
	}
};

/**
 * Creates the preferences view.
 * 
 * @return	{string}	the view HTML
 * @see		_displayPrefDialog
 */
ApptSummaryZimlet.prototype._createPreferenceView =
function() {
	var html = new Array();
	var i = 0;
	html[i++] = "<DIV>";
	html[i++] = "<input id='";
	html[i++] = ApptSummaryZimlet.ELEMENT_ONLY_SEND_APPTS;
	html[i++] = "'  type='checkbox'/>";
	html[i++] = this.getMessage("ApptSummary_sendApptEmailOnlyWhenThereAreEmails");
	html[i++] = "</DIV>";
	return html.join("");
};

/**
 * Preferences dialog OK button listener.
 * 
 * @see		_displayPrefDialog
 */
ApptSummaryZimlet.prototype._okBtnListner =
function() {
	this.setUserProperty(ApptSummaryZimlet.USER_PROP_ONLY_SEND_APPTS, document.getElementById(ApptSummaryZimlet.ELEMENT_ONLY_SEND_APPTS).checked, true);
	appCtxt.getAppController().setStatusMsg(this.getMessage("ApptSummary_preferences_saved"), ZmStatusView.LEVEL_INFO);
	this.pbDialog.popdown();//hide the dialog
};

/*
 * -------------------------------------
 * Supporting functions
 * -------------------------------------
 */

/**
 * Gets today as a string.
 * 
 * @return	{string}	today as a string
 */
ApptSummaryZimlet.prototype._getTodayStr =
function() {
	var todayDate = new Date();
	var todayStart = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
	return this._formatDate(todayStart.getMonth() + 1, todayStart.getDate(), todayStart.getFullYear());
};

/**
 * Formats the date.
 * 
 * @param	{string}	month		the month
 * @param	{string}	day		the day
 * @param	{string}	year		the year
 * @return	{string}	the formatted date
 */
ApptSummaryZimlet.prototype._formatDate =
function(month, day, year) {
	var fString = [];
	var ds = I18nMsg.formatDateShort.toLowerCase();
	var arry = [];
	arry.push({name:"m", indx:ds.indexOf("m")});
	arry.push({name:"y", indx:ds.indexOf("y")});
	arry.push({name:"d", indx:ds.indexOf("d")});
	var sArry = arry.sort(emailappts_sortTimeObjs);
	for (var i = 0; i < sArry.length; i++) {
		var name = sArry[i].name;
		if (name == "m") {
			fString.push(month);
		} else if (name == "y") {
			fString.push(year);
		} else if (name == "d") {
			fString.push(day);
		}
	}
	return fString.join("/");
};

/**
 * Sorts time objects based on index
 * 
 * @param	{hash}	a A hash
 * @param  {string} a.name  first letter of month/year/date
 * @param  {int} a.indx  index of month/year/date
 * @param	{hash}	b A hash
 * @param  {string} b.name  first letter of month/year/date
 * @param  {int} b.indx  index of month/year/date
 * @return	{hash}	sorted objects
 */
function emailappts_sortTimeObjs(a, b) {
	var x = parseInt(a.indx);
	var y = parseInt(b.indx);
	return ((x > y) ? 1 : ((x < y) ? -1 : 0));
}