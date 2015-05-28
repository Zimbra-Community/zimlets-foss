<%--
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2009, 2010, 2013, 2014 Zimbra, Inc.
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
 * @Author Raja Rao DV
 *
--%>
 
<%@ page language="java" import="org.apache.commons.httpclient.Credentials"%>
<%@ page language="java" import="org.apache.commons.httpclient.HostConfiguration"%>
<%@ page language="java" import="org.apache.commons.httpclient.HttpClient"%>
<%@ page language="java" import="org.apache.commons.httpclient.UsernamePasswordCredentials"%>
<%@ page language="java" import="org.apache.commons.httpclient.auth.AuthScope"%>
<%@ page language="java" import="org.apache.commons.httpclient.methods.PutMethod"%>
<%@ page language="java" import="org.apache.commons.httpclient.methods.StringRequestEntity"%>

<%
	String server = request.getParameter("server");
	String turnon = request.getParameter("turnon");
	String email = request.getParameter("email");
	String password =  request.getParameter("password");
	String action =  request.getParameter("action");
	String resp = "";
	if(action.contains("doNotDisturb")) {
		resp = doNotDisturb(server, turnon, email, password);
	} else 	if(action.contains("callAnyWhere")) {
		resp = callAnyWhere(server, turnon, email, password);
	}
		/*String result = "{"
			  + "\"server\": \""+server+"\","
			  + "\"turnon\": \""+turnon+"\","
			  + "\"email\": \""+email+"\","
			  + "\"password\": \""+password+"\""
			  + "\"response\": \""+resp+"\""
			  + "}";
			*/  
		
%>

<%=  resp %>

<%!public String doNotDisturb(String server, String turnOn, String userName, String password) {
		String url = "https://"+server+"/com.broadsoft.xsi-actions/v1.0/user/"+userName+"/services/DoNotDisturb";
		String body = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><DoNotDisturb xmlns=\"http://schema.broadsoft.com/xsi-actions\">";
		body = body + "<isActive>"+turnOn+"</isActive><ringSplash>false</ringSplash></DoNotDisturb>";

		try {
			HttpClient httpClient = new HttpClient();
			PutMethod putMethod = new PutMethod(url);
			if (body != null) {
				putMethod.setRequestEntity(new StringRequestEntity(body,
						"application/xml", "UTF-8"));
			}
			Credentials defaultcreds = new UsernamePasswordCredentials(userName, password);
			httpClient.getState().setCredentials(AuthScope.ANY, defaultcreds);
			int code = httpClient.executeMethod(putMethod);
			return ""+code;
			// Response response = new Response(code,
			// putMethod.getResponseBody());
			//out.println("code:" + code);
		} catch (Exception e) {
			return e.toString();
		}

}

%>


<%!public String callAnyWhere(String server, String turnOn, String userName, String password) {
		String url = "https://"+server+"/com.broadsoft.xsi-actions/v1.0/user/"+userName+"/services/broadworksanywhere";
		
		String body = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><BroadWorksAnywhere xmlns=\"http://schema.broadsoft.com/xsi-actions\"><alertAllLocationsForClickToDialCalls>true</alertAllLocationsForClickToDialCalls><locations><location><phoneNumber>4083498112</phoneNumber><isActive>true</isActive></location></locations></BroadWorksAnywhere>";
		try {
			HttpClient httpClient = new HttpClient();
			PutMethod putMethod = new PutMethod(url);
			if (body != null) {
				putMethod.setRequestEntity(new StringRequestEntity(body,
						"application/xml", "UTF-8"));
			}
			Credentials defaultcreds = new UsernamePasswordCredentials(userName, password);
			httpClient.getState().setCredentials(AuthScope.ANY, defaultcreds);
			int code = httpClient.executeMethod(putMethod);

			return ""+code;
			// Response response = new Response(code,
			// putMethod.getResponseBody());
			//out.println("code:" + code);
		} catch (Exception e) {
			return e.toString();
		}

}

%>