<!--
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2013, 2014, 2016 Synacor, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software Foundation,
 * version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 * ***** END LICENSE BLOCK *****
-->
<%@ page import="java.util.*" %>
<%@ page import="com.zimbra.cs.account.*" %>
<%@ page import="com.zimbra.cs.mailbox.*" %>
<%@ page import="com.zimbra.common.service.ServiceException" %>
<%
int itemId = getParameterInt(request, "itemId", -1);
long date = getParameterLong(request, "date", -1L);
if (itemId != -1 && date != -1) {
	try {
		AuthToken authToken = AuthToken.getAuthToken(getCookie(request, "ZM_AUTH_TOKEN"));
		Account account = AccessManager.getInstance().getAccount(authToken);
		Mailbox mbox = MailboxManager.getInstance().getMailboxByAccount(account);

		OperationContext octxt = new OperationContext(mbox);
		mbox.setDate(octxt, itemId, MailItem.TYPE_MESSAGE, date);
		%>Success<%
	}
	catch (ServiceException e) {
		%>Error: <font color=red>error: <%=e%></font><%
	}
}
%>
<%!
static int getParameterInt(HttpServletRequest request, String name, int defaultValue) {
    try {
        return Integer.parseInt(request.getParameter(name));
    }
    catch (NumberFormatException e) {
        return defaultValue;
    }
}
static long getParameterLong(HttpServletRequest request, String name, long defaultValue) {
    try {
        return Long.parseLong(request.getParameter(name));
    }
    catch (NumberFormatException e) {
        return defaultValue;
    }
}
static String getCookie(HttpServletRequest request, String name) {
	for (Cookie cookie : request.getCookies()) {
		if (cookie.getName().equals(name)) {
			return cookie.getValue();
		}
	}
	return null;
}
%>