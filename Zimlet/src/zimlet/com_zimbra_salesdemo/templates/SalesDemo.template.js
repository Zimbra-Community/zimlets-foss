/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2011, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
AjxTemplate.register("com_zimbra_salesdemo.templates.SalesDemo#TEMPLATE_FOR_SAP_SEM_ITEM_TOOLTIP", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table align=center cellpadding='0' cellspacing='0' border='0'><tr><td><b>SEM: </b>Product Acme SEM chart for 2011</td></tr><tr><td><b>BU: </b>Desktop</td></tr><tr><td><img class='SalesZimletTooltipImageCSS' src='";
	buffer[_i++] = data["zimletBaseUrl"];
	buffer[_i++] = "/img/SAP_SEM_tooltipAndDlg.png'></img></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "TEMPLATE_FOR_SAP_SEM_ITEM_TOOLTIP"
}, true);
AjxPackage.define("com_zimbra_salesdemo.templates.SalesDemo");
AjxTemplate.register("com_zimbra_salesdemo.templates.SalesDemo", AjxTemplate.getTemplate("com_zimbra_salesdemo.templates.SalesDemo#TEMPLATE_FOR_SAP_SEM_ITEM_TOOLTIP"), AjxTemplate.getParams("com_zimbra_salesdemo.templates.SalesDemo#TEMPLATE_FOR_SAP_SEM_ITEM_TOOLTIP"));

AjxTemplate.register("com_zimbra_salesdemo.templates.SalesDemo#TEMPLATE_FOR_SAP_SEM_ITEM_DIALOG", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table align=center cellpadding='0' cellspacing='0' border='0'><tr><td><b>SAP Cockpit:</b></td></tr><tr><td><img class='SalesZimletDialogImageCSS' src='";
	buffer[_i++] = data["zimletBaseUrl"];
	buffer[_i++] = "/img/SAP_SEM_tooltipAndDlg.png'></img></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "TEMPLATE_FOR_SAP_SEM_ITEM_DIALOG"
}, true);

AjxTemplate.register("com_zimbra_salesdemo.templates.SalesDemo#TEMPLATE_FOR_SAP_SEM_ITEM_TOOLBAR", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table align=center cellpadding='0' cellspacing='0' border='0'><tr><td><b>SEM: </b>Product Acme SEM chart for 2011</td></tr><tr><td><b>BU: </b>Desktop</td></tr><tr><td><img class='SalesZimletToolbarImageCSS' src='";
	buffer[_i++] = data["zimletBaseUrl"];
	buffer[_i++] = "/img/SAP_SEM_toolbar.png'></img></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "TEMPLATE_FOR_SAP_SEM_ITEM_TOOLBAR"
}, true);

AjxTemplate.register("com_zimbra_salesdemo.templates.SalesDemo#TEMPLATE_FOR_Q2_FORECAST_TOOLTIP", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table align=center cellpadding='0' cellspacing='0' border='0'><tr><td><img class='SalesZimletTooltipImageCSS' src='";
	buffer[_i++] = data["zimletBaseUrl"];
	buffer[_i++] = "/img/q2_forecast_tooltipAndDlg.png'></img></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "TEMPLATE_FOR_Q2_FORECAST_TOOLTIP"
}, true);

AjxTemplate.register("com_zimbra_salesdemo.templates.SalesDemo#TEMPLATE_FOR_Q2_FORECAST_DIALOG", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table align=center cellpadding='0' cellspacing='0' border='0'><tr><td><img class='SalesZimletDialogImageCSS' src='";
	buffer[_i++] = data["zimletBaseUrl"];
	buffer[_i++] = "/img/q2_forecast_tooltipAndDlg.png'></img></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "TEMPLATE_FOR_Q2_FORECAST_DIALOG"
}, true);

AjxTemplate.register("com_zimbra_salesdemo.templates.SalesDemo#TEMPLATE_FOR_Q2_FORECAST_TOOLBAR", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table align=center cellpadding='0' cellspacing='0' border='0'><tr><td><b>SEM: </b>Product Acme SEM chart for 2011</td></tr><tr><td><b>BU: </b>Desktop</td></tr><tr><td><img class='SalesZimletToolbarImageCSS' src='";
	buffer[_i++] = data["zimletBaseUrl"];
	buffer[_i++] = "/img/q2_forecast_toobar.jpg'></img></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "TEMPLATE_FOR_Q2_FORECAST_TOOLBAR"
}, true);

AjxTemplate.register("com_zimbra_salesdemo.templates.SalesDemo#TEMPLATE_FOR_EPIC_TOOLTIP", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table align=center cellpadding='0' cellspacing='0' border='0'><tr><td><b>Patient Name: </b>John Doe</td></tr><tr><td><b>Phone: </b>+1 650 123 1234</td></tr><tr><td><b>Problem: </b>Broken Leg</td></tr><tr><td><b>Blood Group: </b>B+</td></tr><tr><td><b>Patient Since: </b>10/10/2010</td></tr><tr><td><img class='SalesZimletTooltipImageCSS' src='";
	buffer[_i++] = data["zimletBaseUrl"];
	buffer[_i++] = "/img/epic_broken_leg_tooltipAndDlg.jpg'></img></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "TEMPLATE_FOR_EPIC_TOOLTIP"
}, true);

AjxTemplate.register("com_zimbra_salesdemo.templates.SalesDemo#TEMPLATE_FOR_EPIC_DIALOG", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table align=center cellpadding='0' cellspacing='0' border='0'><tr><td><b>Patient Name: </b>John Doe</td></tr><tr><td><b>Phone: </b>+1 650 123 1234</td></tr><tr><td><b>Problem: </b>Broken Leg</td></tr><tr><td><b>Blood Group: </b>B+</td></tr><tr><td><b>Patient Since: </b>10/10/2010</td></tr><tr><td><img class='SalesZimletDialogImageCSS' src='";
	buffer[_i++] = data["zimletBaseUrl"];
	buffer[_i++] = "/img/epic_broken_leg_tooltipAndDlg.jpg'></img></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "TEMPLATE_FOR_EPIC_DIALOG"
}, true);

AjxTemplate.register("com_zimbra_salesdemo.templates.SalesDemo#TEMPLATE_FOR_EPIC_TOOLBAR", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table align=center cellpadding='0' cellspacing='0' border='0'><tr><td><b>Patient Name: </b>John Doe</td></tr><tr><td><b>Phone: </b>+1 650 123 1234</td></tr><tr><td><b>Problem: </b>Broken Leg</td></tr><tr><td><b>Blood Group: </b>B+</td></tr><tr><td><b>Patient Since: </b>10/10/2010</td></tr><tr><td><img class='SalesZimletToolbarImageCSS' src='";
	buffer[_i++] = data["zimletBaseUrl"];
	buffer[_i++] = "/img/epic_broken_leg_tooltipAndDlg.jpg'></img></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "TEMPLATE_FOR_EPIC_TOOLBAR"
}, true);

