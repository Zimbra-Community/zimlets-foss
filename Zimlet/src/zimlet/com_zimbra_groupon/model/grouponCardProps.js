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
 * @Author Raja Rao DV (rrao@zimbra.com)
 */

function Com_Zimbra_GrouponCardProps() {
	this.type = "";
	this.tableId = "";
	this.timer = "";
	this.accountId = "";
	this.isClosed = "";
	this.refreshBtnId = "";
	this.closeBtnd = "";
	this.headerName = "";
	this.headerIcon = "";
	this.autoScroll = "";
	this.updateBtnId = "";//id of the updateButton
	this.updateFieldId = "";//id of the textArea that contains the status update
	this.updateToOtherFieldId = "";//html div that shows To:<otheruser> about the updateField
	this.feedPostParentId = "";//parentId of the current card
	this.feedPostOtherParentId = "";//parentId of the current feed-item within the card(used to write on other's wall)
	this.filterFeedByType = ""; //used to filter newsfeeds(used in default whereClause)
	this.whereClause = ""; //used to filter newsfeeds but allows us to set complete whereClause(if set, this will be used instead of this.filterFeedByType)
	this.latestTimeStamp = "";//latest timestamp of the feed/comment
	this.isMarkAsReadSet = false;//boolean that indicates if we need to use latestTimeStamp to filter the feeds
	this.unreadCountCellId = ""; //div id that shows the unreadcount
	this.markAsReadBtnId = "";//div id that stores markAsRead button.
	this.unReadCount = 0; //keeps track of # of unread feed items
	this.attachfileLinkId = ""; //Anchor for Attach files
}