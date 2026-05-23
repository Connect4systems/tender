import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_fields


def execute():
	add_docfield_columns()
	add_docfield_table_columns()
	add_docfield_property_setters()


def add_docfield_columns():
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


def add_docfield_table_columns():
	columns = {
		"tab_style_icon": "Data",
		"tab_style_inactive_background_color": "Data",
		"tab_style_inactive_text_color": "Data",
		"tab_style_active_background_color": "Data",
		"tab_style_active_text_color": "Data",
		"tab_style_height": "Int",
		"tab_style_one_line": "Check",
	}

	for column_name, fieldtype in columns.items():
		if not frappe.db.has_column("DocField", column_name):
			frappe.db.add_column("DocField", column_name, fieldtype)


def add_docfield_property_setters():
	property_fields = [
		("tab_style_section", "Section Break", "Tab Style", "description", None, 0),
		(
			"tab_style_icon",
			"Select",
			"Tab Icon",
			"tab_style_section",
			"none\ngrid\nclock\nlist\ntable\npaperclip\nnews\nhome\ncolumns\nsettings\nstar\nheart\nfile\nbriefcase\ncalendar\nmap-pin",
			0,
		),
		("tab_style_inactive_background_color", "Color", "Inactive Tab Background", "tab_style_icon", None, 0),
		("tab_style_inactive_text_color", "Color", "Inactive Tab Text", "tab_style_inactive_background_color", None, 0),
		("tab_style_column_break", "Column Break", None, "tab_style_inactive_text_color", None, 0),
		("tab_style_active_background_color", "Color", "Active Tab Background", "tab_style_column_break", None, 0),
		("tab_style_active_text_color", "Color", "Active Tab Text", "tab_style_active_background_color", None, 0),
		("tab_style_height", "Int", "Tab Height", "tab_style_active_text_color", None, 0),
		("tab_style_one_line", "Check", "Keep Tabs in One Line", "tab_style_height", None, 0),
	]

	existing_fields = {df.fieldname for df in frappe.get_meta("DocField").fields}
	max_idx = max((df.idx for df in frappe.get_meta("DocField").fields), default=0)

	for offset, (fieldname, fieldtype, label, insert_after, options, hidden) in enumerate(property_fields, start=1):
		if fieldname in existing_fields:
			continue

		df = frappe.new_doc("DocField")
		df.parent = "DocField"
		df.parentfield = "fields"
		df.parenttype = "DocType"
		df.fieldname = fieldname
		df.fieldtype = fieldtype
		df.label = label
		df.insert_after = insert_after
		df.options = options
		df.hidden = hidden
		df.depends_on = "eval:doc.fieldtype == 'Tab Break'"
		df.idx = max_idx + offset
		df.insert(ignore_permissions=True)

	frappe.clear_cache(doctype="DocField")
