/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Constructor.
 * 
 * @author Raja Rao DV
 */
function com_zimbra_attachmail_HandlerObject() {
};

com_zimbra_attachmail_HandlerObject.prototype = new ZmZimletBase();
com_zimbra_attachmail_HandlerObject.prototype.constructor = com_zimbra_attachmail_HandlerObject;

/**
 * Simplify handler object
 *
 */
var AttachMailZimlet = com_zimbra_attachmail_HandlerObject;



/**
 * Called by framework when attach popup called
 */

AttachMailZimlet.prototype.initializeAttachPopup =
function(menu, controller) {
	controller._createAttachMenuItem(menu, ZmMsg.mail, this.showAttachmentDialog.bind(this), "ATTACH_MENU_MAIL");
};

AttachMailZimlet.prototype.removePrevAttDialogContent =
function(contentDiv) {
    var elementNode =  contentDiv && contentDiv.firstChild;
    if (elementNode && elementNode.className == "DwtComposite" ){
        contentDiv.removeChild(elementNode);
    }
};

AttachMailZimlet.prototype.onDisposeComposeController =
function() {
	this.AMV._overview._controller.dispose();
};

AttachMailZimlet.prototype.showAttachmentDialog =
function() {

	var attachDialog = this._attachDialog = appCtxt.getAttachDialog();
	attachDialog.setTitle(ZmMsg.attachMail);
    this.removePrevAttDialogContent(attachDialog._getContentDiv().firstChild);
    if (!this.AMV || !this.AMV.attachDialog){
	    this.AMV = new AttachMailTabView(this._attachDialog, this);
    }

    this.AMV.reparentHtmlElement(attachDialog._getContentDiv().childNodes[0], 0);
    this.AMV.attachDialog = attachDialog;
	attachDialog.setOkListener(new AjxCallback(this.AMV, this.AMV.uploadFiles));

    var view = appCtxt.getCurrentView();
    var callback = new AjxCallback(view, view._attsDoneCallback, [true]);
    attachDialog.setUploadCallback(callback);

    this.AMV.attachDialog.popup();
    this.AMV.attachDialog.enableInlineOption(false);
    this._addedToMainWindow = true;
};

/**
 * Called when the panel is double-clicked.
 * 
 */
AttachMailZimlet.prototype.doubleClicked = function() {
	this.singleClicked();
};

/**
 * Called when the panel is single-clicked.
 * 
 */
AttachMailZimlet.prototype.singleClicked = function() {
	// do nothing
};

/**
 * @class
 * The attach mail tab view.
 * 
 * @param	{DwtTabView}	parant		the tab view
 * @param	{hash}	zimlet				the zimlet
 * @param	{string}	className		the class name
 * 
 * @extends		DwtTabViewPage
 */
AttachMailTabView =
function(parent, zimlet, className) {
	this.zimlet = zimlet;
	DwtComposite.call(this,parent,className,Dwt.STATIC_STYLE);
	var acct = appCtxt.multiAccounts ? appCtxt.getAppViewMgr().getCurrentView().getFromAccount() : appCtxt.getActiveAccount();
	if (this.prevAccount && (acct.id == this.prevAccount.id)) {
			this.setSize(Dwt.DEFAULT, "275");
			return;
	}
	this.prevAccount = acct;
	this._createHtml1();
	document.getElementById(this._folderTreeCellId).onclick = AjxCallback.simpleClosure(this._treeListener, this);
};

AttachMailTabView.prototype = new DwtComposite;
AttachMailTabView.prototype.constructor = AttachMailTabView;

/**
 * Defines the "search field" element id.
 */
AttachMailTabView.ELEMENT_ID_SEARCH_FIELD = "attDlg_attMsg_SearchField";
/**
 * Defines the "search button" element id.
 */
AttachMailTabView.ELEMENT_ID_SEARCH_BUTTON = "attDlg_attMsg_SearchBtn";
/**
 * Defines the "view message button" element id.
 */
AttachMailTabView.ELEMENT_ID_VIEW_MESSAGE_BUTTON = "attDlg_attMsg_ViewMsgBtn";
/**
 * Defines the "nav button cell" element id.
 */
AttachMailTabView.ELEMENT_ID_NAV_BUTTON_CELL = "attDlg_attMsg_NavBtnCell";

/**
 * Returns a string representation of the object.
 * 
 */
AttachMailTabView.prototype.toString = function() {
	return "AttachMailTabView";
};

/**
 * Shows the tab view.
 * 
 */
AttachMailTabView.prototype.showMe =
function() {
	DwtTabViewPage.prototype.showMe.call(this);
	var acct = appCtxt.multiAccounts ? appCtxt.getAppViewMgr().getCurrentView().getFromAccount() : appCtxt.getActiveAccount();
	if (this.prevAccount && (acct.id == this.prevAccount.id)) {
			this.setSize(Dwt.DEFAULT, "275");
			return;
	}
	this.prevAccount = acct;
	this._createHtml1();
	document.getElementById(this._folderTreeCellId).onclick = AjxCallback.simpleClosure(this._treeListener, this);
};

/**
 * Resets the query.
 * 
 * @param	{string}	newQuery		the new query
 */
AttachMailTabView.prototype._resetQuery =
function(newQuery) {
	if (this._currentQuery == undefined) {
		this._currentQuery = newQuery;
		return newQuery;
	}

	if (this._currentQuery != newQuery) {
		this._offset = 0;
		this._currentQuery = newQuery;
	}
	return newQuery;
};

/**
 * Gets the "from folder id" query.
 * 
 * @param	{string}		folderId
 * @return	{string}	the query
 */
AttachMailTabView.prototype._getQueryFromFolder =
function(folderId) {
	return this._resetQuery('inid:"' + folderId + '"');
};

/**
 * Hides the tab view.
 * 
 */
AttachMailTabView.prototype.hideMe =
function() {
	DwtTabViewPage.prototype.hideMe.call(this);
};

/**
 * Creates HTML for for the attach mail tab UI.
 * 
 */
AttachMailTabView.prototype._createHtml1 =
function() {

	this._tableID = Dwt.getNextId();
	this._folderTreeCellId = Dwt.getNextId();
	this._folderListId = Dwt.getNextId();
	var html = [];
	var idx = 0;

	html[idx++] = '<table width="100%" style="margin-bottom:5px">';
	html[idx++] = '<TR><td width=\"20%\"><INPUT type="text" id="';
	html[idx++] = AttachMailTabView.ELEMENT_ID_SEARCH_FIELD;
	html[idx++] = '" style="padding:4px"></INPUT></td>';
	html[idx++] = '<td width=\"10%\"><div id="';
	html[idx++] = AttachMailTabView.ELEMENT_ID_SEARCH_BUTTON;
	html[idx++] = '" style="margin: 0 2px" />';
	html[idx++] = '<td width=\"10%\"><div id="';
	html[idx++] = AttachMailTabView.ELEMENT_ID_VIEW_MESSAGE_BUTTON;
	html[idx++] = '" style="margin: 0 2px" /></td>';
	html[idx++] = '<td align="right" width="60%"><SPAN id="';
	html[idx++] = AttachMailTabView.ELEMENT_ID_NAV_BUTTON_CELL;
	html[idx++] = '" /></td></TR></table>';
	html[idx++] = '<table width="100%">';
	html[idx++] = '<tr>';
	html[idx++] = '<td valign="top" id="' + this._folderTreeCellId + '">';
	html[idx++] = '</td>';
	html[idx++] = '<td  valign="top"  id="' + this._folderListId + '">';
	html[idx++] = '</td>';
	html[idx++] = '</tr>';
	html[idx++] = '</table>';

    this.setContent(html.join(""));

	var searchButton = new DwtButton({parent:this});
	var searchButtonLabel = this.zimlet.getMessage("AttachMailZimlet_tab_button_search");
	searchButton.setText(searchButtonLabel);
	searchButton.addSelectionListener(new AjxListener(this, this._searchButtonListener));
	document.getElementById(AttachMailTabView.ELEMENT_ID_SEARCH_BUTTON).appendChild(searchButton.getHtmlElement());

	var viewMsgButton = new DwtButton({parent:this});
	var viewMsgButtonLabel = this.zimlet.getMessage("AttachMailZimlet_tab_button_view");
	viewMsgButton.setText(viewMsgButtonLabel);
	viewMsgButton.addSelectionListener(new AjxListener(this, this._viewMsgButtonListener));
	document.getElementById(AttachMailTabView.ELEMENT_ID_VIEW_MESSAGE_BUTTON).appendChild(viewMsgButton.getHtmlElement());

	this._navigationContainer = new DwtComposite(appCtxt.getShell());
	
	this._navTB = new AMZimletNavToolBar({parent:this._navigationContainer});
	var navBarListener = new AjxListener(this, this._navBarListener);
	this._navTB.addSelectionListener(ZmOperation.PAGE_BACK, navBarListener);
	this._navTB.addSelectionListener(ZmOperation.PAGE_FORWARD, navBarListener);

	document.getElementById(AttachMailTabView.ELEMENT_ID_NAV_BUTTON_CELL).appendChild(this._navTB.getHtmlElement());


	var params = {parent: appCtxt.getShell(), className: "AttachMailTabBox AttachMailList", posStyle: DwtControl.ABSOLUTE_STYLE, view: ZmId.VIEW_BRIEFCASE_ICON, type: ZmItem.ATT};
	var bcView = this._tabAttachMailView = new ZmAttachMailListView(params);
	this.showAttachMailTreeView(); //this must be called AFTER setting this._tabAttachMailView since callback called from it uses it. so far only on IE7 for some reason this callback was called before the previous line, when this line was above it, but it was the bug

	bcView.reparentHtmlElement(this._folderListId);
	bcView.addSelectionListener(new AjxListener(this, this._listSelectionListener));

	Dwt.setPosition(bcView.getHtmlElement(), Dwt.RELATIVE_STYLE);
	//this.executeQuery(ZmOrganizer.ID_BRIEFCASE);
};



/**
 * Listens for "search" button events.
 * 
 * @see			_createHtml
 */
AttachMailTabView.prototype._searchButtonListener =
function(ev) {
	this.treeView.deselectAll();
	var val = document.getElementById(AttachMailTabView.ELEMENT_ID_SEARCH_FIELD).value;
	if (val == "")
		return;

	var query = this._resetQuery(val);
	this.executeQuery(query);
};

/**
 * Listens for "view message" button events.
 * 
 * @see			_createHtml
 */
AttachMailTabView.prototype._viewMsgButtonListener =
function(ev) {
	var items = this.getSelectedMsgs();
	for (var i = 0; i < items.length; i++) {
		items[i].load({});
		ZmMailMsgView.detachMsgInNewWindow(items[i]);
	}
};

/**
 * Listens for "navigation bar" button events.
 * 
 * @see			_createHtml
 */
AttachMailTabView.prototype._navBarListener =
function(ev) {
	var op = ev.item.getData(ZmOperation.KEY_ID);
	this._paginate(op == ZmOperation.PAGE_FORWARD);
};

/**
 * Pagination.
 * 
 */
AttachMailTabView.prototype._paginate =
function(getNext) {
	this.executeQuery(this._currentQuery, getNext);

};

/**
 * Performs a folder search.
 * 
 * @param	{hash}	params		a hash of parameters
 */
AttachMailTabView.prototype.searchFolder =
function(params) {
	var soapDoc = AjxSoapDoc.create("SearchRequest", "urn:zimbraMail");
	soapDoc.setMethodAttribute("types", "message");
	soapDoc.setMethodAttribute("limit", params.limit);
	soapDoc.setMethodAttribute("offset", params.offset);
	soapDoc.set("query", params.query);

	params.response = appCtxt.getAppController().sendRequest({soapDoc:soapDoc,noBusyOverlay:false});
	this.handleSearchResponse(params);
};

/**
 * Handles the search folder response.
 * 
 * @param	{hash}	params		a hash of parameters
 */
AttachMailTabView.prototype.handleSearchResponse =
function(params) {
	var response = params.response;
	if (response && (response.SearchResponse || response._data.SearchResponse)) {
		params.searchResponse = response.SearchResponse || response._data.SearchResponse;
		params.items = this.processDocsResponse(params);
	}
	if (params.callback) {
		params.callback.run(params);
	}
};

/**
 * Processes the search folder doc response.
 * 
 * @param	{hash}	params		a hash of parameters
 */
AttachMailTabView.prototype.processDocsResponse =
function(params) {
	var msgs = params.searchResponse.m;
	var mailList = new ZmMailList(ZmItem.MSG, this._currentSearch);
	mailList.clear();
	mailList.setHasMore(params.searchResponse.more);
	if (msgs == undefined)
		return mailList;

	for (var i = 0; i < msgs.length; i++) {
		var msg = msgs[i];
		mailList.addFromDom(msg);
	}
	return mailList;
};

/**
 * Shows the search folder result content.
 * 
 * @param	{hash}	params		a hash of parameters
 */
AttachMailTabView.prototype.showResultContents =
function(params) {
	var items = params.items;
	this._navTB.enable(ZmOperation.PAGE_BACK, params.offset > 0);
	this._navTB.enable(ZmOperation.PAGE_FORWARD, items.hasMore());
	var numItems = items.size();
	if (numItems == 0)
		this._navTB.setText("");
	else
		this._navTB.setText((this._offset + 1) + "-" + (this._offset + items.size()));


	if (items) {
		this._list = items;
	} else {
		this._list = new ZmList(ZmItem.BRIEFCASE_ITEM);
	}
	var bcView = this._tabAttachMailView;
	bcView.set(this._list);
	bcView._controller.setList(this._list);
};

/**
 * Handles the view keys events.
 * 
 * @param	{DwtKeyEvent}	ev
 */
AttachMailTabView.prototype._handleKeys =
function(ev) {
	var key = DwtKeyEvent.getCharCode(ev);
	return !DwtKeyEvent.IS_RETURN[key];
};

AttachMailTabView.prototype.gotAttachments =
function() {
	return false;
};

/**
 * Gets the selected messages.
 * 
 */
AttachMailTabView.prototype.getSelectedMsgs =
function() {
	var bcView = this._tabAttachMailView;
	return bcView.getSelection();
};

/**
 * Uploads the files.
 * 
 */
AttachMailTabView.prototype.uploadFiles =
function(attachmentDlg, msgIds) {
	if (!msgIds) {
		msgIds = [];
		var items = this.getSelectedMsgs();
		if (!items || (items.length == 0)) {
			return;
		}
		for (var i in items) {
			msgIds.push(items[i].id);
		}
	}
	if(attachmentDlg == undefined)//in 5.x this is undefined, so use the local one
		attachmentDlg = this.attachDialog;

	if (attachmentDlg._uploadCallback) {
		attachmentDlg._uploadCallback.run(AjxPost.SC_OK, null, null,msgIds);
	}
    attachmentDlg.popdown();
};

/**
 * Shows the attach mail tree view.
 * 
 */
AttachMailTabView.prototype.showAttachMailTreeView =
function() {
	var callback = new AjxCallback(this, this._showTreeView);
	AjxPackage.undefine("zimbraMail.mail.controller.ZmMailFolderTreeController");
	AjxPackage.require({name:"MailCore", forceReload:true, callback:callback});
};

AttachMailTabView.prototype._showTreeView =
function() {
	if(appCtxt.isChildWindow) {
		ZmOverviewController.CONTROLLER["FOLDER"] = "ZmMailFolderTreeController";
	}
	//Force create deferred folders if not created
	var app = appCtxt.getApp(ZmApp.MAIL);
	app._createDeferredFolders();

	var base = this.toString();

	var params = {
		treeIds: ["FOLDER"],
		fieldId: this._folderTreeCellId,
		overviewId: (appCtxt.multiAccounts) ? ([base, this.prevAccount.name].join(":")) : base,
		account: this.prevAccount
	};
	this._setOverview(params);
	this.setSize(Dwt.DEFAULT, "275");
	this._currentQuery = this._getQueryFromFolder("2");
	//this.treeView.setSelected("2");
	setTimeout(AjxCallback.simpleClosure(this.treeView.setSelected, this.treeView, 2), 100);
};


AttachMailTabView.prototype._setOverview =
function(params) {
	var overviewId = params.overviewId;
	var opc = appCtxt.getOverviewController();
	var overview = opc.getOverview(overviewId);
	if (!overview) {
		var ovParams = {
			overviewId: overviewId,
			overviewClass: "AttachMailTabBox",
			headerClass: "DwtTreeItem",
			noTooltips: true,
			treeIds: params.treeIds
		};
		overview =  opc.createOverview(ovParams);
		overview.account = this.prevAccount;    //need to set account here before set overview so that account switch from selection list will be used to get tree data.
		overview.set(params.treeIds);
		overview.clearChangeListener(params.treeIds);
	} else if (params.account) {
		overview.account = params.account;
	}
	overview.setSelected(this.prevAccount.id + ":" + ZmFolder.ID_INBOX, "FOLDER");
	this._overview = overview;
	document.getElementById(params.fieldId).appendChild(overview.getHtmlElement());
	this.treeView = overview.getTreeView("FOLDER");
	this.treeView.addSelectionListener(new AjxListener(this, this._treeListener));
	this._hideRoot(this.treeView);
};

AttachMailTabView.prototype._treeListener =
function(ev, ignoreEvent) {
	ev = ev || window.event; //this is called from onClick via simpleClosure and the event is not passed in IE as a param.
	if (ignoreEvent || ev.detail == DwtTree.ITEM_SELECTED) {
		var item = this.treeView.getSelected();
		document.getElementById(AttachMailTabView.ELEMENT_ID_SEARCH_FIELD).value = ["in:\"", item.getSearchPath(),"\""].join("");
		var query = this._getQueryFromFolder(item.id);
		this.executeQuery(query);
        this._tabAttachMailView.focus();
	}
};

AttachMailTabView.prototype._hideRoot =
function(treeView) {
	var ti = treeView.getTreeItemById(ZmOrganizer.ID_ROOT);
	if (!ti) {
		var rootId = ZmOrganizer.getSystemId(ZmOrganizer.ID_ROOT, this.prevAccount);
		ti = treeView.getTreeItemById(rootId);
	}
	ti.showCheckBox(false);
	ti.setExpanded(true);
	ti.setVisible(false, true);
};

/**
 * Sets the view size.
 * 
 * @param	{number}	width		the width
 * @param	{number}	height		the height
 * @return	{AttachMailTabView}	the view
 */
AttachMailTabView.prototype.setSize =
function(width, height) {
	DwtTabViewPage.prototype.setSize.call(this, width, height);
	var size = this.getSize();

	var treeWidth = size.x * 0.350;
	// var listWidth = size.x - treeWidth - 15;
	var listWidth = size.x - treeWidth;
	var newHeight = height - 55;
	this._overview.setSize(treeWidth, newHeight);
	this._tabAttachMailView.setSize(listWidth - 5, newHeight);
	return this;
};

AttachMailTabView.prototype.executeQuery =
function(query, forward) {
	if (this._limit == undefined)
		this._limit = 50;

	if (this._offset == undefined)
		this._offset = 0;

	if (forward != undefined) {
		if (forward) {
			this._offset = this._offset + 50;
		} else {
			this._offset = this._offset - 50;
		}
	}

	//var bController = this._AttachMailController;
	var callback = new AjxCallback(this, this.showResultContents);
	this.searchFolder({query:query, offset:this._offset, limit:this._limit , callback:callback});
};

/**
 * @class
 * The attach mail controller.
 * 
 * @extends		ZmListController
 */
ZmAttachMailController = function(view) {
	if (arguments.length == 0) { return; }
	ZmListController.call(this, null, null);
	this.clearChangeListener();
	this._currentViewId = "ZmAttachMailListView";
	this._view = {};
	this._view[this._currentViewId] = view;

};

ZmAttachMailController.prototype = new ZmListController;
ZmAttachMailController.prototype.constructor = ZmAttachMailController;

ZmAttachMailController.prototype._resetToolbarOperations =
function() {
	// override to avoid js expn although we do not have a toolbar per se
};

ZmAttachMailController.prototype.clearChangeListener = function() {
	// remove listener for the tag list
	if (this._boundTagChangeListener) {
		var tagTree = appCtxt.getTagTree();
		if (tagTree) {
			tagTree.removeChangeListener(this._boundTagChangeListener);
		}
	}
};


/**
 * @class
 * The attach mail list view.
 * 
 * @extends		ZmListView
 */
ZmAttachMailListView = function(params) {
	this._showCheckboxColSpan = appCtxt.get(ZmSetting.SHOW_SELECTION_CHECKBOX);
	ZmListView.call(this, params);
	this.clearChangeListener();
	this._controller = new ZmAttachMailController(this);
};

ZmAttachMailListView.prototype = new ZmListView;
ZmAttachMailListView.prototype.constructor = ZmAttachMailListView;

ZmAttachMailListView.prototype._getDivClass =
function(base, item, params) {
	return "";
};

ZmAttachMailListView.prototype.clearChangeListener = function() {
	// remove listeners for this list from folder tree and tag list
	if (this._boundFolderChangeListener) {
		var folderTree = appCtxt.getFolderTree();
		if (folderTree) {
			folderTree.removeChangeListener(this._boundFolderChangeListener);
		}
	}
	if (this._tagListChangeListener) {
		var tagTree = appCtxt.getTagTree();
		if (tagTree) {
			tagTree.removeChangeListener(this._tagListChangeListener);
		}
	}
};

ZmAttachMailListView.prototype._getCellContents =
function(htmlArr, idx, item, field, colIdx, params) {

	var fragment = item.fragment ? AjxStringUtil.htmlEncode(item.fragment.slice(0, 80)) : "";

	var from = item.getAddress("FROM");
	if (from.name != "") {
		from = from.name;
	} else {
		from = from.address;
	}
	var attachCell = "";
	var cols = 2;
	if (item.hasAttach){

		attachCell = "<td width='16px'><div class='ImgAttachment'/></td>";
		cols = 3;
	}
	htmlArr[idx++] = "<div class='AttachMailRowDiv'>";
	htmlArr[idx++] = "<table width='100%'>"; 
	
	var subject = item.subject ? AjxStringUtil.htmlEncode(item.subject.slice(0, 32)) : ZmMsg.noSubject;
	htmlArr[idx++] = "<tr>";
	if (this._showCheckboxColSpan) {
		htmlArr[idx++] = "<td rowspan=3 style='vertical-align:middle;' width='20'><center>";
		idx = this._getImageHtml(htmlArr, idx, "CheckboxUnchecked", this._getFieldId(item, ZmItem.F_SELECTION));
		htmlArr[idx++] = "</center></td>";
	}
	htmlArr[idx++] = attachCell;
	htmlArr[idx++] = "<td align='left' width='80%'><span class='AttachMailSubject'> " + subject + "</span></td>";

	htmlArr[idx++] = "<td width='20%' align='right'>";
	htmlArr[idx++] = AjxDateUtil.computeDateStr(params.now || new Date(), item.date);
	htmlArr[idx++] = "</td></tr>";

	htmlArr[idx++] = "<tr><td align='left' colspan='"+cols+"'><span class='AttachMailFrom'> ";
	htmlArr[idx++] = from;
	htmlArr[idx++] = "</span></td></tr>";
	
	if (fragment != "") {
		htmlArr[idx++] = "<tr><td align=left colspan="+cols+"><span class='AttachMailFrag'>" + fragment + "</span></td></tr>";
	}
	htmlArr[idx++] = "</table></div>";
	
	return idx;
};
