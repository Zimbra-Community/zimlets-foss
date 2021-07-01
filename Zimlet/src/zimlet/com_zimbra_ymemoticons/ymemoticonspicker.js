/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2007, 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

YMEmoticonsPickerButton = function(params, popBelow){

	if (arguments.length == 0) return;
	params.actionTiming = DwtButton.ACTION_MOUSEUP;
    DwtToolBarButton.call(this, params);
	this.setEmoticon();
	if(popBelow && popBelow == true)
		this.setMenu(new AjxCallback(this, this._createMenu), false, false, false);
	else
		this.setMenu(new AjxCallback(this, this._createMenu), false, false, true);

};

YMEmoticonsPickerButton.prototype = new DwtToolBarButton;
YMEmoticonsPickerButton.prototype.constructor = YMEmoticonsPickerButton;

YMEmoticonsPickerButton.prototype._createMenu = function() {
        var menu = new DwtMenu({parent:this, style:DwtMenu.GENERIC_WIDGET_STYLE});
        this._picker = new YMEmoticonsPicker(menu,null,null);
	    this._picker.addSelectionListener(new AjxListener(this, this._smileyPicked));
        return menu;
};

YMEmoticonsPickerButton.prototype.setEmoticon = function(id){
	var smiley = id
			? YMEmoticonsPicker.SMILEYS[id]
			: YMEmoticonsPicker.getDefaultSmiley();

	if (smiley) {
		this._smileyButtonDiv.src = smiley.src;
		this._smiley = smiley;
	}
};

YMEmoticonsPickerButton.prototype._createHtmlFromTemplate = function(templateId, data) {

    DwtButton.prototype._createHtmlFromTemplate.call(this, templateId, data);

 	var id = Dwt.getNextId();
 	var displayHtml = "<div unselectable><img width='18' src='' id='"+ id+"_smiley'></div>";
	this.setText(displayHtml);

    this._smileyButtonDiv = document.getElementById( id+"_smiley");

    delete id;
};

YMEmoticonsPickerButton.prototype.getSmiley = function(id){
	return this._picker.getSmiley(id);
};

YMEmoticonsPickerButton.prototype.getSelectedSmiley = function(){
	return this._smiley;
};

YMEmoticonsPickerButton.prototype._smileyPicked = function(ev){

	var id = ev.detail;
	this.setEmoticon(id);

	if (this.isListenerRegistered(DwtEvent.SELECTION)) {
 		var selEv = DwtShell.selectionEvent;
 		selEv.item = this;
 		this.notifyListeners(DwtEvent.SELECTION, selEv);
 	}
};

//----------------------------------------------------------------------------------

YMEmoticonsPicker = function(parent, className, posStyle){

    if (arguments.length == 0) return;
	className = className || "DwtColorPicker";
	DwtControl.call(this, {parent:parent, className:className, posStyle:posStyle});

    this._createEmoticonsPicker(parent);

};

//Needs to act like a button, so DwtButton
YMEmoticonsPicker.prototype = new DwtControl;
YMEmoticonsPicker.prototype.constructor = YMEmoticonsPicker;
YMEmoticonsPicker.SMILEYS = Com_Zimbra_YMEmoticons.SMILEYS;

YMEmoticonsPicker.getDefaultSmiley = function() {
	for (var smiley in YMEmoticonsPicker.SMILEYS) {
		return YMEmoticonsPicker.SMILEYS[smiley];
	}
	return null;
};

YMEmoticonsPicker.prototype.getDefaultSmiley = YMEmoticonsPicker.getDefaultSmiley;

YMEmoticonsPicker.prototype._createEmoticonsPicker = function(parent){
	this._createEmoticonsTable();
	//this.setSize("250px",Dwt.DEFAULT);
	this._registerHandlers();
};

YMEmoticonsPicker.prototype.addSelectionListener =
function(listener) {
	this.addListener(DwtEvent.SELECTION, listener);
};

YMEmoticonsPicker.prototype.removeSelectionListener =
function(listener) {
	this.removeListener(DwtEvent.SELECTION, listener);
};

YMEmoticonsPicker.prototype.dispose =
function () {
	if (this._disposed) return;
	Dwt.disassociateElementFromObject(this.getHtmlElement().firstChild, this);
	DwtControl.prototype.dispose.call(this);
};

YMEmoticonsPicker.prototype.getSmiley = function(id){
	return YMEmoticonsPicker.SMILEYS[id];
};

YMEmoticonsPicker.EMOTICONS_PER_ROW = 11;
YMEmoticonsPicker.prototype._createEmoticonsTable = function(){
	var idx = 0;
	var html = [];
	var counter  = 0;
	var totalWidth = 0;
	var maxWidth = 0;
	var width = 0;
	var height =0;
	for(var smiley in YMEmoticonsPicker.SMILEYS){
		if( counter != 0 && !(counter % YMEmoticonsPicker.EMOTICONS_PER_ROW) ){ 
			html[idx++] = "</tr><tr>";
			if(totalWidth > maxWidth) {
				maxWidth = totalWidth;
			}
			totalWidth = 0;
		}
		width = YMEmoticonsPicker.SMILEYS[smiley].width;
		height = YMEmoticonsPicker.SMILEYS[smiley].height;
		html[idx++] = ["<td style='background-color:#FFFFFF;' align=\"center\" valign=\"middle\" id='", smiley , "' >"].join("");
		html[idx++] = ["<img  height='", height, "' width='", width, "' src='", YMEmoticonsPicker.SMILEYS[smiley].src, "'","  title='", YMEmoticonsPicker.SMILEYS[smiley].alt,"  ",YMEmoticonsPicker.SMILEYS[smiley].text,"'","  />"].join("");
		html[idx++] = "</td>";
		counter++;
		totalWidth = totalWidth + width;
	}

	html[idx++] = "</table>"

	var firstLine = ["<table  cellpadding='2' cellspacing='3' border='0' align='center' width='", maxWidth, "px'><tr>"].join("");

	this.getHtmlElement().innerHTML =  [firstLine, html.join("")].join("");

	if(AjxEnv.isFirefox1_5up && !AjxEnv.isFirefox3up){//for ff2
		this.setSize("480px", Dwt.DEFAULT);
	}


};

YMEmoticonsPicker.prototype._registerHandlers = function(){
	var table = this.getHtmlElement().firstChild;
	Dwt.associateElementWithObject(table, this);
	var rows = table.rows;
	var numRows = rows.length;

	for (var i = 0; i < numRows; i++) {
		var cells = rows[i].cells;
		var numCells = cells.length
		for (var j = 0; j < numCells; j++) {
			var cell = cells[j];
			Dwt.setHandler(cell, DwtEvent.ONMOUSEDOWN, YMEmoticonsPicker._mouseDownHdlr);
			Dwt.setHandler(cell, DwtEvent.ONMOUSEUP, YMEmoticonsPicker._mouseUpHdlr);
		}
	}
};

YMEmoticonsPicker._mouseDownHdlr = function(ev) {

	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev, true);
	var target = mouseEv.target;
	if (target.nodeName.toLowerCase() == "img")
		target = target.parentNode;

	mouseEv.dwtObj._downTdId = target.id;

	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);
	return false;


};

YMEmoticonsPicker._mouseUpHdlr = function(ev) {

	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev, true);
	var obj = mouseEv.dwtObj;

	var target = mouseEv.target;
	if (target.nodeName.toLowerCase() == "img")
		target = target.parentNode;

	if (obj._downTdId == target.id) {
		// If our parent is a menu then we need to have it close

		var smiley = YMEmoticonsPicker.SMILEYS[target.id];

		if(smiley) {
			// Call Listeners on mouseEv.target.id
			if (obj.isListenerRegistered(DwtEvent.SELECTION)) {
		    	var selEv = DwtShell.selectionEvent;
		    	DwtUiEvent.copy(selEv, mouseEv);
		    	selEv.item = obj;
		    	selEv.detail = target.id;
		    	obj.notifyListeners(DwtEvent.SELECTION, selEv);
		    }
		}

		if (obj.parent instanceof DwtMenu)
			DwtMenu.closeActiveMenu();

	}
	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev)
	return false;

};
