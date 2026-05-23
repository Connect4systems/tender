// Copyright (c) 2026, Connect4Systems and contributors
// For license information, please see license.txt

frappe.ui.form.on("Tender", {
	refresh(frm) {
		frm.$wrapper.addClass("tender-form-shell");
		tender_style_tabs(frm);
	},
	onload_post_render(frm) {
		frm.$wrapper.addClass("tender-form-shell");
		tender_style_tabs(frm);
	},
});

function tender_style_tabs(frm) {
	const icons = {
		"Basic Information": "fa-th-large",
		"Addresses and dates": "fa-clock-o",
		"Classification and Execution": "fa-list",
		"Quantity Tables": "fa-table",
		"Attachments": "fa-paperclip",
		"Competition News": "fa-newspaper-o",
		"Local Content Mechanisms": "fa-home",
		"Evaluation Criteria": "fa-university",
		"المعلومات الأساسية": "fa-th-large",
		"العناوين والمواعيد المتعلقة بالمنافسة": "fa-clock-o",
		"مجال التصنيف وموقع التنفيذ والتقديم": "fa-list",
		"جداول الكميات": "fa-table",
		"المرفقات": "fa-paperclip",
		"أخبار المنافسة": "fa-newspaper-o",
		"آليات المحتوى المحلي": "fa-home",
		"معايير التقييم": "fa-university",
	};

	frm.$wrapper.find(".form-tabs a.nav-link, .form-tabs a").each(function () {
		const $tab = $(this);
		const label = $tab.text().trim();

		if (!$tab.find(".tender-tab-icon").length && icons[label]) {
			$tab.prepend(`<i class="fa ${icons[label]} tender-tab-icon" aria-hidden="true"></i>`);
		}
	});
}
