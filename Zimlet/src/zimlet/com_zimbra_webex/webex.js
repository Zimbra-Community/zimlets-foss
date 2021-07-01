/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2007, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Constructor.
 *
 * @author Raja Rao DV (rrao@zimbra.com)
 */
function com_zimbra_webex_HandlerObject() {
}

com_zimbra_webex_HandlerObject.prototype = new ZmZimletBase();
com_zimbra_webex_HandlerObject.prototype.constructor = com_zimbra_webex_HandlerObject;

/**
 * Simplify handler object
 *
 */
var WebExZimlet = com_zimbra_webex_HandlerObject;

/**
 * Stores WebEx accountName property.
 */
WebExZimlet.PROP_ACCOUNTNAME = {propId: "webexZimlet_accountname", label: "WebExZimlet_accountName", defaultVal: "", extraLabel: ""};

/**
 * Stores WebEx userName property.
 */
WebExZimlet.PROP_USERNAME = {propId: "webexZimlet_username", label: "WebExZimlet_userName", defaultVal: "", extraLabel: ""};

/**
 * Stores WebEx password property.
 */
WebExZimlet.PROP_PASSWORD = {propId: "webexZimlet_pwd", label: "WebExZimlet_password", defaultVal: "", extraLabel: "", objType: "password"};

/**
 * Stores WebEx company id property.
 */
WebExZimlet.PROP_COMPANY_ID = {propId: "webexZimlet_companyId", label: "WebExZimlet_companyId", defaultVal: "", extraLabel: ""};

/**
 * Stores WebEx Alternate Host property.
 */
WebExZimlet.PROP_ALT_HOSTS = {propId: "WebExZimlet_altHosts", label: "WebExZimlet_altHosts", defaultVal: "", extraLabel: ""};

/**
 * Stores calendar that is associated with a particular WebEx Account
 */
WebExZimlet.PROP_ASSOCIATED_CALENDAR = {propId: "webexZimlet_AssociatedCalendar", label: "WebExZimlet_useThisAccountFor", defaultVal: "", extraLabel: ""};

/**
 * Stores Meeting password for a particular account
 */
WebExZimlet.PROP_MEETING_PASSWORD = {propId: "webexZimlet_meetingPwd", label: "WebExZimlet_meetingPwd", defaultVal: "", extraLabel: "WebExZimlet_optional"};

/**
 * Stores toll-free phone number property
 */
WebExZimlet.PROP_TOLL_FREE_PHONE_NUMBER = {propId: "webexZimlet_tollFreePH", label: "WebExZimlet_tollFreeNumber", defaultVal: "", extraLabel: ""};

/**
 * Stores toll phone number property.
 */
WebExZimlet.PROP_TOLL_PHONE_NUMBER = {propId: "webexZimlet_tollPH", label: "WebExZimlet_tollNumber", defaultVal: "", extraLabel: ""};

/**
 * Stores WebEx international phone number property.
 */
WebExZimlet.PROP_OTHER_PHONE_NUMBERS = {propId: "webexZimlet_otherPH", label: "WebExZimlet_otherPhoneNumbers", defaultVal: "", extraLabel: ""};

/**
 * Stores WebEx phone passcode property.
 */
WebExZimlet.PROP_PHONE_PASSCODE = {propId: "webexZimlet_phonePasscode", label: "WebExZimlet_phonePasscode", defaultVal: "", extraLabel: "WebExZimlet_digitsOnly"};

/**
 * An Array w/ just account properties. Helps in drawing account specific UI
 */
WebExZimlet.SINGLE_WEBEX_ACCNT_PROPS = [WebExZimlet.PROP_USERNAME, WebExZimlet.PROP_PASSWORD,
	WebExZimlet.PROP_COMPANY_ID, WebExZimlet.PROP_MEETING_PASSWORD,
	WebExZimlet.PROP_ALT_HOSTS];

/**
 * An Array w/ just tele-conf properties.  Used in drawing tele-conf specific UI
 */
WebExZimlet.WEBEX_TELECONF_PROPS = [WebExZimlet.PROP_TOLL_FREE_PHONE_NUMBER,
	WebExZimlet.PROP_TOLL_PHONE_NUMBER, WebExZimlet.PROP_OTHER_PHONE_NUMBERS,
	WebExZimlet.PROP_PHONE_PASSCODE];

/**
 * An array with all properties.
 */
WebExZimlet.ALL_ACCNT_PROPS = [WebExZimlet.PROP_ACCOUNTNAME, WebExZimlet.PROP_USERNAME,
	WebExZimlet.PROP_PASSWORD, WebExZimlet.PROP_COMPANY_ID, WebExZimlet.PROP_MEETING_PASSWORD,
	WebExZimlet.PROP_ASSOCIATED_CALENDAR, WebExZimlet.PROP_TOLL_FREE_PHONE_NUMBER,
	WebExZimlet.PROP_TOLL_PHONE_NUMBER, WebExZimlet.PROP_OTHER_PHONE_NUMBERS,
	WebExZimlet.PROP_PHONE_PASSCODE, WebExZimlet.PROP_ALT_HOSTS];


/**
 * Stores append meeting password  property
 */
WebExZimlet.PROP_APPEND_WEBEX_MEETING_PWD = {propId: "webexZimlet_appendWebexMeetingPassword", label: "WebExZimlet_appendMeetingPwd", defaultVal: "NONE", extraLabel: ""};

/**
 * Stores append toll free property property
 */
WebExZimlet.PROP_APPEND_TOLL_FREE_PHONE_NUMBER = {propId: "webexZimlet_appendTollFreeConfNumber", label: "WebExZimlet_appendToolFreeNumber", defaultVal: "NONE", extraLabel: ""};

/**
 * Stores append toll phone property
 */
WebExZimlet.PROP_APPEND_TOLL_PHONE_NUMBER = {propId: "webexZimlet_appendTollConfNumber", label: "WebExZimlet_appendTollConfNumber", defaultVal: "NONE", extraLabel: ""};


/**
 * Stores append passcode property
 */
WebExZimlet.PROP_APPEND_PHONE_PASSCODE = {propId: "webexZimlet_appendPhonePasscode", label: "WebExZimlet_appendPhonePasscode", defaultVal: "NONE", extraLabel: ""};


/**
 * Helps draw append options UI
 */
WebExZimlet.APPEND_SUB_OPTIONS = [WebExZimlet.PROP_APPEND_WEBEX_MEETING_PWD,
	WebExZimlet.PROP_APPEND_TOLL_FREE_PHONE_NUMBER, WebExZimlet.PROP_APPEND_TOLL_PHONE_NUMBER,
	WebExZimlet.PROP_APPEND_PHONE_PASSCODE];

/**
 * Array with all General options. This entire list is stored  in Zimbra DB
 */
WebExZimlet.ALL_GENERAL_PROPS = [WebExZimlet.PROP_APPEND_WEBEX_MEETING_PWD,
	WebExZimlet.PROP_APPEND_TOLL_FREE_PHONE_NUMBER, WebExZimlet.PROP_APPEND_TOLL_PHONE_NUMBER,
	WebExZimlet.PROP_APPEND_PHONE_PASSCODE];

/**
 * Map Zimbra TimeZone Name to WebEx TimeZone Id
 *
 */
WebExZimlet.WebExToZimbraTZIDMap = {"Etc/GMT+12": "0", "Pacific/Midway": "1", "Pacific/Honolulu": "2", "America/Anchorage": "3", "America/Los_Angeles": "4", "America/Tijuana": "4",
	"America/Phoenix": "5","America/Chihuahua": "6", "America/Denver": "6", "America/Chicago": "7", "America/Guatemala": "7", "America/Mexico_City": "8", "America/Regina": "9", "America/Bogota": "10",
	"America/New_York": "11", "America/Indiana/Indianapolis": "12", "America/Halifax": "13", "America/Guyana": "13", "America/La_Paz": "13", "America/Manaus": "13", "America/Santiago": "13",
	"America/Caracas": "14", "America/St_Johns": "15", "America/Sao_Paulo": "16", "America/Argentina/Buenos_Aires": "17", "America/Godthab": "17", "America/Montevideo": "17",
	"Atlantic/South_Georgia": "18", "Atlantic/Azores": "19", "Atlantic/Cape_Verde": "19", "Africa/Casablanca": "20", "Africa/Monrovia": "20", "Europe/London": "21", "Africa/Algiers": "21",
	"Africa/Windhoek": "22", "Europe/Belgrade": "22", "Europe/Warsaw": "22", "Europe/Brussels": "23", "Europe/Berlin": "25", "Europe/Athens": "26", "Africa/Cairo": "28",
	"Africa/Harare": "29", "Asia/Amman": "29", "Asia/Beirut": "29", "Europe/Helsinki": "30", "Europe/Minsk": "30", "Asia/Jerusalem": "31", "Asia/Baghdad": "32", "Europe/Moscow": "33",
	"Africa/Nairobi": "34", "Asia/Kuwait": "35", "Asia/Tehran": "35", "Asia/Muscat": "36", "Asia/Baku": "37", "Asia/Tbilisi": "37", "Asia/Yerevan": "37", "Asia/Kabul": "38", "Asia/Tashkent": "39",
	"Asia/Yekaterinburg": "39", "Asia/Karachi": "40", "Asia/Kolkata": "41", "Asia/Colombo": "42", "Asia/Dhaka": "42", "Asia/Novosibirsk": "43", "Asia/Rangoon": "43", "Asia/Bangkok": "44",
	"Asia/Krasnoyarsk": "44", "Asia/Hong_Kong": "45", "Asia/Irkutsk": "45", "Australia/Perth": "46", "Asia/Kuala_Lumpur": "47", "Asia/Taipei": "48", "Asia/Tokyo": "49", "Asia/Seoul": "50", "Asia/Yakutsk": "51",
	"Australia/Adelaide": "52", "Australia/Darwin": "53", "Asia/Vladivostok": "54", "Australia/Brisbane": "54", "Australia/Sydney": "55", "Pacific/Guam": "56", "Australia/Hobart": "57",
	"Asia/Magadan": "59", "Pacific/Auckland": "60", "Pacific/Fiji": "61", "Pacific/Tongatapu": "61"};


/**
 * Map Zimbra's short Weekday name to WebEx's Weekday
 */
WebExZimlet.WEEK_NAME_MAP = { "MO": "MONDAY","TU": "TUESDAY","WE": "WEDNESDAY","TH": "THURSDAY","FR": "FRIDAY", "SA": "SATURDAY", "SU": "SUNDAY"};

var webExZimletInstance;

/**
 * Initializes the zimlet.
 *
 */
WebExZimlet.prototype.init = function() {
	this.metaData = appCtxt.getActiveAccount().metaData;
	WebExZimlet.PROP_COMPANY_ID["defaultVal"] = this.getUserProperty("webexZimlet_companyId");
	this._currentWebExAccountNumber = 1;
	//this._displayGeneralPrefsDlg();
	webExZimletInstance = this;
};

/**
 * Adds button to Calendar toolbar.
 *
 */
WebExZimlet.prototype.initializeToolbar = function(app, toolbar, controller, viewId) {
	var viewType = appCtxt.getViewTypeFromId(viewId);
	if (viewType == ZmId.VIEW_APPOINTMENT) {
		this._initCalendarWebexToolbar(toolbar, controller);
	} else 	if (viewType == ZmId.VIEW_CONVLIST || viewType == ZmId.VIEW_CONV || viewType == ZmId.VIEW_TRAD
			|| viewType == ZmId.VIEW_CONTACT_SIMPLE || viewType == ZmId.VIEW_CAL_DAY) {

		var op = toolbar.getOp(ZmId.OP_ACTIONS_MENU);
		if(op) {
			var menu = op.getMenu();
			if(menu) {
				if(menu.getMenuItem("WEBEX_ZIMLET_START_QUICK_MEETING")) {
					return;
				}
				var mi = menu.createMenuItem("WEBEX_ZIMLET_START_QUICK_MEETING", {image:"WEBEX-panelIcon", text:this.getMessage("WebExZimlet_startQuickWebExMeeting")});
				mi.addSelectionListener(new AjxListener(this, this._handleQuickMeetingMenuClick, controller));
			}
		}
	}
};

WebExZimlet.prototype._handleQuickMeetingMenuClick = function(controller) {
	var items = controller.getSelection();
	if(!items instanceof Array) {
		this._showOneClickDlg("");
		return;
	}
	var type = items[0].type;
	var obj;
	var emails = [];
	if (type == ZmId.ITEM_CONV) {
		obj = items[0].getFirstHotMsg();
		emails = obj.getEmails().getArray();
	} else if(type == ZmId.ITEM_MSG) {
		obj = items[0];
		emails = obj.getEmails().getArray();
	} else if(type == ZmId.ITEM_CONTACT) {
		emails = this._getEmailsFromContacts(items);
	}
	var emails = emails instanceof Array ?  emails.join(";") : "";
	this._showOneClickDlg(emails);
};

/**
 * Called by the framework when an appointment is deleted
 *
 * @param {ZmAppt|array} appt	the appointment or an array of {@link ZmAppt} objects just deleted
 */
WebExZimlet.prototype.onAppointmentDelete = function(appt) {
	if (!(appt instanceof ZmAppt)) {
		for (var el in appt) {
			var tmp = appt[el][0];
            if (tmp) {
                appt = tmp;
                break;
            }
		}
	}
	this._appt = appt;//store this appt.
	if(this._appt.id.indexOf(":") > 0) {//current api doesnt support deleting shared-calendar(we get permission-denied)
		return;
	}
	var postCallback;
	if (appt.viewMode != ZmCalItem.MODE_DELETE_INSTANCE) {
		postCallback = new AjxCallback(this, this._doDeleteWebExAppt);
	} else {
		postCallback = new AjxCallback(this, this._showDeleteWebExApptYesNoDlg);
	}
	this._getApptIdsHashMetaData(appt.id, postCallback);
};

/**
 * Displays Yes/No dialog.
 *
 * @param {hash} webExKeyData  a hash of parameters
 * @param {int} webExKeyData.meetingKey	the Webex meeting key
 * @param {int} webExKeyData.exceptionMeetingKey	the Webex meeting key of an exception to the series appt
 * @param {string} webExKeyData.username	 the Webex username
 * @param {string} webExKeyData.password	the Webex password
 * @param {string} webExKeyData.companyId	the Webex company id
 */
WebExZimlet.prototype._showDeleteWebExApptYesNoDlg =
function(webExKeyData) {
	if (!webExKeyData || !webExKeyData.meetingKey) {
		return;
	}
	var dlg = appCtxt.getYesNoMsgDialog();
	dlg.registerCallback(DwtDialog.YES_BUTTON, this._deleteYesButtonClicked, this, [dlg, webExKeyData]);
	dlg.registerCallback(DwtDialog.NO_BUTTON, this._deleteNoButtonClicked, this, dlg);
	dlg.setMessage(this.getMessage("WebExZimlet_entireSeriesWillBeDeleted"), DwtMessageDialog.WARNING_STYLE);
	dlg.popup();
};

/**
 * Called when yes button is clicked to confirm delete.
 *
 * @param {ZmDialog} dlg		the dialog
 * @param {obj} webExKeyData	 the object containing webex information stored for a particular appointment
 */
WebExZimlet.prototype._deleteYesButtonClicked =
function(dlg, webExKeyData) {
	dlg.popdown();
	this._doDeleteWebExAppt(webExKeyData);
};

/**
 * Deletes a WebEx appointment.
 *
 * @param {hash} webExKeyData	a hash of parameters
 *
 * @see this._showDeleteWebExApptYesNoDlg
 */
WebExZimlet.prototype._doDeleteWebExAppt =
function(webExKeyData) {
	var key = "";
	if (!webExKeyData || !webExKeyData.meetingKey) {
		return;
	}
	key = webExKeyData.meetingKey;
	if (this._appt.viewMode == ZmCalItem.MODE_DELETE || this._appt.viewMode == ZmCalItem.MODE_DELETE_INSTANCE) {
		if (webExKeyData.exceptionMeetingKey) {
			key = webExKeyData.exceptionMeetingKey;
		}
	}
	var requestBody = ["<bodyContent xsi:type=\"java:com.webex.service.binding.meeting.DelMeeting\">",
		"<meetingKey>", key, "</meetingKey>","</bodyContent>"].join("");

	var request = this.newWebExRequest(requestBody, webExKeyData);
	var result = AjxRpc.invoke(request, this.postUri(webExKeyData), {"Content-Type":"text/xml"}, null, false, false);
	var objResult = this.xmlToObject(result);
	if (!this._validateWebExResult(objResult, this.getMessage("WebExZimlet_unableToDeleteWebExAppt"))) {
		return;
	}
	appCtxt.getAppController().setStatusMsg(this.getMessage("WebExZimlet_meetingWasDeleted"), ZmStatusView.LEVEL_INFO);
};

/**
 * Closes warning dialog when No was clicked to a a warning.
 *
 * @param {ZmDialog} dlg		 the yes/no dialog
 */
WebExZimlet.prototype._deleteNoButtonClicked =
function(dlg) {
	dlg.popdown();
};

/**
 * Initiates calendar toolbar.
 *
 * @param {ZmToolbar} toolbar	 the Zimbra toolbar
 * @param {ZmCalController} controller  the Zimbra calendar controller
 */
WebExZimlet.prototype._initCalendarWebexToolbar = function(toolbar, controller) {
	if (!toolbar.getButton("SAVE_AS_WEBEX")) {
		ZmMsg.sforceAdd = this.getMessage("WebExZimlet_saveAsWebEx");
		var buttonIndex = toolbar.opList.length + 1;
		var button = toolbar.createOp("SAVE_AS_WEBEX", {image:"WEBEX-panelIcon", text:"WebEx", tooltip:this.getMessage("WebExZimlet_savesThisApptAsWebEx"), index:buttonIndex});
		toolbar.addOp("SAVE_AS_WEBEX", buttonIndex);
		this._composerCtrl = controller;
		this._composerCtrl._webexZimlet = this;

		//btn.addSelectionListener(new AjxListener(this._composerCtrl, this._saveAsWebExHandler));
		var menu = new ZmPopupMenu(button); //create menu
		button.setMenu(menu);//add menu to button
		button.noMenuBar = true;
		//this._viewIdAndMenuMap[viewId] = {menu:menu, controller:controller, button:button};
		button.removeAllListeners();
		button.removeDropDownSelectionListener();
		//button.addSelectionListener(new AjxListener(this, this._addMenuItems, [button, menu]));
		//button.addDropDownSelectionListener(new AjxListener(this, this._addMenuItems, [button, menu]));
		var mi = menu.createMenuItem(Dwt.getNextId(), {image:"WEBEX-panelIcon", text:this.getMessage("WebExZimlet_insertWebExDetails")});
		mi.addSelectionListener(new AjxListener(this._composerCtrl, this._saveAsWebExHandler, true));
		var mi = menu.createMenuItem(Dwt.getNextId(), {image:"WEBEX-panelIcon", text:this.getMessage("WebExZimlet_insertWebExDetailsAndSendAppointment")});
		mi.addSelectionListener(new AjxListener(this._composerCtrl, this._saveAsWebExHandler, false));
	}
};
/**
 * Saves a WebEx appointment.
 *
 * @param {event} ev		an event object
 */
WebExZimlet.prototype._saveAsWebExHandler = function(dontSaveMeeting) {
	try {
		if (this._composeView.isValid()) {
			var appt = this._composeView.getAppt();
			var viewMode = appt.viewMode;
			var params = {apptController:this, apptComposeView:this._composeView, appt:appt, dontSaveMeeting: dontSaveMeeting};

			//check if it is an update.. if so, check if we already have that appt.
			if (viewMode != ZmCalItem.MODE_EDIT_SINGLE_INSTANCE && viewMode != ZmCalItem.MODE_EDIT
					&& viewMode != ZmCalItem.MODE_EDIT_SERIES) {
				this._webexZimlet._doSaveWebExAppt(params);
			} else {
				var postCallback = new AjxCallback(this._webexZimlet, this._webexZimlet._checkIfItsWebExUpdate, params);
				this._webexZimlet._getApptIdsHashMetaData(appt.id, postCallback);
			}
		}
	} catch(ex) {
		this._webexZimlet._showErrorMessage(ex);
		return;
	}
};

/**
 * Verifies if its a WebEx appointment
 *
 * @param {hash} params		a hash of parameters
 * @param {ZmCalComposeController} params.apptController the calendar Controller
 * @param {ZmCalendarComposeView} params.apptComposeView the Calendar compose view
 * @param {ZmAppointment} params.appt	ann appointment
 * @param {hash} webExKeyData for more details
 *
 * @see {this._showDeleteWebExApptYesNoDlg}
 */
WebExZimlet.prototype._checkIfItsWebExUpdate =
function(params, webExKeyData) {
	if (!webExKeyData) {
		this._doSaveWebExAppt(params);
	} else if (webExKeyData && webExKeyData.meetingKey) {
		params.webExKeyData = webExKeyData;
		this._showUpdateWebExApptYesNoDlg(params);
	}
};

/**
 * Shows warning dialog.
 *
 * @param {hash}	params  a hash of parameters
 *
 * @see this._checkIfItsWebExUpdate
 */
WebExZimlet.prototype._showUpdateWebExApptYesNoDlg =
function(params) {
	var dlg = appCtxt.getYesNoMsgDialog();
	dlg.registerCallback(DwtDialog.YES_BUTTON, this._updateYesButtonClicked, this, [dlg, params]);
	dlg.registerCallback(DwtDialog.NO_BUTTON, this._updateNoButtonClicked, this, dlg);
	dlg.setMessage(this.getMessage("WebExZimlet_modifyApptAvoidDuplicateInfoWarning"), DwtMessageDialog.WARNING_STYLE);
	dlg.popup();
};

/**
 * Called when Yes is clicked on warning dialog.
 *
 * @param {ZmDialog} dlg	the dialog
 * @param {hash}	params  a hash of parameters
 *
 * @see this._checkIfItsWebExUpdate
 */
WebExZimlet.prototype._updateYesButtonClicked =
function(dlg, params) {
	dlg.popdown();
	this._doSaveWebExAppt(params);
};

/**
 * Called when no button was clicked.
 *
 * @param {ZmDialog} dlg  a dialog box
 */
WebExZimlet.prototype._updateNoButtonClicked =
function(dlg) {
	dlg.popdown();
};

/**
 * Saves WebEx appointment.
 *
 * @param {hash}	params  a hash of parameters
 *
 * @see this._checkIfItsWebExUpdate
 */
WebExZimlet.prototype._doSaveWebExAppt = function(params) {
	var postCallback = new AjxCallback(this, this._doCreateOrUpdateMeeting, params);
	this._showSelectAccountDlg({postCallback:postCallback, appt:params.appt, showOptions:true});
};

WebExZimlet.prototype._doCreateOrUpdateMeeting = function(params, accountNumber) {
	params["manuallySelectedAccount"] = accountNumber;
	var postCallback = new AjxCallback(this, this._createOrUpdateMeeting, params);
	this._getGeneralPrefsMetaData(postCallback);
};

/**
 * Saves WebEx appointment.
 *
 * @param {hash}	params  a hash of parameters
 *
 * @see	this._checkIfItsWebExUpdate
 */
WebExZimlet.prototype._createOrUpdateMeeting = function(params) {
	var newParams = {};
	var appt = params.appt;
	try {
		if (params.manuallySelectedAccount) {
			this._setCurrentAccntInfoFromAccntNumber(params.manuallySelectedAccount);
		} else {
			this._setCurrentAccntInfoFromCalendar(appt.folderId);
		}
	} catch(ex) {
		this._showErrorMessage(ex);
		return;
	}
	newParams["subject"] = appt.name;
	newParams["loc"] = AjxStringUtil.urlComponentEncode(appt.location);
	newParams["emails"] = params["emails"] = appt.getAttendees(ZmCalBaseItem.PERSON);
	newParams["duration"] = (appt.endDate.getTime() - appt.startDate.getTime()) / 60000;
	newParams["timeZoneID"] = WebExZimlet.WebExToZimbraTZIDMap[appt.timezone];
	newParams["pwd"] = this._currentWebExAccount[WebExZimlet.PROP_MEETING_PASSWORD.propId];
	newParams["recurrence"] = this._getRecurrenceString(appt);
	var startDate = appt.startDate;
	newParams["formattedStartDate"] = this._formatDate(startDate);

	var meetingKey = null;
	if (params.webExKeyData && params.webExKeyData.meetingKey) {
		meetingKey = params.webExKeyData.meetingKey;
	}
	if (appt.viewMode != ZmCalItem.MODE_EDIT_SINGLE_INSTANCE) {//if its modify single-instance, dont use the same meetingKey
		newParams["meetingKey"] = meetingKey;
	} else {
		if (meetingKey) {
			params["seriesMeetingKey"] = meetingKey;//store this to params(not newParams) so we can store this
		}
	}
    var callback = new AjxCallback(this, this._createOrUpdateMeetingResponseHdlr, params);
	this._getCreateOrModifyMeetingRequest(newParams, callback);
};

/**
 * Saves WebEx appointment.
 *
 * @param {ZmAppt} appt	 an appointment
 */
WebExZimlet.prototype._getRecurrenceString = function(appt) {
	var rec = appt.getRecurrence();
	var repeatType = rec.repeatType;
	if (repeatType == "NON" || appt.viewMode == ZmCalItem.MODE_EDIT_SINGLE_INSTANCE) {//non recurring or modify instance, skip creating recurring
		return "";
	}
	var repeatEndCount = rec.repeatEndCount;
	var repeatEndDate = rec.repeatEndDate;

	var endStr = "";
	if (repeatEndCount > 1) {
		endStr = ["<afterMeetingNumber>",repeatEndCount,"</afterMeetingNumber>"].join("");
	} else if (repeatEndDate) {

		repeatEndDate = [(repeatEndDate.getMonth() + 1),"/", repeatEndDate.getDate(), "/",repeatEndDate.getFullYear(), " 00:00:00"].join("");
		endStr = ["<expirationDate>",repeatEndDate,"</expirationDate>"].join("");
	}
	var recString = "";
	if (repeatType == "WEE") {
		var repeatWeeklyDays = rec.repeatWeeklyDays;
		var dayInWeekStr = this._getDayInWeekStr(repeatWeeklyDays, appt);
		recString = ["<repeat><repeatType>WEEKLY</repeatType>",dayInWeekStr,endStr,"</repeat>"].join("");
	} else if (repeatType == "MON") {
		var dayInMonthStr = "";
		var weekInTheMonthStr = "";
		var dayInWeekStr = "";
		var dayList = rec.repeatCustomMonthDay ? [rec.repeatCustomMonthDay] : rec.repeatMonthlyDayList;
		var internalRecStr = "";
		if (rec.repeatBySetPos != "1") {
			weekInTheMonthStr = ["<weekInMonth>",rec.repeatBySetPos,"</weekInMonth>"].join("");
			var repeatWeeklyDays = rec.repeatCustomDays ? rec.repeatCustomDays : rec.repeatWeeklyDays;//special case
			dayInWeekStr = this._getDayInWeekStr(repeatWeeklyDays, appt);
			internalRecStr = weekInTheMonthStr + dayInWeekStr;
		} else if (dayList.length > 0) {
			dayInMonthStr = ["<dayInMonth>",dayList[0],"</dayInMonth>"].join("");
			internalRecStr = dayInMonthStr;
		}
		var intervalStr = ["<interval>",rec.repeatCustomCount,"</interval>"].join("");
		recString = ["<repeat><repeatType>MONTHLY</repeatType>",internalRecStr, intervalStr, endStr,"</repeat>"].join("");
	} else if (repeatType == "YEA") {
		var dayInMonthStr = "";
		var internalRecStr = "";
		var dayInWeekStr = "";
		var weekInMonthStr = "";
		var dayList = rec.repeatCustomMonthDay ? [rec.repeatCustomMonthDay] : rec.repeatMonthlyDayList;
		if (rec.repeatBySetPos != "1") {
			weekInMonthStr = ["<weekInMonth>",rec.repeatBySetPos,"</weekInMonth>"].join("");
			var repeatWeeklyDays = rec.repeatCustomDays ? rec.repeatCustomDays : rec.repeatWeeklyDays;//special case
			dayInWeekStr = this._getDayInWeekStr(repeatWeeklyDays, appt);
			var monthInYearStr = ["<monthInYear>",rec.repeatYearlyMonthsList,"</monthInYear>"].join("");
			internalRecStr = weekInMonthStr + dayInWeekStr + monthInYearStr;
		} else {
			dayInMonthStr = ["<dayInMonth>",dayList[0],"</dayInMonth>"].join("");
			var monthInYearStr = ["<monthInYear>",rec.repeatYearlyMonthsList,"</monthInYear>"].join("");
			internalRecStr = dayInMonthStr + monthInYearStr;
		}
		recString = ["<repeat><repeatType>YEARLY</repeatType>",internalRecStr, endStr,"</repeat>"].join("");
	} else if (repeatType == "DAI") {
		var internalRecStr = "";
		if (!rec.repeatWeekday) {
			var internalRecStr = ["<interval>",rec.repeatCustomCount,"</interval>"].join("");
		} else {
			var repeatWeeklyDays = [ "MO","TU","WE","TH","FR"];
			internalRecStr = this._getDayInWeekStr(repeatWeeklyDays, appt);
		}
		recString = ["<repeat><repeatType>DAILY</repeatType>",internalRecStr, endStr,"</repeat>"].join("");
	}
	return recString;
};

/**
 * Gets day in week string.
 *
 * @param {array} repeatWeeklyDays		an array of weekdays
 * @param {ZmAppoinment} appt		an appointment
 * @return {string} a day in week string
 */
WebExZimlet.prototype._getDayInWeekStr = function(repeatWeeklyDays, appt) {
	var dayInWeek = [];
	dayInWeek.push("<dayInWeek>");
	if (repeatWeeklyDays.length > 0) {
		for (var i = 0; i < repeatWeeklyDays.length; i++) {
			dayInWeek.push("<day>", WebExZimlet.WEEK_NAME_MAP[repeatWeeklyDays[i]], "</day>");
		}
	} else {
		var dayOfWeek = ZmCalItem.SERVER_WEEK_DAYS[appt.startDate.getDay()];
		dayInWeek.push("<day>", WebExZimlet.WEEK_NAME_MAP[dayOfWeek], "</day>");
	}
	dayInWeek.push("</dayInWeek>");

	return dayInWeek.join("");
};

/**
 * Gets createMeetingAttendeeRequest XML
 *
 * @param {hash} params	a hash of parameters
 * @params {string} params.emails meeting invitees
 * @params {string} params.meetingkey meeting key (aka sessionkey)
 */
WebExZimlet.prototype._getCreateAttendeesRequest = function(params) {
	var emails = params.emails;
	var sessionKey = params.meetingKey;
	var emls = [];

	var j = 0;
	for (var i = 0; i < emails.length; i++) {
		var a = emails[i];
		var e = a.getEmail ? a.getEmail() : (a.getAddress ? a.getAddress() : "");
		if (e == "" || e == undefined) {
			continue;
		}
		var fn = a.getFullName ? a.getFullName() : (a.getDispName ? a.getDispName() : "");
		if(i != 0) {
			emls[j++] = "<attendees>";
		}
		emls[j++] = ["<person><email>",e, "</email>"].join("");

		if (fn != "" && fn != undefined) {
			emls[j++] = ["<name>", fn, "</name>"].join("");
		}
		emls[j++] = "</person>";
		emls[j++] = "<joinStatus>INVITE</joinStatus>";
		emls[j++] = ["<sessionKey>",sessionKey,"</sessionKey>"].join("");
		if(i != 0) {
			emls[j++] = "</attendees>";
		}
	}
	var requestBody = [
		"<bodyContent xsi:type=\"java:com.webex.service.binding.attendee.CreateMeetingAttendee\">",
		 emls.join(""),
		"</bodyContent>"].join("");

	return this.newWebExRequest(requestBody);
};

/**
 * Create create or modify WebEx meeting request.
 *
 * @param {hash} params	a hash of parameters
 * @param {string} params.subject meeting subject
 * @param {string} params.loc meeting location
 * @param {string} params.emails meeting invitees
 * @param {string} params.duration meeting duration
 * @param {int} params.timeZoneID WebEx timeZone Id
 * @param {string} params.pwd Meeting password
 * @param {string} params.formattedStartDate Start date string
 * @param {int} params.meetingkey meeting key
 * @param {AjxCallback} callback to be run after request is made
 * @return {string} a request string
 */
WebExZimlet.prototype._getCreateOrModifyMeetingRequest = function(params, callback) {
	var emails = params.emails;
	var meetingKey = params.meetingKey;
	var pwd = params.pwd;
	var subject = params.subject;
	var loc = params.loc;
	var formattedStartDate = params.formattedStartDate;
	var duration = params.duration;
	var timeZoneID = params.timeZoneID;
	var recurrence = params.recurrence ? params.recurrence : "";
	var sendWebExEmail = params.sendWebExEmail;
	var emls = [];
	//only for oneclickMeetings, add attendees right-away
	if(sendWebExEmail) {
		var j = 0;
		for (var i = 0; i < emails.length; i++) {
			var a = emails[i];
			var e = a.getEmail ? a.getEmail() : (a.getAddress ? a.getAddress() : "");
			if (e == "" || e == undefined) {
				continue;
			}
			var fn = a.getFullName ? a.getFullName() : (a.getDispName ? a.getDispName() : "");
			emls[j++] = ["<attendee><person><email>",e, "</email>"].join("");

			if (fn != "" && fn != undefined) {
				emls[j++] = ["<name>", fn, "</name>"].join("");
			}
			emls[j++] = "</person></attendee>";
		}
	}
	var altHosts = this._currentWebExAccount.WebExZimlet_altHosts;
	//use altHosts set in the selectAccnt dlg
	if(this._showSelectAccntsDlg) {
		if(document.getElementById(this._showSelectAccntsDlg._altHostFieldId) && this._showSelectAccntsDlg._showOptions) {
			altHosts = document.getElementById(this._showSelectAccntsDlg._altHostFieldId).value;
		}

		if(document.getElementById(this._showSelectAccntsDlg._mPwdFieldId)) {///use mPwd set in the selectAccnt dlg
			pwd = document.getElementById(this._showSelectAccntsDlg._mPwdFieldId).value;
		}
	}

	if (altHosts != "" && altHosts != "N/A" && altHosts.indexOf(";") > 0) {
		altHosts = altHosts.split(";");
	} else if (altHosts != "" && altHosts != "N/A" && altHosts.indexOf(",") > 0) {
		altHosts = altHosts.split(",");
	} else if (altHosts != "" && altHosts.indexOf("@") > 0) {
		altHosts = [altHosts];
	}
	var altHostsEmls = [];
	if (altHosts instanceof Array) {
		for (var i = 0; i < altHosts.length; i++) {
			var e = altHosts[i];
			altHostsEmls.push("<attendee><person><email>", e, "</email></person><role>HOST</role></attendee>");
		}
	}
	var apiType, meetingKeyStr;
	if (meetingKey) {
		apiType = "java:com.webex.service.binding.meeting.SetMeeting";
		meetingKeyStr = ["<meetingkey>",meetingKey,"</meetingkey>"].join("");
	} else {
		apiType = "java:com.webex.service.binding.meeting.CreateMeeting";
		meetingKeyStr = "";
	}
	if (!pwd || pwd == "" || pwd == "N/A" || pwd == "null") {
		var pwdStr = "";
	} else {
		var pwdStr = ["<accessControl><meetingPassword>", AjxStringUtil.xmlEncode(pwd), "</meetingPassword></accessControl>"].join("");
	}
	var sendWebExEmailStr = "";
	//if(params.sendWebExEmail) { //used for one-click meetings
		 sendWebExEmailStr = "<attendeeOptions><emailInvitations>TRUE</emailInvitations></attendeeOptions>";
	//}
    var requestBody = [
        "<bodyContent xsi:type=\"",apiType,"\">",
        pwdStr,
        "<metaData><sessionTemplate><default>true</default></sessionTemplate><confName>", AjxStringUtil.xmlEncode(subject), "</confName>",
        "<location>",loc,"</location></metaData>",
        "<participants><attendees>", emls.join(""),altHostsEmls.join(""), "</attendees></participants>",
        "<schedule>",
        "<startDate>", formattedStartDate, "</startDate>",
        "<duration>", duration, "</duration>",
        "<timeZoneID>", timeZoneID, "</timeZoneID></schedule>",
        "<telephony><telephonySupport>@callintype@</telephonySupport>",
        "<enableTSP>@tspEnabled@</enableTSP>",
        "@tspAccountIndex@",
        "<extTelephonyDescription>", AjxStringUtil.xmlEncode(this._getWebExBodyString(null, "FIELD", true, true)),
        "</extTelephonyDescription></telephony>",
        sendWebExEmailStr,
        meetingKeyStr,
        recurrence,
        "</bodyContent>"].join("");

    this._getTspAccount(requestBody, callback);
};

/**
 * Querys the WebEx server to determine if TSP is enabled for this account 
 * @param  {String} requestBody  request body to be passed to result
 * @param {AjxCallback}  callback   callback to be invoked after handling response
 */
WebExZimlet.prototype._getTspAccount = function(requestBody, callback) {
    var detailsBody = "<bodyContent xsi:type=\"java:com.webex.service.binding.user.GetUser\"><webExId>" + this._currentWebExAccount[WebExZimlet.PROP_USERNAME.propId] + "</webExId></bodyContent>";
    var detailsRequest = this.newWebExRequest(detailsBody);
    AjxRpc.invoke(detailsRequest, this.postUri(), {"Content-Type":"text/xml"},
            new AjxCallback(this, this._handleTspAccountEnabled, [requestBody, callback]), false, false); 
};

/**
 * parse GetUser response to determine if user has setup a TSP account for recording the call
 * @param {String} requestBody the WebEx request with TSP info
 * @param {AjxCallback} callback to be invoked after handling response
 * @param {object} result   the WebEx response
 */
WebExZimlet.prototype._handleTspAccountEnabled = function(requestBody, callback, result) {
    var tspEnabled = false;
    var accountIndex = 1;
    var objResult = this.xmlToObject(result);
    if (AjxUtil.get(objResult, "header", "response", "result") == "SUCCESS") {
        var resp = AjxUtil.get(objResult, "body", "bodyContent", "tspAccount", "tspAccount", "accountIndex");
        if (resp) {
            tspEnabled = true;
            accountIndex = parseInt(resp.toString());
        }
    }
    var callInType = tspEnabled ? "CALLIN" : "NONE";
    var accountIndexNode = tspEnabled ? "<tspAccountIndex>" + accountIndex + "</tspAccountIndex>" : "";
    requestBody = requestBody.replace("@callintype@", callInType);
    requestBody = requestBody.replace("@tspAccountIndex@", accountIndexNode);
    requestBody = requestBody.replace("@tspEnabled@", tspEnabled);
    requestBody = this.newWebExRequest(requestBody);
    AjxRpc.invoke(requestBody, this.postUri(), {"Content-Type":"text/xml"}, callback, false, false);
};

/**
 * Handles create or modify meeting response.
 *
 * @param {hash} params			a hash of parameters
 * @param {object} result		the WebEx response
 *
 * @see this._showDeleteWebExApptYesNoDlg
 */
WebExZimlet.prototype._createOrUpdateMeetingResponseHdlr = function(params, result) {
	var objResult = this.xmlToObject(result);
	if (!this._validateWebExResult(objResult, this.getMessage("WebExZimlet_unableToCreateOrModifyMeeting"))) {
		return;
	}

	var meetingKey;
	if (objResult.body.bodyContent.meetingkey) {
		meetingKey = objResult.body.bodyContent.meetingkey.toString();
	} else if (params.webExKeyData && params.webExKeyData.meetingKey) {//when people modify an existing webex appt..
		meetingKey = params.webExKeyData.meetingKey;
	}
	if (!meetingKey) {
		this.displayErrorMessage(this.getMessage("WebExZimlet_webExDidntReturnMeetingKey"), this.getMessage("WebExZimlet_webExError"));
		return;
	}
	var emails = params.emails;
	if(emails && (emails instanceof Array) && emails.length > 0) {
		//register attendees.
		var request = this._getCreateAttendeesRequest({emails: params.emails, meetingKey: meetingKey})
		var result = AjxRpc.invoke(request, this.postUri(), {"Content-Type":"text/xml"}, null, false, false);
		var objResult = this.xmlToObject(result);
		if (!this._validateWebExResult(objResult, this.getMessage("WebExZimlet_couldNotRegisterAttendees"))) {
			return;
		}
	}

	//get join meeting url..
	var requestBody = ["<bodyContent xsi:type=\"java:com.webex.service.binding.meeting.GetjoinurlMeeting\">",
		"<meetingKey>", meetingKey, "</meetingKey>","</bodyContent>"].join("");

	var request = this.newWebExRequest(requestBody);
	var result = AjxRpc.invoke(request, this.postUri(), {"Content-Type":"text/xml"}, null, false, false);
	var objResult = this.xmlToObject(result);
	if (!this._validateWebExResult(objResult, this.getMessage("WebExZimlet_couldNotGetJoinMeetingUrl"))) {
		return;
	}
	var joinMeetingUrl = objResult.body.bodyContent.joinMeetingURL.toString();
	params["joinMeetingUrl"] = joinMeetingUrl;
	params["meetingKey"] = meetingKey;
	this._params = params;
	this._appt = params.appt;
	this._updateMeetingBodyAndSave(params);
};

/**
 * Called by framework.
 */
WebExZimlet.prototype.onSaveApptSuccess = function(controller, calItem, result) {
	if (!this._params) {
		return;
	}
	var match = calItem.name.indexOf(this._appt.name);
	if (this._appt.name != calItem.name && (match == -1 || match > 0)) {
		return;
	}

	this._saveApptIdsHashToServer(result.apptId, this._params.meetingKey, this._params.seriesMeetingKey);
	this._params = null;//make sure to set this to null
};

/**
 * Appends meeting body and saves meeting.
 *
 * @param {hash} params		 a hash of parameters
 *
 * @see this._showDeleteWebExApptYesNoDlg
 */
WebExZimlet.prototype._updateMeetingBodyAndSave = function(params) {
	var composeView = params.apptComposeView;
	var editorType = "HTML";
	if (composeView.getComposeMode() != "text/html") {
		editorType = "PLAIN_TEXT";
	}
	var webexBodyStr = this._getWebExBodyString(params.joinMeetingUrl, editorType);

	var currentContent = composeView.getHtmlEditor().getContent();
	if (editorType == "HTML") {
		var lastIndx = currentContent.lastIndexOf("</body></html>");
		var tmp = currentContent.substr(0, lastIndx);
		var newContent = [tmp, webexBodyStr, "</body></html>"].join("");
	} else {
		var newContent = [currentContent, webexBodyStr].join("");
	}
	if (this._appendToSubjectOrLocation("SUBJECT")) {
		var additionalStr = this._getAddionalStringToAppend("SUBJECT");
		if (additionalStr != "") {
			var subjectField = composeView._apptEditView._subjectField;
			var newVal = [subjectField.getValue()," [", additionalStr,"]"].join("");
			subjectField.setValue(newVal);
		}
	}
	if (this._appendToSubjectOrLocation("LOCATION")) {
		var additionalStr = this._getAddionalStringToAppend("LOCATION");
		if (additionalStr != "") {
			var locationField = composeView._apptEditView._attInputField[ZmCalBaseItem.LOCATION];
			var newVal = [locationField.getValue()," [", additionalStr,"]"].join("");
			locationField.setValue(newVal);
		}
	}
	composeView.getHtmlEditor().setContent(newContent);
	//delay to avoid race condition b/w setting content and sending msg
	if(!params.dontSaveMeeting) {
		setTimeout(AjxCallback.simpleClosure(this._saveAppt, this, params.apptController), 500);
	} else {
		this._showModifyAlertDialog();
	}
};

WebExZimlet.prototype._showModifyAlertDialog = function() {
	if (!this._modifyAlertDlg) {
		this._modifyAlertDlg = new DwtMessageDialog({parent:this.getShell(), buttons:[DwtDialog.OK_BUTTON]});
		this._modifyAlertDlg.setMessage(this.getMessage("modifyAlertNotice"));
	}
	this._modifyAlertDlg.popup();
};

/**
 * Saves appointment
 * @param {ZmApptController} Appointment Controller
 */
WebExZimlet.prototype._saveAppt = function(apptController) {
	if(apptController._sendListener) {
		apptController._sendListener();
	} else if(apptController._saveListener) {
		apptController._saveListener();
	}
	appCtxt.getAppController().setStatusMsg(this.getMessage("WebExZimlet_successfullyCreatedWebEx"), ZmStatusView.LEVEL_INFO);
	this._showModifyAlertDialog();
};

/**
 * Returns true if we need to append metting info to Subject or location
 * @param {string} type LOCATION or SUBJECT
 * @returns <code>true</code> if we need to append metting info to Subject or location
 */
WebExZimlet.prototype._appendToSubjectOrLocation = function(type) {
	if (!this._webexZimletGeneralPreferences) {
		false;
	}
	for (var el in this._webexZimletGeneralPreferences) {
		if (this._webexZimletGeneralPreferences[el] == "BOTH" || this._webexZimletGeneralPreferences[el] == type) {
			return true;
		}
	}
	return false;
};

/**
 * Gets meeting informations string to be appended to location or subject.
 *
 * @param {string} type  LOCATION or SUBJECT
 */
WebExZimlet.prototype._getAddionalStringToAppend = function(type) {
	if (this._webexZimletGeneralPreferences == undefined) {
		return "";
	}
	var str = [];
	//	var currentType = this._webexZimletGeneralPreferences[WebExZimlet.PROP_APPEND_WEBEX_URL.propId];
	//	if (currentType == "BOTH" || currentType == type) {
	//		str.push([this.getMessage("WebExZimlet_webExUrl")," ", joinMeetingUrl].join(""));
	//	}

	var currentType = this._webexZimletGeneralPreferences[WebExZimlet.PROP_APPEND_WEBEX_MEETING_PWD.propId];
	var val = this._currentWebExAccount[WebExZimlet.PROP_MEETING_PASSWORD.propId];
	if ((val != "" && val != "N/A") && (currentType == "BOTH" || currentType == type)) {
		str.push([this.getMessage("WebExZimlet_meetingPwd")," ", val].join(""));
	}

	currentType = this._webexZimletGeneralPreferences[WebExZimlet.PROP_APPEND_TOLL_FREE_PHONE_NUMBER.propId];
	val = this._currentWebExAccount[WebExZimlet.PROP_TOLL_FREE_PHONE_NUMBER.propId];
	if ((val != "" && val != "N/A") && (currentType == "BOTH" || currentType == type)) {
		str.push([this.getMessage("WebExZimlet_tollFreeNumber")," ", val].join(""));
	}

	currentType = this._webexZimletGeneralPreferences[WebExZimlet.PROP_APPEND_TOLL_PHONE_NUMBER.propId];
	val = this._currentWebExAccount[WebExZimlet.PROP_TOLL_PHONE_NUMBER.propId];
	if ((val != "" && val != "N/A") && (currentType == "BOTH" || currentType == type)) {
		str.push([this.getMessage("WebExZimlet_tollNumber")," ", val].join(""));
	}

	currentType = this._webexZimletGeneralPreferences[WebExZimlet.PROP_APPEND_PHONE_PASSCODE.propId];
	val = this._currentWebExAccount[WebExZimlet.PROP_PHONE_PASSCODE.propId];
	if ((val != "" && val != "N/A") && (currentType == "BOTH" || currentType == type)) {
		str.push([this.getMessage("WebExZimlet_phonePasscode"), " ", val].join(""));
	}
	return str.join(", ");
};

/**
 * Gets the WebEx body string to append.
 *
 * @param {string} joinMeetingUrl		the WebEx join meeting url
 * @param {string} editorType  "HTML" | "PLAIN_TEXT" | "FIELD" (Field is for edit-fields)
 * @param {boolean} telephoneOnly		 if <code>true</code>, then only telephone information is returned
 * @param {boolean} noHeader		if <code>true</code>, then html for header is ignored
 */
WebExZimlet.prototype._getWebExBodyString = function(joinMeetingUrl, editorType, telephoneOnly, noHeader) {
	var html = [];
	html.push(noHeader ? "" : this._getMeetingDetailshdr(this.getMessage("WebExZimlet_teleconferenceDetails"), editorType));
	if (editorType == "HTML") {
		html.push("<table width='100%'><tr><td>");
		html.push("<div style='border-bottom:1px solid #6E6E6E; border-right:1px solid #6E6E6E; border-left:1px solid #CECECE;'>");
		html.push("<table width='100%' class='ZPropertySheet' cellspacing='6'>");
	}
	var isRowOdd = true;
	var hasTeleconfDetails = false;
	for (var i = 0; i < WebExZimlet.WEBEX_TELECONF_PROPS.length; i++) {
		var obj = WebExZimlet.WEBEX_TELECONF_PROPS[i];
		var val = this._currentWebExAccount[obj.propId];
		if(val == "" || val == "N/A") {
			continue;
		}
		if (i == WebExZimlet.WEBEX_TELECONF_PROPS.length - 1) {//dont add delimiter for last item
			html.push(this._getMeetingDetailsRow(this.getMessage(obj.label), val, editorType, true, isRowOdd));
		} else {
			html.push(this._getMeetingDetailsRow(this.getMessage(obj.label), val, editorType, false, isRowOdd));
		}
		isRowOdd = !isRowOdd;
		hasTeleconfDetails = true;
	}
	if (editorType == "HTML") {
		html.push("</table>");
		html.push("</div>");
		html.push("</td></tr></table>");
	}
	var telephoneStr = hasTeleconfDetails ? html.join("") : "";
	if (telephoneOnly) {
		return telephoneStr;
	}

	var pwd = this._currentWebExAccount[WebExZimlet.PROP_MEETING_PASSWORD.propId];
	if (pwd == "" || pwd == "N/A") {
		pwd = this.getMessage("WebExZimlet_passwordNotRequired");
	}
	var html = [];
	html.push(noHeader ? "" : this._getMeetingDetailshdr(this.getMessage("WebExZimlet_webExDetails"), editorType));
	if (editorType == "HTML") {
		html.push("<table width='100%'><tr><td>");
		html.push("<div style='border-bottom:1px solid #6E6E6E; border-right:1px solid #6E6E6E; border-left:1px solid #CECECE;'>");
		html.push("<table width='100%' class='ZPropertySheet' cellspacing='6'>");
	}
	html.push(this._getMeetingDetailsRow(this.getMessage("WebExZimlet_webExUrl"), joinMeetingUrl, editorType, false, true));
	html.push(this._getMeetingDetailsRow(this.getMessage("WebExZimlet_userName"), this.getMessage("WebExZimlet_enterYourName"), editorType, false, false));
	html.push(this._getMeetingDetailsRow(this.getMessage("WebExZimlet_email"), this.getMessage("WebExZimlet_enterYourEmail"), editorType, false, true));
	html.push(this._getMeetingDetailsRow(this.getMessage("WebExZimlet_meetingPwd"), pwd, editorType, true, false));
	if (editorType == "HTML") {
		html.push("</table>");
		html.push("</div>");
		html.push("</td></tr></table>");
	}
	var webExStr = html.join("");

	return  webExStr + telephoneStr;
};

/**
 * Gets meeting html row.
 *
 * @param {string} name		 the name/label of the item
 * @param {string} val		  the value string
 * @param {string} editorType	 the type of the editor
 * @param {boolean} noDelimiter	if <code>true</code>, delimiter is no appended
 * @param {boolean} isRowOdd	if <code>true</code>, colors the row
 */
WebExZimlet.prototype._getMeetingDetailsRow = function(name, val, editorType, noDelimiter, isRowOdd) {
	if (val == "" || val == "N/A") {//dont return empty rows
		return;
	}
	var txtSeperator = "";
	if (editorType == "PLAIN_TEXT") {
		txtSeperator = "\n";
	} else if (editorType == "FIELD") {//for location/subject/webex OTHER field
		txtSeperator = " | ";
	}
	if (editorType == "HTML") {
		val = val.replace(/\n/g, "<br/>");//make sure to replace newLine to br
		var rStyle = " style='background-color:" + (isRowOdd ? "#FEFDFC" : "#FBF9F4") + ";' ";
		return ["<tr ",rStyle,"><td width='20%'><b>",name,"</b> </td><td> ", val, "</td></tr>"].join("");
	} else {
		if (noDelimiter) {
			return [name, val].join("");
		} else {
			val = val.replace(/\n/g, txtSeperator);//for other-phones, you get bunch of phones with /n
			return [name, " ",val, txtSeperator].join("");
		}
	}
};
/**
 * Gets meeting  section header
 *
 * @param {string} hdrName	 the name of the section header
 * @param {string} editorType	the editor type
 */
WebExZimlet.prototype._getMeetingDetailshdr = function(hdrName, editorType) {
	if (editorType == "HTML") {
		return	["<div class='webExZimlet_hdr' style='margin-top:1em;'>", hdrName, "</div>"].join("");
	} else {
		return	["\n--------------------------------------------------------------------",
			,"\n", hdrName,
			"\n--------------------------------------------------------------------\n"].join("");
	}
};

/**
 * Formats the date.
 *
 * @param	{Date}	d		the date
 * @return	{string}	the formatted date
 */
WebExZimlet.prototype._formatDate = function(d) {
	d.setMinutes((Math.ceil(d.getMinutes() / 15) * 15) % 60);
	d.setSeconds(0);
	d.setMilliseconds(0);

	var formatter = new AjxDateFormat("MM/dd/yyyy HH:mm:ss");
	return formatter.format(d);
};

/**
 * The uri to post all webex xml requests to.
 *
 * @param	{hash}	securityParams		a hash of parameters
 *
 * @return	{string}	the resulting uri
 */
WebExZimlet.prototype.postUri = function(securityParams) {
	var companyId = securityParams ? securityParams.companyId : this._currentWebExAccount[WebExZimlet.PROP_COMPANY_ID.propId];
	//return this.getResource("httpPost.jsp")+"?companyId="+companyId;

	return ZmZimletBase.PROXY +
		   AjxStringUtil.urlComponentEncode(["https://", companyId, ".webex.com/WBXService/XMLService"].join(""));
};

/**
 * Asks user to right-click for more option.
 *
 */
WebExZimlet.prototype.singleClicked = function() {
	this._displayGeneralPrefsDlg();
};

/**
 * Calls singleClicked when doubleClicked on panel item.
 *
 */
WebExZimlet.prototype.doubleClicked = function() {
	this.singleClicked();
};

/**
 * Called by the Zimbra framework when a menu item is selected
 * dispatch the call, ensuring the webex configuration is set.
 *
 */
WebExZimlet.prototype.menuItemSelected = function(itemId) {
	switch (itemId) {
		case "ACCOUNT_PREFERENCES":
			this._displayAccntPrefsDialog();
			break;
		case "GENERAL_PREFERENCES":
			this._displayGeneralPrefsDlg();
			break;
		case "START_JOIN_MEETING":
			//var postCallback = new AjxCallback(this, this._showAppointmentsList);
			//this._showSelectAccountDlg({postCallback:postCallback, appt:null, showOptions:false});
			//So, it's calling _showSelectAccointDlg first, then that calls _showAppointmentsList.  I need to add select-account into appojntmentslist.  Tricky.
			this._showAppointmentsList();
			break;
		case "START_QUICK_MEETING":
			this._showOneClickDlg();
			break;
	}
};

/**
 * Convert the xml response to a javascript object.
 *
 * @param	{object}	result		the result
 * @return {hash}	a js object
 */
WebExZimlet.prototype.xmlToObject = function(result) {
	var xd = null;
	try {
		var xd1 = null;
		if (result.xml && result.xml.childNodes.length > 0) {
			xd1 = new AjxXmlDoc.createFromDom(result.xml);
		} else {
			xd1 = new AjxXmlDoc.createFromXml(result.text);
		}
		xd = xd1.toJSObject(true, false);
	} catch(ex) {
		this.displayErrorMessage(this.getMessage("WebExZimlet_errorInWebExXml"), result.text, this.getMessage("WebExZimlet_webExError"));
		return null;
	}

	//for some reason in ff, it doesn't throw an exception
	if (result.text && result.text.length > 5 && result.text.substring(0, 6).toLowerCase() == "<html>") {
		xd = null;
		this.displayErrorMessage(this.getMessage("WebExZimlet_errorInWebExXml"), result.text, this.getMessage("WebExZimlet_webExError"));
	}

	return xd;
};

/**
 * Return an AjxXmlDoc containing the webex request with the given body
 * appends the security context header.
 *
 */
WebExZimlet.prototype.newWebExRequest = function(requestBody, securityParams) {
	return ["<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
		"<serv:message xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" ",
		"xmlns:serv=\"http://www.webex.com/schemas/2002/06/service\" " ,
		"xmlns:schemaLocation=\"http://www.webex.com/schemas/2002/06/service http://www.webex.com/schemas/2002/06/service/service.xsd\">",
		"<header>" , this.newSecurityContext(securityParams) , "</header>",
		"<body>" , requestBody , "</body>" ,
		"</serv:message>"].join("");
};

/**
 * Returns a string containing the xml for the security context header.
 *
 * @params {hash} securityParams	a hash of parameters with login information
 * @params {string} securityParams.name	the WebEx username
 * @params {string} securityParams.pwd	the WebEx password
 * @params {string} securityParams.companyId	the WebEx company Id
 */
WebExZimlet.prototype.newSecurityContext = function(securityParams) {
	var name = securityParams ? securityParams.hostName : this._currentWebExAccount[WebExZimlet.PROP_USERNAME.propId];
	var pwd = securityParams ? securityParams.hostPwd : this._currentWebExAccount[WebExZimlet.PROP_PASSWORD.propId];
	var companyId = securityParams ? securityParams.companyId : this._currentWebExAccount[WebExZimlet.PROP_COMPANY_ID.propId];

	return ["<securityContext>",
		"<webExID>", name, "</webExID>",
		"<password>", AjxStringUtil.htmlEncode(pwd), "</password>",
		"<siteName>", companyId, "</siteName>",
		"</securityContext>"].join("");
};

/**
 * Returns a string containing companyId
 *
 * @params {hash} securityParams	a hash of parameters with login information
 * @params {string} securityParams.name	the WebEx username
 * @params {string} securityParams.pwd	the WebEx password
 * @params {string} securityParams.companyId	the WebEx company Id
 */
WebExZimlet.prototype.getCompanyId = function(securityParams) {
	return securityParams ? securityParams.companyId : this._currentWebExAccount[WebExZimlet.PROP_COMPANY_ID.propId];

};


/**
 * Displays Account preferences dialog.
 */
WebExZimlet.prototype._displayAccntPrefsDialog =
function() {
	if (this.accPrefsDlg) {
		this.accPrefsDlg.popup();
		this._addAccntPrefsTabControl();
		return;
	}
	this._accPrefsDlgView = new DwtComposite(this.getShell());
	this._accPrefsDlgView.setSize("560", "400");
	//this._accPrefsDlgView.getHtmlElement().style.background = "white";
	this._accPrefsDlgView.getHtmlElement().style.overflow = "auto";
	
	/*tabs*************/
	//This is about where the tab stuff is going to have to go...
	//Add the tab-bar
	//add 5 DwtComposites?  For the individual account panels.
	this._addPrefsDlgViewTabView = new DwtTabView({parent: this._accPrefsDlgView, id: "webExZimlet_accountTabView", posStyle: Dwt.STATIC_STYLE});
	this._addPrefsDlgViewTabView.setSize("560", "420"); //Good - this fixes the resizing-on-tab-change bug.
	
	
	this._addressPrefsViewPage = [];
	this._accntPrefsHelpObjsHash = [];
	this._tabKeys = [];
	for (var ii = 1; ii < 6; ii++) {
		this._addressPrefsViewPage[ii] = new DwtTabViewPage(this._addPrefsDlgViewTabView, "", Dwt.STATIC_STYLE, "WebExZimlet_addressPage" + ii);
		this._addressPrefsViewPage[ii].getHtmlElement().innerHTML = this._createAccPrefsView(ii);
		this._tabKeys[ii] = this._addPrefsDlgViewTabView.addTab("webExZimletTab" + ii, this._addressPrefsViewPage[ii]);
	}
	this.accPrefsDlg = new ZmDialog({parent: this.getShell(), title: this.getMessage("WebExZimlet_manageAccounts"),
		view: this._accPrefsDlgView, standardButtons: [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON],
		extraButtons: [new DwtDialog_ButtonDescriptor("webex_zimlet_add_tab_button", this.getMessage("WebExZimlet_addAccount"), DwtDialog.ALIGN_LEFT, new AjxCallback(this, this._addAccountTab))]});
	this.accPrefsDlg.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._accPrefsOkBtnListner));
	this._addTestAccountButtons();
	this._addHelpLinkListeners();
	var postCallback = new AjxCallback(this, this._setDataToAccPrefsDlg);
	this._getAccPrefsMetaData(postCallback);
};

/**
 * Adds tab control for Account Preferences' fields
 */
WebExZimlet.prototype._addAccntPrefsTabControl =
function() {
	this.accPrefsDlg._tabGroup.removeAllMembers();
	for (var i = 0; i < this._accntPrefsObjsHash.length; i++) {
		var obj = document.getElementById(this._accntPrefsObjsHash[i]);
		if (obj) {
			this.accPrefsDlg._tabGroup.addMember(obj);
		}
	}
	document.getElementById(this._accntPrefsObjsHash[0]).focus();
};

/**
 * Adds listeners to "help" links
 */
WebExZimlet.prototype._addHelpLinkListeners =
function() {
	for(var i =0; i < this._accntPrefsHelpObjsHash.length; i++) {
		var obj = this._accntPrefsHelpObjsHash[i];
		document.getElementById(obj.helpLinkId).onclick = AjxCallback.simpleClosure(this._accPrefsShowHelpdialog, this, obj.propId);
	}
};

/**
 * Shows a message dialog with help
 */
WebExZimlet.prototype._accPrefsShowHelpdialog =
function(propId) {
	var msg = "";
	if(propId == WebExZimlet.PROP_ALT_HOSTS.propId) {
		var msg = this.getMessage("WebExZimlet_setupAlternateHost");
	} else if(propId == WebExZimlet.PROP_COMPANY_ID.propId) {
		var msg = this.getMessage("WebExZimlet_companyIdExample");
	}
	var dlg = appCtxt.getMsgDialog();
	dlg.reset();//reset dialog since we could be using it
	dlg.setMessage(msg, DwtMessageDialog.INFO_STYLE);
	dlg.popup();
};

/**
 * Adds test WebEx account buttons.
 * Also add 'add phone settings' button
 */
WebExZimlet.prototype._addTestAccountButtons = function() {
	for (var i = 1; i < 6; i++) {
		var btn = new DwtButton({parent:this.getShell()});
		btn.setText(AjxMessageFormat.format(this.getMessage("WebExZimlet_validateWebExAccntNumber"),i));
		btn.setImage("WEBEX-panelIcon");
		btn.addSelectionListener(new AjxListener(this, this._testWebExAccount, [i]));
		document.getElementById("webExZimlet_TestAccountBtn" + i).appendChild(btn.getHtmlElement());
		
		//And the phone settings button -- RBAIN
		//btn = new DwtButton({parent:this.getShell()});
		//AjxMessageFormat.format(this.getMessage("WebExZimlet_addTeleConfSettings"),i));
		//btn.setImage("WEBEX-panelIcon");
		//btn.addSelectionListener(new AjxListener(this, this._showPhoneSettings, [i]));
		//document.getElementById("webExZimlet_ShowPhoneBtn" + i).appendChild(btn.getHtmlElement());
	}
};

/**
 * Gets Account preferences meta data.[dela
 *
 * @param {AjxCallback} postCallback  a callback
 */
WebExZimlet.prototype._getAccPrefsMetaData = function(postCallback) {
	setTimeout(AjxCallback.simpleClosure(this._doGetAccPrefsMetaData, this, postCallback), 500);
};

/**
 * @private Called by _getAccPrefsMetaData after .5 secs to avoid race condition in some browsers
 */
WebExZimlet.prototype._doGetAccPrefsMetaData = function(postCallback) {
	this.metaData.get("webexZimletAccountPreferences", null, new AjxCallback(this, this._handleGetAccPrefsMetaData, postCallback));
};

/**
 * Handles Account preferences metadata callback.
 *
 * @param {AjxCallback} postCallback  a callback
 * @param {object} result	 the response
 */
WebExZimlet.prototype._handleGetAccPrefsMetaData = function(postCallback, result) {
	this._webexZimletAccountPreferences = null; //nullify old data
	try {
		this._webexZimletAccountPreferences = result.getResponse().BatchResponse.GetMailboxMetadataResponse[0].meta[0]._attrs;
		if (postCallback) {
			postCallback.run(this);
		} else {
			return this._webexZimletAccountPreferences;
		}
	} catch(ex) {
		this._showErrorMessage(ex);
	}
};

/**
 * Sets current account information based on associated calendar.
 *
 * @param {string} id Calendar id
 */
WebExZimlet.prototype._setCurrentAccntInfoFromCalendar = function(id) {
	var accntNumber = this._getAccountNumberFromFolderId(id);
	this._currentWebExAccount = [];
	for (var i = 0; i < WebExZimlet.ALL_ACCNT_PROPS.length; i++) {
		var prop = WebExZimlet.ALL_ACCNT_PROPS[i].propId;
		this._currentWebExAccount[prop] = this._webexZimletAccountPreferences[prop + accntNumber];
	}
	this._currentWebExAccountNumber = accntNumber;
	this._validateCurrentAccount(accntNumber);
};

/**
 * Gets the account number based on associated calendar.
 *
 * @param {string} id Calendar id
 * @param {int} Account number
 */
WebExZimlet.prototype._getAccountNumberFromFolderId = function(id) {
	this._isAtLeastOneAccountConfigured();
	var accntNumber = 1;
	for (var i = 1; i < 6; i++) {
		if (this._webexZimletAccountPreferences[WebExZimlet.PROP_ASSOCIATED_CALENDAR.propId + i] == id) {
			accntNumber = i;
			break;
		}
	}
	return accntNumber;
};

/**
 * Checks if at least one Account is configured
 *
 * @return {AjxException} If none, it throws exception
 */
WebExZimlet.prototype._isAtLeastOneAccountConfigured = function() {
	if(this._webexZimletAccountPreferences == undefined) {
		throw new AjxException(this.getMessage("WebExZimlet_noWebExAccount"), AjxException.INTERNAL_ERROR, this.getMessage("WebExZimlet_label"));
	}
	for(var i = 1; i < 6; i++) {
		if(this._isAccountConfigured(i)) {
			return true;
		}
	}
	throw new AjxException(this.getMessage("WebExZimlet_noWebExAccount"), AjxException.INTERNAL_ERROR, this.getMessage("WebExZimlet_label"));
};

/**
 * Checks if at least one Account is configured
 * @param {number} index  Account index. Starts from 1
 * @return {boolean} <code>true</code> if configured
 */
WebExZimlet.prototype._isAccountConfigured = function(index) {
	if(!this._webexZimletAccountPreferences) {
		return false;
	}
	if(this._webexZimletAccountPreferences[WebExZimlet.PROP_USERNAME.propId + index] != "" &&
			this._webexZimletAccountPreferences[WebExZimlet.PROP_USERNAME.propId + index] != "N/A"
			&& this._webexZimletAccountPreferences[WebExZimlet.PROP_PASSWORD.propId + index] != "" &&
			this._webexZimletAccountPreferences[WebExZimlet.PROP_PASSWORD.propId + index] != "N/A"
			&& this._webexZimletAccountPreferences[WebExZimlet.PROP_COMPANY_ID.propId + index] != "" &&
			this._webexZimletAccountPreferences[WebExZimlet.PROP_COMPANY_ID.propId + index] != "N/A") {
			return true;
	}
	return false;
};

/**
 * Sets an account active based on account number.
 *
 * @param {number} accntNumber	the account number
 */
WebExZimlet.prototype._setCurrentAccntInfoFromAccntNumber = function(accntNumber) {
	this._isAtLeastOneAccountConfigured();
	this._currentWebExAccount = [];
	for (var i = 0; i < WebExZimlet.ALL_ACCNT_PROPS.length; i++) {
		var prop = WebExZimlet.ALL_ACCNT_PROPS[i].propId;
		this._currentWebExAccount[prop] = this._webexZimletAccountPreferences[prop + accntNumber];
	}
	this._validateCurrentAccount(accntNumber);
	this._currentWebExAccountNumber = accntNumber;
};

/**
 * validates current account.
 *
 * @param {number} accntNumber	the account number
 */
WebExZimlet.prototype._validateCurrentAccount = function(accntNumber) {
	var userName = this._currentWebExAccount[WebExZimlet.PROP_USERNAME.propId];
	var pwd = this._currentWebExAccount[WebExZimlet.PROP_PASSWORD.propId];
	var cId = this._currentWebExAccount[WebExZimlet.PROP_COMPANY_ID.propId];
	if (userName == "" || userName == "N/A" || pwd == "" || pwd == "N/A" || cId == "" || cId == "N/A") {
		var label = this.getMessage("WebExZimlet_accountNumberNotSetup").replace("{0}", accntNumber);
		throw new AjxException(label, AjxException.INTERNAL_ERROR, "_validateCurrentAccount");
	}
};

/**
 * Sets data to account preferences.
 * Loads data into the form.
 */
WebExZimlet.prototype._setDataToAccPrefsDlg = function() {
	try {
		var tabBar = this._addPrefsDlgViewTabView.getTabBar();
		var tabs = tabBar.getItems(); //array of tab buttons.  (5 of them)

		for (var indx = 1; indx < 6; indx++) {
			var useDefaultVals = true;
			if (this._isAccountConfigured(indx)) {
				useDefaultVals = false;
			}
			for (var i = 0; i < WebExZimlet.ALL_ACCNT_PROPS.length; i++) {
				var objId = WebExZimlet.ALL_ACCNT_PROPS[i].propId;
				var key = objId + indx;

				var val;
				if (useDefaultVals) {
					val = WebExZimlet.ALL_ACCNT_PROPS[i].defaultVal;
				}
				else {
					val = this._webexZimletAccountPreferences[key];
				}
				
				if (objId === WebExZimlet.PROP_ACCOUNTNAME.propId) {
					tabs[indx - 1].setText(val);
				}				
				
				if (val === "N/A" || val === "" || val === undefined || val === "undefined") {
					continue;
				}
				if (objId.indexOf(WebExZimlet.PROP_ASSOCIATED_CALENDAR.propId) === -1) {
					document.getElementById(key).value = val;
				}
				else {
					this._setMenuValue(key, val);
				}
				
			}
			this.hideOrShowTab(indx, true);
		}
		//if there's NO visible tabs, set the first tab to be visible & focussed.
		/*
		if (!anyTabsVisible) {
			tabs[0].setVisibility(true);
		}
		*/
		this.accPrefsDlg.popup();
		this._addAccntPrefsTabControl();
		
			/*
			//set tab visibility.  
			//If any of these are filled in, display it.
			if(this._webexZimletAccountPreferences[WebExZimlet.PROP_USERNAME.propId + indx] != "" &&
				this._webexZimletAccountPreferences[WebExZimlet.PROP_USERNAME.propId + indx] != "N/A"
				&& this._webexZimletAccountPreferences[WebExZimlet.PROP_PASSWORD.propId + indx] != "" &&
				this._webexZimletAccountPreferences[WebExZimlet.PROP_PASSWORD.propId + indx] != "N/A" &&
				this._webexZimletAccountPreferences[WebExZimlet.PROP_MEETING_PASSWORD.propId + indx] != "" &&
				this._webexZimletAccountPreferences[WebExZimlet.PROP_MEETING_PASSWORD.propId + indx] != "N/A" &&
				this._webexZimletAccountPreferences[WebExZimlet.PROP_ALT_HOSTS.propId + indx] != "" &&
				this._webexZimletAccountPreferences[WebExZimlet.PROP_ALT_HOSTS.propId + indx] != "N/A"
			) {	
				tabs[indx - 1].setVisibility(true);  
				anyTabsVisible = true;
			} else {
				tabs[indx - 1].setVisibility(false);  
			}
			*/
		
	}
	catch(ex) {
		this._showErrorMessage(ex);
	}
	
};

/**
 * Sets html select value.
 *
 * @param {string} menuId Menu id
 * @param {string} val Menu value to match and select
 */
WebExZimlet.prototype._setMenuValue =
function(menuId, val) {
	var optn = document.getElementById(menuId).options;
	for (var i = 0; i < optn.length; i++) {
		if (optn[i].value == val) {
			optn[i].selected = true;
			break;
		}
	}
};

/**
 * Creates Account preferences view
 */
WebExZimlet.prototype._createAccPrefsView = function(tabIndex) {
	this._accntPrefsObjsHash = [];

	var html = [];
	if (!AjxEnv.isIE) {//w/o this, stupid IE will break
		html.push("<table width='100%'><tr><td>");
	}
	var indx = tabIndex;
	//for (var indx = 1; indx < 6; indx++) {
		var notes = indx === 1 ? this.getMessage("WebExZimlet_account1UsedAsDefaultForUnAssociatedCal") : "";
		html.push(this._getAccountPrefsHtml(indx, notes));
	//}
	if (!AjxEnv.isIE) {//w/o this, stupid IE will break
		html.push("</td></tr></table>");
	}
	return html.join("");
};

/**
 * Get account preferences dialog html.
 *
 * @param {string} indx	  the account number
 * @param {string} notes	 the string with some additional notes
 */
 //This is where the tab-form gets set up.
 
WebExZimlet.prototype._getAccountPrefsHtml = function(indx, notes) {
	var html = [];
	var j = 0;
	var prefLabel = this.getMessage("WebExZimlet_accountNumber").replace("{0}", indx);
	html.push("<div class='webExZimlet_background'>");
	//html.push("<div class='webExZimlet_acctHdr'>", prefLabel, "</div>")
	html.push("<div class='webExZimlet_subHdr'>", this.getMessage("WebExZimlet_accountSettings"), "</div>");

	html.push("<table class='webExZimlet_table ZPropertySheet' cellspacing='6' width='100%'>");
	//Put accountname stuff here. - RBAIN
	html.push("<tr><td class='ZmFieldLabelRight'>", this.getMessage(WebExZimlet.PROP_ACCOUNTNAME.label),
		"</td><td><input id='", WebExZimlet.PROP_ACCOUNTNAME.propId + indx, "' type='text' onkeyup='webex_zimlet_update_tab(" , indx, ")' />",
		"&nbsp; <a href='javascript:void(0)' id='", Dwt.getNextId(), "' style='color:red;font-weight:bold;' onclick='webExZimletInstance.deleteTab(",indx, ")'>",
		this.getMessage("WebExZimlet_delete") + "","</a></td></tr>");
		
	for (var i = 0; i < WebExZimlet.SINGLE_WEBEX_ACCNT_PROPS.length; i++) {
		var obj = WebExZimlet.SINGLE_WEBEX_ACCNT_PROPS[i];
		var type = obj.objType ? obj.objType : "text";
		var id = [obj.propId , indx].join("");
		this._accntPrefsObjsHash.push(id);
		if (obj.propId == WebExZimlet.PROP_COMPANY_ID.propId ||  obj.propId == WebExZimlet.PROP_ALT_HOSTS.propId) {
			var helpLinkId = Dwt.getNextId();
			this._accntPrefsHelpObjsHash.push({helpLinkId:helpLinkId, propId:obj.propId});
			html.push("<tr><td class='ZmFieldLabelRight' width='30%'><label>", this.getMessage(obj.label), "</label></td>",
				"<td><input id='", id, "'  type='", type, "'/>",
				"&nbsp; <a href='javascript:void(0)' id='",helpLinkId,"'>",this.getMessage("WebExZimlet_help"),"</a></td></tr>");
		} else {
			html.push("<tr><td class='ZmFieldLabelRight' width='30%'><label>", this.getMessage(obj.label), "</label></td>",
				"<td><input id='", id, "'  type='", type, "'/>",
				"&nbsp; <label style='color:gray;'>", this.getMessage(obj.extraLabel), "</label></td></tr>");
		}
	}
	//setting property for selecting associated calendar
	var obj = WebExZimlet.PROP_ASSOCIATED_CALENDAR;
	html.push("<tr><td class='ZmFieldLabelRight' width='30%'>", this.getMessage(obj.label),
		"</td><td><label style='color:gray;'>", this._getCalendarFoldersList(indx), "&nbsp; <label style='color:gray;'>", this.getMessage(obj.extraLabel),
		"</label></td></tr>");

	//buttons to verify account and show phone settings
	html.push("<tr><td width='30%'></td><td><table class='ZPropertySheet' cellspacing='6'><tr>",
		"<td id='webExZimlet_TestAccountBtn", indx, "' ></td>",
		"<td><a href='javascript:void(0)' id='", Dwt.getNextId(), "' onclick='webExZimletInstance._showPhoneSettings(",indx, ")'>",
		this.getMessage("WebExZimlet_addTeleConfSettings"), "</a></td></tr></table></td></tr></table>");
	
	//everything from this point on down needs to be hidden by default.
	html.push("<br/><div id='webex_zimlet_phone_info", indx, "'><div class='webExZimlet_subHdr'>",
		"<table width='100%'><tr><td style='font-weight:bold;'>", this.getMessage("WebExZimlet_teleConfSettings"),
		"</td><td style='text-align:right'><a href='javascript:void(0)' id='", Dwt.getNextId(),
		"' onclick='webExZimletInstance._hidePhoneSettings(",indx, ")'>",
		this.getMessage("WebExZimlet_removeTeleConfSettings"), "</a></td></tr></table></div>");
	html.push("<table class='webExZimlet_table ZPropertySheet' cellspacing='6' width='100%'>");
	for (var i = 0; i < WebExZimlet.WEBEX_TELECONF_PROPS.length; i++) {
		var obj = WebExZimlet.WEBEX_TELECONF_PROPS[i];
		var id = [obj.propId , indx].join("");
		this._accntPrefsObjsHash.push(id);
		if (obj.propId != WebExZimlet.PROP_OTHER_PHONE_NUMBERS.propId) {
			html.push("<tr><td class='ZmFieldLabelRight' width='30%'>", this.getMessage(obj.label), "</td>",
					"<td><input id='", id, "' type='text'/>",
					"&nbsp; <label style='color:gray;'>", this.getMessage(obj.extraLabel), "</label></td></tr>");
		} else {
			html.push("<tr><td class='ZmFieldLabelRight' width='30%'>", this.getMessage(obj.label), "</td>",
					"<td><textarea id='", id, "' rows='5' cols='20'></textarea>",
					"&nbsp; <label style='color:gray;'>", this.getMessage(obj.extraLabel), "</label></td></tr>");
		}
	}
	html.push("</table>");

	return html.join("");
};

/**
 * Tests Webex account
 *
 * @param {number} indx	the account number
 */
WebExZimlet.prototype._testWebExAccount = function(indx) {
	var userName = document.getElementById(WebExZimlet.PROP_USERNAME.propId + indx).value;
	var pwd = document.getElementById(WebExZimlet.PROP_PASSWORD.propId + indx).value;
	var cId = document.getElementById(WebExZimlet.PROP_COMPANY_ID.propId + indx).value;
	var params = {hostName: userName, hostPwd:pwd,  companyId: cId};
	if (userName.length === 0 || pwd.length === 0 || cId.length === 0) {
		appCtxt.getAppController().setStatusMsg(this.getMessage("WebExZimlet_userPwdCIdRequired"), ZmStatusView.LEVEL_WARNING);
		return;
	}
	appCtxt.getAppController().setStatusMsg(this.getMessage("WebExZimlet_pleaseWait"), ZmStatusView.LEVEL_INFO);

	var requestBody = "<bodyContent xsi:type=\"java:com.webex.service.binding.user.GetUser\"><webExId>" + userName + "</webExId></bodyContent>";
	var request = this.newWebExRequest(requestBody, params);
	var result = AjxRpc.invoke(request, this.postUri(params), {"Content-Type":"text/xml"}, new AjxCallback(this, this._handleTestWebExAccount), false, false);
};

WebExZimlet.prototype._handleTestWebExAccount =
function(result) {
	var objResult = this.xmlToObject(result);
	if (!this._validateWebExResult(objResult, this.getMessage("WebExZimlet_testFailed"))) {
		return;
	}

	var dlg = appCtxt.getMsgDialog();
	dlg.reset();//reset dialog since we could be using it
	dlg.setTitle(this.getMessage("WebExZimlet_testSucceeded"));
	dlg.setMessage(this.getMessage("WebExZimlet_testPassed"), DwtMessageDialog.INFO_STYLE, this.getMessage("WebExZimlet_testSucceeded"));
	dlg.popup();
};

/**
 * Listener to Account Preferences dialog.
 */
WebExZimlet.prototype._accPrefsOkBtnListner =
function() {
	var keyValArray = [];
	for (var indx = 1; indx < 6; indx++) {
		for (var i = 0; i < WebExZimlet.ALL_ACCNT_PROPS.length; i++) {
			var key = WebExZimlet.ALL_ACCNT_PROPS[i].propId + indx;
			var val = document.getElementById(key).value;
			val = val == "" ? "N/A" : val;
			keyValArray[key] = val;
		}
	}
	this.metaData.set("webexZimletAccountPreferences", keyValArray, null, new AjxCallback(this, this._saveAccPrefsHandler), null, true);
};

/**
 * Saves Account preferences.
 */
WebExZimlet.prototype._saveAccPrefsHandler =
function() {
	this._webexZimletAccountPreferences = null;//nullify
	appCtxt.getAppController().setStatusMsg(this.getMessage("WebExZimlet_PrefSaved"), ZmStatusView.LEVEL_INFO);
	this.accPrefsDlg.popdown();
};

/**
 * Gets html-select containing all calendars.
 *
 * @param {number} idNumber	the account number
 * @return {string} Html-Select
 */
WebExZimlet.prototype._getCalendarFoldersList =
function(idNumber) {
	var id = [WebExZimlet.PROP_ASSOCIATED_CALENDAR.propId,idNumber].join("");
	this._accntPrefsObjsHash.push(id);
	var j = 0;
	var html = new Array();

	html[j++] = ["<SELECT id='",id,"'>"].join("");
	html[j++] = this._getCalendarsOptionsHtml();
	html[j++] = "</SELECT>";
	return html.join("");
};

/**
 * Gets Calendar appointment html.
 *
 * @return {string}	the calendar options html
 */
WebExZimlet.prototype._getCalendarsOptionsHtml =
function() {
	if (this._calendarOptionsHtml) {
		return this._calendarOptionsHtml;
	}
	var j = 0;
	var html = new Array();

	var soapDoc = AjxSoapDoc.create("GetFolderRequest", "urn:zimbraMail");
	var folderNode = soapDoc.set("folder");
	folderNode.setAttribute("l", appCtxt.getFolderTree().root.id);

	var command = new ZmCsfeCommand();
	var top = command.invoke({soapDoc: soapDoc,  noAuthToken: true}).Body.GetFolderResponse.folder[0];
	var arry1 = top.folder ? top.folder : [];
	var arry2 = top.link ? top.link : [];
	var folders = arry1.concat(arry2);
	if (folders) {
		html[j++] = ["<option value='ALL'>",this.getMessage("WebExZimlet_allCalendars"),"</option>"].join("");
		for (var i = 0; i < folders.length; i++) {
			var f = folders[i];
			if (f && f.view == "appointment") {
				var id = f.id;
				if(f.zid && f.rid) {
					id = [f.zid,":",f.rid].join("");
				}
				html[j++] = ["<option value='", id,"'>", AjxStringUtil.htmlEncode(f.name) , "</option>"].join("");

			}
		}
	}
	this._calendarOptionsHtml = html.join("");
	return this._calendarOptionsHtml;
};

/**
 * Display general preferences dialog.
 *
 */
WebExZimlet.prototype._displayGeneralPrefsDlg =
function() {
	if (this.generalPrefsDlg) {
		this.generalPrefsDlg.popup();
		return;
	}
	var view = new DwtComposite(this.getShell());
	view.getHtmlElement().style.overflow = "auto";
	view.getHtmlElement().innerHTML = this._createGeneralPrefsView();
	//this.pView.setSize("510", "350");
	//this.pView.getHtmlElement().style.background = "white";
	this.generalPrefsDlg = new ZmDialog({parent: this.getShell(), title:this.getMessage("WebExZimlet_preferences"), view:view, standardButtons:[DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON]});
	this.generalPrefsDlg.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._generalPrefsOkBtnListner));
	var postCallback = new AjxCallback(this, this._setDataToGeneralPrefsDlg);
	this._getGeneralPrefsMetaData(postCallback);
};

/**
 * Gets General metadata.
 *
 * @param {AjxCallback} postCallback A callback
 */
WebExZimlet.prototype._getGeneralPrefsMetaData =
function(postCallback) {
	this.metaData.get("webexZimletGeneralPreferences", null, new AjxCallback(this, this._handleGetGeneralPrefsMetaData, postCallback));
};

/**
 * Sets default general preferences.
 */
WebExZimlet.prototype._setDefaultGeneralPreferences = function() {
	this._webexZimletGeneralPreferences = {};
	for (var i = 0; i < WebExZimlet.ALL_GENERAL_PROPS.length; i++) {
		var obj = WebExZimlet.ALL_GENERAL_PROPS[i];
		this._webexZimletGeneralPreferences[obj.propId] = obj.defaultVal;
	}
};

/**
 * Handles getMetadata response for general preferences.
 *
 * @param {AjxCallback} postCallback A Callback
 * @param {object} result	 a response
 */
WebExZimlet.prototype._handleGetGeneralPrefsMetaData =
function(postCallback, result) {
	try {
		this._webexZimletGeneralPreferences = null;//nullify
		var response = result.getResponse().BatchResponse.GetMailboxMetadataResponse[0];
		if (response.meta && response.meta[0]) {
			this._webexZimletGeneralPreferences = response.meta[0]._attrs;
		}
		if (this._webexZimletGeneralPreferences == undefined) {
			this._setDefaultGeneralPreferences();
		}
		if (postCallback) {
			postCallback.run(this);
		} else {
			return this._webexZimletGeneralPreferences;
		}
	} catch(ex) {
		this._showErrorMessage(ex);
		return;
	}
};

/**
 * Sets default data to general preferences dialog.
 *
 */
WebExZimlet.prototype._setDataToGeneralPrefsDlg =
function() {
	try {
		var useDefaultVals = false;
		if (this._webexZimletGeneralPreferences == undefined) {
			var useDefaultVals = true;
		}
		for (var i = 0; i < WebExZimlet.ALL_GENERAL_PROPS.length; i++) {
			var key = WebExZimlet.ALL_GENERAL_PROPS[i].propId;
			var val;
			if (useDefaultVals) {
				val = WebExZimlet.ALL_GENERAL_PROPS[i].defaultVal;
			} else {
				val = this._webexZimletGeneralPreferences[key];
			}
			if (val == "N/A") {
				continue;
			}
			var optn = document.getElementById(key).options;
			for (var n = 0; n < optn.length; n++) {
				if (optn[n].value == val || optn[n].text == val) {
					optn[n].selected = true;
					break;
				}
			}
			//} else if (val == "true") {
			//	document.getElementById(key).checked = true;
			//}
		}

		this.generalPrefsDlg.popup();
	} catch(ex) {
		this._showErrorMessage(ex);
	}
};

/**
 * Creates Zimlets Preferences view.
 *
 * @returns {string} html
 */
WebExZimlet.prototype._createGeneralPrefsView =
function() {
	var html = [];
	html.push("<div class='webExZimlet_background '>");
	html.push("<div class='webExZimlet_subHdr'>", this.getMessage("WebExZimlet_appendMeetingInfoToSubOrLoc"), "</div>");
	html.push("<table class='ZPropertySheet' cellspacing='6'>");
	for (var i = 0; i < WebExZimlet.APPEND_SUB_OPTIONS.length; i++) {
		var obj = WebExZimlet.APPEND_SUB_OPTIONS[i];
		html.push("<tr><td class='ZmFieldLabelRight'>", this.getMessage(obj.label), "</td><td>", this._getAppendSelectListMenuHtml(obj.propId), "</td></tr>");
	}
	html.push("</table>");
	html.push("<br/>");
	return html.join("");
};

/**
 * Gets html select menu.
 *
 * @param {number} id		the account number
 * @return {string} html
 */
WebExZimlet.prototype._getAppendSelectListMenuHtml = function(id) {
	var html = [];
	html.push("<select id='", id, "'>");
	html.push("<option value='NONE'>", this.getMessage("WebExZimlet_none"), "</option>");
	html.push("<option value='SUBJECT'>", this.getMessage("WebExZimlet_subject"), "</option>");
	html.push("<option value='LOCATION'>", this.getMessage("WebExZimlet_location"), "</option>");
	html.push("<option value='BOTH'>", this.getMessage("WebExZimlet_subjectAndLocation"), "</option>");

	html.push("</select>");
	return html.join("");
};

/**
 * Handles OK button in General Preferences dialog and saves General Preferences.
 *
 */
WebExZimlet.prototype._generalPrefsOkBtnListner =
function() {
	var keyValArray = [];
	try {
		for (var i = 0; i < WebExZimlet.ALL_GENERAL_PROPS.length; i++) {
			var key = WebExZimlet.ALL_GENERAL_PROPS[i].propId;
			var lst = document.getElementById(key);
			var val = lst.options[lst.selectedIndex].value;
			val = val == "" ? "N/A" : val;
			keyValArray[key] = val;
		}
		this.metaData.set("webexZimletGeneralPreferences", keyValArray, null, new AjxCallback(this, this._saveGeneralPrefsHandler), null, true);
	} catch(ex) {
		this._showErrorMessage(ex);
	}
};

/**
 * Saves General preferences.
 */
WebExZimlet.prototype._saveGeneralPrefsHandler =
function() {
	this._webexZimletGeneralPreferences = null;
	appCtxt.getAppController().setStatusMsg(this.getMessage("WebExZimlet_PrefSaved"), ZmStatusView.LEVEL_INFO);
	this.generalPrefsDlg.popdown();
};

/**
 * Gets appointment id and meeting data.
 *
 * @param {string} key Appointment id
 * @param {AjxCallback} postCallback  A callback
 */
WebExZimlet.prototype._getApptIdsHashMetaData =
function(key, postCallback) {
	this._currentMetaData = new ZmMetaData(appCtxt.getActiveAccount(), key);
	this._currentMetaData.get("webexZimletApptIdsHash", null, new AjxCallback(this, this._handleGetApptIdsHashMetaData, postCallback));
};

/**
 * Handles appointment and webex response.
 *
 * @param {AjxCallback} postCallback A callback
 * @param {object} result Custom metadata response
 */
WebExZimlet.prototype._handleGetApptIdsHashMetaData =
function(postCallback, result) {
	this._apptIdsMetaData = null;//nullify old data
	var response = result.getResponse();
	if(response && response.BatchResponse && response.BatchResponse.GetCustomMetadataResponse) {
		response = response.BatchResponse.GetCustomMetadataResponse;
	} else {
		return;
	}
	try {
		if (response.meta && response.meta[0]) {
			this._apptIdsMetaData = response.meta[0]._attrs;
		}
		if (postCallback) {
			postCallback.run(this._apptIdsMetaData);
		} else {
			return this._apptIdsMetaData;
		}
	} catch(ex) {
		this._showErrorMessage(ex);
		return;
	}
};

/**
 * Saves appointment-id and webex meeting key information using customMetaData api.
 *
 * @param {string} apptId Appointment id
 * @param {string} meetingKey Meeting key
 * @param {string} seriesMeetingKey  Series meeting key
 */
WebExZimlet.prototype._saveApptIdsHashToServer =
function(apptId, meetingKey, seriesMeetingKey) {
	this._currentMetaData = new ZmMetaData(appCtxt.getActiveAccount(), apptId);
	var keyValArry = [];

	if (this._appt.viewMode == ZmCalItem.MODE_EDIT_SINGLE_INSTANCE) {
		keyValArry["exceptionMeetingKey"] = meetingKey;
		if (seriesMeetingKey && seriesMeetingKey != "") {
			keyValArry["meetingKey"] = seriesMeetingKey;
		}
	} else {
		keyValArry["meetingKey"] = meetingKey;
	}
	keyValArry["hostName"] = this._currentWebExAccount[WebExZimlet.PROP_USERNAME.propId];
	keyValArry["hostPwd"] = this._currentWebExAccount[WebExZimlet.PROP_PASSWORD.propId];
	keyValArry["companyId"] = this._currentWebExAccount[WebExZimlet.PROP_COMPANY_ID.propId];
	this._currentMetaData.set("webexZimletApptIdsHash", keyValArry, null, null, null, true);
};

/**
 * Shows Select Account dialog.

 * @param {hash} params	 a hash of parameters containing meeting key
 * @param {string} params.postCallback A post callback
 * @param {object} params.appt Appointment
 * @param {boolean} params.showOptions If true, then account option fields are displayed
 */
WebExZimlet.prototype._showSelectAccountDlg = function(params) {
	var postCallback = new AjxCallback(this, this._doShowSelectAccountDlg, params);
	this._getAccPrefsMetaData(postCallback);
};

/**
 * Shows Select Account dialog.
 *
 * @param {AjxCallback} postCallback A callback
 */
WebExZimlet.prototype._doShowSelectAccountDlg = function(params) {
	var postCallback = params.postCallback;
	var appt = params.appt;
	var showOptions = params.showOptions ? true : false;
	var accountNumber = 1;
	if (appt && appt.folderId) {
		accountNumber = this._getAccountNumberFromFolderId(appt.folderId);
	}
	if (this._showSelectAccntsDlg) {
		this._showSelectAccntsDlg._postCallback = postCallback;
		if (accountNumber) {
			this._setMenuValue("webExZimlet_accountsToSelectList", accountNumber);
		}
		this._showSelectAccntsDlg._showOptions = showOptions;
		this._setSelectAccntDlgData(accountNumber);
		this._setSelectAccntListeners();
		this._setSelectAccntOptions();
		this._showSelectAccntsDlg.popup();
		return;
	}
	try {
		var selectHtml = this._getAccountsSelectListMenuHtml("webExZimlet_accountsToSelectList");
	} catch (ex) {
		this._showErrorMessage(ex);
		return;
	}
	this._showSelectAccntsDlg = new ZmDialog({parent: this.getShell(), title:this.getMessage("WebExZimlet_selectAccntToUse"),  standardButtons:[DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON]});
	this._showSelectAccntsDlg._showOptions = showOptions;

	this._showSelectAccntDlgView = new DwtComposite(this.getShell());
	this._showSelectAccntDlgView.getHtmlElement().style.overflow = "auto";
	this._showSelectAccntDlgView.getHtmlElement().innerHTML = this._createShowSelectAccntView(selectHtml);
	this._showSelectAccntsDlg.setView(this._showSelectAccntDlgView);
	this._showSelectAccntsDlg._postCallback = postCallback;
	this._showSelectAccntsDlg.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._showSelectAccntDlgOkBtnListner));
	if (accountNumber) {
		this._setMenuValue("webExZimlet_accountsToSelectList", accountNumber);
	}
	this._setSelectAccntDlgData(accountNumber);
	this._setSelectAccntListeners();
	this._setSelectAccntOptions();
	this._showSelectAccntsDlg.popup();
};

/**
 * Sets  account's name, altHosts & meetingPwd
 * @param {string} accountNumber Account number
 */
WebExZimlet.prototype._setSelectAccntDlgData =
function(accountNumber) {
	try {
		this._setCurrentAccntInfoFromAccntNumber(accountNumber);
	} catch(ex) {
		this._showErrorMessage(ex);
		return;
	}
	var altHost = this._currentWebExAccount[WebExZimlet.PROP_ALT_HOSTS.propId];
	var mPwd = this._currentWebExAccount[WebExZimlet.PROP_MEETING_PASSWORD.propId];
	document.getElementById(this._showSelectAccntsDlg._altHostFieldId).value = altHost == "N/A"? "" : altHost;
	document.getElementById(this._showSelectAccntsDlg._mPwdFieldId).value = mPwd == "N/A" ? "" : mPwd;
};

/**
 * Hides or displays account options with in Select Accounts dialog
 */
WebExZimlet.prototype._setSelectAccntOptions =
function() {
	var display = this._showSelectAccntsDlg._showOptions ? "block" : "none";
	document.getElementById("webexZimlet_showSelectAccnts_OptionsDiv").style.display = display;
};

/**
 * Sets listeners for select account dialog
 */
WebExZimlet.prototype._setSelectAccntListeners =
function() {
	document.getElementById(this._showSelectAccntsDlg._altHelpLinkId).onclick = AjxCallback.simpleClosure(this._accPrefsShowHelpdialog, this, WebExZimlet.PROP_ALT_HOSTS.propId);
	document.getElementById("webExZimlet_accountsToSelectList").onchange =  AjxCallback.simpleClosure(this._setNewAccountData, this);
};

/**
 * Sets account data based on webExZimlet_accountsToSelectList menu
 */
WebExZimlet.prototype._setNewAccountData =
function() {
	var accountNumber = document.getElementById("webExZimlet_accountsToSelectList").value;
	try {
		this._setCurrentAccntInfoFromAccntNumber(accountNumber);
	} catch(ex) {
		this._showErrorMessage(ex);
		return;
	}
	this._setSelectAccntDlgData(accountNumber);
};





/**
 * Creates select account html view.
 *
 * @return {string} html
 */
WebExZimlet.prototype._createShowSelectAccntView =
function(selectHtml) {
	try {
		var html = [];
		this._showSelectAccntsDlg._altHostFieldId = "WebExZimlet_showSelectAccntsDlg_altHostFieldId";
		this._showSelectAccntsDlg._altHelpLinkId = "WebExZimlet_showSelectAccntsDlg_altHelpLinkId";
		this._showSelectAccntsDlg._mPwdFieldId = "WebExZimlet_showSelectAccntsDlg_mPwdFieldId";
		html.push("<div class='webExZimlet_background' style='width:500px;'>",
			"<table class='ZPropertySheet' cellspacing='6' width='100%' style='margin-bottom:.5em;'><tr>",
			"<td class='ZmFieldLabelRight' width='30%'>",
			this.getMessage("WebExZimlet_webExAccntToUse"),
			"</td>",
			"<td><span>", selectHtml, "</span></td></tr></table>",
			"<div id='webexZimlet_showSelectAccnts_OptionsDiv' >",
			"<div class='webExZimlet_subHdr'>",
			this.getMessage("WebExZimlet_getAccounts"),
			"</div>",
			"<table class='webExZimlet_table ZPropertySheet' cellspacing='6' width='100%'>",
			"<tr><td class='ZmFieldLabelRight' width='30%'>",
			this.getMessage(WebExZimlet.PROP_ALT_HOSTS.label),
			"</td>",
			"<td><input  id='",
			this._showSelectAccntsDlg._altHostFieldId,
			"'  type='text'/>",
			"&nbsp; <a href='javascript:void(0)' id='",this._showSelectAccntsDlg._altHelpLinkId,"'>",
			this.getMessage("WebExZimlet_help"),
			"</a></td></tr>",
			"<tr><td class='ZmFieldLabelRight' width='30%'>",
			this.getMessage(WebExZimlet.PROP_MEETING_PASSWORD.label),
			"</td>",
			"<td><input id='",
			this._showSelectAccntsDlg._mPwdFieldId,
			"'  type='text'/>",
			"&nbsp; <label style='color:gray;'>",
			this.getMessage(WebExZimlet.PROP_MEETING_PASSWORD.extraLabel),
			"</label></td></tr>",
			"</table>",
			"</div></div>");

		return html.join("");
	} catch(ex) {
		this._showErrorMessage(ex);
	}
};

/**
 * OK button listener for Select accounts dialog.
 */
WebExZimlet.prototype._showSelectAccntDlgOkBtnListner =
function() {
	try {
		this._validateCurrentAccount(document.getElementById("webExZimlet_accountsToSelectList").value);
	} catch(ex) {
		this._showErrorMessage(ex);
		return;
	}
	appCtxt.getAppController().setStatusMsg(this.getMessage("WebExZimlet_pleaseWait"), ZmStatusView.LEVEL_INFO);
	this._showSelectAccntsDlg.popdown();
	this._showSelectAccntsDlg._postCallback.run(document.getElementById("webExZimlet_accountsToSelectList").value);
};

/**
 * Shows WebEx appointments list for a given account number.
 * Revised - account number gets selected in the meeting list dlg form.
 */
//WebExZimlet.prototype._showAppointmentsList = function(accountNumber) {
WebExZimlet.prototype._showAppointmentsList = function() {
	if (!this._webexZimletAccountPreferences) {
		var postCallback = new AjxCallback(this, this._showMeetingListDlg, ["NOW_ON"]);
		this._getAccPrefsMetaData(postCallback);
	} else {
		this._showMeetingListDlg("NOW_ON");
	}
};

/**
 * Gets WebEx appointment list
 *
 * @param {number} accountNumber	the account number
 * @param {string} listType Specifies what constraints should be put for the list. If null, then "NOW_ON" is used
 */
WebExZimlet.prototype._getMeetingsList = function(accountNumber, listType) {
	if (document.getElementById("webex_meetingsearch_resultfield")) {
		document.getElementById("webex_meetingsearch_resultfield").innerHTML = "<div style='text-align:center;vertical-align:middle'>" + this.getMessage("WebExZimlet_findingMeetings") + "</div>";
	}
	else {
		appCtxt.getAppController().setStatusMsg(this.getMessage("WebExZimlet_pleaseWait"), ZmStatusView.LEVEL_INFO);
	}
	//Put the wait msg in the table section instead.
	//
	try {
		this._setCurrentAccntInfoFromAccntNumber(accountNumber);
	} catch(ex) {
		this._showErrorMessage(ex);
		return;
	}

	var today = new Date();
	var tomorrow = new Date(today.getTime() + (1 * 24 * 3600 * 1000));
	var seventhDay = new Date(today.getTime() + (7 * 24 * 3600 * 1000));
	if (listType == "TODAY") {
		var sHours = 0;
		var sDate = today;
	} else if (listType == "TOMORROW") {
		var sHours = 0;
		var sDate = tomorrow;
	} else if (listType == "NEXT_7_DAYS") {
		var sHours = 0;
		var sDate = today;
	} else {
		var sHours = today.getHours() - 1;//give 1 hour buffer
		var sDate = today;
	}
	sHours = sHours < 10 ? "0" + sHours : sHours;

	var sm = sDate.getMonth() + 1;
	sm = sm < 10 ? "0" + sm : sm;

	var sd = sDate.getDate();
	sd = sd < 10 ? "0" + sd : sd;

	var startDateStr = ["<startDateStart>",sm,"/", sd, "/",sDate.getFullYear(), " ", sHours, ":00:00", "</startDateStart>"].join("");

	var endDateStr = "";
	if (listType == "TODAY" || listType == "TOMORROW") {
		endDateStr = ["<startDateEnd>",sm,"/", sd, "/",sDate.getFullYear(), " ",  "23:00:00", "</startDateEnd>"].join("");
	} else if (listType == "NEXT_7_DAYS") {
		var ed = seventhDay.getDate();
		ed = ed < 10 ? "0" + ed : ed;

		var em = seventhDay.getMonth() + 1;
		em = em < 10 ? "0" + em : em;

		endDateStr = ["<startDateEnd>",em,"/", ed, "/",seventhDay.getFullYear(), " ",  "23:00:00", "</startDateEnd>"].join("");

	}
	var requestBody = ["<bodyContent xsi:type=\"java:com.webex.service.binding.meeting.LstsummaryMeeting\" ",
		"xmlns:meet=\"http://www.webex.com/schemas/2002/06/service/meeting\">" ,
		"<listControl><startFrom>1</startFrom><maximumNum>20</maximumNum></listControl>",
		"<order><orderBy>STARTTIME</orderBy><orderAD>ASC</orderAD></order>",
		"<dateScope>",startDateStr, endDateStr,"</dateScope></bodyContent>"].join("");

	var request = this.newWebExRequest(requestBody);
	AjxRpc.invoke(request, this.postUri(), {"Content-Type":"text/xml"}, new AjxCallback(this, this._handleGetMeetingsList, [listType]), false, false);	
};

WebExZimlet.prototype._handleGetMeetingsList = function(listType, result) {
	var objResult = this.xmlToObject(result);
	/*  It needs to load the popup even if there's no meetings currently available.
	if (!this._validateWebExResult(objResult, this.getMessage("WebExZimlet_unableToGetMeetingInfo"))) {
		return;
	}
	*/
	this._setMeetingListView(objResult, listType);
	this._addShowMeetingListListeners();	
};
/**
 * Shows WebEx meeting list dialog.
 * @param {int} accountNumber WebEx Account Number
 * Revised - account number needs to be selected in this form.
 * Use this._currentWebExAccountNumber instead?
 * @param {string} listType Specifies what constraints should be put for the list. If null, then "NOW_ON" is used
 */
WebExZimlet.prototype._showMeetingListDlg = function(listType) {
	if (this._meetingLstDlg) {
		this._meetingListDlgView.getHtmlElement().innerHTML = ["<label style='font-weight:bold;font-size:12px;'>",this.getMessage("WebExZimlet_pleaseWait"),"</div>"].join("");
		this._meetingLstDlg.popup();
		this._getMeetingsList(this._currentWebExAccountNumber, listType);
		return;
	}
	this._meetingListDlgView = new DwtComposite(this.getShell());
	this._meetingListDlgView.setSize("570", "200");
	//this._meetingListDlgView.getHtmlElement().style.background = "white";
	this._meetingListDlgView.getHtmlElement().style.overflow = "auto";
	this._meetingListDlgView.getHtmlElement().innerHTML =  ["<label style='font-weight:bold;font-size:12px;'>",this.getMessage("WebExZimlet_pleaseWait"),"</div>"].join("");
	this._meetingLstDlg = new ZmDialog({parent: this.getShell(), title:this.getMessage("WebExZimlet_startOrJoinWebExMeeting") , view:this._meetingListDlgView, standardButtons:[DwtDialog.CANCEL_BUTTON]});
	this._meetingLstDlg.popup();
	this._getMeetingsList(this._currentWebExAccountNumber, listType);
};

/**
 * Adds meeting listeners to links that opens WebEx meetings.
 */
WebExZimlet.prototype._addShowMeetingListListeners = function() {
	for (var id in this._startMeetingStartLinkIdMap) {
		document.getElementById(id).onclick = AjxCallback.simpleClosure(this._onStartLinkClicked, this, this._startMeetingStartLinkIdMap[id]);
	}
	var callback = this._meetingListTypesMenuHandler.bind(this);
	document.getElementById("webExZimlet_meetingsListTypesMenu").onchange = callback;
	//XXX Do the same sort of thing here for the account-number selector.
	var callback2 = this._meetingListAccountsMenuHandler.bind(this);
	document.getElementById("webExZimlet_meetingsListAccountsMenu").onchange = callback2;
};

/**
 * Handler for type menu change
 */
WebExZimlet.prototype._meetingListTypesMenuHandler = function() {
	var type = document.getElementById("webExZimlet_meetingsListTypesMenu").value;
	this._getMeetingsList(this._currentWebExAccountNumber, type);
};


/**
 * Handler for account menu change
 * Rbain
 */
WebExZimlet.prototype._meetingListAccountsMenuHandler = function() {
	var type = document.getElementById("webExZimlet_meetingsListTypesMenu").value;
	//XXX - call the account-number getter, it should set _currentWebExAccountNumber.
	this._currentWebExAccountNumber = document.getElementById("webExZimlet_meetingsListAccountsMenu").value;
	this._getMeetingsList(this._currentWebExAccountNumber, type);
};

/**
 * Opens WebEx meeting.
 *
 * @param {hash} params	 a hash of parameters containing meeting key
 * @param {string} params.meetingKey WebEx meeting key
 * @param {string} params.hostWebExId WebEx host id
 */
WebExZimlet.prototype._onStartLinkClicked = function(params) {
	var isHost = false;
	if (params.hostWebExId == this._currentWebExAccount.webexZimlet_username) {
		isHost = true;
		var requestBody = ["<bodyContent xsi:type=\"java:com.webex.service.binding.meeting.GethosturlMeeting\">",
			"<meetingKey>", params.meetingKey, "</meetingKey>","</bodyContent>"].join("");
	} else {
		var requestBody = ["<bodyContent xsi:type=\"java:com.webex.service.binding.meeting.GetjoinurlMeeting\">",
			"<meetingKey>",  params.meetingKey, "</meetingKey>","</bodyContent>"].join("");
	}
	var request =  this.newWebExRequest(requestBody);
	var result = AjxRpc.invoke(request, this.postUri(), {"Content-Type":"text/xml"}, null, false, false);
	var objResult = this.xmlToObject(result);
	if (!this._validateWebExResult(objResult, this.getMessage("WebExZimlet_unableToGetJoinOrHostURL"))) {
		return;
	}
	var url = "";
	if (isHost) {
		url = objResult.body.bodyContent.hostMeetingURL.toString();
	} else {
		url = objResult.body.bodyContent.joinMeetingURL.toString();
	}
	window.open(url);
};

/**
 * Creates Meeting list view.
 * @param {object} objResult	the Object with list of WebEx meetings
 * @param {string} listType	 Type of the list
 */
WebExZimlet.prototype._setMeetingListView = function(objResult, listType) {
	var mtgs = AjxUtil.toArray(objResult && objResult.body && objResult.body.bodyContent && objResult.body.bodyContent.meeting);

	this._startMeetingStartLinkIdMap = {};
	var html = [];

	html.push("<div class='webExZimlet_background'>",
		"<table class='ZPropertySheet' cellspacing='6' width='100%' style='margin-bottom:.5em;'>",
		"<tr><td class='ZmFieldLabelRight' width='30%'>", this.getMessage("WebExZimlet_webExAccntToUse"), "</td>",
		"<td>", this._getAccountsSelectListMenuHtml("webExZimlet_meetingsListAccountsMenu"), "</td></tr>",
		"<tr><td class='ZmFieldLabelRight' width='30%'>", this.getMessage("WebExZimlet_showMeetings"), "</td>",
		"<td>", this._getMeetingListTypesMenu(listType), "</td></tr>",
		"</table>");

	html.push("<div id='webex_meetingsearch_resultfield'>"); //The result table OR 'loading...' type messages go here.
	html.push("<table class='webex_hoverTable' id='webex_hoverTable' width=100%>");
	if (mtgs.length == 0) { 
		html.push("<tr class='", cls, "'>", "<td colspan='4' align='center'>", this.getMessage("WebExZimlet_noMeetingsFound"), "</td>","</tr>");
	} else {

		html.push("<tr align=left><th>", this.getMessage("WebExZimlet_host"), "</th>",
			"<th width=50%>", this.getMessage("WebExZimlet_meetingName"), "</th>",
			"<th>", this.getMessage("WebExZimlet_startTime"), "</th>",
			"<th>", this.getMessage("WebExZimlet_action"), "</th></tr>");
		var isOdd = true;
		for (var i = 0; i < mtgs.length; i++) {
			var cls = "RowEven";
			var mtg = mtgs[i];
			var startLinkId = Dwt.getNextId();
			this._startMeetingStartLinkIdMap[startLinkId] = {meetingKey: mtg.meetingKey.toString(), hostWebExId: mtg.hostWebExID.toString()}
			if (!isOdd) {
				cls = "RowOdd";
			}

			html.push("<tr class='", cls, "'>",
				"<td>", mtg.hostWebExID, "</td>",
				"<td>", AjxStringUtil.urlComponentDecode(mtg.confName), "</td>",
				"<td>", mtg.startDate, "<br/><label style='color:gray;font-size:10px'>", this._getTimeZoneName(mtg.timeZone.toString()), "</label></td>",
				"<td><a href='javascript:void(0)' id='", startLinkId, "' >", this.getMessage("WebExZimlet_startJoin"), "</a></td>",
				"</tr>");
			isOdd = !isOdd;
		}
	}
	html.push("</table></div></div>");

	this._meetingListDlgView.getHtmlElement().innerHTML = html.join("");
};

WebExZimlet.prototype._getMeetingListTypesMenu = function(listType) {
	if (!listType) {
		listType = "NOW_ON";
	}
	var items = {"NOW_ON": this.getMessage("WebExZimlet_fromNowOn"), "TODAY" : this.getMessage("WebExZimlet_today"),
				"TOMORROW" : this.getMessage("WebExZimlet_tomorrow"), "NEXT_7_DAYS" : this.getMessage("WebExZimlet_next7days")}
	var html = [];
	html.push("<select id='webExZimlet_meetingsListTypesMenu'>");
	for (var el in items) {
		var sltdStr = el == listType ? " selected " : "";
		html.push("<option value='", el, "' ", sltdStr, " >", items[el], "</option>");
	}
	html.push("</select>");
	return html.join("");
};

/**
 * Gets time Zone by stripping offset information.
 *
 * @param {string}	timeZone Timezone
 * @return {string} the timezone string without GMT offset
 */
WebExZimlet.prototype._getTimeZoneName =
function(timeZone) {
	var tmp = timeZone.split(",");
	var arry = [];
	for (var i = 1; i < tmp.length; i++) {
		arry.push(tmp[i]);
	}
	return arry.join(",");
};

/**
 * Shows one click dialog.
 * @param {string} attendees A string with email addresses
 */
WebExZimlet.prototype._showOneClickDlg = function(attendees) {
	if(!attendees) {
		attendees = "";
	}
	if (this._oneClickDlg) {
		this._setAttendeesToOneClickDlg(attendees);
		this._oneClickDlg.popup();
		return;
	}

	var postCallback = new AjxCallback(this, this._doShowOneClickDlg, attendees);
	this._getAccPrefsMetaData(postCallback);
};

/**
 * Shows one click dialog.
 */
WebExZimlet.prototype._doShowOneClickDlg =
function(attendees) {
	try {
		var selectHtml = this._getAccountsSelectListMenuHtml("webExZimlet_oneClickAccountSelect");
	} catch (ex) {
		this._showErrorMessage(ex);
		return;
	}
	this._oneClickDlgView = new DwtComposite(this.getShell());
	this._oneClickDlgView.getHtmlElement().style.overflow = "auto";
	this._oneClickDlgView.getHtmlElement().innerHTML = this._createOneClickMeetingView(selectHtml);
	this._oneClickDlg = new ZmDialog({parent: this.getShell(), title:this.getMessage("WebExZimlet_startQuickWebExMeeting"), view:this._oneClickDlgView, standardButtons:[DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON]});
	this._oneClickDlg.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._oneClickDlgOkBtnListner));
	this._addAutoCompleteHandler();
	this._addToButton();
	this._setAttendeesToOneClickDlg(attendees);
	this._oneClickDlg.popup();
};

WebExZimlet.prototype._addToButton =
function(attendees) {
	var btn = new DwtButton({parent:this.getShell()});
	btn.setText(ZmMsg.to);
	btn.addSelectionListener(new AjxListener(this, this._handleToButton));
	document.getElementById("webexZimlet__oneClickMeeting_toButton").appendChild(btn.getHtmlElement());
};

WebExZimlet.prototype._handleToButton =
function(ev) {
	if (!this._contactPicker) {
		AjxDispatcher.require("ContactsCore");
		var buttonInfo = [{id:AjxEmailAddress.TO, label : ZmMsg[AjxEmailAddress.TYPE_STRING[AjxEmailAddress.TO]]}];

		this._contactPicker = new ZmContactPicker(buttonInfo);
		this._contactPicker.registerCallback(DwtDialog.OK_BUTTON, this._contactPickerOkCallback, this);
	}
	this._contactPicker.popup();
};

WebExZimlet.prototype._contactPickerOkCallback =
function(addrVec) {
	var addrAdded = false;
	used = {};
	var addrList = [];
	var addrs = addrVec && addrVec.getArray();
	if (addrs && addrs.length) {
		for (var i = 0, len = addrs.length; i < len; i++) {
			var addr = addrs[i];
			var email = addr.isAjxEmailAddress ? addr && addr.getAddress() : addr;
			if (!email) { continue; }
			email = email.toLowerCase();
			if (!used[email]) {
				addrList.push(addr.address);
				used[email] = true;
				addrAdded = true;
			}
		}
		var field = document.getElementById("webExZimlet_oneClickAttendeesField");
		var existingAddrs = AjxEmailAddress.parseEmailString(field.value).good.getArray();
		var eAddrs = [];
		var len = existingAddrs.length;
		for(var i = 0; i < len; i++) {
			eAddrs.push(existingAddrs[i].address);
		}
		addrList = eAddrs.concat(addrList);
		var addrStr = addrList.join(AjxEmailAddress.SEPARATOR);
		field.value = addrStr;
	}
	this._contactPicker.popdown();
};

/**
 *Sets attendees to one click dialog
 *@param {string} attendees Attendees
 */
WebExZimlet.prototype._setAttendeesToOneClickDlg =
function(attendees) {
	if (!attendees || attendees == "") {
		attendees = "";
	}
	document.getElementById("webExZimlet_oneClickAttendeesField").value = attendees;
};

WebExZimlet.prototype._addAutoCompleteHandler =
function() {
	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED) || appCtxt.get(ZmSetting.GAL_ENABLED)) {
		var params = {
			dataClass:		appCtxt.getAutocompleter(),
			matchValue:		ZmAutocomplete.AC_VALUE_EMAIL,
			keyUpCallback:	this._acKeyUpListener.bind(this),
			contextId:		this.name
		};
		this._acAddrSelectList = new ZmAutocompleteListView(params);
		this._acAddrSelectList.handle(document.getElementById("webExZimlet_oneClickAttendeesField"));
	}
};

WebExZimlet.prototype._acKeyUpListener =
function(event, aclv, result) {
	//ZmSharePropsDialog._enableFieldsOnEdit(this);
};

/**
 * Creates oneclick html view.
 *
 * @returns  {string} html
 */
WebExZimlet.prototype._createOneClickMeetingView =
function(selectHtml) {

	var html = [];
	html.push("<table width='100%' class='webExZimlet_table ZPropertySheet' cellspacing='6'>");
	html.push("<tr><td colspan='2' class='ZmFieldLabelRight'>", this.getMessage("WebExZimlet_webExAccntToUse"), " </td><td>", selectHtml, "</td></tr>");
	html.push("<tr>",
			"<td width='30'></td><td width='15' id='webexZimlet__oneClickMeeting_toButton'></td>",
			"<td><input  style='width:400px;' type='text' id='webExZimlet_oneClickAttendeesField'> </input></td></tr>");
	html.push("</table>");
	return html.join("");
};

/**
 * Adds OK button listener.
 *
 */
WebExZimlet.prototype._oneClickDlgOkBtnListner =
function() {
	var accntNumber = document.getElementById("webExZimlet_oneClickAccountSelect").value;
	var attendees = this._getValidEmailsAsString("webExZimlet_oneClickAttendeesField");
	if(attendees == "") {
		return;
	}
	var params = {accntNumber:accntNumber, attendees:attendees};
	var postCallback2 = new AjxCallback(this, this._createOneClickMeetingAndLaunch, params);
	var postCallback = new AjxCallback(this, this._getGeneralPrefsMetaData, postCallback2);
	this._getAccPrefsMetaData(postCallback);
	this._oneClickDlg.popdown();
};

/**
 * Creates one click meeting and launches WebEx.
 *
 * @param {hash} params a hash of parameters
 * @param {string} params.accntNumber	 the account number
 * @param {string} params.attendees		the attendee emails
 *
 */
WebExZimlet.prototype._createOneClickMeetingAndLaunch =
function(params) {
	try {
		this._setCurrentAccntInfoFromAccntNumber(params.accntNumber);
	} catch(ex) {
		this._showErrorMessage(ex);
		return;
	}
	var newParams = {};
	newParams["subject"] = this.getMessage("WebExZimlet_quickMeetingSubject");
	newParams["loc"] = this.getMessage("WebExZimlet_quickMeetingLocation");
	if (params.attendees && params.attendees != "") {
		newParams["emails"] = AjxEmailAddress.parseEmailString(params.attendees).good.getArray();
	} else {
		newParams["emails"] = [];
	}
	newParams["duration"] = 60;
	var tzName = "";
	try {
		tzName = appCtxt.getActiveAccount().settings.getInfoResponse.prefs._attrs.zimbraPrefTimeZoneId;
	} catch(e) {
		tzName = "America/Los_Angeles";//default
	}
	newParams["timeZoneID"] = WebExZimlet.WebExToZimbraTZIDMap[tzName];
	newParams["pwd"] = this._currentWebExAccount[WebExZimlet.PROP_MEETING_PASSWORD.propId];
	var d = new Date();
	var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	var nd = new Date(utc);
	newParams["formattedStartDate"] = this._formatDate(new Date());
	newParams["meetingKey"] = null;
	newParams["sendWebExEmail"] = true;
    
    var callback = new AjxCallback(this, this._createOneClickMeetingHdlr);
	this._getCreateOrModifyMeetingRequest(newParams, callback);
};

/**
 * Handles one-click meeting response.
 *
 * @param {object} result  the create meeting response
 */
WebExZimlet.prototype._createOneClickMeetingHdlr = function(result) {
	var objResult = this.xmlToObject(result);
	if (!this._validateWebExResult(objResult, "Unable to create meeting")) {
		return;
	}
	var meetingKey = null;
	if (objResult.body.bodyContent.meetingkey) {
		meetingKey = objResult.body.bodyContent.meetingkey.toString();
	}
	if (!meetingKey) {
		this.displayErrorMessage("WebEx did not return meeting key, perhaps, meeting didn't get created on the WebEx server.", "WebEx Error");
		return;
	}
	var requestBody = ["<bodyContent xsi:type=\"java:com.webex.service.binding.meeting.GethosturlMeeting\">",
		"<meetingKey>", meetingKey, "</meetingKey>","</bodyContent>"].join("");

	var request = this.newWebExRequest(requestBody);
	var result = AjxRpc.invoke(request, this.postUri(), {"Content-Type":"text/xml"}, null, false, false);
	var objResult = this.xmlToObject(result);
	if (!this._validateWebExResult(objResult, this.getMessage("WebExZimlet_unableToCreateMeeting"))) {
		return;
	}
	var hostMeetingUrl = objResult.body.bodyContent.hostMeetingURL.toString();
	window.open(hostMeetingUrl);
};

/**
 * Validates WebEx Result.
 *
 * @param  {object} objResult  WebEx Result
 * @param {string} customMsg Error message string
 */
WebExZimlet.prototype._validateWebExResult =
function(objResult, customMsg) {
	var hasError = false;
	if (!customMsg) {
		customMsg = "";
	}
	if (!objResult) {
		hasError = true;
	} else if (!objResult.header || !objResult.header.response || !objResult.header.response.result || objResult.header.response.result != "SUCCESS") {
		hasError = true;
	}

	if (hasError) {
		var msg = [];
		msg.push(customMsg);
		if (objResult && objResult.header && objResult.header.response && objResult.header.response.reason) {
			var extMsg = "";
			if(objResult.header.response.exceptionID && objResult.header.response.exceptionID.toString() == "040007") {
				extMsg = this.getMessage("WebExZimlet_invalidAlternateHost");
			}
			
			msg.push("<br/><b>", this.getMessage("WebExZimlet_failureReason"), " </b><label style='color:red;font-weight:bold;'>", objResult.header.response.reason, "<br/>", extMsg, "</label>");
		}
		this._showErrorMessage(msg.join(""));
		return false;
	}

	return true;
};

/**
 * Displays error message.
 *
 * @param {string} expnMsg Exception message string
 */
WebExZimlet.prototype._showErrorMessage =
function(expnMsg) {
	var msg = "";
	if (expnMsg instanceof AjxException) {
		msg = expnMsg.msg;
	} else {
		msg = expnMsg;
	}
	var dlg = appCtxt.getMsgDialog();
	dlg.reset();
	dlg.setMessage(msg, DwtMessageDialog.WARNING_STYLE);
	dlg.popup();
};

/**
 * Gets html select menu.
 *
 * @param {number} id		the account number
 * @return {string} html
 */
WebExZimlet.prototype._getAccountsSelectListMenuHtml = function(id) {
	this._isAtLeastOneAccountConfigured();
	var html = [];
	html.push("<select id='", id, "'>");
	for (var i = 1; i < 6; i++) {
		var userName = this._webexZimletAccountPreferences["webexZimlet_username" + i];
		if (userName == "" || userName == "N/A") {
			userName = this.getMessage("WebExZimlet_notConfigured");
		}
		var label = AjxMessageFormat.format(this.getMessage("WebExZimlet_accntNumberAndName"), [i, userName]);
		var selected  = (i === this._currentWebExAccountNumber ? " selected" : "");
		html.push("<option value='", i, "'", selected , ">", label, "</option>");
	}
	html.push("</select>");
	return html.join("");
};

/**
 * Handles object drop
 *
 */
WebExZimlet.prototype.doDrop = function(obj) {
	switch (obj.TYPE) {
		case "ZmContact":
			this.contactDropped(obj);
			break;
		case "ZmAppt":
			this.apptDropped(obj);
			break;
		case "ZmConv":
		case "ZmMailMsg":
			this.mailDropped(obj);
			break;
	}
};

/**
 * when an appointment  is dropped on the zimlet,
 * pop up the quick create dialog with the contacts as attendees
 * @param {Obj} ZmAppt
 */
WebExZimlet.prototype.apptDropped = function(obj) {
	var attendees = obj.srcObj.getAttendees(ZmCalBaseItem.PERSON);
	var emails = [];
	for (var i = 0; i < attendees.length; i++) {
		emails.push(attendees[i].getEmail());
	}
	this._showOneClickDlg(emails.join(";"));
}

/**
 * when a conversation or msg is dropped on the zimlet,
 * pop up the quick create dialog with the contacts as attendees
 * @param {Obj} ZmConv | ZmMailMsg
 */
WebExZimlet.prototype.mailDropped = function(msgObj) {
	if(msgObj instanceof Array) {
		msgObj = msgObj[0];
	}
	this.srcMsgObj = msgObj.srcObj;
	if (this.srcMsgObj.type == "CONV") {
		this.srcMsgObj = this.srcMsgObj.getFirstHotMsg();
	}
	var emails = this.srcMsgObj.getEmails().getArray().join(";");
	this._showOneClickDlg(emails);
};

/**
 * when a contact or list of contacts is dropped on the zimlet,
 * pop up the quick create dialog with the contacts as attendees
 * @param {ZmContact} objContact Contact
 */
WebExZimlet.prototype.contactDropped = function(objContact) {
	var emails = this._getEmailsFromContacts(objContact);
	this._showOneClickDlg(emails.join(";"));
};

WebExZimlet.prototype._getEmailsFromContacts = function(objContact) {
	if (!(objContact instanceof Array)) {
		objContact = [objContact];
	}
	var emails = [];
	for (var i = 0; i < objContact.length; i++) {
		var c = objContact[i];
		//when drag-drop, c.attr is null but when passed from ActionMenu, c.attr has the info
		c = c.attr || c._attr ? (c.attr ? c.attr : c._attr) : c;
		var e = c.email ? c.email : (c.email2 ? c.email2 : (c.email3 ? c.email3 : ""));
		if (e != "" && e != undefined && e != "undefined") {
			emails.push(e);
		}
	}
	return emails;
};

WebExZimlet.prototype._getValidEmailsAsString = function(fieldId) {
    var el = document.getElementById(fieldId),
    ccEmails = [];
    if (el) {
        var val = el.value;
        if (val != "") {
            var parsed = AjxEmailAddress.parseEmailString(val);
            var badAddrs = parsed.bad.getArray().toString();
            if (badAddrs != "") {
                this._showErrorMessage(this.getMessage("cannotContinueInvalidEmails") + "<br>"+ badAddrs);
                return "";
            }
            ccEmails = parsed.good.size() ? parsed.good.getArray() : parsed.all.getArray();
        }
    }
    return ccEmails ? ccEmails.join(';') : "";
};

function webex_zimlet_update_tab(index) {
	var src = document.getElementById("webexZimlet_accountname" + index);
	var tabBar = webExZimletInstance._addPrefsDlgViewTabView.getTabBar();
	var tabs = tabBar.getItems(); //array of tab buttons.  (5 of them)
	tabs[index - 1].setText(src.value);
}

WebExZimlet.prototype.isTabEmpty = function(tabIndex) {

	for (var i = 0; i < WebExZimlet.ALL_ACCNT_PROPS.length; i++) {
		var objId = WebExZimlet.ALL_ACCNT_PROPS[i].propId;
		var key = objId + tabIndex;
		if (objId.indexOf(WebExZimlet.PROP_ASSOCIATED_CALENDAR.propId) !== -1 || objId.indexOf(WebExZimlet.PROP_COMPANY_ID.propId) !== -1) {
		    continue;
		}
		var value = document.getElementById(key).value;
		if (value && value !== "") {
		    return false; //not empty
		}
	}
	return true;
};

/**
 * Tab Index 
 * Clear all fields on that tab.
 * Hide the tab.
 */
WebExZimlet.prototype.deleteTab = function(tabIndex) {
	var originalTabIndex = tabIndex;
	
	//If this isn't the fifth tab, shift each tab down one spot.
	while (tabIndex <= 5) {
		//go through all fields on this tab, copy the value from the next tab over.
		for (var i = 0; i < WebExZimlet.ALL_ACCNT_PROPS.length; i++) {
			var objId = WebExZimlet.ALL_ACCNT_PROPS[i].propId;
			var key = objId + tabIndex;
			var nextKey = objId + (tabIndex + 1);
			var nextValue = tabIndex === 5 ? "" : document.getElementById(nextKey).value;

			if (objId.indexOf(WebExZimlet.PROP_ASSOCIATED_CALENDAR.propId) === -1) {
				document.getElementById(key).value = nextValue;
			}
			else {
				this._setMenuValue(key, nextValue);  //test this one...
			}
		}
		webex_zimlet_update_tab(tabIndex);
		tabIndex++;
	}
	if (originalTabIndex < 5) {
		this.hideOrShowTab(originalTabIndex + 1, false);  //call this to hide the tab.
	}
	this.hideOrShowTab(originalTabIndex, true);
	
	if (this.isTabEmpty(originalTabIndex) && originalTabIndex > 1) {
		tabIndex = originalTabIndex - 1;
		var bar = this._addPrefsDlgViewTabView.getTabBar();
		var button = bar.getItem(tabIndex); 
		//alert("Switch to tab " + tabIndex + " (" + this._tabKeys[tabIndex] + ")");
		button.focus();
		this._addPrefsDlgViewTabView.switchToTab(this._tabKeys[tabIndex]); 
	}
};

/**
 * Check tab's fields - if the 'important' ones are empty, hide it.
 * otherwise allow it to be shown.
 * returns: boolean visibility.  (True = visible)
 */
WebExZimlet.prototype.hideOrShowTab = function(tabIndex, moveFocus) {
	//never turn the first 'page' invisible, but do turn phone info off if needed.
	var noValues = tabIndex !== 1 && this.isTabEmpty(tabIndex);
	if (noValues) {
		var bar = this._addPrefsDlgViewTabView.getTabBar();
		var button = bar.getItem(tabIndex - 1); //zero indexed.
		
		button.setVisibility(false);
		
		this._hidePhoneSettings(tabIndex);
		return false;
	}

	this.hideOrShowPhone(tabIndex);
	return true;
};

/**
 *  Scan through the phone fields - if all empty, hide the phone fields.
 */
WebExZimlet.prototype.hideOrShowPhone = function(tabIndex) {

	for (var i = 0; i < WebExZimlet.WEBEX_TELECONF_PROPS.length; i++) {
		var objId = WebExZimlet.WEBEX_TELECONF_PROPS[i].propId;
		var key = objId + tabIndex;

		if (objId.indexOf(WebExZimlet.PROP_ASSOCIATED_CALENDAR.propId) === -1) {
			if (document.getElementById(key).value && document.getElementById(key).value !== "") {
				//there's a value, so show phone settings
				this._showPhoneSettings(tabIndex);
				return;
			}
		}
	}

	//no values were found - hide phone settings.
	this._hidePhoneSettings(tabIndex);
};

WebExZimlet.prototype._addAccountTab = function() {
	//Go through the tabs, find the first blank one
	for (var i = 1; i < 6; i++) {
		if (!this.isTabEmpty(i)) {
			continue;
		}
		//turn tab button visible, open tab.
		var bar = this._addPrefsDlgViewTabView.getTabBar();
		var button = bar.getItem(i - 1); //zero indexed.
		
		button.setVisibility(true);
		this._addPrefsDlgViewTabView.switchToTab(this._tabKeys[i]);
		return;
	}
	
	//if there are none, pop up a message.
	appCtxt.getAppController().setStatusMsg("Only five accounts available.");
};

WebExZimlet.prototype._showPhoneSettings = function(index) {
	document.getElementById("webex_zimlet_phone_info" + index).style.display = "block";
};

/**
 * Also blanks all the fields.
 */
WebExZimlet.prototype._hidePhoneSettings = function(index) {
	for (var i = 0; i < WebExZimlet.WEBEX_TELECONF_PROPS.length; i++) {
		var objId = WebExZimlet.WEBEX_TELECONF_PROPS[i].propId;
		var key = objId + index;

		if (objId.indexOf(WebExZimlet.PROP_ASSOCIATED_CALENDAR.propId) === -1) {
			document.getElementById(key).value = "";
		} /*
		else {
			this._setMenuValue(key, val);
		}
		*/
	}


	document.getElementById("webex_zimlet_phone_info" + index).style.display = "none";
};
