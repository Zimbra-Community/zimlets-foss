/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2006, 2007, 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

function com_zimbra_tracking_HandlerObject() {
}

com_zimbra_tracking_HandlerObject.prototype = new ZmZimletBase();
com_zimbra_tracking_HandlerObject.prototype.constructor = com_zimbra_tracking_HandlerObject;

/**
 * Simplify handler object
 *
 */
var TrackingZimlet = com_zimbra_tracking_HandlerObject;

/**
 * Defines the regular expressions for UPS and FedEx packages.
 */
TrackingZimlet.UPS = "1[zZ]\\s?\\w{3}\\s?\\w{3}\\s?\\w{2}\\s?\\w{4}\\s?\\w{3}\\s?\\w{1}";
TrackingZimlet.FEDEX = "(\\d{12}|\\d{22})";
TrackingZimlet.TRACKING = "\\b(?:" + TrackingZimlet.UPS + "|" + TrackingZimlet.FEDEX + ")\\b";
TrackingZimlet.TRACKING_RE = new RegExp(TrackingZimlet.TRACKING, "g");

/**
 * Defines the UPS context.
 */
TrackingZimlet.CONTEXT_UPS = "ups";
/**
 * Defines the UPS context.
 */
TrackingZimlet.CONTEXT_FEDEX = "fedex";

/**
 * Matches content.
 * 
 */
TrackingZimlet.prototype.match =
function(line, startIndex) {
	TrackingZimlet.TRACKING_RE.lastIndex = startIndex;
	var m = TrackingZimlet.TRACKING_RE.exec(line);
	if (m) {
		if (m[0].charAt(1) == 'z' || m[0].charAt(1) == 'Z') {
			m.context = TrackingZimlet.CONTEXT_UPS;
		} else {
			m.context = TrackingZimlet.CONTEXT_FEDEX;
		}
	}
	return m;
};

/**
 * Handles tooltip popped-up event.
 * 
 */
TrackingZimlet.prototype.toolTipPoppedUp =
function(spanElement, contentObjText, matchContext, canvas) {
	var html;
	if (matchContext == TrackingZimlet.CONTEXT_UPS) {
		var trackMsg = this.getMessage("TrackingZimlet_tracking_ups");
		html = AjxMessageFormat.format(trackMsg, AjxStringUtil.htmlEncode(contentObjText));
	} else if (matchContext == TrackingZimlet.CONTEXT_FEDEX) {
		var trackMsg = this.getMessage("TrackingZimlet_tracking_fedex");
		html = AjxMessageFormat.format(trackMsg, AjxStringUtil.htmlEncode(contentObjText));
	} else {
		var trackMsg = this.getMessage("TrackingZimlet_tracking_other");
		html = AjxMessageFormat.format(trackMsg, AjxStringUtil.htmlEncode(contentObjText));
	}
	canvas.innerHTML = html;
};

/**
 * Gets the html content.
 * 
 */
TrackingZimlet.prototype._getHtmlContent =
function(html, idx, tracking, context) {
	var t = tracking.replace(/\s/g, '');
	var url;
	if (context == TrackingZimlet.CONTEXT_UPS) {
		url = "http://wwwapps.ups.com/WebTracking/processInputRequest?" + "sort_by=status&tracknums_displayed=1&TypeOfInquiryNumber=T&loc=en_US&InquiryNumber1=" + t + "&track.x=0&track.y=0";
	} else if (context == TrackingZimlet.CONTEXT_FEDEX) {
		url = "http://www.fedex.com/Tracking?tracknumbers=" + t;
	}

	if (url) {
		html[idx++] = '<a target="_blank" href="' + url + '">' + AjxStringUtil.htmlEncode(tracking) + '</a>';
	} else {
		html[idx++] = AjxStringUtil.htmlEncode(tracking);
	}
	return idx;
};