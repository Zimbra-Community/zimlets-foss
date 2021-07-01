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

Com_Zimbra_Local = function() {

};
Com_Zimbra_Local.prototype = new ZmZimletBase;
Com_Zimbra_Local.prototype.constructor = Com_Zimbra_Local;

Com_Zimbra_Local.prototype.toString =
function() {
	return "Com_Zimbra_Local";
};

Com_Zimbra_Local.prototype.init =
function() {
	this._controller = new YahooLocalController(this);
	// add convenience function to skin
	if (window.skin && !skin.searchLocal) {
		skin.searchLocal = AjxCallback.simpleClosure(this._controller.searchLocal, this._controller);
	}
	//Add "Search Local" to the Search toolbar.
    if(appCtxt.get(ZmSetting.WEB_SEARCH_ENABLED)) {
		// only add search toolbar if there isn't already a skin-specific button for it!
		var localSearchBtnEl = document.getElementById("skin_search_local_button");
		if (!localSearchBtnEl) {
			this.addLocalSearchToolBar((new AjxListener(this,this._localSearchListener)));
		}
		else {
			Dwt.setVisible(localSearchBtnEl, true);
		}
	}

    YahooMaps.loadExternalResources();
};


// Add "Search Local" button the existing
Com_Zimbra_Local.prototype.addLocalSearchToolBar =
function(listener) {
	var searchToolBar = this._searchToolBar = appCtxt.getSearchController().getSearchToolbar();
	//Add Custom Button to the Search Toolbar
	var searchMenuBtnTd = document.getElementById(searchToolBar._htmlElId+"_searchMenuButton");
	var td = searchMenuBtnTd.parentNode.insertCell(searchMenuBtnTd.cellIndex+2);
	td.id = searchToolBar._htmlElId + "_searchLocal";
	td.className  =  'ZmSearchToolbarCell';
	var b = searchToolBar._addButton({ tdId:"_searchLocal", lbl:this.getMessage("localSearchBtnLabel"),
									   icon:"WebSearch", tooltip:this.getMessage("localSearchBtnTooltip"),
									   buttonId:ZmId.LOCAL_SEARCH_BUTTON});
	b.addSelectionListener(listener);
};


Com_Zimbra_Local.prototype._localSearchListener =
function(ev){
	var query = AjxStringUtil.trim(this._searchToolBar.getSearchFieldValue());
	if (query && query.length) {
		this._controller.searchLocal(query);
	}
};

Com_Zimbra_Local.prototype.menuItemSelected =
function(itemId) {
	switch (itemId) {
		case "MY_LOCATION":			this._controller.markMe();				break;
		case "SEARCH":				this._controller.searchQuery();			break;
		case "SEARCH_ADDR":			this._controller.searchAddress();		break;
		case "TRAFFIC":				this._controller.searchTraffic();		break;
		case "UPCOMING":			this._controller.searchUpcoming();		break;
		case "MANUAL_LOCAION":		this._controller.changeLocation();		break;
		case "MANULA_LOCATION_ZIP":	this._controller.changeLocationByZip();	break;
		case "PREFERENCES":			this.createPropertyEditor();			break;
		default:					this.createPropertyEditor();			break;
	}
};

Com_Zimbra_Local.prototype.singleClicked =
function() {
	this._controller.searchQuery();
};


/**
 * YahooLocalController
 * @param zimlet
 */
YahooLocalController = function(zimlet) {

	if (arguments.length == 0) { return; }

	ZmController.call(this, appCtxt.getShell());

	ZmOperation.registerOp("TRAFFIC", {image:"YLogo"});
	ZmOperation.registerOp("UPCOMING",{image:"ULogo"});
	this._listeners = {};
	this._listeners[ZmOperation.TRAFFIC] = new AjxListener(this, this._trafficListener);
	this._listeners[ZmOperation.CANCEL] = new AjxListener(this, this._cancelListener);
	this._listeners[ZmOperation.SEND] = new AjxListener(this, this._sendListener);
	this._listeners[ZmOperation.UPCOMING] = new AjxListener(this, this._upcomingListener);
	this._listeners[ZmOperation.SEARCH] = new AjxListener(this, this.searchAddress);

	this._zimlet = zimlet;

	this._searchOkListener = new AjxListener(this, this._handleSearchListener);
	this._searchAddrOkListener = new AjxListener(this, this._handleSearchAddrListener);
	this._changeLocationOkListener = new AjxListener(this, this._handleChangeLocationListener);

//	this.setLocation("37.3878","-122.0195"); // set default location to Sunnyvale
};

YahooLocalController.prototype = new ZmController;
YahooLocalController.prototype.constructor = YahooLocalController;

/**
 * Find Lon/Lat and other details for the IPAddress. Thanks to maxmind.com
 */
YahooLocalController.prototype.getLocal =
function() {

	if (typeof(geoip_country_code) == 'undefined' || !AjxUtil.isFunction(geoip_country_code)) {
		return;
	}

	if (!this._ylocal) {
		this._countryCode = geoip_country_code();
		this._countryName = geoip_country_name();
		this._city = geoip_city();
		this._region = geoip_region();
		this._latitude = geoip_latitude();
		this._longitude = geoip_longitude();

		this._ylocal = {
			countryCode: this._countryCode,
			countryName: this._countryName,
			city: this._city,
			region: this._region,
			latitude: this._latitude,
			longitude: this._longitude
		};

		this._ylocalTmp = {
			countryCode: this._countryCode,
			countryName: this._countryName,
			city: this._city,
			region: this._region,
			latitude: this._latitude,
			longitude: this._longitude
		}
	}

	var manLoc = this._zimlet.getUserProperty("manuallocation");
	if (manLoc && manLoc.match(/true/i)) {
		this._ylocalTmp.latitude = this._zimlet.getUserProperty("latitude");
		this._ylocalTmp.longitude = this._zimlet.getUserProperty("longitude");
		return this._ylocalTmp;
	}
	return this._ylocal;
};

YahooLocalController.prototype.setLocation =
function(lat, lon, callback) {
    this._zimlet.setUserProperty("manuallocation", "true");
    this._zimlet.setUserProperty("latitude", lat);
    this._zimlet.setUserProperty("longitude", lon);
    this._zimlet.saveUserProperties(callback);
};

YahooLocalController.prototype.searchLocal =
function(query) {
	this._getGeoIP(new AjxCallback(this, this._handleSearchLocal, query));
};

YahooLocalController.prototype._handleSearchLocal =
function(query) {
	var coords = this._setDefaultView(this._curr_lat, this._curr_lon);

	if (coords) {
		this.getMapsView().searchLocal({
			query: query,
			defaultLat: coords.latitude,
			defaultLon: coords.longitude
		});
	} else {
		this._showErrorLoadingAPI();
	}
};

YahooLocalController.prototype.searchQuery =
function() {
	var title = this._zimlet.getMessage("searchYahooLocal");
	var inputLabel = this._zimlet.getMessage("searchFor");

	this._showInputDialog(title, inputLabel, this._searchOkListener);
};

YahooLocalController.prototype.searchAddress =
function(ev) {
	var title = this._zimlet.getMessage("enterAddress");
	var inputLabel = this._zimlet.getMessage("address");

	this._showInputDialog(title, inputLabel, this._searchAddrOkListener);
};

YahooLocalController.prototype.changeLocationByZip =
function(zip) {
	var title = this._zimlet.getMessage("changeLocation");
	var inputLabel = this._zimlet.getMessage("zipCode");

	this._showInputDialog(title, inputLabel, this._changeLocationOkListener);
};

YahooLocalController.prototype.searchUpcoming =
function() {
	this._getGeoIP(new AjxCallback(this, this._handleSearchUpcoming));
};

YahooLocalController.prototype._handleSearchUpcoming =
function() {
    var coords = this._setDefaultView(this._curr_lat, this._curr_lon);

	if (coords) {
		this.getMapsView().searchUpcoming({
			latitude : coords.latitude,
			longitude: coords.longitude
		});
	} else {
		this._showErrorLoadingAPI();
	}
};

YahooLocalController.prototype.searchTraffic =
function() {
	this._getGeoIP(new AjxCallback(this, this._handleSearchTraffic));
};

YahooLocalController.prototype._handleSearchTraffic =
function() {
    var coords = this._setDefaultView(this._curr_lat, this._curr_lon);

	if (coords) {
		this.getMapsView().searchTraffic({
			latitude : coords.latitude,
			longitude: coords.longitude
		});
	} else {
		this._showErrorLoadingAPI();
	}
};

YahooLocalController.prototype.markMe =
function() {
	this._getGeoIP(new AjxCallback(this, this._handleMarkMe));
};

YahooLocalController.prototype._handleMarkMe =
function() {
	var lat;
    var lon;
    if(AjxUtil.isFunction(geoip_latitude) && AjxUtil.isFunction(geoip_longitude)){
        lat = geoip_latitude();
        lon = geoip_longitude();
        this._curr_lat = lat;
        this._curr_lon = lon;
    }
    var coords = this._setDefaultView(this._curr_lat,this._curr_lon);

	if (coords) {
		var latitude = coords ? coords.latitude : null;
		var longitude = coords ? coords.longitude : null;

		this.getMapsView().markMe(latitude, longitude);
	} else {
		this._showErrorLoadingAPI();
	}
};

YahooLocalController.prototype.displayAddress =
function(addr) {
	this.setView({
		clean: true,
		typeControl:true,
		panControl:false,
		zoomControl:"long",
		zoomLevel: 6,
		defaultLocation: addr
	});

	this.getMapsView().markAddr({defaultLocation: addr});
};

YahooLocalController.prototype.changeLocation =
function(params) {
    this._getGeoIP(new AjxCallback(this, this._handleChangeLocation,params));
};

YahooLocalController.prototype._handleChangeLocation =
function(params) {
    var coords = this._setDefaultView(45,45);

	if (coords) {
		this.getMapsView().changeLocation({
			latitude : coords.latitude,
			longitude: coords.longitude
		});
	} else {
		this._showErrorLoadingAPI();
	}
};

// View
ZmId.VIEW_YMAPS = "YAHOOMAPS";

YahooLocalController.prototype.getMapsView =
function() {
	if (!this._mapsView) {
		this._mapsView = new YahooMaps(appCtxt.getShell(), this);
	}
	return this._mapsView;
};

YahooLocalController.prototype.setView =
function(params) {
	this._initializeToolBar();
	this._toolbar.enableAll(true);
	this._createMapView(params); // YahooMapsView
	this.showView(params);
};

YahooLocalController.prototype.showView =
function(params) {
	this._mapsView.prepareMap(params);
	appCtxt.getAppViewMgr().pushView(ZmId.VIEW_YMAPS);
	// fit to container, since the height and width needs to be set for this view
	appCtxt.getAppViewMgr()._fitToContainer([ZmAppViewMgr.C_APP_CONTENT]);
};

YahooLocalController.prototype.hideView =
function() {
	appCtxt.getAppViewMgr().popView(true, ZmId.VIEW_YMAPS);
};

YahooLocalController.prototype._createView =
function() {
	var elements = {};
	elements[ZmAppViewMgr.C_TOOLBAR_TOP] = this._toolbar;
	elements[ZmAppViewMgr.C_APP_CONTENT] = this._mapsView;
	appCtxt.getAppViewMgr().createView({viewId:ZmId.VIEW_YMAPS, elements:elements});
};

YahooLocalController.prototype._createMapView =
function(params) {
	if (this._mapsView) { return; }

	// Creating Map View
	this.getMapsView();
	this._createView();
};

YahooLocalController.prototype._initializeToolBar =
function() {
	if (this._toolbar) { return; }

	var buttons = [
		ZmOperation.SEND,
		ZmOperation.UPCOMING,
		ZmOperation.TRAFFIC,
		ZmOperation.SEARCH,
		ZmOperation.CANCEL
	];
	this._toolbar = new ZmButtonToolBar({parent:appCtxt.getShell(), buttons:buttons, className:"ZmAppToolBar ImgSkin_Toolbar"});

	// add listeners to the operations
	for (var i = 0; i < this._toolbar.opList.length; i++) {
		var button = this._toolbar.opList[i];

		if (button == ZmOperation.UPCOMING) {
			var b = this._toolbar.getOp(button);
			b.setText(this._zimlet.getMessage("menuItemUpcoming"));
			b.setToolTipContent(this._zimlet.getMessage("upcomingTooltip"));
		} else if (button == ZmOperation.TRAFFIC) {
			var b = this._toolbar.getOp(button);
			b.setText(this._zimlet.getMessage("menuItemTraffic"));
			b.setToolTipContent(this._zimlet.getMessage("trafficTooltip"));
		}

		if (this._listeners[button]) {
			this._toolbar.addSelectionListener(button, this._listeners[button]);
		}
	}
};

YahooLocalController.prototype._showInputDialog =
function(title, inputLabel, okListener) {
	if (!this._inputDialog) {
		this._inputDialog = new ZmDialog({parent:appCtxt.getShell()});

		// create content
		var html = [];
		var i = 0;
		html[i++] = "<table cellpadding=2 cellspacing=2><tr><td class='ZmFieldLabelRight' id='";
		html[i++] = this._inputDialog._htmlElId;
		html[i++] = "_label'></td><td><input type='text' size=20 maxlength=255 id='";
		html[i++] = this._inputDialog._htmlElId;
		html[i++] = "_input'></td></tr></table>";

		this._inputDialog.setContent(html.join(""));

		// cache the input element and label for easy access
		this._inputEl = document.getElementById(this._inputDialog._htmlElId + "_input");
		this._inputLabel = document.getElementById(this._inputDialog._htmlElId + "_label");
	}

	this._inputDialog.setTitle(title);
	this._inputDialog.setButtonListener(DwtDialog.OK_BUTTON, okListener);
	this._inputDialog.setEnterListener(okListener);

	this._inputEl.value = "";
	this._inputLabel.innerHTML = inputLabel;

	this._inputDialog.popup();

	this._inputEl.focus();
};

YahooLocalController.prototype._setDefaultView =
function(lati,longi) {
	if(lati==45 && longi == 45)
        zoomLevel = 14;
    else
        zoomLevel = 8;
    var coords = this.getLocal();
    var latitude =   this._zimlet.getUserProperty("latitude");
    var longitude =  this._zimlet.getUserProperty("longitude");


    if((!latitude || !longitude) && (!coords ||(coords && (!coords.latitude || !coords.longitude))) && (!lati && !longi)){
        var manLoc = this._zimlet.getUserProperty("manuallocation");
	    if (!manLoc || manLoc.match(/false/i)) {
            var msg = this._zimlet.getMessage("maxMindError");
            var selectDialog = new YLocalDialog(appCtxt._shell, null, this._zimlet, msg, true);
            selectDialog.popup();
            return;
        }
    }
    if(!coords){
         this._zimlet._ylocal = {
			countryCode: "",
			countryName: "",
			city: "",
			region: "",
			latitude: lati || latitude,
			longitude: longi || longitude
		};
        coords = this._zimlet._ylocal;
    }

    if (coords) {
        coords.latitude = lati || coords.latitude;
        coords.longitude = longi || coords.longitude;

		this.setView({
			clean: true,
			typeControl:true,
			panControl:false,
			zoomControl:"long",
			zoomLevel: zoomLevel,
			defaultLat: coords.latitude,
			defaultLon: coords.longitude
		});
	}
    return coords;
};

YahooLocalController.prototype._getGeoIP =
function(callback) {
	geoip_country_code = null;

	var url = "http://j.maxmind.com/app/geoip.js";
	var respCallback = new AjxCallback(this, this._handleGetIP, callback);
	var serverURL = ZmZimletBase.PROXY + AjxStringUtil.urlComponentEncode(url);

	// allow timeout of 5 seconds for browser to grab geoip code
	AjxRpc.invoke(null, serverURL, null, respCallback, true, 5000);
};

YahooLocalController.prototype._handleGetIP =
function(callback, result) {
	if (result && result.success && result.text) {
		AjxPackage.eval(result.text);
	}

	if (callback) { callback.run(); }
};

YahooLocalController.prototype._showErrorLoadingAPI =
function() {
	var errorDlg = appCtxt.getMsgDialog();
	var msg = this._zimlet.getMessage("errorLoadingAPI");
	errorDlg.setMessage(msg, DwtMessageDialog.CRITICAL_STYLE);
	errorDlg.popup();
};

YahooLocalController.prototype.selectLocation =
function(isZip){
    this.messageDlg.popdown();
    this._dlg_propertyEditor = new YLocalDialog(appCtxt._shell, null, this._zimlet,isZip);
    this._dlg_propertyEditor.popup();
}

YahooLocalController.prototype._locateLocation =
function(){
     var latitude = this._textObj1.getValue();
     var longitude = this._textObj2.getValue();
     this._zimlet.setUserProperty("latitude",latitude);
     this._zimlet.setUserProperty("longitude",longitude);
     this._curr_lat = latitude;
     this._curr_lon = longitude;
     this._zimlet._controller._dlg_propertyEditor.popdown();
     this._zimlet._controller._handleSearchLocal();
}

YahooLocalController.prototype._getMessageDlg =
function(msg){
    this.messageDlg = new DwtDialog (appCtxt.getShell(),null,"Confirmation",[DwtDialog.OK_BUTTON]);
    this.messageDlg.setContent (msg);
    return this.messageDlg;
};

// Listeners

YahooLocalController.prototype._handleSearchListener =
function() {
	var query = AjxStringUtil.trim(this._inputEl.value);
	if (query.length) {
		this._inputDialog.popdown();
		this.searchLocal(query);
	}
};

YahooLocalController.prototype._handleSearchAddrListener =
function() {
	var query = AjxStringUtil.trim(this._inputEl.value);
	if (query.length) {
		this._inputDialog.popdown();
		this.displayAddress(query);
	}
};

YahooLocalController.prototype._handleChangeLocationListener =
function() {
	var query = AjxStringUtil.trim(this._inputEl.value);
	if (query.length) {
		this._inputDialog.popdown();
		this._getLatLonForZip(query);
	}
};


YahooLocalController.prototype._getLatLonForZip =
function(zip) {
    var ydnAPPID = this._zimlet.getConfig("ydnAPPID");
    var url = this._zimlet.getMessage("ygeoapiURL");;//
    url += "?appid=" + ydnAPPID + "&zip=" + zip;

	//var url = "http://www.csgnetwork.com/cgi-bin/zipcodes.cgi?Zipcode=" + zip;
	var serverURL = ZmZimletBase.PROXY + AjxStringUtil.urlComponentEncode(url);
	var callback = new AjxCallback(this, this._handleLatLonForZip, zip);

	// allow timeout of 5 seconds for browser to grab webservice code
	AjxRpc.invoke(null, serverURL, null, callback, true, 5000);
};

YahooLocalController.prototype._handleLatLonForZip =
function(zip, result) {
	if (!result || (result && !result.success)) {
		var msg = this._zimlet.getMessage("ygeoLocalError");
        var selectDialog = new YLocalDialog(appCtxt._shell, null, this._zimlet, msg, false);
        selectDialog.popup();
        return;
    }

	if (result.text.match(/Error/i)) {
		appCtxt.setStatusMsg(this._zimlet.getMessage("zipCodeInvalid"), ZmStatusView.LEVEL_CRITICAL);
		return;
	}

	//var lat = AjxStringUtil.trim((result.text.match(/<td><b>Latitude<\/b><\/td><td>.*(\-?[.\w]+)<\/td>/ig))[0].replace(/<\/?[^>]+>|Latitude/gi, ''));
	//var lon = AjxStringUtil.trim((result.text.match(/<td><b>Longitude<\/b><\/td><td>.*(\-?[.\w]+)<\/td>/ig))[0].replace(/<\/?[^>]+>|Longitude/gi, ''));
    var lat = AjxStringUtil.trim((result.text.match(/<Latitude>.*(\-?[.\w]+)<\/Latitude>/ig))[0].replace(/<\/?[^>]+>|Latitude/gi,''));
    var lon = AjxStringUtil.trim((result.text.match(/<Longitude>.*(\-?[.\w]+)<\/Longitude>/ig))[0].replace(/<\/?[^>]+>|Longitude/gi,''));

    if (!(lat && lon)) {
		appCtxt.setStatusMsg(this._zimlet.getMessage("coordsNotFound"), ZmStatusView.LEVEL_CRITICAL);
		return;
	}
    this.setLanLongAndChangeLocation(lat,lon,3);
};

YahooLocalController.prototype.setLanLongAndChangeLocation=
function(latitude,longitude,level){
    //this.popdown();
    //var latitude = this._textObj1.getValue();
    //var longitude = this._textObj2.getValue();
    var params = {
		clean: true,
		typeControl:true,
		panControl:false,
		zoomControl:"long",
		zoomLevel: level || 6,
		defaultLat: latitude,
		defaultLon: longitude
	};
    this._zimlet._controller.setView(params);

	this._zimlet._controller.getMapsView().changeLocation({
		latitude:   latitude,
		longitude:  longitude
	});
    this._curr_lat = latitude;
    this._curr_lon = longitude;

}

YahooLocalController.prototype._sendListener =
function(ev) {

	var mapObject = this._mapsView.getState();

	var url = [
		"http://maps.yahoo.com/#tt=", mapObject.query,
		"&lon=", mapObject.lon,
		"&lat=", mapObject.lat,
		"&mag=", mapObject.zoom,
		"&mvt=m&tp=1"
	].join("");

	var body = this._zimlet.getMessage("msgBody").replace("{0}", mapObject.query ? "("+mapObject.query+")" : "");//"Hi,\n Your friend has shared you a Yahoo Map regarding \""+mapObject.query+"\". \n\nPlease access it @ \t\n\n";
	var footer = this._zimlet.getMessage("msgFooter");//"\n\nThis email was sent to you by a user on Yahoo Maps (maps.yahoo.com)."
	var subject = this._zimlet.getMessage("msgSubject").replace("{0}",appCtxt.get(ZmSetting.USERNAME));//appCtxt.get(ZmSetting.USERNAME) + " sent this Yahoo Maps.";

    this._zimlet.getMessage("maxMindError");

	if (appCtxt.get(ZmSetting.HTML_COMPOSE_ENABLED) &&
		appCtxt.get(ZmSetting.COMPOSE_AS_FORMAT) == ZmSetting.COMPOSE_HTML)
	{
		body = AjxStringUtil.nl2br(body);
		footer = AjxStringUtil.nl2br(footer);
	}

	var params = {
		action: ZmOperation.NEW_MESSAGE,
		subjOverride: subject,
		extraBodyText: (body + url + footer),
        inNewWindow:appCtxt.get(ZmSetting.NEW_WINDOW_COMPOSE)        
    };

	var cc = AjxDispatcher.run("GetComposeController");
	cc.doAction(params);
};

YahooLocalController.prototype._upcomingListener =
function(ev) {
	this.searchUpcoming();
};

YahooLocalController.prototype._trafficListener =
function(ev) {
	this.searchTraffic();
};

YahooLocalController.prototype._cancelListener =
function(ev) {
	this.hideView();
};
