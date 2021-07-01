/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

EmailToolTipSlideShow.mainDivId = "EmailZimlet_slidesMainDiv";
EmailToolTipSlideShow.navDivId = "EmailZimlet_slidesNavDiv";
EmailToolTipSlideShow.navTableRowId = "EmailZimlet_slidesNavTableRow";

function EmailToolTipSlideShow(zimlet, canvas) {
	this.slidesIconAndSlideMap = [];
	this.numberOfSlides = 0;
	this.emailZimlet = zimlet;
	this.canvas = canvas;
	this._createFrame(canvas);
	this.mainDiv = document.getElementById(EmailToolTipSlideShow.mainDivId);
	this.navDiv = document.getElementById(EmailToolTipSlideShow.navDivId);
	this.navTableRow = document.getElementById(EmailToolTipSlideShow.navTableRowId);
	this.currentSelectCellId = null;
	this.currentSlideId = null;
	this.navDiv.onclick = AjxCallback.simpleClosure(this._handleClick, this);
	canvas.onmouseover =  AjxCallback.simpleClosure(this.handleMouseOver, this);
	canvas.onmouseout = AjxCallback.simpleClosure(this.handleMouseOut, this);
	//set height and width to make it work in IE
	this.mainDiv.style.width = EmailTooltipZimlet.tooltipWidth + "px";
	this.navDiv.style.width = EmailTooltipZimlet.tooltipWidth + "px";
};

EmailToolTipSlideShow.prototype._createFrame =
function(canvas) {
	canvas.innerHTML = ["<div id='", EmailToolTipSlideShow.mainDivId,"'></div>",
						"<div id='", EmailToolTipSlideShow.navDivId, "'>",
						"<div class='horizsep'></div>",
						"<table width=100%><tr id='",EmailToolTipSlideShow.navTableRowId,"'>",
						"</tr></table></div>"].join("");
};

EmailToolTipSlideShow.prototype._handleClick =
function(e) {
	if (!e){
		var e = window.event;
	}
	var targ;
	if (e.target) {
		targ = e.target;
	} else if (e.srcElement) {
		targ = e.srcElement;
	}
	if (targ.nodeType == 3) {
		targ = targ.parentNode;
	}
	if(targ.id) {
		if(this.slidesIconAndSlideMap[targ.id]){
			this.slidesIconAndSlideMap[targ.id].select();
		}
	}
};

EmailToolTipSlideShow.prototype.addSlide =
function(slide, index) {
	slide.slideShow = this;
	if(!index) {
		index = this.numberOfSlides;
	}
	this.slidesIconAndSlideMap[slide.iconDivId] = slide;
	var div  =  document.createElement("div");
	div.id = slide.id;
	div.style.display = "none";
	this.mainDiv.appendChild(div);
	div.innerHTML = slide.html;

	this._insertSlideIcon(slide);
	this.numberOfSlides++;
};

EmailToolTipSlideShow.prototype._insertSlideIcon =
function(slide) {
	var iconName = slide.iconName;
	var iconDivId = slide.iconDivId;
	var selectCellId = slide.selectCellId;
	var name = slide.name;
	var iconCell = this.navTableRow.insertCell(0);
	this._insertIconHtml(iconCell, selectCellId, name, iconDivId, iconName);
};

EmailToolTipSlideShow.prototype._insertIconHtml =
function(iconCell, selectCellId, name, iconDivId, iconName) {
	iconCell.align="center";
	iconCell.id = selectCellId;

	iconCell.innerHTML = ["<div title='",name,"' id='",iconDivId,"' class='Img", iconName, "' style='cursor:pointer;'></div>"].join("");
};

EmailToolTipSlideShow.prototype.handleMouseOver =
function() {
	this.isMouseOverTooltip = true;
};

EmailToolTipSlideShow.prototype.handleMouseOut =
function() {
	this.isMouseOverTooltip = false;
	this.emailZimlet.hoverOut();

};
