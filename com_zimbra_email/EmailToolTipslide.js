/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2012, 2013, 2014 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2012, 2013, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */

function EmailToolTipSlide(html, visible, iconName, selectCallback, name) {
	this.html = html;
	this.visible = visible;
	this.iconName = iconName;
	this.id = Dwt.getNextId();
	this.iconDivId = Dwt.getNextId();
	this.selectCellId = Dwt.getNextId();
	this.slideShow = null;
	this.canvasElement = null;
	this._selectCallback = selectCallback;
	this.name = name;
};

EmailToolTipSlide.prototype.select =
function() {
	if(this.slideShow.currentSlideId) {
		document.getElementById(this.slideShow.currentSlideId).style.display = "none";
	}

	document.getElementById(this.id).style.display = "block";

	this.slideShow.currentSlideId = this.id;
	if(this.slideShow.currentSelectCellId) {
		document.getElementById(this.slideShow.currentSelectCellId).style.background = "";
	}
	document.getElementById(this.selectCellId).style.display = "none";
	this.slideShow.currentSelectCellId = this.selectCellId;
	if(this._selectCallback) {
		this._selectCallback.run();
	}
};

/**
*Sets main div element that can be used to show info/error-msgs inline
*/
EmailToolTipSlide.prototype.setCanvasElement =
function(el) {
	this.canvasElement = el;
};

EmailToolTipSlide.prototype.setInfoMessage =
function(msg) {
	this._appendMsg2Slide(msg, "EmailToolTipSlideMsgColor");
};

EmailToolTipSlide.prototype.setErrorMessage =
function(msg) {
	this._appendMsg2Slide(msg, "EmailToolTipSlideErrorColor");
};

EmailToolTipSlide.prototype._appendMsg2Slide =
function(msg, colorClass) {
	var html = ["<div class='EmailToolTipSlideText ",colorClass,"'>",msg,"</div>"].join("");
	if(this.canvasElement) {
		this.canvasElement.innerHTML = html;
	}
};

EmailToolTipSlide.prototype.clearSlideMessage =
function(msg, colorClass) {
	if(this.canvasElement) {
		this.canvasElement.innerHTML = "";
	}
};
