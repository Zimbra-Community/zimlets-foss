/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
function com_zimbra_email_handlerObject() {
	this.isPrimaryEmailTooltip = true;
}

com_zimbra_email_handlerObject.prototype = new ZmZimletBase();
com_zimbra_email_handlerObject.prototype.constructor = com_zimbra_email_handlerObject;

var EmailTooltipZimlet = com_zimbra_email_handlerObject;


// static content
EmailTooltipZimlet.NEW_FILTER = "__new__";
EmailTooltipZimlet.MAILTO_RE = /^mailto:[\x27\x22]?([^@?&\x22\x27]+@[^@?&]+\.[^@?&\x22\x27]+)[\x27\x22]?/;
EmailTooltipZimlet.tooltipWidth = 280;
//EmailTooltipZimlet.tooltipHeight = 150;

EmailTooltipZimlet.prototype.init =
function() {
	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED)) {
		AjxDispatcher.require(["ContactsCore", "Contacts"]);
	}
	this._prefDialog = new EmailToolTipPrefDialog(this);

	this._subscriberZimlets = [];
    this._presenceProvider = null; // For the subscriber zimlet that can provide presence info. Only one presence provider
	this._preLoadImgs();
    this._presenceCache = []; // Cache for holding presence information
};

/**
 * This method is called when the panel item is double-clicked.
 *
 */
EmailTooltipZimlet.prototype.doubleClicked =
function() {
	this.singleClicked();
};

/**
 * This method is called when the panel item is single-clicked.
 *
 */
EmailTooltipZimlet.prototype.singleClicked =
function() {
	this._prefDialog.popup();
};

EmailTooltipZimlet.prototype._getHtmlContent =
function(html, idx, obj, context, spanId, options) {
	if (obj instanceof AjxEmailAddress) {
		var context = window.parentAppCtxt || window.appCtxt;
		var contactsApp = context.getApp(ZmApp.CONTACTS);
		var contact = contactsApp && contactsApp.getContactByEmail(obj.address); // contact in cache?
		if (contactsApp && !contact && contact !== null) {
			// search for contact
			var respCallback = new AjxCallback(this, this._handleResponseGetContact, [html, idx, obj, spanId, options]);
			contactsApp.getContactByEmail(obj.address, respCallback);
		}
		// return content for what we have now (may get updated after search)
		return this._updateHtmlContent(html, idx, obj, contact, spanId, options);
	} else {
		html[idx++] = AjxStringUtil.htmlEncode(obj);
		return idx;
	}
};

/**
 * Returns content for this object's <span> element based on a contact.
 * If given a spanId, it will instead replace the content of the <span>, for example,
 * with the results of a search.
 */
EmailTooltipZimlet.prototype._updateHtmlContent =
function(html, idx, obj, contact, spanId, options) {

	var content = AjxStringUtil.htmlEncode(obj.toString(options && options.shortAddress));

	var span = spanId && document.getElementById(spanId);
	if (span) {
		span.innerHTML = content;
	} else {
		html[idx++] = content;
		return idx;
	}
};

EmailTooltipZimlet.prototype._handleResponseGetContact =
function(html, idx, obj, spanId, options, contact) {
	if (contact) {
		this._updateHtmlContent(html, idx, obj, contact, spanId, options);
	}
};

EmailTooltipZimlet.prototype.hoverOut =
function(object, context, span, spanId) {
    //console.log("In hoverout");
    //console.log("Object " + object && object.currentTarget);
	if(!this.tooltip) {	return;	}

	this._hoverOver =  false;
	this.tooltip.setSticky(true);

	setTimeout(AjxCallback.simpleClosure(this.popDownIfMouseNotOnSlide, this), 700);
	//override to ignore hoverout. 
};

EmailTooltipZimlet.prototype.popDownIfMouseNotOnSlide =
function() {
	if(this._hoverOver) {
        //console.log("_hoverOver is true")
		return;
	} else if(this.slideShow && this.slideShow.isMouseOverTooltip) {
        //console.log("isMouseOverTooltip is true");
		return;
	} else if(this.tooltip) {
        //console.log("Popping down tooltip");
		this.tooltip.setSticky(false);
		this.tooltip.popdown();
	}
};

EmailTooltipZimlet.prototype.popdown =
function() {
	this._hoverOver =  false;
	
	if(this.tooltip) {
		this.tooltip.setSticky(false);
		this.tooltip.popdown();
	}
};

EmailTooltipZimlet.prototype.addSubscriberZimlet =
function(subscriberZimlet, isPrimary, cbObject) {
    //debugger;
	this._subscriberZimlets.push(subscriberZimlet);	
	if(isPrimary) {
		this.primarySubscriberZimlet = subscriberZimlet;
	}

    // Presence provider set up - only one presence provider assumed

    if (cbObject && cbObject.presenceCallback && !this._presenceProvider){
        this._presenceProvider = cbObject.presenceCallback;
    }
};

// This is called by the zimlet framework.
EmailTooltipZimlet.prototype.onEmailHover = function(object, context, x, y, span) {
	var shell = DwtShell.getShell(window);
	var tooltip = shell.getToolTip();
	tooltip.setContent('<div id="zimletTooltipDiv"/>', true);
	this.x = x;
	this.y = y;
	if (!this.toolTipPoppedUp(span, object, context, document.getElementById("zimletTooltipDiv"))) {
		tooltip.popup(x, y, true, new AjxCallback(this, this.hoverOut, object, context, span));
	}
	// return true for now - not sure how to determine whether non-empty tooltip actually shown
	return true;
};

EmailTooltipZimlet.prototype.toolTipPoppedUp =
function(spanElement, contentObjText, matchContext, canvas) {
	var tooltip = appCtxt.getToolTipMgr().getToolTip(ZmToolTipMgr.PERSON, {address:contentObjText});
	if (tooltip) {
		// for some reason canvas is not the live element, need to fetch it from DOM here
		var tooltipDiv = document.getElementById("zimletTooltipDiv");
		if (tooltipDiv) {
			tooltipDiv.innerHTML = tooltip;
		}
		return false;
	}
	return true;
};

// This is called from the core tooltip manager.
EmailTooltipZimlet.prototype.onHoverOverEmailInList =
function(object, ev, noRightClick) {

	if (!object || !object.address) {
		return false;
	}
	var x = ev ? ev.docX : this.x;
	var y = ev ? ev.docY : this.y;
	this.noRightClick = noRightClick;
	
	var shell = DwtShell.getShell(window);
	var manager = shell.getHoverMgr();
	manager.setHoverOutDelay(500);
	
	return this.handleHover(object, null, x, y);
};

// return true if we have handled the hover
EmailTooltipZimlet.prototype.handleHover =
function(object, context, x, y, span, spanId) {

	this._hoverOver = true;
	this._initializeProps(object, context, x, y, span);
	appCtxt.notifyZimlets("onEmailHoverOver", [this], {waitUntilLoaded:true});
	if (this.primarySubscriberZimlet) {
		this.primarySubscriberZimlet.showTooltip();
		return true;
	}

    this._unknownPersonSlide = new UnknownPersonSlide();
    this._unknownPersonSlide.onEmailHoverOver(this);
    this._unknownPersonSlide.showTooltip();
    return true;
};

EmailTooltipZimlet.prototype._initializeProps =
function(object, context, x, y, span) {
	if (!this.seriesAnimation) {
		this.seriesAnimation = new SeriesAnimation();
	}
	this.seriesAnimation.reset();
	var shell = DwtShell.getShell(window);
	var tooltip = shell.getToolTip();
	tooltip.setContent("<div id=\"zimletTooltipDiv\"></div>", true);
	this.x = x;
	this.y = y;
	this.tooltip = tooltip;
	//this is used by mail/conv list
	tooltip.setListener((AjxEnv.isIE8 ?
	                     DwtEvent.ONMOUSELEAVE : DwtEvent.ONMOUSEOUT),
	                    new AjxListener(this, this.hoverOut));

	var addr = (object.isAjxEmailAddress) ? object.address : object;

	addr = AjxStringUtil.parseMailtoLink(addr).to;
	this.emailAddress = addr;
	this.fullName = (object instanceof AjxEmailAddress) ? object.name : "";
	this.canvas =   document.getElementById("zimletTooltipDiv");
	this.slideShow = new EmailToolTipSlideShow(this, this.canvas);
	this.contextMenu = this.getActionMenu(object, span, context, false);
};

EmailTooltipZimlet.prototype._preLoadImgs =
function() {
	this._busyImg = new Image();
	this._busyImg.src = this.getResource("img/EmailZimlet_busy.gif");
	this._unknownPersonImg = new Image();
	this._unknownPersonImg.src = this.getResource("img/UnknownPerson_dataNotFound.jpg");
};

EmailTooltipZimlet.prototype.showBusyImg =
function(timeoutCallback, xOffset, yOffset) {
	var top = yOffset ? this.y + yOffset : this.y;
	var left = xOffset ? this.x + xOffset : this.x;

	this._busyImg.style.top = top;
	this._busyImg.style.left = left;
	this._busyImg.style.display = "block";
	this._busyImg.style.position = "absolute";
	this._busyImg.style.zIndex = "500";
	this._busyImgTimer = setTimeout(AjxCallback.simpleClosure(this._handleNoImg, this, timeoutCallback), 4000);//hide busyImg after 4 secs
};

EmailTooltipZimlet.prototype.showLoadingAtId =
function(timeoutCallback, id) {
	var div = document.getElementById(id);
	div.innerHTML = ["<br/><br/><label style='color:gray'>", ZmMsg.loading, "</label>"].join("");
	this._busyImgTimer = setTimeout(AjxCallback.simpleClosure(this._handleNoImgAtId, this, timeoutCallback, id), 4000);//hide busyImg after 4 secs
};

EmailTooltipZimlet.prototype._handleNoImgAtId =
function(timeoutCallback, id) {
	clearTimeout(this._busyImgTimer);
	if (timeoutCallback) {
		timeoutCallback.run();
	}
};


EmailTooltipZimlet.prototype._handleNoImg =
function(timeoutCallback) {
	clearTimeout(this._busyImgTimer);
	this._busyImg.style.zIndex = "100";
	this._busyImg.style.display = "none";
	if (timeoutCallback) {
		timeoutCallback.run();
	}
};

EmailTooltipZimlet.prototype.hideBusyImg =
function() {
	clearTimeout(this._busyImgTimer);
	this._busyImg.style.zIndex = "100";
	this._busyImg.style.display = "none";
};

EmailTooltipZimlet.prototype._getAddress =
function(obj) {
	return obj.isAjxEmailAddress ? obj.address : obj;
};

// To call a phone by clicking on it in the contact card

EmailTooltipZimlet.prototype._phoneListener = function(phone) {
    if (!phone) return;
    appCtxt.notifyZimlets("onPhoneClicked", [phone], {waitUntilLoaded:true});
};

EmailTooltipZimlet.prototype._imListener = function(imURI) {
    if (!imURI) return;
};

/**
 * Helper function
 */
EmailTooltipZimlet.prototype.animateOpacity =
function(id, opacStart, opacEnd, millisec) {
	// create a starting point
	this.changeOpac(opacStart, document.getElementById(id).style);

	//speed for each frame
	var speed = Math.round(millisec / 100);
	var timer = 0;
	var styleObj = document.getElementById(id).style;

	// determine the direction for the blending, if start and end are the same nothing happens
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

/**
 * Change the opacity for different browsers
 */
EmailTooltipZimlet.prototype.changeOpac =
function(opacity, styleObj) {
	styleObj.opacity = (opacity / 100);
	styleObj.MozOpacity = (opacity / 100);
	styleObj.KhtmlOpacity = (opacity / 100);
	styleObj.zoom = 1;
};

EmailTooltipZimlet.prototype.openCenteredWindow =
function (url) {
	this.popdown();
	var width = 800;
	var height = 600;
	var left = parseInt((screen.availWidth / 2) - (width / 2));
	var top = parseInt((screen.availHeight / 2) - (height / 2));
	var windowFeatures = "width=" + width + ",height=" + height + ",status,resizable,left=" + left + ",top=" + top + "screenX=" + left + ",screenY=" + top;
	var win = window.open(url, "subWind", windowFeatures);
	if (!win) {
		this._showWarningMsg(ZmMsg.popupBlocker);
	}
};
