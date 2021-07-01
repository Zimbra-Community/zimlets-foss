/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
InboxZero = function() {
    ZmZimletBase.call(this);
    this._msgResponseMap = {};
    this._msgMap = {};
};
InboxZero.prototype = new ZmZimletBase;
InboxZero.prototype.constructor = InboxZero;

InboxZero.prototype.toString = function() {
    return "InboxZero";
};

//
// Constants
//

InboxZero.OP_ARCHIVE = "archive";
InboxZero.OP_DEFER = "defer";
InboxZero.OP_DEFER_1_HOUR = InboxZero.OP_DEFER;
InboxZero.OP_DEFER_1_DAY = "defer1d";
InboxZero.OP_DEFER_1_WEEK = "defer1w";
InboxZero.OP_DELEGATE = "delegate";
InboxZero.OP_DELETE = "delete";
InboxZero.OP_DO = "do";
InboxZero.OP_FOLLOWUP = "followup";
InboxZero.OP_RESPOND = "respond";
InboxZero.OP_RESPOND_ALL = "respondAll";

InboxZero.CATEGORIES = [
    InboxZero.OP_DELETE, InboxZero.OP_DELEGATE, InboxZero.OP_RESPOND, InboxZero.OP_DEFER, InboxZero.OP_DO
];

InboxZero.OPS = {};
InboxZero.OPS[InboxZero.OP_ARCHIVE] = { category: InboxZero.OP_DELETE };
InboxZero.OPS[InboxZero.OP_DEFER_1_HOUR] = { category: InboxZero.OP_DEFER };
InboxZero.OPS[InboxZero.OP_DEFER_1_DAY] = { category: InboxZero.OP_DEFER };
InboxZero.OPS[InboxZero.OP_DEFER_1_WEEK] = { category: InboxZero.OP_DEFER };
InboxZero.OPS[InboxZero.OP_DELEGATE] = { category: InboxZero.OP_DELEGATE };
InboxZero.OPS[InboxZero.OP_DELETE] = { category: InboxZero.OP_DELETE };
InboxZero.OPS[InboxZero.OP_DO] = { category: InboxZero.OP_DO };
InboxZero.OPS[InboxZero.OP_FOLLOWUP] = { category: InboxZero.OP_DELEGATE };
InboxZero.OPS[InboxZero.OP_RESPOND] = { category: InboxZero.OP_RESPOND };
InboxZero.OPS[InboxZero.OP_RESPOND_ALL] = { category: InboxZero.OP_RESPOND };

InboxZero.KEY_OP = "inboxzero_op";
InboxZero.KEY_OP_CATEGORY = "inboxzero_op_category";

//
// ZmZimletBase
//

InboxZero.prototype.init = function() {
    // register ops
    for (var id in InboxZero.OPS) {
        ZmOperation.registerOp("INBOXZERO_"+id);
    }

    // setup icons and messages
    for (var op in InboxZero.OPS) {
        var def = InboxZero.OPS[op];
        def.text = this.getMessage(op+"Text");
        def.icon = this.getMessage(op+"Icon");
        def.tooltip = this.getMessage(op+"Tooltip");
    }

    // start polling of deferred items
    var func = AjxCallback.simpleClosure(this._pollDeferredItems, this);
    func();

    var interval = 10 * 60 * 1000; // 10 minutes
    this.__pollIntervalId = setInterval(func, interval);
};

//
// Public
//

// notifications

InboxZero.prototype.onMsgView = function(msg, oldMsg, msgView) {
    this._msg = msg;
    var el = msgView.getHtmlElement();
    var id = msgView.getHTMLElId()+"_inboxzero";
    // TODO: Should we show even if it's an invite? or a share notice?
    // TODO: Should our toolbar replace those? be added to those?
    if (!msg.isShared() && !msg.isInvite() && !msg.share && (!el.firstChild || el.firstChild.id != id)) {
        // HACK: fix ZmMailMsg#notifyModify, if necessary
        if (!InboxZero.__ZmMailMsg_notifyModify) {
            InboxZero.__ZmMailMsg_notifyModify = ZmMailMsg.prototype.notifyModify;
            ZmMailMsg.prototype.notifyModify = InboxZero.__notifyModify;
        }

        // create controls
        var toolbar = this._toolbar;
        if (!toolbar || toolbar._disposed) {
            var PREFIX = "INBOXZERO_";

            // init button list
            var buttons = [];
            for (var i = 0; i < InboxZero.CATEGORIES.length; i++) {
                buttons.push(PREFIX+InboxZero.CATEGORIES[i]);
            }

            // create toolbar
            var params = {
                id: id,
                parent: msgView,
                buttons: buttons,
                posStyle: DwtControl.STATIC_STYLE,
                // HACK: mimic invite toolbar of ZmMailMsgView
                className: "ZmInviteToolBar",
                buttonClassName: "DwtToolbarButton"
            }
            var toolbar = new ZmButtonToolBar(params);

            // intitialize toolbar buttons
            var listener = new AjxListener(this, this._handleButton);
            for (var i = 0; i < buttons.length; i++) {
                // init button
                var zmop = buttons[i];
                var category = zmop.substr(PREFIX.length);

                var button = toolbar.getButton(zmop);
                this._initControl(button, category);
				var menu = this._createMenu(category, button);
				if(menu) {
					button.setMenu(menu);
				}

                button.addSelectionListener(listener);

                // set button to last used state
                var op = this.getUserProperty(category);
                if (op && op != category) {
                    this._initControl(button, op);
                }
            }
            toolbar.addFiller();
            var help = new DwtToolBarButton({parent:toolbar,className:"DwtToolbarButton"});
            help.setImage("Help");
            help.setToolTipContent(this.getMessage("helpTooltip"));
            var openArgs = ["http://inboxzero.com/inboxzero/","_blank","menubar=yes,resizable=yes,scrollbars=yes"]; 
            help.addSelectionListener(new AjxListener(window, window.open, openArgs));

            this._toolbar = toolbar;
        }

        // place toolbar at tool of message view
        el.insertBefore(toolbar.getHtmlElement(), el.firstChild);
    }
};

InboxZero.prototype.onSendMsgSuccess = function(controller, msg) {
    var id = msg.id || (msg._origMsg && msg._origMsg.id);
    var data = this._msgResponseMap[id];
    if (data) {
        delete this._msgResponseMap[id];
        this._archive(data.msg, data.callback);
    }
};

InboxZero.prototype.onSaveApptSuccess = function(controller, calItem, result) {
    // bug 72822, only archive the original mail when the task is saved
    var msg = calItem._relatedMsg;
    if (msg) {
        this._archive(msg, null);
        calItem._relatedMsg = null;
    }
};

//
// Protected
//

// utility

InboxZero.prototype._getActiveInbox = function(account) {
    if (account) return this._getAccountInbox(account); 
    return appCtxt.getById(ZmOrganizer.ID_INBOX) || this._getAccountInbox();
};

InboxZero.prototype._getAccountInbox = function(account) {
    account = account || appCtxt.getActiveAccount();
    var inboxId = [account.id,ZmOrganizer.ID_INBOX].join(":");
    return appCtxt.getById(inboxId) || appCtxt.getById(ZmOrganizer.ID_INBOX);
}

InboxZero.prototype._getAccounts = function() {
    var list = appCtxt.isChildWindow ? parentAppCtxt.accountList : appCtxt.accountList;
    return list.getAccounts();
};

// operations

InboxZero.prototype._archive = function(msg, callback) {
    var inbox = this._getActiveInbox(msg.getAccount());
    var archive = inbox.getByName(this.getMessage("archiveFolder"));
    // HACK: needed to ensure current list updates to next message
    this.__selectNext();
    msg.list.moveItems({items:msg, folder:archive, callback:callback});
};

InboxZero.prototype._defer = function(date, msg, callback) {
    // defer by 1 hour by default
    if (!(date instanceof Date)) {
        this._defer1h.apply(this, arguments);
        return;
    }
    // defer message
    var url = [
        this.getResource("SetMessageDate.jsp"),
        "?",
        "itemId=",msg.id,
        "&",
        "date=",date.getTime()
    ].join("");
    AjxRpc.invoke("", url, [], new AjxCallback(this, this._deferMove, [msg, callback]));
};

InboxZero.prototype._defer1h = function(msg, callback) {
    var date = new Date();
    date.setHours(date.getHours() + 1);
    this._defer(date, msg, callback);
};

InboxZero.prototype._defer1d = function(msg, callback) {
    var date = new Date();
    date.setDate(date.getDate() + 1);
    // NOTE: Set to 6 AM so that it re-appears at start of work day
    date.setHours(6);
    this._defer(date, msg, callback);
};

InboxZero.prototype._defer1w = function(msg, callback) {
    var date = new Date();
    date.setDate(date.getDate() + 7);
    // NOTE: Set to 6 AM so that it re-appears at start of work day
    date.setHours(6);
    this._defer(date, msg, callback);
};

InboxZero.prototype._deferMove = function(msg, callback) {
    var inbox = this._getActiveInbox();
    var deferred = inbox.getByName(this.getMessage("deferFolder"));
    // HACK: needed to ensure current list updates to next message
    this.__selectNext();
    msg.list.moveItems({ items:msg, folder:deferred, callback:callback });
};

InboxZero.prototype._delegate = function(msg, callback) {
    this._respondAction(ZmOperation.FORWARD_INLINE, msg, callback); // TODO: inline vs. attachment
};

InboxZero.prototype._delete = function(msg, callback) {
    // HACK: needed to ensure current list updates to next message
    this.__selectNext();
    msg.list.deleteItems({items:msg, callback:callback});
};

InboxZero.prototype._do = function(msg, callback) {
    AjxDispatcher.require(["TasksCore", "Tasks"]);
    var task = new ZmTask();
    task.setEndDate(AjxDateUtil.roundTimeMins(new Date, 30));
    task.setFromMailMessage(msg, msg.subject);
    task._relatedMsg = msg;
    appCtxt.getApp(ZmApp.TASKS).getTaskController().show(task, ZmCalItem.MODE_NEW, true);
};

InboxZero.prototype._followup = function(msg, callback) {
    var args = [this.getMessage("followupPrefix"), msg, callback];
    this._delegate(msg, new AjxCallback(this, this._doWithPrefix, args));
};

InboxZero.prototype._respond = function(msg, callback) {
    this._respondAction(ZmOperation.REPLY, msg, callback);
};

InboxZero.prototype._respondAll = function(msg, callback) {
    this._respondAction(ZmOperation.REPLY_ALL, msg, callback);
};

InboxZero.prototype._respondAction = function(action, msg, callback) {
    this._msgResponseMap[msg.id] = { msg:msg, callback:callback };

    var params = {
        action: action,
        msg: msg,
        callback: new AjxCallback(this, this._respondActionComposeShown, [msg, null])
    };
    appCtxt.getApp(ZmApp.MAIL).compose(params);
};

InboxZero.prototype._respondActionComposeShown = function(msg, callback, controller) {
    // TODO: anything we want to do here?
};

// polling

InboxZero.prototype._pollDeferredItems = function() {
    if (!this.__pollCallback) {
        this.__pollCallback = new AjxCallback(this, this._pollDeferredItemsResponse);
    }

    var batchCmd = new ZmBatchCommand(null, null, true);

    var accounts = this._getAccounts();
    for (var id in accounts) {
        var inbox = this._getAccountInbox(accounts[id]);
        var deferred = inbox && inbox.getByName(this.getMessage("deferFolder"));
        if (!deferred) continue;

        var request = {
            SearchRequest: {
                _jsns: "urn:zimbraMail",
                query: [ "inid:\"",deferred.id,"\" AND ","before:-1minutes" ].join(""),
                types: "message"
            }
        };
//        var params = {
//            jsonObj: request,
//            asyncMode: true,
//            noBusyOverlay: true,
//            callback: this.__pollCallback
//        };
        batchCmd.addNewRequestParams(request, this.__pollCallback);
    }

    if (batchCmd.size() > 0) {
        batchCmd.run();
    }
};

InboxZero.prototype._pollDeferredItemsResponse = function(result) {
    var resp = result.getResponse();
    var messages = resp && resp.SearchResponse && resp.SearchResponse.m;
    if (messages) {
        if (!InboxZero.__ZmRequestMgr_handleResponseSendRequest) {
            InboxZero.__ZmRequestMgr_handleResponseSendRequest = ZmRequestMgr.prototype._handleResponseSendRequest;
            ZmRequestMgr.prototype._handleResponseSendRequest = InboxZero.__handleResponseSendRequest;
        }

        if (!this.__pollResponseCallback) {
            this.__pollResponseCallback = new AjxCallback(this, this._pollRestoreItemsResponse);
        }

        var ids = new Array(messages.length);
        for (var i = 0; i < messages.length; i++) {
            var message = messages[i];
            ids[i] = message.id;
            // HACK: Save this message JSON for later
            this._msgMap[message.id] = message;
        }
        ids = ids.join(",");

        var params = {
            jsonObj: {
                BatchRequest: {
                    _jsns: "urn:zimbra",
                    onerror: "continue",
                    ItemActionRequest: [
                        {   _jsns: "urn:zimbraMail",
                            action: { id: ids, op: "!read" }
                        },
                        {   _jsns: "urn:zimbraMail",
                            action: { id: ids, op: "move", l: ZmOrganizer.ID_INBOX }
                        }
                    ]
                }
            },
            asyncMode: true,
            noBusyOverlay: true,
            callback: this.__pollResponseCallback
        };
        appCtxt.getAppController().sendRequest(params);
    }
};

InboxZero.prototype._pollRestoreItemsResponse = function(result) {
    var header = result.__Header;
    var notify = header && header.context && header.context.notify;
    var modified = notify && notify[0].modified;
    var messages = modified && modified.m;
    if (messages) {
        var created = notify[0].created = notify[0].created || {};
        var createdMsgs = created.m = created.m || [];
        for (var i = 0; i < messages.length; i++) {
            var message = messages[i];
            if (appCtxt.getById(message.l) && appCtxt.getById(message.l).nId == ZmOrganizer.ID_INBOX) {
                // HACK: This uses the full msg info from the SearchResponse
                // HACK: and puts it in the "created" list with the folder
                // HACK: updated to the inbox. If there are any other fields
                // HACK: modified on the message, the normal notification
                // HACK: handling will take care of that.
                var createdMsg = this._msgMap[message.id];
                createdMsg.l = message.l;
                createdMsgs.push(createdMsg);
                delete this._msgMap[message.id];
                messages.splice(i--, 1);
            }
        }
        if (messages.length == 0) {
            delete modified.m;
        }
    }
};

// user interface

InboxZero.prototype._createButton = function(parentOrParams, op, listener) {
    var button = this._createControl(DwtButton, parentOrParams, op, listener);
    button.setMenu(this._createMenu(op, button));
    return button;
};
InboxZero.prototype._createMenuItem = function(parentOrParams, op, listener) {
    return this._createControl(DwtMenuItem, parentOrParams, op, listener);
};
InboxZero.prototype._createControl = function(constructor, parentOrParams, op, listener) {
    var params = parentOrParams instanceof DwtComposite ? {parent:parentOrParams} : parentOrParams; 
    var control = new constructor(params);
    this._initControl(control, op);
    control.addSelectionListener(listener);
    return control;
};
InboxZero.prototype._initControl = function(control, op) {
    var def = InboxZero.OPS[op];
    control.setText(def.text);
    control.setImage(def.icon);
    control.setToolTipContent(def.tooltip);
    control.setData(InboxZero.KEY_OP, op);
    control.setData(InboxZero.KEY_OP_CATEGORY, def.category);
};

InboxZero.prototype._createMenu = function(op, button) {
    if (op == InboxZero.OP_DO) return null;

    var listener = new AjxListener(this, this._handleMenuItemSelect, [button]);
    var menu = new DwtMenu({parent:button});
    if (op == InboxZero.OP_DEFER) {
        this._createMenuItem(menu, InboxZero.OP_DEFER_1_HOUR, listener);
        this._createMenuItem(menu, InboxZero.OP_DEFER_1_DAY, listener);
        this._createMenuItem(menu, InboxZero.OP_DEFER_1_WEEK, listener);
    }
    else if (op == InboxZero.OP_DELEGATE) {
        this._createMenuItem(menu, InboxZero.OP_DELEGATE, listener);
        this._createMenuItem(menu, InboxZero.OP_FOLLOWUP, listener);
    }
    else if (op == InboxZero.OP_DELETE) {
        this._createMenuItem(menu, InboxZero.OP_DELETE, listener);
        this._createMenuItem(menu, InboxZero.OP_ARCHIVE, listener);
    }
    else if (op == InboxZero.OP_RESPOND) {
        this._createMenuItem(menu, InboxZero.OP_RESPOND, listener);
        this._createMenuItem(menu, InboxZero.OP_RESPOND_ALL, listener);
    }
    return menu;
};

// ui handlers

InboxZero.prototype._handleMenuItemSelect = function(button, event) {
    var menuItem = event.item;
    var op = menuItem.getData(InboxZero.KEY_OP);
    var category = menuItem.getData(InboxZero.KEY_OP_CATEGORY);
    this._initControl(button, op);
    this.setUserProperty(category, op, true);
    this._handleButton(event);
};

InboxZero.prototype._handleButton = function(event) {
    // do we have a handler for this operation?
    var button = event.item;
    var op = button.getData(InboxZero.KEY_OP);
    var method = this["_"+op];
    if (!method) {
        return;
    }

    // are folders created?
    var inbox = this._getActiveInbox();
    var archive = inbox.getByName(this.getMessage("archiveFolder"));
    if (!archive) {
        this._createFolders(new AjxCallback(this, method, [this._msg]));
        return;
    }

    // perform operation
    method.call(this, this._msg);
};

// initialization

InboxZero.prototype._createFolders = function(callback) {
    var params = {
        jsonObj: {
            BatchRequest: {
                _jsns: "urn:zimbra",
                onerror: "continue",
                CreateFolderRequest: [
                    {   _jsns: "urn:zimbraMail",
                        folder: { name: this.getMessage("archiveFolder"), l: ZmOrganizer.ID_INBOX }
                    },
                    {   _jsns: "urn:zimbraMail",
                        folder: { name: this.getMessage("deferFolder"), l: ZmOrganizer.ID_INBOX }
                    }
                ]
            }
        },
        asyncMode: true,
        callback: new AjxCallback(this, this._createFoldersDone, [callback])
    };
    appCtxt.getAppController().sendRequest(params);
};

InboxZero.prototype._createFoldersDone = function(callback, resp) {
    // TODO: Check for errors
    appCtxt.setStatusMsg(this.getMessage("foldersCreated"));

    // NOTE: We have to let the notifications complete before callback runs
    var args = [].concat(callback.run, callback, callback.args);
    var func = AjxCallback.simpleClosure.apply(window, args);
    setTimeout(func, 0);
};

//
// Private
//

// HACKS

InboxZero.prototype.__selectNext = function() {
    var controller = appCtxt.getCurrentController();
    controller.getListView()._itemToSelect = controller._getNextItemToSelect();
};

/**
 * <strong>Note:</strong>
 * This method is a replacement to ZmMailMsg.notifyModify and is executed
 * <em>as</em> a ZmMailMsg object.
 */
InboxZero.__notifyModify = function(obj, batchMode) {
    var odate = this.date;
    var retValue = InboxZero.__ZmMailMsg_notifyModify.apply(this, arguments);
    if (obj.d && this.date == odate) {
        this.date = obj.d;
        var fields = {};
        fields[ZmItem.F_DATE] = true;
        this._notify(ZmEvent.E_MODIFY, {fields:fields});
    }
    return retValue;
};

/**
 * <strong>Note:</strong>
 * This method is a replacement to ZmRequestMgr._handleResponseSendRequest
 * and is executed <em>as</em> a ZmRequestMgr object.
 */
InboxZero.__handleResponseSendRequest = function(params, result) {
    // save original header
    result.__Header = result._data && result._data.Header;

    // perform default behavior
    return InboxZero.__ZmRequestMgr_handleResponseSendRequest.apply(this, arguments);
};
