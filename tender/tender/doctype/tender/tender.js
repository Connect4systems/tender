// Copyright (c) 2026, Connect4Systems and contributors
// For license information, please see license.txt

frappe.ui.form.on("Tender", {
	refresh(frm) {
		frm.$wrapper.addClass("tender-form-shell");
		tender_style_tabs(frm);
		setTimeout(() => tender_style_tabs(frm), 100);
	},
	onload_post_render(frm) {
		frm.$wrapper.addClass("tender-form-shell");
		tender_style_tabs(frm);
		setTimeout(() => tender_style_tabs(frm), 100);
	},
});

function tender_style_tabs(frm) {
	const icons_by_fieldname = {
		basic_information_tab: "fa-th-large",
		addresses_and_dates_tab: "fa-clock-o",
		classification_and_execution_tab: "fa-list",
		quantity_tables_tab: "fa-table",
		attachments_tab: "fa-paperclip",
		competition_news_tab: "fa-newspaper-o",
		local_content_mechanisms_tab: "fa-home",
		evaluation_criteria_tab: "fa-columns",
	};

	const icons_by_label = {
		"Basic Information": "fa-th-large",
		"Addresses and dates": "fa-clock-o",
		"Classification and Execution": "fa-list",
		"Quantity Tables": "fa-table",
		Attachments: "fa-paperclip",
		"Competition News": "fa-newspaper-o",
		"Local Content Mechanisms": "fa-home",
		"Evaluation Criteria": "fa-columns",
		"المعلومات الأساسية": "fa-th-large",
		"العناوين والمواعيد المتعلقة بالمنافسة": "fa-clock-o",
		"مجال التصنيف وموقع التنفيذ والتقديم": "fa-list",
		"جداول الكميات": "fa-table",
		"المرفقات": "fa-paperclip",
		"أخبار المنافسة": "fa-newspaper-o",
		"آليات المحتوى المحلي": "fa-home",
		"معايير التقييم": "fa-columns",
	};

	const tab_fields = (frm.meta.fields || []).filter((df) => df.fieldtype === "Tab Break");
	const $tabs = frm.$wrapper.find(
		".form-tabs a.nav-link, .form-tabs a, .form-tabs-list a.nav-link, .form-tabs-list a"
	);

	$tabs.each(function (index) {
		const $tab = $(this);
		const label = $tab.clone().children(".tender-tab-icon").remove().end().text().trim();
		const fieldname = $tab.attr("data-fieldname") || $tab.data("fieldname") || tab_fields[index]?.fieldname;
		const icon = icons_by_fieldname[fieldname] || icons_by_label[label];

		if (icon && !$tab.find(".tender-tab-icon").length) {
			$tab.prepend(`<i class="fa ${icon} tender-tab-icon" aria-hidden="true"></i>`);
		}
	});
}
