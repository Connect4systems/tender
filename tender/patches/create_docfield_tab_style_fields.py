import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_fields


def execute():
	custom_fields = {
		"DocField": [
			{
				"fieldname": "tab_style_section",
				"fieldtype": "Section Break",
				"label": "Tab Style",
				"insert_after": "description",
				"depends_on": "eval:doc.fieldtype == 'Tab Break'",
			},
			{
				"fieldname": "tab_style_icon",
				"fieldtype": "Select",
				"label": "Tab Icon",
				"options": "none\ngrid\nclock\nlist\ntable\npaperclip\nnews\nhome\ncolumns\nsettings\nstar\nheart\nfile\nbriefcase\ncalendar\nmap-pin",
				"default": "none",
				"insert_after": "tab_style_section",
				"depends_on": "eval:doc.fieldtype == 'Tab Break'",
			},
			{
				"fieldname": "tab_style_inactive_background_color",
				"fieldtype": "Color",
				"label": "Inactive Tab Background",
				"default": "#f4f4f4",
				"insert_after": "tab_style_icon",
				"depends_on": "eval:doc.fieldtype == 'Tab Break'",
			},
			{
				"fieldname": "tab_style_inactive_text_color",
				"fieldtype": "Color",
				"label": "Inactive Tab Text",
				"default": "#4d555a",
				"insert_after": "tab_style_inactive_background_color",
				"depends_on": "eval:doc.fieldtype == 'Tab Break'",
			},
			{
				"fieldname": "tab_style_column_break",
				"fieldtype": "Column Break",
				"insert_after": "tab_style_inactive_text_color",
				"depends_on": "eval:doc.fieldtype == 'Tab Break'",
			},
			{
				"fieldname": "tab_style_active_background_color",
				"fieldtype": "Color",
				"label": "Active Tab Background",
				"default": "#2f8b5d",
				"insert_after": "tab_style_column_break",
				"depends_on": "eval:doc.fieldtype == 'Tab Break'",
			},
			{
				"fieldname": "tab_style_active_text_color",
				"fieldtype": "Color",
				"label": "Active Tab Text",
				"default": "#ffffff",
				"insert_after": "tab_style_active_background_color",
				"depends_on": "eval:doc.fieldtype == 'Tab Break'",
			},
			{
				"fieldname": "tab_style_height",
				"fieldtype": "Int",
				"label": "Tab Height",
				"default": "74",
				"insert_after": "tab_style_active_text_color",
				"depends_on": "eval:doc.fieldtype == 'Tab Break'",
			},
			{
				"fieldname": "tab_style_one_line",
				"fieldtype": "Check",
				"label": "Keep Tabs in One Line",
				"default": "1",
				"insert_after": "tab_style_height",
				"depends_on": "eval:doc.fieldtype == 'Tab Break'",
			},
		]
	}
	create_custom_fields(custom_fields, ignore_validate=True)
