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
package com.zimbra.examples.extns.soapservice;

import com.zimbra.common.service.ServiceException;
import com.zimbra.common.soap.Element;
import com.zimbra.soap.DocumentHandler;
import com.zimbra.soap.ZimbraSoapContext;
import org.dom4j.Namespace;
import org.dom4j.QName;

import java.util.Map;

/**
 * A simple "Hello World" SOAP method implementation.
 *
 * @author vmahajan
 */
public class HelloWorld extends DocumentHandler {

    static QName REQUEST_QNAME = new QName("HelloWorldRequest", Namespace.get("urn:zimbra:examples"));
    static QName RESPONSE_QNAME = new QName("HelloWorldResponse", Namespace.get("urn:zimbra:examples"));

    /**
     * Handles request.
     *
     * @param request request element
     * @param context context map
     * @return response
     * @throws ServiceException
     */
    public Element handle(Element request, Map<String, Object> context) throws ServiceException {
        Element callerElt = request.getElement("caller");
        String caller = callerElt.getTextTrim();

        ZimbraSoapContext zsc = getZimbraSoapContext(context);
        Element response = zsc.createElement(HelloWorld.RESPONSE_QNAME);
        Element replyElt = response.addElement("reply");
        replyElt.setText("Hello " + caller + "!");
        return response;
    }

    /**
     * Returns whether the command's caller must be authenticated.
     *
     * @param context context map
     * @return needs auth or not
     */
    @Override
    public boolean needsAuth(Map<String, Object> context) {
        return false;
    }
}
