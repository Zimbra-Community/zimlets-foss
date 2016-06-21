/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Server
 * Copyright (C) 2010, 2013, 2014 Zimbra, Inc.
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
package com.zimbra.examples.extns.customauth;

import com.zimbra.common.soap.Element;
import com.zimbra.common.util.SystemUtil;
import com.zimbra.common.util.ZimbraLog;
import com.zimbra.cs.account.Account;
import com.zimbra.cs.account.auth.ZimbraCustomAuth;

import java.io.FileInputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * A simple authentication mechanism that reads usernames/passwords from /opt/zimbra/conf/users.xml file.
 *
 * @author vmahajan
 */
public class SimpleAuth extends ZimbraCustomAuth {

    private static Map<String, String> userPassMap = new HashMap<String, String>();

    static {
        try {
            Element usersElt = Element.parseXML(new FileInputStream("/opt/zimbra/conf/users.xml"));
            List<Element> userEltList = usersElt.getPathElementList(new String[]{"user"});
            for (Element userElt : userEltList) {
                userPassMap.put(userElt.getAttribute("name"), userElt.getAttribute("password"));
            }
        } catch (Exception e) {
            ZimbraLog.extensions.error(SystemUtil.getStackTrace(e));
        }
    }

    /**
     * Authenticates account.
     *
     * @param acct account
     * @param password password
     * @param context context map
     * @param args arg list
     * @throws Exception
     */
    public void authenticate(Account acct, String password, Map<String, Object> context, List<String> args)
            throws Exception {
        String username = acct.getName();
        if (userPassMap.containsKey(username)) {
            if (!userPassMap.get(username).equals(password))
                throw new Exception("Invalid password");
        } else {
            throw new Exception("Invalid user name \"" + username + "\"");
        }

    }
}
