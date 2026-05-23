import frappe

from tender.patches.create_docfield_tab_style_fields import execute as create_docfield_tab_style_fields
from tender.patches.create_default_tender_tab_styles import execute as create_default_tender_tab_styles


def execute():
	create_docfield_tab_style_fields()
	create_default_tender_tab_styles()
	frappe.clear_cache()
