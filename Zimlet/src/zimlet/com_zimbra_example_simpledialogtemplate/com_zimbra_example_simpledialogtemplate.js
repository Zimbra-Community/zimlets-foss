/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

com_zimbra_example_simpledialogtemplate_HandlerObject = function() {
};
com_zimbra_example_simpledialogtemplate_HandlerObject.prototype = new ZmZimletBase;
com_zimbra_example_simpledialogtemplate_HandlerObject.prototype.constructor = com_zimbra_example_simpledialogtemplate_HandlerObject;

/**
 * Double clicked.
 */
com_zimbra_example_simpledialogtemplate_HandlerObject.prototype.doubleClicked =
function() {
	this.singleClicked();
};

/**
 * Single clicked.
 */
com_zimbra_example_simpledialogtemplate_HandlerObject.prototype.singleClicked =
function() {
	this._displayDialog();
};

/**
 * Displays the dialog.
 * 
 */
com_zimbra_example_simpledialogtemplate_HandlerObject.prototype._displayDialog = 
function() {
	if (this.pbDialog) { //if zimlet dialog already exists...
		this.pbDialog.popup(); //simply popup the dialog
		return;
	}
	
	var sDialogTitle = this.getMessage("simpledialog_dialog_title");
	var sStatusMsg = this.getMessage("simpledialog_status_launch");
	
	this.pView = new DwtComposite(this.getShell()); //creates an empty div as a child of main shell div
	this.pView.setSize("250", "150"); // set width and height
	this.pView.getHtmlElement().style.overflow = "auto"; // adds scrollbar
	this.pView.getHtmlElement().innerHTML = this._createDialogView(); // insert html to the dialogbox
	
	// pass the title, view & buttons information to create dialog box
	this.pbDialog = new ZmDialog({title:sDialogTitle, view:this.pView, parent:this.getShell(), standardButtons:[DwtDialog.DISMISS_BUTTON]});

	this.pbDialog.setButtonListener(DwtDialog.DISMISS_BUTTON, new AjxListener(this, this._dismissBtnListener)); 

	this.pbDialog.popup(); //show the dialog

	appCtxt.getAppController().setStatusMsg(sStatusMsg);
};

/**
 * Creates the dialog view.
 * 
 */
com_zimbra_example_simpledialogtemplate_HandlerObject.prototype._createDialogView =
function() {
	var html = AjxTemplate.expand("com_zimbra_example_simpledialogtemplate.templates.Simple#Main");		
	return html;
	};

/**
 * The "DISMISS" button listener.
 * 
 */
	com_zimbra_example_simpledialogtemplate_HandlerObject.prototype._dismissBtnListener =
function() {
		
	this.pbDialog.popdown(); //hide the dialog
	};
