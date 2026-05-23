// Copyright (c) 2026, Connect4Systems and contributors
// For license information, please see license.txt

frappe.ui.form.on("Tender", {
	refresh(frm) {
		tender_install_styles();
		tender_mark_form(frm);
		tender_style_tabs(frm);
		setTimeout(() => tender_style_tabs(frm), 100);
		setTimeout(() => tender_style_tabs(frm), 500);
	},
	onload_post_render(frm) {
		tender_install_styles();
		tender_mark_form(frm);
		tender_style_tabs(frm);
		setTimeout(() => tender_style_tabs(frm), 100);
		setTimeout(() => tender_style_tabs(frm), 500);
	},
});

function tender_install_styles() {
	if (document.getElementById("tender-inline-form-style")) {
		return;
	}

	const style = document.createElement("style");
	style.id = "tender-inline-form-style";
	style.textContent = `
		.tender-page-shell,
		.tender-form-shell {
			--tender-green: #2f8b5d;
			--tender-green-dark: #155c4f;
			--tender-border: #d8dde1;
			--tender-text: #244f47;
		}

		.tender-form-shell .form-layout {
			background: #fbfcfc !important;
			border: 1px solid var(--tender-border) !important;
			border-radius: 6px !important;
			padding: 18px 26px !important;
		}

		.tender-tabs-enhanced {
			border-bottom: 0 !important;
			display: flex !important;
			flex-wrap: nowrap !important;
			gap: 5px !important;
			justify-content: center !important;
			margin: 0 0 18px !important;
			overflow: visible !important;
			width: 100% !important;
		}

		.tender-tabs-enhanced > li,
		.tender-tabs-enhanced > .nav-item {
			flex: 1 1 0 !important;
			margin: 0 !important;
			min-width: 0 !important;
		}

		.tender-tabs-enhanced a,
		.tender-tabs-enhanced .nav-link {
			align-items: center !important;
			background: #f4f4f4 !important;
			border: 0 !important;
			border-radius: 2px !important;
			box-shadow: 0 1px 6px rgba(31, 63, 54, 0.05) !important;
			color: #4d555a !important;
			display: flex !important;
			flex-direction: column !important;
			font-size: 10.5px !important;
			font-weight: 700 !important;
			gap: 5px !important;
			height: 74px !important;
			justify-content: center !important;
			line-height: 1.3 !important;
			min-height: 74px !important;
			min-width: 0 !important;
			overflow: hidden !important;
			padding: 9px 5px !important;
			text-align: center !important;
			text-decoration: none !important;
			white-space: normal !important;
			width: 100% !important;
		}

		.tender-tabs-enhanced a.active,
		.tender-tabs-enhanced a[aria-selected="true"],
		.tender-tabs-enhanced .nav-link.active,
		.tender-tabs-enhanced .nav-link[aria-selected="true"],
		.tender-tabs-enhanced .nav-item.active > a,
		.tender-tabs-enhanced .nav-item.active > .nav-link,
		.tender-tabs-enhanced .tender-tab-active {
			background: var(--tender-green) !important;
			box-shadow: 0 4px 10px rgba(47, 139, 93, 0.28) !important;
			color: #fff !important;
		}

		.tender-tabs-enhanced a.active *,
		.tender-tabs-enhanced a[aria-selected="true"] *,
		.tender-tabs-enhanced .nav-link.active *,
		.tender-tabs-enhanced .nav-link[aria-selected="true"] *,
		.tender-tabs-enhanced .nav-item.active > a *,
		.tender-tabs-enhanced .nav-item.active > .nav-link *,
		.tender-tabs-enhanced .tender-tab-active * {
			color: #fff !important;
			stroke: #fff !important;
		}

		.tender-tab-icon {
			color: currentColor !important;
			display: block !important;
			height: 22px !important;
			line-height: 1 !important;
			margin-bottom: 2px !important;
			width: 22px !important;
		}

		.tender-tab-icon svg {
			display: block !important;
			height: 22px !important;
			width: 22px !important;
		}

		.tender-form-shell .section-head {
			color: var(--tender-green) !important;
			font-weight: 700 !important;
		}

		.tender-form-shell .grid-heading-row,
		.tender-form-shell .grid-header,
		.tender-form-shell .datatable .dt-header {
			background: var(--tender-green) !important;
			color: #fff !important;
		}
	`;
	document.head.appendChild(style);
}

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
	};

	const icons_by_index = ["grid", "clock", "list", "table", "paperclip", "news", "home", "columns"];
	const tab_fields = (frm.meta.fields || []).filter((df) => df.fieldtype === "Tab Break");
	const $scope = frm.page?.wrapper ? $(frm.page.wrapper) : frm.$wrapper;
	const $tabs = $scope.find(
		".form-tabs a.nav-link, .form-tabs a, .form-tabs-list a.nav-link, .form-tabs-list a"
	);

	const $tab_container = $tabs.first().closest(".form-tabs, .form-tabs-list, ul, nav");
	$tab_container.addClass("tender-tabs-enhanced");
	$tab_container.off("click.tender_tabs").on("click.tender_tabs", "a", () => {
		setTimeout(() => tender_style_tabs(frm), 30);
	});

	$tabs.each(function (index) {
		const $tab = $(this);
		const label = $tab.clone().children(".tender-tab-icon").remove().end().text().trim();
		const fieldname = $tab.attr("data-fieldname") || $tab.data("fieldname") || tab_fields[index]?.fieldname;
		const icon = icons_by_fieldname[fieldname] || icons_by_label[label] || icons_by_index[index];

		if (icon && !$tab.find(".tender-tab-icon").length) {
			$tab.prepend(`<span class="tender-tab-icon" aria-hidden="true">${tender_tab_icon(icon)}</span>`);
		}

		const is_active =
			$tab.hasClass("active") ||
			$tab.attr("aria-selected") === "true" ||
			$tab.parent().hasClass("active");
		$tab.toggleClass("tender-tab-active", is_active);
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
