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


/**
 * Object that deals with Preferences and Preferences dialog
 * @param zimlet  Email Zimlet
 */
function EmailToolTipPrefDialog(zimlet) {
	this.zimlet = zimlet;
	this.emailZimlet_tooltipArea = this.zimlet.getUserProperty("emailZimlet_tooltipArea");
	if(!this.emailZimlet_tooltipArea) {
		this.emailZimlet_tooltipArea = EmailToolTipPrefDialog.DIMENSIONS[EmailToolTipPrefDialog.SIZE_MEDIUM];
	}
	this.updateEmailTooltipSize();
}

EmailToolTipPrefDialog.SIZE_VERYSMALL = "VERYSMALL";
EmailToolTipPrefDialog.SIZE_SMALL = "SMALL";
EmailToolTipPrefDialog.SIZE_MEDIUM = "MEDIUM";
EmailToolTipPrefDialog.SIZE_LARGE = "LARGE";
EmailToolTipPrefDialog.SIZE_XL = "XL";

EmailToolTipPrefDialog.DIMENSIONS = [];
EmailToolTipPrefDialog.DIMENSIONS[EmailToolTipPrefDialog.SIZE_VERYSMALL]  = "220px x 130px";
EmailToolTipPrefDialog.DIMENSIONS[EmailToolTipPrefDialog.SIZE_SMALL]  = "230px x 140px";
EmailToolTipPrefDialog.DIMENSIONS[EmailToolTipPrefDialog.SIZE_MEDIUM]  = "280px x 150px";
EmailToolTipPrefDialog.DIMENSIONS[EmailToolTipPrefDialog.SIZE_LARGE]  = "260px x 200px";
EmailToolTipPrefDialog.DIMENSIONS[EmailToolTipPrefDialog.SIZE_XL]  = "270px x 210px";

/**
 * Updates Email Tooltip's tooltipWidth and tooltipHeight
 */
EmailToolTipPrefDialog.prototype.updateEmailTooltipSize =
function() {
	var size = this.emailZimlet_tooltipArea.replace(/px/ig, "");
	var arry = size.split(" x ");
	EmailTooltipZimlet.tooltipWidth = arry[0];
	EmailTooltipZimlet.tooltipHeight = arry[1];
};