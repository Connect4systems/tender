# Copyright (c) 2026, Connect4Systems and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class FormTabStyle(Document):
	pass


@frappe.whitelist()
def get_tab_styles(doctype):
	if not doctype:
		return []

	return frappe.get_all(
		"Form Tab Style",
		filters={"document_type": doctype, "enabled": 1},
		fields=[
			"name",
			"document_type",
			"tab_fieldname",
			"tab_label",
			"icon",
			"inactive_background_color",
			"inactive_text_color",
			"active_background_color",
			"active_text_color",
			"tab_height",
			"one_line_tabs",
			"idx",
		],
		order_by="idx asc, modified asc",
	)


@frappe.whitelist()
def save_tab_styles(doctype, styles):
	frappe.only_for("System Manager")

	if not doctype:
		frappe.throw("DocType is required")

	if isinstance(styles, str):
		styles = frappe.parse_json(styles)
	styles = styles or []
	for idx, row in enumerate(styles, start=1):
		tab_fieldname = (row.get("tab_fieldname") or "").strip()
		if not tab_fieldname:
			continue

		existing_name = frappe.db.get_value(
			"Form Tab Style",
			{
				"document_type": doctype,
				"tab_fieldname": tab_fieldname,
			},
		)
		doc = frappe.get_doc("Form Tab Style", existing_name) if existing_name else frappe.new_doc("Form Tab Style")
		doc.document_type = doctype
		doc.tab_fieldname = tab_fieldname
		doc.tab_label = row.get("tab_label")
		doc.icon = row.get("icon") or "none"
		doc.inactive_background_color = row.get("inactive_background_color") or "#f4f4f4"
		doc.inactive_text_color = row.get("inactive_text_color") or "#4d555a"
		doc.active_background_color = row.get("active_background_color") or "#2f8b5d"
		doc.active_text_color = row.get("active_text_color") or "#ffffff"
		doc.tab_height = row.get("tab_height") or 74
		doc.one_line_tabs = 1 if row.get("one_line_tabs") else 0
		doc.enabled = 1 if row.get("enabled", 1) else 0
		doc.idx = idx
		doc.save(ignore_permissions=True)

	frappe.clear_cache(doctype=doctype)
	return get_tab_styles(doctype)
