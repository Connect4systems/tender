// Copyright (c) 2026, Connect4Systems and contributors
// For license information, please see license.txt

frappe.ui.form.on("Tender", {
	refresh(frm) {
		tender_mark_form(frm);
		tender_style_tabs(frm);
		setTimeout(() => tender_style_tabs(frm), 100);
	},
	onload_post_render(frm) {
		tender_mark_form(frm);
		tender_style_tabs(frm);
		setTimeout(() => tender_style_tabs(frm), 100);
	},
});

function tender_mark_form(frm) {
	frm.$wrapper.addClass("tender-form-shell");

	if (frm.page?.wrapper) {
		$(frm.page.wrapper).addClass("tender-page-shell");
	}
}

function tender_style_tabs(frm) {
	const icons_by_fieldname = {
		basic_information_tab: "grid",
		addresses_and_dates_tab: "clock",
		classification_and_execution_tab: "list",
		quantity_tables_tab: "table",
		attachments_tab: "paperclip",
		competition_news_tab: "news",
		local_content_mechanisms_tab: "home",
		evaluation_criteria_tab: "columns",
	};

	const icons_by_label = {
		"Basic Information": "grid",
		"Addresses and dates": "clock",
		"Classification and Execution": "list",
		"Quantity Tables": "table",
		Attachments: "paperclip",
		"Competition News": "news",
		"Local Content Mechanisms": "home",
		"Evaluation Criteria": "columns",
		"المعلومات الأساسية": "grid",
		"العناوين والمواعيد المتعلقة بالمنافسة": "clock",
		"مجال التصنيف وموقع التنفيذ والتقديم": "list",
		"جداول الكميات": "table",
		"المرفقات": "paperclip",
		"أخبار المنافسة": "news",
		"آليات المحتوى المحلي": "home",
		"معايير التقييم": "columns",
	};

	const tab_fields = (frm.meta.fields || []).filter((df) => df.fieldtype === "Tab Break");
	const $scope = frm.page?.wrapper ? $(frm.page.wrapper) : frm.$wrapper;
	const $tabs = $scope.find(
		".form-tabs a.nav-link, .form-tabs a, .form-tabs-list a.nav-link, .form-tabs-list a"
	);

	$tabs.each(function (index) {
		const $tab = $(this);
		const label = $tab.clone().children(".tender-tab-icon").remove().end().text().trim();
		const fieldname = $tab.attr("data-fieldname") || $tab.data("fieldname") || tab_fields[index]?.fieldname;
		const icon = icons_by_fieldname[fieldname] || icons_by_label[label];

		if (icon && !$tab.find(".tender-tab-icon").length) {
			$tab.prepend(`<span class="tender-tab-icon" aria-hidden="true">${tender_tab_icon(icon)}</span>`);
		}
	});
}

function tender_tab_icon(name) {
	const attrs = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
	const icons = {
		grid: `<svg ${attrs}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
		clock: `<svg ${attrs}><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>`,
		list: `<svg ${attrs}><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/></svg>`,
		table: `<svg ${attrs}><path d="M4 5h16"/><path d="M5 5v14"/><path d="M19 5v14"/><path d="M4 10h16"/><path d="M4 19h16"/><path d="M9 10v9"/><path d="M15 10v9"/></svg>`,
		paperclip: `<svg ${attrs}><path d="m21 8-10 10a5 5 0 0 1-7-7L14 1a3.5 3.5 0 0 1 5 5L9 16a2 2 0 0 1-3-3l9-9"/></svg>`,
		news: `<svg ${attrs}><path d="M4 5h14a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2V5Z"/><path d="M8 9h6M8 13h8M8 17h5"/></svg>`,
		home: `<svg ${attrs}><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>`,
		columns: `<svg ${attrs}><path d="M4 5h16v14H4z"/><path d="M12 5v14"/><path d="M4 10h16"/></svg>`,
	};

	return icons[name] || "";
}
