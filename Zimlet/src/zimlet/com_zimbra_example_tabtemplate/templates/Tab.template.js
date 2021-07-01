/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
AjxTemplate.register("com_zimbra_example_tabtemplate.templates.Tab#Main", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table cellpadding=\"2\" cellspacing=\"10\" border=\"1\" width=\"100%\"><tr><td colspan=\"2\"><h1><span>Lorem Ipsum</span></h1></td></tr><tr><td colspan=\"2\">&nbsp;</td></tr><tr><td align=\"top\"><h2><span>What is Lorem Ipsum?</span></h2><p>\n";
	buffer[_i++] = "\t\t\tLorem ipsum dolor sit amet, consectetur adipiscing elit. Ut dictum nibh in libero semper eu convallis ligula consequat. Maecenas mollis euismod interdum. Curabitur metus quam, consequat non tincidunt quis, rhoncus pellentesque ipsum. Vestibulum sed ligula eros. Nunc fringilla metus vitae lacus hendrerit eu fermentum mi egestas. Duis rhoncus, nibh et fringilla luctus, erat nisi hendrerit lorem, at mollis lacus enim id mauris. Nullam fermentum porta mi quis lobortis. Donec a tincidunt ligula. Duis dolor nulla, rhoncus at semper vitae, accumsan iaculis purus. Aenean facilisis varius velit, eget tristique nibh porttitor non. Mauris at convallis erat. Vestibulum id mauris felis. Vivamus enim dui, tincidunt vitae blandit id, dictum sit amet turpis. Proin posuere ultrices quam, ut consequat tortor tempor non. Praesent nec congue massa. Suspendisse et diam ligula. \n";
	buffer[_i++] = "\t\t\t</p><h2><span>Where does it come from?</span></h2><p>\n";
	buffer[_i++] = "\t\t\tSed lectus nulla, mattis in tincidunt eu, malesuada ut velit. Quisque tempus, est eu feugiat tempor, nulla ipsum rutrum tortor, ut vehicula felis massa sit amet nibh. Maecenas ornare congue rutrum. Aenean elit sem, dictum ut porta a, mollis vitae justo. Donec tempor vulputate massa. Proin arcu massa, tempus ut porta quis, gravida id ante. Ut id dolor metus. Quisque suscipit gravida dapibus. Aenean fringilla suscipit hendrerit. Quisque convallis massa sem. Aliquam erat volutpat. Nulla nec dolor ut nisi euismod iaculis at sit amet nibh. Morbi a tellus ac metus convallis iaculis quis eget nunc. \n";
	buffer[_i++] = "\t\t\t</p></td><td align=\"top\"><h2><span>Why do we use it?</span></h2><p>\n";
	buffer[_i++] = "\t\t\tMaecenas semper gravida tellus nec accumsan. Morbi ut nibh dui, quis varius sem. Phasellus pharetra tincidunt feugiat. Etiam sed metus nec sem dignissim fringilla sit amet sed quam. Proin in urna ante. Vivamus at nulla massa, ut sodales nulla. Aenean malesuada convallis eros, in venenatis nisl semper id. Aliquam eleifend sem ante. Aenean ac massa et ligula ornare volutpat sed at erat. Maecenas accumsan nisl vel urna venenatis nec varius arcu rhoncus. \n";
	buffer[_i++] = "\t\t\t</p><h2><span>Where can I get some?</span></h2><p>\n";
	buffer[_i++] = "\t\t\tQuisque et tortor id risus semper blandit id et elit. Nulla luctus neque ut ante consequat tincidunt. Vivamus sed sodales arcu. Etiam a arcu sed nibh adipiscing pulvinar. Aliquam ultricies odio quis urna rutrum id condimentum nibh auctor. Aenean pellentesque lacus et arcu tristique placerat. Nullam risus tellus, rutrum a gravida in, accumsan non lectus. Phasellus vel enim molestie metus porttitor vehicula eget at elit. Nullam fermentum venenatis diam sed placerat. Morbi pharetra ullamcorper nisl, in mattis sem consectetur eu. Curabitur tristique blandit sagittis. Morbi pharetra hendrerit justo et pellentesque. Phasellus molestie imperdiet rutrum. Nam volutpat, sapien tempus laoreet consequat, massa nunc ullamcorper sapien, mattis ultrices turpis massa id massa. Cras laoreet ligula massa, ac commodo diam. \n";
	buffer[_i++] = "\t\t\t</p></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "Main"
}, false);
AjxTemplate.register("com_zimbra_example_tabtemplate.templates.Tab", AjxTemplate.getTemplate("com_zimbra_example_tabtemplate.templates.Tab#Main"), AjxTemplate.getParams("com_zimbra_example_tabtemplate.templates.Tab#Main"));

