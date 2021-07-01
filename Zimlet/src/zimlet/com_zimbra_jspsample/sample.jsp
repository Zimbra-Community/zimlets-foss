<!-- 
***** BEGIN LICENSE BLOCK *****
Zimbra Collaboration Suite Zimlets
Copyright (C) 2006, 2007, 2010, 2013, 2014, 2016 Synacor, Inc.

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software Foundation,
version 2 of the License.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with this program.
If not, see <https://www.gnu.org/licenses/>.
***** END LICENSE BLOCK *****
-->

<%@ page language="java" import="java.io.*, java.util.*, javax.naming.*"%>
<%
	String name = (String) request.getParameter("name");
	String path = (String) request.getParameter("path");
	String subject = (String) request.getParameter("subject");
	String id = (String) request.getParameter("id");
	PrintWriter pw = response.getWriter();
    if (name == null) 
	    pw.println("id=" + id + "; subject=" + subject);
	else 
		pw.println("name=" + name + "; path=" + path); 
%>
