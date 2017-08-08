/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'fonticon\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icon-phone2': '&#xe92d;',
		'icon-edit2': '&#xe92b;',
		'icon-paperclip': '&#xe02d;',
		'icon-lightbulb': '&#xe030;',
		'icon-layers': '&#xe031;',
		'icon-profile-male': '&#xe040;',
		'icon-profile-female': '&#xe041;',
		'icon-map-pin': '&#xe047;',
		'icon-upload': '&#xe04c;',
		'icon-download': '&#xe04d;',
		'icon-refresh': '&#xe05a;',
		'icon-file': '&#xe91c;',
		'icon-file2': '&#xe91d;',
		'icon-hourglass': '&#xe916;',
		'icon-camera2': '&#xe90f;',
		'icon-A0000102': '&#xe928;',
		'icon-C00024': '&#xe907;',
		'icon-A000032': '&#xe908;',
		'icon-A000052': '&#xe909;',
		'icon-A000054': '&#xe90a;',
		'icon-A00005': '&#xe90b;',
		'icon-A000010': '&#xe90c;',
		'icon-shopping-cart': '&#xe929;',
		'icon-home-outline': '&#xe925;',
		'icon-location-outline': '&#xe926;',
		'icon-alarm': '&#xe855;',
		'icon-alarm_off': '&#xe857;',
		'icon-alarm_on': '&#xe858;',
		'icon-all_inclusive': '&#xeb3d;',
		'icon-create_new_folder': '&#xe2cc;',
		'icon-not_interested': '&#xe033;',
		'icon-do_not_disturb_alt': '&#xe611;',
		'icon-favorite': '&#xe87d;',
		'icon-favorite_border': '&#xe87e;',
		'icon-help_outline': '&#xe8fd;',
		'icon-home': '&#xe88a;',
		'icon-lightbulb_outline': '&#xe927;',
		'icon-power_settings_new': '&#xe8ac;',
		'icon-timer': '&#xe425;',
		'icon-timer_off': '&#xe426;',
		'icon-verified_user': '&#xe8e8;',
		'icon-find_in_page': '&#xe880;',
		'icon-keyboard_control': '&#xe20f;',
		'icon-more_vert': '&#xe210;',
		'icon-notifications': '&#xe24a;',
		'icon-notifications_none': '&#xe24b;',
		'icon-notifications_active': '&#xe24d;',
		'icon-subject': '&#xe2e4;',
		'icon-toc': '&#xe2f0;',
		'icon-view_headline': '&#xe300;',
		'icon-view_list': '&#xe301;',
		'icon-view_module': '&#xe302;',
		'icon-loop': '&#xe028;',
		'icon-error': '&#xe000;',
		'icon-error_outline': '&#xe001;',
		'icon-add': '&#xe069;',
		'icon-add_box': '&#xe06a;',
		'icon-add_circle': '&#xe06b;',
		'icon-add_circle_outline': '&#xe06c;',
		'icon-clear': '&#xe070;',
		'icon-remove': '&#xe07f;',
		'icon-remove_circle': '&#xe080;',
		'icon-remove_circle_outline': '&#xe081;',
		'icon-cancel': '&#xe205;',
		'icon-check_circle': '&#xe281;',
		'icon-done': '&#xe28a;',
		'icon-highlight_remove': '&#xe29c;',
		'icon-search': '&#xe2ca;',
		'icon-help': '&#xe604;',
		'icon-info': '&#xe605;',
		'icon-info-outline': '&#xe606;',
		'icon-cart2': '&#xe92a;',
		'icon-cart': '&#xe93a;',
		'icon-search2': '&#xe91f;',
		'icon-hyperlink': '&#xe920;',
		'icon-comments': '&#xe921;',
		'icon-screen': '&#xe922;',
		'icon-iphone': '&#xe923;',
		'icon-pin': '&#xe924;',
		'icon-menu': '&#xe917;',
		'icon-trash': '&#xe918;',
		'icon-checkmark': '&#xe910;',
		'icon-check-alt': '&#xe911;',
		'icon-x': '&#xe913;',
		'icon-x-altx-alt': '&#xe914;',
		'icon-arrow-small-down': '&#xf0a0;',
		'icon-arrow-small-left': '&#xf0a1;',
		'icon-arrow-small-right': '&#xf071;',
		'icon-arrow-small-up': '&#xf09f;',
		'icon-triangle-down': '&#xf05b;',
		'icon-triangle-left': '&#xf044;',
		'icon-triangle-right': '&#xf05a;',
		'icon-triangle-up': '&#xf0aa;',
		'icon-loop2': '&#xe904;',
		'icon-attachment': '&#xe903;',
		'icon-folder-upload': '&#xe901;',
		'icon-box-remove': '&#xe902;',
		'icon-drawer2': '&#xe900;',
		'icon-browser': '&#xe607;',
		'icon-calendar': '&#xe608;',
		'icon-hour-glass': '&#xe979;',
		'icon-write': '&#xe92c;',
		'icon-windows': '&#xe90d;',
		'icon-trashcan': '&#xe91e;',
		'icon-user': '&#xe915;',
		'icon-camera': '&#xe90e;',
		'icon-eye': '&#xe919;',
		'icon-edit': '&#xe91a;',
		'icon-pencil': '&#xe91b;',
		'icon-chevron-thin-down': '&#xe600;',
		'icon-chevron-thin-left': '&#xe601;',
		'icon-chevron-thin-right': '&#xe602;',
		'icon-chevron-thin-up': '&#xe603;',
		'icon-codepen': '&#xf1cb;',
		'icon-people': '&#xe905;',
		'icon-phone': '&#xe906;',
		'icon-uniE912': '&#xe912;',
		'icon-cloud-upload': '&#xf0ee;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
