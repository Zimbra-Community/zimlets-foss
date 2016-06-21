/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Server
 * Copyright (C) 2012, 2013, 2014 Zimbra, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software Foundation,
 * version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 * ***** END LICENSE BLOCK *****
 */
package com.zimbra.examples.extns.storemanager;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import com.zimbra.common.service.ServiceException;
import com.zimbra.common.util.FileUtil;
import com.zimbra.common.util.ZimbraLog;
import com.zimbra.cs.extension.ExtensionException;
import com.zimbra.cs.extension.ZimbraExtension;
import com.zimbra.cs.mailbox.Mailbox;
import com.zimbra.cs.store.external.ExternalStoreManager;

public class ExampleStoreManager extends ExternalStoreManager implements ZimbraExtension {

    String directory = "/tmp/examplestore/blobs";

    @Override
    public void startup() throws IOException, ServiceException {
        super.startup();
        ZimbraLog.store.info("Using ExampleStoreManager. If you are seeing this in production you have done something WRONG!");
        FileUtil.mkdirs(new File(directory));
    }

    @Override
    public void shutdown() {
        super.shutdown();
    }

    private String dirName(Mailbox.MailboxData mboxData) {
        return directory + "/" + mboxData.accountId;
    }

    private File getNewFile(Mailbox.MailboxData mboxData) throws IOException {
        String baseName = dirName(mboxData);
        FileUtil.mkdirs(new File(baseName));
        baseName += "/zimbrablob";
        String name = baseName;
        synchronized (this) {
            int count = 1;
            File file = new File(name+".msg");
            while (file.exists()) {
                name = baseName+"_"+count++;
                file = new File(name+".msg");
            }
            if (file.createNewFile()) {
                ZimbraLog.store.debug("writing to new file %s",file.getName());
                return file;
            } else {
                throw new IOException("unable to create new file");
            }
        }
    }

    @Override
    public String writeStreamToStore(InputStream in, long actualSize, Mailbox.MailboxData mboxData) throws IOException {
        File destFile = getNewFile(mboxData);
        FileUtil.copy(in, false, destFile);
        return destFile.getCanonicalPath();
    }

    @Override
    public InputStream readStreamFromStore(String locator, Mailbox.MailboxData mboxData) throws IOException {
        return new FileInputStream(locator);
    }

    @Override
    public boolean deleteFromStore(String locator, Mailbox.MailboxData mboxData) throws IOException {
        File deleteFile = new File(locator);
        return deleteFile.delete();
    }

    @Override
    public boolean supports(StoreFeature feature) {
        if (feature == StoreFeature.CENTRALIZED) {
            return false;
        } else {
            return super.supports(feature);
        }
    }


    //ZimbraExtension stub so class can be loaded by ExtensionUtil.
    @Override
    public String getName() {
        return "StoreManagerExtension";
    }

    @Override
    public void init() throws ExtensionException, ServiceException {
    }

    @Override
    public void destroy() {
    }
}
