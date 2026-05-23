import frappe


def execute():
	if not frappe.db.exists("DocType", "Form Tab Style") or not frappe.db.exists("DocType", "Tender"):
		return

	tabs = [
		("basic_information_tab", "Basic Information", "grid"),
		("addresses_and_dates_tab", "Addresses and dates", "clock"),
		("classification_and_execution_tab", "Classification and Execution", "list"),
		("quantity_tables_tab", "Quantity Tables", "table"),
		("attachments_tab", "Attachments", "paperclip"),
		("competition_news_tab", "Competition News", "news"),
		("local_content_mechanisms_tab", "Local Content Mechanisms", "home"),
		("evaluation_criteria_tab", "Evaluation Criteria", "columns"),
	]

	for idx, (fieldname, label, icon) in enumerate(tabs, start=1):
		if frappe.db.exists("Form Tab Style", {"document_type": "Tender", "tab_fieldname": fieldname}):
			continue

		doc = frappe.new_doc("Form Tab Style")
		doc.enabled = 1
		doc.document_type = "Tender"
		doc.tab_fieldname = fieldname
		doc.tab_label = label
		doc.icon = icon
		doc.inactive_background_color = "#f4f4f4"
		doc.inactive_text_color = "#4d555a"
		doc.active_background_color = "#2f8b5d"
		doc.active_text_color = "#ffffff"
		doc.tab_height = 74
		doc.one_line_tabs = 1
		doc.idx = idx
		doc.insert(ignore_permissions=True)
