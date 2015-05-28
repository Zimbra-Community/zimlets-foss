/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2014, 2015 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at: http://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 
 * have been added to cover use of software over a computer network and provide for limited attribution 
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B. 
 * 
 * Software distributed under the License is distributed on an "AS IS" basis, 
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. 
 * See the License for the specific language governing rights and limitations under the License. 
 * The Original Code is Zimbra Open Source Web Client. 
 * The Initial Developer of the Original Code is Zimbra, Inc. 
 * All portions of the code are Copyright (C) 2014, 2015 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */

/**
 * Provides file/folder browser for sync and share. Allows user to select folder for saving attachments and 
 * also allows selection of files to be inserted as links in message body.
 * 
 * REQUIRES: AjxStringUtil, AjxCallback, AjxListener, AjxRpc, AjxDateFormat
 */


function com_zimbra_zss_Explorer(initObj) {
	this.rootContainer = initObj.rootContainer;
	this.isFolderExplorer = initObj.isFolderExplorer;

	this.mezeoServerPath = initObj.vaultPath;
	this.parentDialog = initObj.dialog;
	
	this.noFilesMsg = initObj.noFilesMsg;
	this.fetchingContentMsg = initObj.fetchingContentMsg;
	this.unprovisionedAccountMsg = initObj.unprovisionedAccountMsg;
	this.serviceUnavailableMsg = initObj.serviceUnavailableMsg;
	this.serviceTimedOutMsg = initObj.serviceTimedOutMsg;
	this.genericFailureMsg = initObj.genericFailureMsg;

	this.selectedItems = [];

	this._initUI();
	this._addEventHandlers();
	//Mezeo content related to the item stored here
	this.dataKey = "mezeoContent";
	//Prevent fetching of data again on clicking the header again
	this.dataFetched = "dataFetched";
	this.mezeoCache = {};

	this.loadRootContainer();
	this.formatter = new AjxDateFormat("MMM dd yyyy h:mm a");
	this.parentDialog.setButtonEnabled(DwtDialog.OK_BUTTON, false);
}

com_zimbra_zss_Explorer.prototype._initUI = 
function() {
	this._createHtml();

	this.folderExplorer = new DwtTree({
		parent: this.rootContainer,
		className: "zss-folder-explorer"
	});
	this.folderExplorer.reparentHtmlElement(document.getElementById(this._folderTreeCellId));

	this.fileExplorer = new DwtTree({
		parent: this.rootContainer,
		posStyle: DwtControl.RELATIVE_STYLE,
		className: "zss-file-explorer",
		style: (this.isFolderExplorer ? DwtTree.SINGLE_STYLE : DwtTree.CHECKEDITEM_STYLE)
	});
	this.fileExplorer.reparentHtmlElement(document.getElementById(this._fileTreeCellId));	

	//Add a dummy file to prevent the file explorer td from collapsing
	this._addGhostFile();

	//Cache elements 
	this._fileFolderTreeContainer = document.getElementById(this._treeWrapperTableId);
	this._folderTreeWrapper = document.getElementById(this._folderTreeCellId);
	this._fileTreeWrapper = document.getElementById(this._fileTreeCellId);

	//Adjust the heights of the trees to prevent collapse on FF.
	this._adjustTreeHeights();
};

com_zimbra_zss_Explorer.prototype._addEventHandlers = function(){
	this.folderExplorer.addSelectionListener(new AjxListener(this, this._folderTreeViewListener));
	this.fileExplorer.addSelectionListener(new AjxListener(this, this._fileTreeViewListener));
}

com_zimbra_zss_Explorer.prototype._adjustTreeHeights = function(){
	//Set Element Height
	var containerDimensions = this.rootContainer.getSize();
	var availableContentHeight = containerDimensions.y;
	
	var height = this.isFolderExplorer ? availableContentHeight - 3 : availableContentHeight - 27;
	
	this._fileFolderTreeContainer.style.height = height + "px";
	this._folderTreeWrapper.style.height = height + "px";
	this._fileTreeWrapper.style.height = height + "px";
}

com_zimbra_zss_Explorer.prototype._adjustTreeWidths = function(){
	var containerDimensions = this.rootContainer.getSize(),
		availableContentWidth = containerDimensions.x;
	this.folderExplorer.setSize(availableContentWidth * .32, this._folderTreeWrapper.style.height);
	this.fileExplorer.setSize(availableContentWidth * .65, this._fileTreeWrapper.style.height);
}

com_zimbra_zss_Explorer.prototype._addGhostFile = function(){
	this._addTreeItem({
		className: "zss-ghost-file DwtTreeItem",
		name: "",
		path: "",
		type: this.MEZEO_FILE,
		icon: "",
		content: ""
	}, this.fileExplorer);
}

// FETCHING CONTENTS NOTIFICATION HELPERS
com_zimbra_zss_Explorer.prototype._showFetchContentsNotification = function(){
	$('.zss-file-explorer').append('<div class="zss-loader"><span>' + this.fetchingContentMsg + '</span></div>');
}
com_zimbra_zss_Explorer.prototype._hideFetchContentsNotification = function(){
	$('.zss-file-explorer .zss-loader').remove();
}
//END FETCHING CONTENTS HELPER

// FETCHING CONTENTS NOTIFICATION HELPERS
com_zimbra_zss_Explorer.prototype._showNoFilesFoundMessage = function(){
	$('.zss-file-explorer').append('<div class="zss-no-result"><span>' + this.noFilesMsg + '</span></div>');
}
com_zimbra_zss_Explorer.prototype._hideNoFilesFoundMessage = function(){
	$('.zss-file-explorer .zss-no-result').remove();
}
//END FETCHING CONTENTS HELPER

com_zimbra_zss_Explorer.prototype._createHtml = function() {
	this._treeWrapperTableId = Dwt.getNextId();
	this._folderTreeCellId = Dwt.getNextId();
	this._fileTreeCellId = Dwt.getNextId();

	var html = [];
	var idx = 0;
	var wrapperCssClass = this.isFolderExplorer? "is-chooseFolderMode" : "";	
	
	html[idx++] = '<table id="' + this._treeWrapperTableId + '" class="zss-tree-container ' + wrapperCssClass + '" width="100%">';
	html[idx++] = '<tr>';
	html[idx++] = '<td valign="top" id="' + this._folderTreeCellId + '">';
	html[idx++] = '</td>';
	html[idx++] = '<td  valign="top"  id="' + this._fileTreeCellId + '">';
	html[idx++] = '</td>';
	html[idx++] = '</tr>';
	html[idx++] = '</table>';

    this.rootContainer.setContent(html.join(""));
}

com_zimbra_zss_Explorer.prototype.MEZEO_CONTAINER = "MEZEO_CONTAINER";
com_zimbra_zss_Explorer.prototype.MEZEO_FILE = "MEZEO_FILE";

com_zimbra_zss_Explorer.prototype._refreshFolders = function(){
	this.folderExplorer.clearItems();
	this._clearTreeItems(this.fileExplorer);
	this.selectedItems = [];
	this.mezeoCache = {};
	this.loadRootContainer();
};

com_zimbra_zss_Explorer.prototype.loadRootContainer = function() {
	this._showFetchContentsNotification();
	this.queryServer(this.mezeoServerPath + '/v2',new AjxCallback(this, this.displayRootContainerContents));
}

com_zimbra_zss_Explorer.prototype._fileTreeViewListener  = function(ev){
	var selectedItem = ev.item;
	if (selectedItem) {
		var data = selectedItem.getData(this.dataKey);

		if(ev.detail === DwtTree.ITEM_CHECKED) {
			this._markItem(selectedItem);
			this.onSelectItem(data, selectedItem.getChecked());
		}
	}
}

com_zimbra_zss_Explorer.prototype._markItem = function(item) {
	if (item.getChecked()) {
		item.addClassName('zss-file-selected');
	}
	else {
		item.delClassName('zss-file-selected');	
	}
}

com_zimbra_zss_Explorer.prototype._folderTreeViewListener  = function(ev){
	var selectedItem = ev.item;
	if (selectedItem) {
		var data = selectedItem.getData(this.dataKey);

		if(ev.detail === DwtTree.ITEM_SELECTED ) {
			if(this.isFolderExplorer) {
				this.onSelectItem(data, true);
			}
			this.getContainerContents(data.path, selectedItem);
		}
		else if(ev.detail === DwtTree.ITEM_EXPANDED){
			selectedItem.setExpanded(true,false,false);
		}
	}
};

com_zimbra_zss_Explorer.prototype.processResponseForErrors = function(response){
	// HANDLE additional Errcodes if required
	if(response.status === 403){
		appCtxt.getAppController().setStatusMsg(this.unprovisionedAccountMsg, ZmStatusView.LEVEL_CRITICAL);
		return;
	}

	if(response.status === 404){
		appCtxt.getAppController().setStatusMsg(this.serviceUnavailableMsg, ZmStatusView.LEVEL_CRITICAL);
		return;
	}

	if(response.status === 504){
		appCtxt.getAppController().setStatusMsg(this.serviceTimedOutMsg, ZmStatusView.LEVEL_CRITICAL);
		return;
	}

	appCtxt.getAppController().setStatusMsg(this.genericFailureMsg, ZmStatusView.LEVEL_CRITICAL);
};

com_zimbra_zss_Explorer.prototype.displayRootContainerContents = function(contents) {
	this._hideFetchContentsNotification();
	//Adjust the tree widths to accommodate results.
	this._adjustTreeWidths();

	if(!contents.success){
		this.processResponseForErrors(contents);
		this.parentDialog.popdown();
		return;
	}
	
	contents =  JSON.parse(contents.text);
	if(contents) {
		if(contents.cloud && contents.cloud.locations) {
			var locations = contents.cloud.locations;
			for(var i = 0, count = locations.length; i < count; i++) {
				var location = locations[i];

				var item = this._addTreeItem({
						className: "mezeo-root DwtTreeItem",
						name: location.name,
						path: location.rootContainer,
						type: this.MEZEO_CONTAINER,
						icon: "Folder",
						id: "mezeo-root",
						headerItem: true,
						content: location
					},
					this.folderExplorer);

				this.getContainerContents(location.rootContainer,item);
			}
		}
	}
};

com_zimbra_zss_Explorer.prototype.getContainerContents = function(path,parentContainer) {
	var dataInCache = this.mezeoCache[path + "/contents"];
	this._showFetchContentsNotification();
	if(!dataInCache) {
		this.queryServer(path + "/contents", new AjxCallback(this, this._handleGetContainerContents, { parent: parentContainer, refetched: false } ));
	}
	else {
		this._handleGetContainerContents( { parent: parentContainer, refetched: true }, dataInCache);
	}
}

com_zimbra_zss_Explorer.prototype._addTreeItem = function(mezeoItem, parent) {
	var treeItemProperties = {
				arrowDisabled: true,
				dynamicWidth: true,
				className: mezeoItem.className,
				index: parent.getChildren().length,
				parent: parent,
				imageInfo : mezeoItem.icon,
				path: mezeoItem.path,
				text: mezeoItem.name,
			}

	var item = mezeoItem.headerItem ? 
				new DwtHeaderTreeItem(treeItemProperties)
				: new DwtTreeItem(treeItemProperties);
	
	if(mezeoItem.isSelected)	{
		item.setChecked(true);
	}
	
	item.setData(this.dataKey,{
		type: mezeoItem.type,
		path: mezeoItem.path,
		content: mezeoItem.content,
		self: item
	});

	return item;
};

com_zimbra_zss_Explorer.prototype._handleGetContainerContents = function(extraData, contents) {
	this._hideFetchContentsNotification();
	//Error handling
	if(!contents.success){
		this.processResponseForErrors(contents);
		return;
	}

	var parent = extraData.parent,
		refetched = extraData.refetched;
	
	this.selectedFolderHasDuplicateFile = false;
	
	this._clearTreeItems(this.fileExplorer);

	var mezeoContainer, filesTree;
	var contentsJson =  JSON.parse(contents.text);

	if(contentsJson["file-list"]){
		if(contentsJson["file-list"]["file-list"]){
			
			this.mezeoCache[contentsJson["file-list"].uri] = contents;
			
			var containerContents = contentsJson["file-list"]["file-list"];
			this._hideNoFilesFoundMessage();
			
			for(var i = 0, count = containerContents.length; i < count; i++){
				var content = containerContents[i];
				var mezeoItem = {};

				if(content.container && !refetched){
					var item = this._addTreeItem({
						className: "mezeo-container DwtTreeItem",
						name: content.container.name,
						path: content.container.uri,
						type: this.MEZEO_CONTAINER,
						icon: "Folder",
						content: content,
						forceNotifySelection: true,
						headerItem: true
					}, parent);
				}
				if(content.file){
					var fileTypeInfo = ZmMimeTable.getInfo(content.file.mime_type, true);

					var item = this._addTreeItem({
						className: "zss-file DwtTreeItem",
						name: this._createFileHtml(content.file),
						path: content.file.uri,
						type: this.MEZEO_FILE,
						icon: fileTypeInfo.image,
						content: content,
						isSelected: this._isFileSelected(content.file.uri)
					}, this.fileExplorer);
					item.enableSelection(false);
					this._markItem(item);

					if (this.isFolderExplorer) {
						if (content.file.name.toLowerCase() === this.attachmentToBeSaved.name.toLowerCase()) {
							this.selectedFolderHasDuplicateFile = true;
						}	
					}
				}
			}
			//Show No files found
			if(containerContents.length === 0 || this.fileExplorer.getChildren().length === 0){
				//Add a ghost file to prevent fileExplorer td from collapsing
				this._addGhostFile();
				this._showNoFilesFoundMessage();				
			}
			parent.setExpanded(true,false,false);
		}
	}
}
com_zimbra_zss_Explorer.prototype._isFileSelected = function (fileUri){
	for(var i = 0, len = this.selectedItems.length; i < len; i++){
		if(this.selectedItems[i].path === fileUri){
			return true;
		}
	}
	return false;
};

com_zimbra_zss_Explorer.prototype._clearTreeItems = function(parent){
	while(parent.getChildren().length){
		parent.removeChild(parent.getChildren()[0]);
	}
}

com_zimbra_zss_Explorer.prototype._createFileHtml = function(file) {
	var html = [],
		i = 0;

 	html[i++] = "<div class='zss-file-name'>" + AjxStringUtil.htmlEncode(file.name) +"</div>";
 	html[i++] = "<div class='zss-file-details'>";
 	html[i++] = "<span class='zss-file-size'>" + this.formatter.format(new Date(file.created * 1000)) + "</span>";
 	html[i++] = "</div>";

 	return html.join("");
}

com_zimbra_zss_Explorer.prototype.onSelectItem = function(file,selected){
	if(selected) {
		if(this.isFolderExplorer){
			this.clearSelection();	
		}
		this.selectedItems.push(file);
	}
	else {
		for(var i = 0, len = this.selectedItems.length; i < len; i++) {
			if(this.selectedItems[i].path === file.path) {
				this.selectedItems.splice(i,1);
				break;
			}
		}
	}
	this.parentDialog.setButtonEnabled(DwtDialog.OK_BUTTON, this.selectedItems.length > 0);
}



com_zimbra_zss_Explorer.prototype.setAttachmentToBeSaved = function(attachment) {
	this.attachmentToBeSaved = attachment;
}


com_zimbra_zss_Explorer.prototype.getSelection = function(){
	// var selectedFiles = this.fileExplorer.getSelection();
	return this.selectedItems;
}

com_zimbra_zss_Explorer.prototype.reload = function(){
	this.clearSelection();
	this._refreshFolders();

	if (this.isFolderExplorer) {
		this.selectedFolderHasDuplicateFile = false;
	}
}

com_zimbra_zss_Explorer.prototype.clearSelection = function(){
	this.fileExplorer.deselectAll();
	for(var i = 0, len = this.selectedItems.length; i < len; i++) {
		this.selectedItems[i].self.setChecked(false);
	}
	this.selectedItems = [];
	this.parentDialog.setButtonEnabled(DwtDialog.OK_BUTTON, false);
}


com_zimbra_zss_Explorer.prototype.queryServer = function(extServerUrl, callback, appendHost) {
	extServerUrl = extServerUrl.substring(extServerUrl.indexOf('/zss'));
	var hdrs = [];
	hdrs["X-Client-Specification"] = 3; //must pass the length of data
	hdrs["X-Cloud-Depth"] = 1;
	
	// submit the URL and asynchronous response (using callback)
	AjxRpc.invoke(null, extServerUrl, hdrs, callback, true);
};