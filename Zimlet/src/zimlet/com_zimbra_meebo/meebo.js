/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Constructor.
 *
 * @author		Raja Rao
 */
function com_zimbra_meebo_HandlerObject() {
}
com_zimbra_meebo_HandlerObject.prototype = new ZmZimletBase();
com_zimbra_meebo_HandlerObject.prototype.constructor = com_zimbra_meebo_HandlerObject;

/**
 * Simplify handler object
 *
 */
var MeeboZimlet = com_zimbra_meebo_HandlerObject;

/**
 * Defines the "load" interval (milliseconds).
 */
MeeboZimlet.LOAD_INTERVAL = 5000;
/**
 * Defines the "load" timeout (milliseconds).
 */
MeeboZimlet.LOAD_TIMEOUT = 15000;

/**
 * Static ids
 */
MeeboZimlet.SKIN_ROW_ID = "meeboZimlet_bar_rowId";


/**
 * Initializes the zimlet.
 */
MeeboZimlet.prototype.init =
function() {
	this._makeSpaceForMeeboBar();
	this._initializeMeebo();
	this._callCount = 0;
	this.timer = setInterval(AjxCallback.simpleClosure(this._checkMeeboExists, this), MeeboZimlet.LOAD_INTERVAL);
};


/**
 * Makes space for Meebo bar in the skin
 */
MeeboZimlet.prototype._makeSpaceForMeeboBar =
function() {
	var tbl = document.getElementById("skin_table_outer");
	var newRow = tbl.insertRow(tbl.rows.length);
	newRow.style.display = "block";
	newRow.id = MeeboZimlet.SKIN_ROW_ID;

	var cell = newRow.insertCell(0);
	if (AjxEnv.isIE) {
		cell.height = "22px";
	} else {
		cell.height = "26px";
	}
	cell.innerHTML = ["<label style='font-size:12px;font-weight:bold;'>",this.getMessage("MeeboZimlet_loadingMeebo"),"</label>"].join("");
	appCtxt.getAppViewMgr().fitAll();
};

/**
 * [Code is from Meebo] - Loads Meebo Bar
 */
MeeboZimlet.prototype._initializeMeebo =
function() {
window.Meebo||function(c){function p(){return["<",i,' onload="var d=',g,";d.getElementsByTagName('head')[0].",
j,"(d.",h,"('script')).",k,"='//cim.meebo.com/cim?iv=",a.v,"&",q,"=",c[q],c[l]?
"&"+l+"="+c[l]:"",c[e]?"&"+e+"="+c[e]:"","'\"></",i,">"].join("")}var f=window,
a=f.Meebo=f.Meebo||function(){(a._=a._||[]).push(arguments)},d=document,i="body",
m=d[i],r;if(!m){r=arguments.callee;return setTimeout(function(){r(c)},100)}a.$=
{0:+new Date};a.T=function(u){a.$[u]=new Date-a.$[0]};a.v=4;var j="appendChild",
h="createElement",k="src",l="lang",q="network",e="domain",n=d[h]("div"),v=n[j](d[h]("m")),
b=d[h]("iframe"),g="document",o,s=function(){a.T("load");a("load")};f.addEventListener?
f.addEventListener("load",s,false):f.attachEvent("onload",s);n.style.display="none";
m.insertBefore(n,m.firstChild).id="meebo";b.frameBorder="0";b.id="meebo-iframe";
b.allowTransparency="true";v[j](b);try{b.contentWindow[g].open()}catch(w){c[e]=
d[e];o="javascript:var d="+g+".open();d.domain='"+d.domain+"';";b[k]=o+"void(0);"}try{var t=
b.contentWindow[g];t.write(p());t.close()}catch(x){b[k]=o+'d.write("'+p().replace(/"/g,
'\\"')+'");d.close();'}a.T(1)}({network:"zimbra"});
	Meebo.disableSharePageButton = true;
};


/**
 * Shows the meebo iframe.
 *
 */
MeeboZimlet.prototype._checkMeeboExists =
function() {
	this._callCount++;
	var meeboDiv = document.getElementById("meebo");
	if(meeboDiv.className.indexOf("meebo") != -1 || meeboDiv.style.display == "block") {
		clearInterval(this.timer);
		return;
	}
	if (this._callCount == (MeeboZimlet.LOAD_TIMEOUT / MeeboZimlet.LOAD_INTERVAL)) { //after 60 seconds, stop checking
		clearInterval(this.timer);
		document.getElementById(MeeboZimlet.SKIN_ROW_ID).style.display = "none";
		var errMsg = AjxMessageFormat.format(this.getMessage("MeeboZimlet_error_loadBar"), MeeboZimlet.LOAD_TIMEOUT / 1000);
		appCtxt.getAppController().setStatusMsg(errMsg, ZmStatusView.LEVEL_WARNING);
		appCtxt.getAppViewMgr().fitAll();
		return;
	}
};