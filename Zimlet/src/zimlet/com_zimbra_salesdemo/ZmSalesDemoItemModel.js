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
function ZmSalesDemoItemModel(zimlet) {
	this.items = {};
	var response = AjxRpc.invoke(null, zimlet.getResource("data.xml"));
	var rawItems = new AjxXmlDoc.createFromDom(response.xml).toJSObject();
	this.loadAllItems(rawItems);
}

ZmSalesDemoItemModel.prototype.loadAllItems = function(rawItems){
	var items = rawItems.item;
	for(var i=0; i < items.length; i++) {
		this.addItem(items[i]);
	}
};

ZmSalesDemoItemModel.prototype.addItem = function(jsObj){
	var tooltipObj = jsObj.tooltip;
	if(!tooltipObj) {
		return;
	}
	var textToMatch = tooltipObj.textToMatch ? tooltipObj.textToMatch.toString() : null;
	if(!textToMatch) {
		return;
	}
	var salesItem = new ZmSalesDemoItem(textToMatch);

	if(tooltipObj) {
		var tooltipTemplateId = tooltipObj.tooltipTemplateId ? tooltipObj.tooltipTemplateId.toString() : "";
		salesItem.setTooltipTemplateId(tooltipTemplateId);

		var contextMenuObj = tooltipObj.contextMenu ? tooltipObj.contextMenu : null;
		if(contextMenuObj) {
			var contextMenuItemArray = contextMenuObj.contextMenuItem && (contextMenuObj.contextMenuItem instanceof Array) ? contextMenuObj.contextMenuItem : [];
			for(var i=0; i < contextMenuItemArray.length; i++) {
				var mi = contextMenuItemArray[i];
				var name = mi.name ? mi.name.toString() : "Menu Item"+i;
				var icon = mi.icon ? mi.icon.toString() : "";
				salesItem.setContextMenuItem(name, icon);
			}
		}
	}
	var dialogObj = jsObj.popupDialog;
	if(dialogObj) {
		var dialogTemplateId = dialogObj.dialogTemplateId ? dialogObj.dialogTemplateId.toString() : "";
		salesItem.setDialogTemplateId(dialogTemplateId);
	}

	var toolbarObj = jsObj.toolbar;
	if(toolbarObj) {
		var toolbarName = toolbarObj.toolbarName ? toolbarObj.toolbarName.toString() : "Zimlet Toolbar";
		var icon = toolbarObj.icon ? toolbarObj.icon.toString() : "";
		var toolbarTemplateId = toolbarObj.toolbarTemplateId ? toolbarObj.toolbarTemplateId.toString() : "";
		salesItem.setToolbar(icon, toolbarName, toolbarTemplateId);
		var toolbarButtonsObj = toolbarObj.toolbarButtons ? toolbarObj.toolbarButtons : null;
		if(toolbarButtonsObj) {
			var toolbarButtonsArray = toolbarButtonsObj.toolbarButton && (toolbarButtonsObj.toolbarButton instanceof Array) ?  toolbarButtonsObj.toolbarButton : [];
			for(var i=0; i < toolbarButtonsArray.length; i++) {
				var btn = toolbarButtonsArray[i];
				var name = btn.name ? btn.name.toString() : "Button "+i;
				var icon = btn.icon ? btn.icon.toString() : "";
				salesItem.setToolbarButton(name, icon);
			}
		}

	}
	this.items[salesItem.textToMatch] =  salesItem;
};
