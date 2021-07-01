/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 *@Author Raja Rao DV
 */

function ZmInsertShareURL() {
}
ZmInsertShareURL.prototype = new ZmZimletBase();
ZmInsertShareURL.prototype.constructor = ZmInsertShareURL;

ZmInsertShareURL.prototype.initializeToolbar =
function(app, toolbar, controller, viewId) {
	var viewType = appCtxt.getViewTypeFromId(viewId);
	if (viewType == ZmId.VIEW_COMPOSE) {
		if(toolbar.getOp("INSERT_SHARE_URL_ZIMLET")) {
			return;
		}
		var buttonIndex = toolbar.opList.length -1 ;


		var buttonArgs = {
			text    :this.getMessage("buttonLabel"),
			tooltip: this.getMessage("description"),
			index: buttonIndex,
			image: "SharedMailFolder"
		};
		var button = toolbar.createOp("INSERT_SHARE_URL_ZIMLET", buttonArgs);
		button.addSelectionListener(new AjxListener(this, this._showChooseFolderDialog));
	}
};

ZmInsertShareURL.prototype._showChooseFolderDialog = function(ev) {
	this.setChooseFolderDialog();
	var base = this.toString();
	var params = {
		overviewId: (appCtxt.multiAccounts) ? ([base, this.prevAccount.name].join(":")) : base,
		title:			this.getMessage("label"),
		treeIds:		[ZmOrganizer.FOLDER, ZmOrganizer.ADDRBOOK, ZmOrganizer.CALENDAR, ZmOrganizer.TASKS, ZmOrganizer.BRIEFCASE],
		treeStyle: 1,
		account: this.prevAccount,
		skipReadOnly:	true,
		skipRemote:		true,
		noRootSelect:	true
	};
	params.omit = {};
	params.omit[ZmFolder.ID_TRASH] = true;
	this._chooseFolderDialog.popup(params);
};

ZmInsertShareURL.prototype.setChooseFolderDialog =
function() {
	this._setAccount(); //set account
	if(!this._chooseFolderDialogs) {
		  this._chooseFolderDialogs = [];
	}

	if (this._chooseFolderDialogs[this.prevAccount.id]) {
		this._chooseFolderDialog = this._chooseFolderDialogs[this.prevAccount.id];
		return;
	} else {
		AjxDispatcher.require("Extras");
		this._chooseFolderDialogs[this.prevAccount.id] = new ZmChooseFolderDialog(this.getShell());
		this._chooseFolderDialogs[this.prevAccount.id].registerCallback(DwtDialog.OK_BUTTON, new AjxCallback(this, this._handleChooseFolder));
	    this._chooseFolderDialog = this._chooseFolderDialogs[this.prevAccount.id];
	}
};


ZmInsertShareURL.prototype._setAccount =
function() {
	var acct = appCtxt.multiAccounts ? appCtxt.getAppViewMgr().getCurrentView().getFromAccount() : appCtxt.getActiveAccount();
	if (appCtxt.multiAccounts) {
		appCtxt.accountList.setActiveAccount(acct);
	}
	if (this.prevAccount && (acct.id == this.prevAccount.id)) {
		return;
	}
	this.prevAccount = acct;
};

ZmInsertShareURL.prototype._handleChooseFolder =
function(folder) {
	if(!folder) {
		return;
	}
	var composeView = appCtxt.getCurrentView();
	var separator = " ";
	var editorType = "HTML";
	if (composeView.getComposeMode() != "text/html") {
		editorType = "PLAIN_TEXT";
	}
	var restUrl = folder.getRestUrl();
	restUrl = separator + restUrl;
	if(folder.type == ZmOrganizer.CALENDAR) {
		 restUrl = [ZmMsg.ics, ": ",restUrl, separator,separator, ZmMsg.view, ": ",restUrl,".html"].join("");
	}
	var editor = composeView.getHtmlEditor();
	editor.focus();
	if(editorType == "HTML") {
		editor.insertText(restUrl);
	} else {
		var textArea = document.getElementById(editor._textAreaId);
		var selection = ZmInsertShareURL.getInputSelection(textArea);
		var val = textArea.value;
		var replaceStr = val.substring(0, selection.start);
		val =  val.replace(replaceStr, replaceStr + restUrl);
		textArea.value = val;
	}
	this._chooseFolderDialog.popdown();
};

ZmInsertShareURL.getInputSelection = function(el) {
    var start = 0, end = 0, normalizedValue, range,
        textInputRange, len, endRange;

    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        start = el.selectionStart;
        end = el.selectionEnd;
    } else {
        range = document.selection.createRange();

        if (range && range.parentElement() == el) {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, "\n");

            // Create a working TextRange that lives only in the input
            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());

            // Check if the start and end of the selection are at the very end
            // of the input, since moveStart/moveEnd doesn't return what we want
            // in those cases
            endRange = el.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;

                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }

    return {
        start: start,
        end: end
    };
}