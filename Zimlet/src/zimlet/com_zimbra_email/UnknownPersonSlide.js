/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
* A tooltip based implementation for a generic contact.
* This class forms the basis for creating an extensible contact card
* into which a customer can add other services such as LinkedIn, TwitterSearch, Click2Call etc.
*
* The basic design is to have the tooltip as the canvas for the contact card.
* The extensions to the basic card (e.g. Linked-in, Click to Call) are added as "slides" into the card.
* Clicking on these extensions could open the corresponding application either in the tooltip itself or outside.
*
* Since tooltips are hidden on mouse movement, we need to make the tooltip to stay around
* by setting the sticky flag on the tooltip.
*
* A word of caution: the tooltip is a singleton, so making it unsticky asap is important for application
* responsiveness.
*/
function UnknownPersonSlide() {
}

//Static variables
UnknownPersonSlide.PHOTO_ID = "unkownPerson_photoBG";
UnknownPersonSlide.PHOTO_PARENT_ID = "unkownPerson_photoBGDiv";
UnknownPersonSlide.TEXT_DIV_ID = "unkownPerson_TextDiv";
UnknownPersonSlide.DOMAIN = "";

UnknownPersonSlide.WIDTH = 65;
UnknownPersonSlide.HEIGHT = 80;

/**
* Implement onEmailHoverOver to get notified by Email tooltip zimlet.
* This function registers UnkownPerson Zimlet as a subscriber Zimlet
*/
UnknownPersonSlide.prototype.onEmailHoverOver =
function(emailZimlet) {
	emailZimlet.addSubscriberZimlet(this, false);
	this.emailZimlet = emailZimlet;
	this._alwaysSetTooltipToSmall();
    this._presenceCache = this.emailZimlet._presenceCache;
    //appCtxt.getAppController().activateApp(ZmApp.CONTACTS);
};

UnknownPersonSlide.prototype._alwaysSetTooltipToSmall =
function() {
	var tooltipSize = EmailToolTipPrefDialog.DIMENSIONS[EmailToolTipPrefDialog.SIZE_VERYSMALL];
	var size = tooltipSize.replace(/px/ig, "");
	var arry = size.split(" x ");
	this._tooltipWidth = arry[0];
	this._tooltipHeight = arry[1];
};

/**
* This is called by Email Zimlet when user hovers over an email
*/
UnknownPersonSlide.prototype.showTooltip =
function() {
    if (appCtxt.get(ZmSetting.CALENDAR_ENABLED)) {
        this._setCalendarFrame();    // New appointment
    }

    if (appCtxt.get(ZmSetting.MAIL_ENABLED)) {
        this._setMailFrame();        // New message
    }

    this._setContactFrame();     // "Home" slide for the contact.

	this.emailZimlet.tooltip.popup(this.emailZimlet.x, this.emailZimlet.y, true, null);
	this._slide.select();
};

UnknownPersonSlide.prototype._setContactFrame =
function() {
	this.emailZimlet.hideBusyImg();
	var tthtml = this._getTooltipBGHtml();
	var selectCallback = new AjxCallback(this, this._handleContactSlideSelect);
	this._slide = new EmailToolTipSlide(tthtml, true, "UnknownPerson_contact", selectCallback, this.emailZimlet.getMessage("slideTooltip"));
	this.emailZimlet.slideShow.addSlide(this._slide);
	this._mainDiv = document.getElementById(UnknownPersonSlide.TEXT_DIV_ID);
	this._slide.setCanvasElement(this._mainDiv);
};

UnknownPersonSlide.prototype._setMailFrame =
    function() {
        var selectCallback = new AjxCallback(this, this._handleMailSlideSelect);
        var slide = new EmailToolTipSlide(null, true, "Mail_icon", selectCallback, this.emailZimlet.getMessage("slideMailTooltip"));
        this.emailZimlet.slideShow.addSlide(slide);
    };

UnknownPersonSlide.prototype._setCalendarFrame =
    function() {
        var selectCallback = new AjxCallback(this, this._handleCalendarSlideSelect);
        var slide = new EmailToolTipSlide(null, true, "Calendar_icon", selectCallback, this.emailZimlet.getMessage("slideCalendarTooltip"));
        this.emailZimlet.slideShow.addSlide(slide);
    };

UnknownPersonSlide.prototype._setChatFrame =
	function() {
		var selectCallback = this._handleChatSlideSelect.bind(this);
		var slide = new EmailToolTipSlide(null, true, "Conversation_icon", selectCallback, this.emailZimlet.getMessage("slideChatTooltip"));
		this.emailZimlet.slideShow.addSlide(slide);
	};

UnknownPersonSlide.prototype._setPresence =
    function() {

    };

UnknownPersonSlide.prototype._handleImgLoadFailure =
function() { // on failure to load img within 5 secs, otherwise load an dataNotFound image
	var img = new Image();
	img.onload = AjxCallback.simpleClosure(this._handleImageLoad, this, img);
	img.id = UnknownPersonSlide.PHOTO_ID;
	img.src = this.emailZimlet.getResource("img/UnknownPerson_dataNotFound.jpg");
};

UnknownPersonSlide.prototype._handleImageLoad =
function(img) {
	this.emailZimlet.hideBusyImg();
	var div = document.getElementById(UnknownPersonSlide.PHOTO_PARENT_ID);
	if(!div) {
		return;
	}
	div.innerHTML = "";
	div.style.textAlign = "center";
	div.appendChild(img);
	if (this.emailZimlet.emailAddress.indexOf(UnknownPersonSlide.DOMAIN) != -1) {
		img.onclick =  AjxCallback.simpleClosure(this._handleProfileImageClick, this); 
		img.style.cursor = "pointer";
	}
};

UnknownPersonSlide.prototype._handleProfileImageClick =
    function() {

    };

UnknownPersonSlide.prototype._handleAllClicks =
function(ev) {
	var isRightClick;
	this.emailZimlet.popdown();
	ev = DwtUiEvent.getEvent(ev);
	if (ev.which){
		isRightClick = (ev.which == 3);
	} else if (ev.button) {
		isRightClick = (ev.button == 2);
	}
	if(isRightClick) {
		return;
	}

	//if its not right click.. 
	var dwtev = DwtShell.mouseEvent;
	dwtev.setFromDhtmlEvent(ev);
	var el = dwtev.target;
	if(el.id == "UnknownPersonSlide_EmailAnchorId") {
		this._composeListener(null, this.emailZimlet.emailAddress);
	} else if(el.id == "UnknownPersonSlide_NameAnchorId") {
		this._contactListener(true);
	}
    else if (el.id == "UnknownPersonSlide_mobilePhoneAnchorId" &&
		appCtxt.getSettings()._hasVoiceFeature()) {
        this.emailZimlet._phoneListener(this.attribs && this.attribs.mobilePhone);
    }
    else if (el.id == "UnknownPersonSlide_workPhoneAnchorId" &&
		appCtxt.getSettings()._hasVoiceFeature()) {
        this.emailZimlet._phoneListener(this.attribs && this.attribs.workPhone);
    }
    else if (el.id == "UnknownPersonSlide_imAnchorId" &&
		appCtxt.getSettings()._hasVoiceFeature()) {
        ZmZimbraMail.unloadHackCallback();
        location.href = this.imURI;
        this.emailZimlet._imListener(this.imURI);
        return false;
    }
};

UnknownPersonSlide.prototype._handleRightClick =
function(ev) {
	var rightclick;
	if (!ev) {
		var ev = window.event;
	}
	if (ev.which){
		rightclick = (ev.which == 3);
	} else if (ev.button) {
		rightclick = (ev.button == 2);
	}
	if(!rightclick) {
		return;
	}
	this.emailZimlet.popdown();
	DwtUiEvent.setBehaviour(ev, true, false);
	this.emailZimlet.contextMenu.popup(100, this.emailZimlet.x, this.emailZimlet.y);
};

UnknownPersonSlide.prototype._handleContactSlideSelect =
function() {
	if (this._slide.loaded) {
		return;
	}
	this._slide.loaded = true;
	this._getContactDetailsAndShowTooltip();
};

UnknownPersonSlide.prototype._handleMailSlideSelect =
    function() {
        this.emailZimlet.popdown();
        this._composeListener(null, this.emailZimlet.emailAddress);
    };

UnknownPersonSlide.prototype._handleCalendarSlideSelect =
    function() {
        this.emailZimlet.popdown();
        var appt = new ZmAppt();
        var c =  this._getActionedContact() || new AjxEmailAddress(this.emailZimlet.emailAddress);
        appt.setAttendees(c, ZmCalBaseItem.PERSON);
        AjxDispatcher.run("GetCalController").newAppointment(appt, null, null, null);
    };

UnknownPersonSlide.prototype._handleChatSlideSelect =
	function() {
		this.emailZimlet.popdown();
		appCtxt.getAppController().getApp(ZmApp.CHAT).startChat(this.xmppURI);
	};


UnknownPersonSlide.prototype._getContactDetailsAndShowTooltip =
function() {
	this._slide.setInfoMessage(this.emailZimlet.getMessage("loading"));

    var contactList = AjxDispatcher.run("GetContacts");
    var localContact = contactList ? contactList.getContactByEmail(this.emailZimlet.emailAddress) : null;
    if (!appCtxt.get(ZmSetting.GAL_ENABLED)) {
        this._handleContactDetails(localContact);
    } else {
    	//search in the GAL
		var jsonObj, request, soapDoc;
		jsonObj = {SearchGalRequest:{_jsns:"urn:zimbraAccount"}};
		request = jsonObj.SearchGalRequest;
		request.type = "account";
		request.name = this.emailZimlet.emailAddress;
		request.offset = 0;
		request.limit = 3;
		var callback = new AjxCallback(this, this._handleContactDetails, localContact);
		appCtxt.getAppController().sendRequest({jsonObj:jsonObj,asyncMode:true,callback:callback, noBusyOverlay:true});
	}

};


// Common code for AB & GAL search
// If response is not undefined, the call is from the GAL search handler
// If contact is not undefined, the call is from AB
UnknownPersonSlide.prototype._handleContactDetails = function(contact, response) {

	var attrs = {};
    var id = null;
	if (response) {
		var data = response.getResponse();
        var r = data.SearchGalResponse;
		var cn = r.cn;
		if (cn && cn[0]) {
            id = cn[0].id;
			attrs = AjxUtil.hashCopy(cn[0]._attrs, ['objectClass']);
		}
    }

	if (contact && contact.attr) {
        AjxUtil.hashUpdate(attrs, contact.attr, true);
	}

    attrs["fullName"] =  this.emailZimlet.fullName || attrs["fullName"] || contact && contact._fileAs;
    this._presentity = attrs["email"] = this.emailZimlet.emailAddress || attrs["email"];        // email is the presence identity

	var imgUrl = contact && contact.getImageUrl(UnknownPersonSlide.WIDTH, UnknownPersonSlide.HEIGHT);

	this._setProfileImage(imgUrl);
	this._setContactDetails(attrs);
    // Retrieve the presence information from the presence provider - e.g. Click2Call
	this._popupToolTip();
    this._setPresenceUI();
};

UnknownPersonSlide.prototype._getPresence =
    function() {
        var now = new Date();

        // Do we have the presence data for this user in the presence cache
        // Also check for cache staleness: currently anything over 30 secs is considered stale
        var then = this._presenceCache[this._presentity] && this._presenceCache[this._presentity].timestamp || 0;

        if (now - then < 5000)  {
            return this._presenceCache[this._presentity];
        }

        if (this.emailZimlet._presenceProvider)  {
            this.emailZimlet._presenceProvider(this._presentity, this._handlePresence.bind(this));
        }
        return null;
};

//
// Callback from the presence provider.
// Valid values for value are: "AVAILABLE", "UNAVAILABLE", "DND", "AWAY"  etc.
//

UnknownPersonSlide.prototype._handlePresence =
    function(presenceObject) {
        if (!presenceObject){
            return;
        }
        var obj = this._presenceCache[this._presentity];
        if (!obj) {
            obj = this._presenceCache[this._presentity] = {};
        }
       	obj.presenceStatus = presenceObject.presenceStatus;
		obj.notes = presenceObject.notes;
        obj.timestamp = new Date();
        this._setPresenceUI();
    }

UnknownPersonSlide.prototype._popupToolTip =
function() {
	this.emailZimlet.tooltip.popup(this.emailZimlet.x, this.emailZimlet.y, true, null);
};

UnknownPersonSlide.prototype._getTooltipBGHtml =
function(email) {
	var width = ";";
	var left = ";";
	if (AjxEnv.isIE8) {
		var width = "width:100%;";
		var left = "left:3%;";
	}
	var subs = {
		photoParentId: UnknownPersonSlide.PHOTO_PARENT_ID,
		textDivId: UnknownPersonSlide.TEXT_DIV_ID,
		width: width,
		left: left
	};
	return AjxTemplate.expand("com_zimbra_email.templates.Email1#Frame", subs);
};

UnknownPersonSlide.prototype._setContactDetails =
function(attrs) {
	if (attrs.workState || attrs.workCity || attrs.workStreet || attrs.workPostalCode) {
		var workState = attrs.workState || "";
		var workCity = attrs.workCity || "";
		var workStreet = attrs.workStreet || "";
		var workPostalCode = attrs.workPostalCode || "";

		var pattern = this.emailZimlet.getMessage("postalAddress");
		var formatter = new AjxMessageFormat(pattern);
		var args = [workStreet, workCity, workState, workPostalCode];
		var address = AjxStringUtil.trim(formatter.format(args), true);

		attrs["address"] = AjxStringUtil.trim(address);
	}

    var im = attrs["imAddress"] || attrs["imAddress1"]  || attrs["imAddress2"]  || attrs["imAddress3"];
    if (im) {
        var imParts = im.split(":");
        if (imParts.length == 2){
			var imProtocol = imParts[0];
			im = im.split(":")[1];
            if (imProtocol && imProtocol == "xmpp") {
                if (appCtxt.get(ZmSetting.CHAT_FEATURE_ENABLED) && appCtxt.get(ZmSetting.CHAT_ENABLED)) {
                    var chatApp = appCtxt.getAppController().getApp(ZmApp.CHAT);
                    if (chatApp && chatApp.getRosterContact(im.substring(2))) {
                        this.xmppURI = attrs["xmppURI"] = AjxStringUtil.htmlEncode(im.substring(2));
                        this._setChatFrame();
                    }
                }
            } else {
                if (imProtocol && imProtocol == "other") {
                    imProtocol = "im";
                }
                else if (imProtocol && imProtocol == "aol") {
                    imProtocol = "aim";
                }
                im = "<a  id='UnknownPersonSlide_imAnchorId' href='" + imProtocol + ":" + AjxStringUtil.htmlEncode(im.substring(2)) + "'>" + AjxStringUtil.htmlEncode(im.substring(2)) + "</a>";
                this.imURI = attrs["imURI"] = im;
            }

        }
    } else if (appCtxt.get(ZmSetting.CHAT_FEATURE_ENABLED) && appCtxt.get(ZmSetting.CHAT_ENABLED)) {
        var chatApp = appCtxt.getAppController().getApp(ZmApp.CHAT);
        if (chatApp) {
            for (var i = 0; i < 4; i++) {
                var emailAddr = "email" + ((i == 0) ? "" : i);
                if (attrs[emailAddr] && chatApp.getRosterContact(attrs[emailAddr])) {
                    //check if this contact is part of the buddy list.
                    this.xmppURI = AjxStringUtil.htmlEncode(attrs[emailAddr]);
                    this._setChatFrame();
                    break;
                }
            }
        }
    }

	if (!this.emailZimlet.noRightClick) {
        attrs["rightClickForMoreOptions"] = false;
	}
    this.attribs = attrs;
    attrs = this._formatTexts(attrs);

	var iHtml = AjxTemplate.expand("com_zimbra_email.templates.Email1#ContactDetails", attrs),
		textDiv = document.getElementById(UnknownPersonSlide.TEXT_DIV_ID),
		frame = document.getElementById("UnknownPersonSlide_Frame");

	if (textDiv) {
		textDiv.innerHTML = iHtml;
	}
	if (frame) {
		frame.onmouseup =  AjxCallback.simpleClosure(this._handleAllClicks, this);
	}
};

UnknownPersonSlide.prototype._formatTexts =
function(attrs) {
	var email = attrs.email ? attrs.email : "";
	attrs["formattedEmail"] = email;
	if(email.length > 25) {
		var tmp = email.split("@");
		var fPart = tmp[0];
		var lPart = tmp[1];
		if(fPart.length > 25){
			fPart = fPart.substring(0, 24) + "..";
		}
		attrs["formattedEmail"] = [fPart, " @", lPart].join("");
	}
	var fullName = attrs.fullName ? attrs.fullName : "";
	if(fullName  ==  email) {
		attrs["fullName"] = "";
	}
	return attrs;
};

UnknownPersonSlide.prototype._setProfileImage =
function(imgUrl) {
	var div = document.getElementById(UnknownPersonSlide.PHOTO_PARENT_ID);
	if (!div || !this.emailZimlet.emailAddress) {
		return;
	}
	if (this.emailZimlet.emailAddress.indexOf(UnknownPersonSlide.DOMAIN) == -1 || !imgUrl || !div) {
		this._handleImgLoadFailure();
		return;
	}
	div.width = div.style.width = UnknownPersonSlide.WIDTH;
	div.height = div.style.height = UnknownPersonSlide.HEIGHT;

	var img = new Image();
	img.onload = AjxCallback.simpleClosure(this._handleImageLoad, this, img);
	img.onerror = function() {
		this.onerror = null;
		this.src = ZmZimbraMail.DEFAULT_CONTACT_ICON;
	};
	img.src = imgUrl;
	var timeoutCallback = new AjxCallback(this, this._handleImgLoadFailure);
	this.emailZimlet.showLoadingAtId(timeoutCallback, UnknownPersonSlide.PHOTO_PARENT_ID);
};

UnknownPersonSlide.prototype._contactListener =
	function() {
		this.emailZimlet.popdown();
		var loadCallback = new AjxCallback(this, this._handleLoadContact);
		AjxDispatcher.require(["ContactsCore", "Contacts"], false, loadCallback, null, true);
	};

UnknownPersonSlide.prototype._handleLoadContact =
	function() {
		var contact = this._getActionedContact(true);

		var isDirty = this._isNewContact;

		if (window.parentAppCtxt) {
			var capp = window.parentAppCtxt.getApp(ZmApp.CONTACTS);
			capp.getContactController().show(contact, isDirty);
		} else {
			AjxDispatcher.run("GetContactController").show(contact, isDirty);
		}
	};

UnknownPersonSlide.prototype._composeListener =
	function(ev, addr) {

		this.emailZimlet.popdown();

		var obj = this.emailZimlet._actionObject;
		addr = addr ? this.emailZimlet._getAddress(addr) : (obj ? this.emailZimlet._getAddress(obj) : "");

		var params = {};
		var inNewWindow = (!appCtxt.get(ZmSetting.NEW_WINDOW_COMPOSE) && ev && ev.shiftKey) ||
			(appCtxt.get(ZmSetting.NEW_WINDOW_COMPOSE) && ev && !ev.shiftKey);

		params.action = ZmOperation.NEW_MESSAGE;
		params.inNewWindow = inNewWindow;
		if (!params.toOverride) {
			params.toOverride = addr + AjxEmailAddress.SEPARATOR;
		}
		if (obj && obj.isAjxEmailAddress && obj.address == addr) {
			params.toOverride = obj;
		}

		AjxDispatcher.run("Compose", params );
	};

UnknownPersonSlide.prototype._getActionedContact =
	function(create) {
		// actionObject can be a ZmContact, a String, or a generic Object (phew!)
		var contact;
		var addr = this.emailZimlet._actionObject;
		if (addr) {
			if (addr.isZmContact) {
				contact = this._actionObject;
			} else if (AjxUtil.isString(addr)) {
				addr = this.emailZimlet._getAddress(addr);
				contact = AjxDispatcher.run("GetContacts").getContactByEmail(addr);
			} else {
				contact = AjxDispatcher.run("GetContacts").getContactByEmail(addr.address);
			}
		}
		this._isNewContact = false;
		if (contact == null && create) {
			this._isNewContact = true;
			contact = new ZmContact(null);
			contact.initFromEmail(addr);
		}
		return contact;
	};

/***
 * <person id ="p1"  >
 <activities>
 <available/>
 </activities>
 </person>
 Busy
 <person id="p2" >
 <activities>
 <busy/>
 </activities>
 </person>
 Do Not Disturb
 <person id="p3" >
 <activities>
 <dnd/>
 </activities>
 </person>
 Away
 <person id="p4" >
 <activities>
 <away/>
 </activities>
 </person>
 On Vacation
 <person id="p5" >
 <activities>
 <vacation/>
 </activities>
 </person>
 Unavailable
 <person id="p6" >
 <activities>
 <unavailable/>
 </activities>
 </person>
 Unknown
 <person id="p7" >
 <activities>
 <unknown/>
 </activities>
 </person>
 */

UnknownPersonSlide.prototype._isKnownPresenceCode =
    function(presence) {
         if (!this._presenceCodes){
             var status_array = ["dnd", "vacation", "on-the-phone", "busy", "unavailable", "away", "available", "unknown"];
             this._presenceCodes = {};
             for (var i=0; i < status_array.length; i++){
                 this._presenceCodes[status_array[i]] = true;
             }
         }
         return this._presenceCodes[presence];
    }

UnknownPersonSlide.prototype._setPresenceUI =
    function() {
        var presenceObj = this._getPresence();
        var presence =  presenceObj && presenceObj.presenceStatus;
        var row = document.getElementById("row_Presence");
        var div = document.getElementById("img_Presence");
        var txt = document.getElementById("text_Presence");
        if (!row || !div || !txt){
            return;
        }
        // If no presence info, hide the row.
        if (presence){
            if (!this._isKnownPresenceCode(presence)) {
                presence = "unknown";
            }
            row.style.display = "";
            var normalizedPresence = presence.split("-").join(""); // remove hyphens (e.g. on-the-phone)
            div.className = "Img_" + normalizedPresence;
			if (presenceObj.notes) {
				txt.innerHTML = presenceObj.notes;
			}
			else {
            	txt.innerHTML = this.emailZimlet.getMessage("msg_"+normalizedPresence);
			}
        }
        else {
            row.style.display = "none";
        }
        return;
    }
