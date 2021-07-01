/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2008, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2008, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

YLocalDialog = function(shell, className, parent,msg,showZip) {
	className = className || "YSymbolsDialog";
	this._zimlet = parent;
	var title = "Select Option";
	DwtDialog.call(this, {parent:shell, className:className, title:title});
	this._createSearchHtml(msg,showZip);
	//DBG.println("user prop:"+this._zimlet.getUserProperty("Yahoo Local"));
};

YLocalDialog.prototype = new DwtDialog;
YLocalDialog.prototype.constructor = YLocalDialog;

YLocalDialog.prototype._lookupCallback;

YLocalDialog.prototype._createSearchHtml = function(msg,showZip) {

	this._textObj1 = new DwtInputField(this);
    this._textObj2 = new DwtInputField(this);
    this._lableObj = new DwtButton(this);

   
    var table = document.createElement("TABLE");
	table.border = 0;
	table.cellPadding = 0;
	table.cellSpacing = 4;
    var row;
    var cell;

    if(msg){
        row = table.insertRow(-1);
        cell = row.insertCell(-1);
        cell.colSpan = 2;
        cell.innerHTML = msg;

        row = table.insertRow(-1);
        cell = row.insertCell(-1);
        cell.colSpan = 2;
        cell.align = "center";
        cell.innerHTML = "<hr>";
    }
    if(showZip){
         //For zip
        this._textZip = new DwtInputField(this);
        row = table.insertRow(-1);
        cell = row.insertCell(-1);
        cell.innerHTML = "Zip:";
        cell = row.insertCell(-1);
        cell.appendChild(this._textZip.getHtmlElement());

        row = table.insertRow(-1);
        cell = row.insertCell(-1);
        cell.colSpan = 2;
        cell.align = "center";
        cell.innerHTML = "<b>or</b>";
    }
    row = table.insertRow(-1);
	cell = row.insertCell(-1);
	cell.colSpan = 2;
	cell.innerHTML = "Enter Latitude and Longitude";

	row = table.insertRow(-1);
	cell = row.insertCell(-1);
	cell.innerHTML = "Latitude:";
	cell = row.insertCell(-1);
	cell.appendChild(this._textObj1.getHtmlElement());

    row = table.insertRow(-1);
	cell = row.insertCell(-1);
	cell.innerHTML = "Longitude:";
	cell = row.insertCell(-1);
	cell.appendChild(this._textObj2.getHtmlElement());

    row = table.insertRow(-1);
	cell = row.insertCell(-1);
	cell.colSpan = 2;
    cell.align = "center";
    cell.innerHTML = "<b>or</b>";

    row = table.insertRow(-1);
	cell = row.insertCell(-1);
	cell.colSpan = 2;
    var params = {latitude:45,longitude:45};
    cell.appendChild(this._lableObj.getHtmlElement());
    YLocalDialog.gInstance = this;
    cell.innerHTML = "<a href='javascript:void(0)' onclick='changeLocation()'>Click here</a> to select location on map";

	var element = this._getContentDiv();
	element.appendChild(table);
};
YLocalDialog.gInstance;
changeLocation =
function(){
    var gInstance = YLocalDialog.gInstance;
    gInstance.popdown();
    gInstance._zimlet._controller.changeLocation({latitude:45,longitude:45});
}


YLocalDialog.prototype.changeLocationByZip =
function(){
    var lat = AjxStringUtil.trim((result.text.match(/<td><b>Latitude<\/b><\/td><td>.*(\-?[.\w]+)<\/td>/ig))[0].replace(/<\/?[^>]+>|Latitude/gi, ''));
	var lon = AjxStringUtil.trim((result.text.match(/<td><b>Longitude<\/b><\/td><td>.*(\-?[.\w]+)<\/td>/ig))[0].replace(/<\/?[^>]+>|Longitude/gi, ''));
	if (!(lat && lon)) {
		appCtxt.setStatusMsg(this._zimlet.getMessage("coordsNotFound"), ZmStatusView.LEVEL_CRITICAL);
		return;
	}

	var cord = this.getLocal();
	this.setView({
		clean: true,
		typeControl:true,
		panControl:false,
		zoomControl:"long",
		zoomLevel: 3,
		defaultLat: lat,
		defaultLon: lon
	});

	this.getMapsView().changeLocation({
		latitude:   cord.latitude,
		longitude:  cord.longitude,
		newLatitude: lat,
		newLongitude: lon
	});
};


YLocalDialog.prototype.popup = function(name, callback) {

	this._lookupCallback = callback;

	this.setTitle("Select Option");
    this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this.okButtonListener));
	// enable buttons
	this.setButtonEnabled(DwtDialog.OK_BUTTON, true);
	this.setButtonEnabled(DwtDialog.CANCEL_BUTTON, true);

	// show
	DwtDialog.prototype.popup.call(this);
};

YLocalDialog.prototype.popdown =
function() {
	ZmDialog.prototype.popdown.call(this);
};

YLocalDialog.prototype.okButtonListener = function(){
    if(this._textZip && this._textZip.getValue() != ''){
        this._zimlet._controller._getLatLonForZip(this._textZip.getValue());
    }else{
        this._zimlet._controller.setLanLongAndChangeLocation(this._textObj1.getValue(),this._textObj2.getValue());
    }
    DwtDialog.prototype.popdown.call(this);
}