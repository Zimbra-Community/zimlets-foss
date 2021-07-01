/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/**
 * The attach contacts tab view.
 *
 * @param	{DwtTabView}	parant		the tab view
 * @param	{hash}	zimlet				the zimlet
 * @param	{string}	className		the class name
 *
 * @extends		DwtTabViewPage
 */
AttachContactsTabView =
function(parent, zimlet, className) {
	this.zimlet = zimlet;
    DwtComposite.call(this,parent,className,Dwt.STATIC_STYLE);
    this._createHtml1();
	this.closed = true;
};

AttachContactsTabView.prototype = new DwtComposite;
AttachContactsTabView.prototype.constructor = AttachContactsTabView;

/**
 * Defines the "search field" element id.
 */
AttachContactsTabView.ELEMENT_ID_SEARCH_FIELD = "attDlg_attContact_SearchField";
/**
 * Defines the "search button" element id.
 */
AttachContactsTabView.ELEMENT_ID_SEARCH_BUTTON = "attDlg_attContact_SearchBtn";

/**
 * Defines the "nav button cell" element id.
 */
AttachContactsTabView.ELEMENT_ID_NAV_BUTTON_CELL = "attDlg_attContact_NavBtnCell";

/**
 * Defines the id of the folder to search initially
 */
AttachContactsTabView.DEFAULT_CONTACTS_FOLDER = "7";

/**
 * Defines the max number of rows in a group entry. If the group has this many entries, they will all be shown. If it has more, cutoff-1 entries will be shown and an "(x more)" message will be displayed as the last row
 */
AttachContactsTabView.GROUP_CUTOFF = 6;

/**
 * Returns a string representation of the object.
 *
 */
AttachContactsTabView.prototype.toString = function() {
	return "AttachContactsTabView";
};

/**
 * Shows the tab view.
 *
 */
AttachContactsTabView.prototype.showMe =
function() {
	DwtTabViewPage.prototype.showMe.call(this);
	var acct = appCtxt.multiAccounts ? appCtxt.getAppViewMgr().getCurrentView().getFromAccount() : appCtxt.getActiveAccount();
	if (appCtxt.multiAccounts) {
		appCtxt.accountList.setActiveAccount(acct);
	}
	if (this.prevAccount && (acct.id == this.prevAccount.id)) {
		this.reset();
		this.setSize(Dwt.DEFAULT, "295");
		return;
	}
	this.prevAccount = acct;
	this._createHtml1();
	Dwt.byId(this._folderTreeCellId).onclick = AjxCallback.simpleClosure(this._treeListener, this);
};

AttachContactsTabView.prototype.setClosed =
function(closed) {
	this._closed = (closed!==false);
};

/**
 * Resets the query.
 * @param	{string}	newQuery		the new query
 */
AttachContactsTabView.prototype._resetQuery =
function(newQuery) {
	if (this._currentQuery == undefined)
		return newQuery;

	if (this._currentQuery != newQuery) {
		this._offset = 0;
		this._currentQuery = newQuery;
	}
	return newQuery;
};

/**
 * Gets the "from folder id" query.
 * @param	{string}		folderId
 * @return	{string}	the query
 */
AttachContactsTabView.prototype._getQueryFromFolder =
function(folderId) {
	return this._resetQuery('inid:"' + folderId + '"');
};

/**
 * Hides the tab view.
 */
AttachContactsTabView.prototype.hideMe =
function() {
	DwtTabViewPage.prototype.hideMe.call(this);
};

/**
 * Creates HTML for for the attach contacts tab UI.
 */
AttachContactsTabView.prototype._createHtml1 =
function() {
	this._tableID = Dwt.getNextId();
	this._folderTreeCellId = Dwt.getNextId();
	this._folderListId = Dwt.getNextId();
	var html = [];
	html.push("<table class='AttachContacts_table' width='100%' style='margin-bottom:5px;'>",
	"<TR><td><INPUT type='text' id='", AttachContactsTabView.ELEMENT_ID_SEARCH_FIELD,"'></INPUT></td>",
	"<td width='80%' style='padding:0 2px'><SPAN id='", AttachContactsTabView.ELEMENT_ID_SEARCH_BUTTON, "' /></td>",
	"<td><SPAN id='", AttachContactsTabView.ELEMENT_ID_NAV_BUTTON_CELL,"' /></td></TR></table>",
	"<table width='100%'><tr><td valign='top' id='", this._folderTreeCellId, "'></td>",
	"<td  valign='top'><div  id='", this._folderListId, "' ></div>",
	"</td></tr></table>");

    this.setContent(html.join(""));

	var searchButton = new DwtButton({parent:this});
	var searchButtonLabel = this.zimlet.getMessage("ACZ_tab_button_search");
	searchButton.setText(searchButtonLabel);
	searchButton.setImage("Contact");
	searchButton.setSize("140");
	searchButton.addSelectionListener(new AjxListener(this, this._searchButtonListener));
	Dwt.byId(AttachContactsTabView.ELEMENT_ID_SEARCH_BUTTON).appendChild(searchButton.getHtmlElement());

	this._navigationContainer = new DwtComposite(appCtxt.getShell());
	this._navTB = new ACZimletNavToolBar({parent:this._navigationContainer});
	var navBarListener = new AjxListener(this, this._navBarListener);
	this._navTB.addSelectionListener(ZmOperation.PAGE_BACK, navBarListener);
	this._navTB.addSelectionListener(ZmOperation.PAGE_FORWARD, navBarListener);
	Dwt.byId(AttachContactsTabView.ELEMENT_ID_NAV_BUTTON_CELL).appendChild(this._navTB.getHtmlElement());

	this.showAttachContactsTreeView();
	Dwt.byId(this._folderListId)
	Dwt.byId(this._folderListId).onclick = AjxCallback.simpleClosure(this._handleItemSelect, this);

};


AttachContactsTabView.prototype._handleItemSelect =
function(ev) {
	if (AjxEnv.isIE) {
		ev = window.event;
	}
	var dwtev = DwtShell.mouseEvent;
	dwtev.setFromDhtmlEvent(ev);
	var rowEl = dwtev.target;
	var rowWasClicked = true;
	if(rowEl.className == "ImgCheckboxUnchecked" || rowEl.className == "ImgCheckboxChecked") {
		 rowWasClicked = false;
	}
	while (!Dwt.hasClass(rowEl, 'AttachContactRow') && rowEl.id != this._folderListId) {
		rowEl = rowEl.parentNode;
	}
	if(rowEl.id == this._folderListId) {
		return;
	}
	this._resetRowSelection(rowWasClicked);

	var itemId = rowEl.id.replace("attachContactsZimlet_row_", "");
	var checkboxEl = document.getElementById("attachContactsZimlet_checkbox_"+itemId);

	if(checkboxEl && !rowWasClicked) {
		if(checkboxEl.className == "ImgCheckboxUnchecked") {
			this._setCheckBoxSelection(checkboxEl, true);
		} else if(checkboxEl.className == "ImgCheckboxChecked" ) {
			this._setCheckBoxSelection(checkboxEl, false);
		}
	}
	if(rowEl) {
		if(rowEl.className.indexOf("Row-selected") >= 0) {
			if(checkboxEl.className != "ImgCheckboxChecked") {
				this._setRowSelection(rowEl, false);
				this._selectedItemIds[itemId] =  false;
			}
		} else {
			this._setRowSelection(rowEl, true);
			this._selectedItemIds[itemId] = true;
		}
	}

    this._selectionChanged();
};

AttachContactsTabView.prototype._resetRowSelection =
function(rowWasClicked) {
	 for(var itemId in this._selectedItemIds) {

		 var checkboxEl = document.getElementById("attachContactsZimlet_checkbox_"+itemId);
		 var rowEl =  document.getElementById("attachContactsZimlet_row_"+itemId);
		 //if checkbox for item1 was selected but already has a row-selected for a different item
		 // item2, unselect that item item2
		 if(!rowWasClicked &&  checkboxEl && checkboxEl.className == "ImgCheckboxChecked") {
			 continue;
		 }
		 this._setRowSelection(rowEl, false);
		 this._setCheckBoxSelection(checkboxEl, false);
		 if(this._selectedItemIds && this._selectedItemIds[itemId]) {
		 	this._selectedItemIds[itemId] = false;
		 }
	 }
};

AttachContactsTabView.prototype._setCheckBoxSelection =
function(checkboxEl, selected) {
	if(!checkboxEl) {
		return;
	}
	if(!selected) {
		checkboxEl.className =  "ImgCheckboxUnchecked";
	} else {
		checkboxEl.className = "ImgCheckboxChecked";
	}
};

AttachContactsTabView.prototype._setRowSelection =
function(rowEl, selected) {
	if(!rowEl) {
		return;
	}
	if(!selected) {
		rowEl.className =  AjxStringUtil.trim(rowEl.className.replace("Row-selected", ""));
	} else if(rowEl.className.indexOf("Row-selected") == -1) {
		rowEl.className = rowEl.className + " Row-selected";
	}
};


/**
 * Listens for "search" button events.
 * @see			_createHtml
 */
AttachContactsTabView.prototype._searchButtonListener =
function(ev) {
	this.treeView.deselectAll();
	var val = Dwt.byId(AttachContactsTabView.ELEMENT_ID_SEARCH_FIELD).value;
	if (val == "")
		return;

	var query = this._resetQuery(val);
	this.executeQuery(query);
};


/**
 * Listens for "navigation bar" button events.
 *
 * @see			_createHtml
 */
AttachContactsTabView.prototype._navBarListener =
function(ev) {
	var op = ev.item.getData(ZmOperation.KEY_ID);
	this._paginate(op == ZmOperation.PAGE_FORWARD);
};

/**
 * Pagination.
 */
AttachContactsTabView.prototype._paginate =
function(getNext) {
	this.executeQuery(this._currentQuery, getNext);

};

/**
 * Shows the search folder result content.
 * @param	{hash}	params		a hash of parameters
 */
AttachContactsTabView.prototype.showResultContents =
function(params) {
	this._checkboxIdAndItemIdMap = [];
	this._selectedItemIds = {};
	var items = [];
	var response = {}
	if(params.response && params.response.SearchResponse &&  params.response.SearchResponse.cn) {
		response = params.response.SearchResponse;
		items = response.cn;
	}

	this._navTB.enable(ZmOperation.PAGE_BACK, response.offset > 0);
	this._navTB.enable(ZmOperation.PAGE_FORWARD, response.more);
	var numItems = items.length;
	if (numItems == 0){
		this._navTB.setText("");
	} else {
		this._navTB.setText((this._offset + 1) + "-" + (this._offset + numItems));
	}

	this._setListView(items);
};

AttachContactsTabView.prototype._setListView =
function(items) {
	var html = [];
	var idx = 0;
	
	if (items.length == 0) {
		if (!this._noContactsFoundStr) {
			this._noContactsFoundStr = ["<div padding=5px>", this.zimlet.getMessage("ACZ_NoContactsFound"), "</div>"].join("");
		}
		html[idx++] = this._noContactsFoundStr;
	} else {
		var desiredAttrs = [ZmContact.EMAIL_FIELDS, ZmContact.PHONE_FIELDS, ZmContact.IM_FIELDS];
		var isRowOdd = true;
		for (var i=0; i < items.length; i++) {
			var item = items[i];
			var contact;
			try {
				contact = ZmContact.createFromDom(item, {});
			} catch (e) {
				continue;
			}
			if (!contact) {
				continue;
			}

			var rowClass = (isRowOdd) ? "RowOdd AttachContactRow" : "RowEven AttachContactRow";
			isRowOdd = !isRowOdd;

			var name = ZmContact.computeFileAs(contact);

			var fields;

            //query should prevent contract group results, but check anyway
            if (!contact.isGroup()){
				fields = [];
				for (var j=0; j<desiredAttrs.length; j++) {
					var wattr = this._getFirstWorkingAttr(contact.getAttrs(), desiredAttrs[j]);
					if (wattr)
						fields.push(wattr);
				}

                var chkId = "attachContactsZimlet_checkbox_"+item.id;
				var rowId = "attachContactsZimlet_row_"+item.id;
                //this._checkboxIdAndItemIdMap[chkId] = item.id;
                html[idx++] = "<div  class='";
                html[idx++] = rowClass;
                html[idx++] = "' id='";
				html[idx++] = rowId;
				html[idx++] = "'>";

                html[idx++] = "<table width=100%>";
                html[idx++] = "<tr>";



				html[idx++] = "<td width='1px'><div  id='";
                html[idx++] = chkId;
                html[idx++] = "' class='ImgCheckboxUnchecked'></div></td>";


                html[idx++] = "<td width='1px'>";
                html[idx++] = AjxImg.getImageHtml(contact.getIcon());
                html[idx++] = "</td>";

                html[idx++] = "<td width='98%'><span style=\"font-weight:bold;\">";
                html[idx++] = AjxStringUtil.htmlEncode(name || ZmMsg.noName);
                html[idx++] = "</span></td></tr>";

                for (var j=0; j<fields.length; j++) {
                    html[idx++] = "<tr><td></td><td colspan=3>";
                    html[idx++] = AjxStringUtil.htmlEncode(fields[j]);
                    html[idx++] = "</td></tr>";
                }

                html[idx++] = "</table></div>";
            }
		}
	}
	
	Dwt.setInnerHtml(Dwt.byId(this._folderListId), html.join(""));

	this._selectionChanged();
};

/**
 * Notify listeners that the selected items changed.
*/
AttachContactsTabView.prototype._selectionChanged =
function() {
    if (this.isListenerRegistered(DwtEvent.SELECTION)) {
        var selEv = new DwtSelectionEvent(true);
        selEv.button = DwtMouseEvent.LEFT;
        selEv.target = this;
        selEv.item = null;
        selEv.detail = DwtListView.ITEM_SELECTED;
        selEv.ersatz = true;
        this.notifyListeners(DwtEvent.SELECTION, selEv);
    }
}

AttachContactsTabView.prototype._getFirstWorkingAttr =
function(item, desiredAttrs) {
	var attrs = [];
	if (AjxUtil.isArray(desiredAttrs)) {
		for (var i=0; i<desiredAttrs.length; i++) {
			var attr = this._getFirstWorkingAttr(item, desiredAttrs[i]);
			if (attr)
				return attr;
		}
	} else if (AjxUtil.isString(desiredAttrs)) {
		if (item[desiredAttrs])
			return item[desiredAttrs];
	}
}

/**
 * Handles the view keys events.
 *
 * @param	{DwtKeyEvent}	ev
 */
AttachContactsTabView.prototype._handleKeys =
function(ev) {
	var key = DwtKeyEvent.getCharCode(ev);
	return !DwtKeyEvent.IS_RETURN[key];
};

AttachContactsTabView.prototype.gotAttachments =
function() {
	return false;
};

/**
 * Gets the selected items.
 *
 */
AttachContactsTabView.prototype._getSelectedItems =
function() {
	var selectedIds = [];
	for (var id in this._selectedItemIds) {
		if (this._selectedItemIds[id]) {
			selectedIds.push(id);
		}
	}
	return selectedIds;
};

/**
 * Get the amount of selected items.
*/
AttachContactsTabView.prototype.getSelectionCount =
function() {
	var n = 0;
	for (var id in this._selectedItemIds) {
		n += this._selectedItemIds[id];
	}
	return n;
}


/**
 * Inserts contacts
 */
AttachContactsTabView.prototype.uploadFiles =
function() {
    var controller = appCtxt.getApp(ZmApp.MAIL).getComposeController(appCtxt.getApp(ZmApp.MAIL).getCurrentSessionId(ZmId.VIEW_COMPOSE));
	this.zimlet.contactIdsToAttach = this._getSelectedItems();
	this.zimlet._isDrafInitiatedByThisZimlet = true;   //set this to true
	controller.saveDraft(ZmComposeController.DRAFT_TYPE_AUTO,null,null,null,this.zimlet.contactIdsToAttach);
};

/**
 * Shows the attach contacts tree view.
 */
AttachContactsTabView.prototype.showAttachContactsTreeView =
function() {
	var callback = new AjxCallback(this, this._showTreeView);
	AjxPackage.undefine("zimbraMail.abook.controller.ZmAddrBookTreeController");
	AjxPackage.require({name:["ContactsCore","Contacts"], forceReload:true, callback:callback});
};

AttachContactsTabView.prototype.reset =
function() {
	Dwt.byId(AttachContactsTabView.ELEMENT_ID_SEARCH_FIELD).value = "";
	var folderId = AttachContactsTabView.DEFAULT_CONTACTS_FOLDER;
	this._currentQuery = this._getQueryFromFolder(folderId);
	this.treeView.setSelected(folderId);
	this._treeListener();
};

AttachContactsTabView.prototype._showTreeView =
function() {
	if (appCtxt.isChildWindow) {
		ZmOverviewController.CONTROLLER["ADDRBOOK"] = "ZmAddrBookTreeController";
	}
	var app = appCtxt.getApp(ZmApp.CONTACTS);

	app._createDeferredFolders();
	var base = this.toString();
	var params = {
		treeIds: ["ADDRBOOK"],
		overviewId: (appCtxt.multiAccounts) ? ([base, this.prevAccount.name].join(":")) : base,
		account: this.prevAccount
	};
	this._setOverview(params);

	this.setSize(Dwt.DEFAULT, "295");
	this.reset();
};
/**
 * Called by Framework
 * @param {Object} params Object with Overview information
 */
AttachContactsTabView.prototype._setOverview =
function(params) {
	var overviewId = params.overviewId;
	var opc = appCtxt.getOverviewController();
	var overview = opc.getOverview(overviewId);
	if (!overview) {
		var ovParams = {
			overviewId: overviewId,
			overviewClass: "AttachContactsTabBox",
			headerClass: "DwtTreeItem",
			noTooltips: true,
			treeIds: params.treeIds
		};
		overview =  opc.createOverview(ovParams);
		overview.account = this.prevAccount;
		var omit = {};
		omit[ZmOrganizer.ID_DLS] = true;
		overview.set(params.treeIds, omit);
	} else if (params.account) {
		overview.account = params.account;
	}
	this._overview = overview;
	Dwt.byId(this._folderTreeCellId).appendChild(overview.getHtmlElement());
	this.treeView = overview.getTreeView("ADDRBOOK");
	this.treeView.addSelectionListener(this._treeListener.bind(this));
	this._hideRoot(this.treeView);
};

/**
 * Handles Tree click
 */
AttachContactsTabView.prototype._treeListener =
function() {
	var item = this.treeView.getSelected();
	if (item) {
		//Dwt.byId(AttachContactsTabView.ELEMENT_ID_SEARCH_FIELD).value = "in:\"" + item.getSearchPath()+"\"";
		var query = this._getQueryFromFolder(item.id);
		this.executeQuery(query);
	}
};

AttachContactsTabView.prototype._hideRoot =
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
 * @return	{AttachContactsTabView}	the view
 */
AttachContactsTabView.prototype.setSize =
function(width, height) {
	DwtTabViewPage.prototype.setSize.call(this, width, height);
	var size = this.getSize();

	var treeWidth = size.x * 0.350;
	//var listWidth = size.x - treeWidth - 15;
	var listWidth = size.x - treeWidth;
	var newHeight = height - 55;
	this._overview.setSize(treeWidth, newHeight);
	var listEl = Dwt.byId(this._folderListId);
	listEl.style.width = (listWidth - 5) + "px";
	listEl.style.height = newHeight + "px";
	listEl.style.overflow = "auto";
	listEl.style.background = "white";

	return this;
};

/**
 *Executes search query
 * @param {String} query Search Query
 * @param {Boolean} forward If <code>true</code>, 
 */
AttachContactsTabView.prototype.executeQuery =
function(query, forward) {
	if (this._limit == undefined) {
		this._limit = 50;
	}
	if (this._offset == undefined) {
		this._offset = 0;
	}
	if (forward != undefined) {
		if (forward) {
			this._offset = this._offset + 50;
		} else {
			this._offset = this._offset - 50;
		}
	}
	var callback = new AjxCallback(this, this.showResultContents);
	this._searchContacts({query:this._currentQuery, offset:this._offset, limit:this._limit , callback:callback});
};

/**
 * Performs a folder search.
 *
 * @param	{hash}	params		a hash of parameters
 */
AttachContactsTabView.prototype._searchContacts =
function(params) {
	var jsonObj = {SearchRequest:{_jsns:"urn:zimbraMail"}};
	jsonObj.SearchRequest.query = params.query + " not #type:group";
	jsonObj.SearchRequest.types = "contact";
	jsonObj.SearchRequest.limit = params.limit;
	jsonObj.SearchRequest.offset = params.offset;
	jsonObj.SearchRequest.fetch = "1";

	params.response = appCtxt.getAppController().sendRequest({jsonObj:jsonObj, noBusyOverlay:false});
	this.showResultContents(params);
};

