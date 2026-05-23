(function () {
	const METHOD_GET = "tender.tender.doctype.form_tab_style.form_tab_style.get_tab_styles";
	const METHOD_SAVE = "tender.tender.doctype.form_tab_style.form_tab_style.save_tab_styles";
	const ICONS = ["none", "grid", "clock", "list", "table", "paperclip", "news", "home", "columns", "settings", "star", "heart", "file", "briefcase", "calendar", "map-pin"];
	const cache = {};
	let last_key = "";

	function target_doctype(frm) {
		if (!frm) return null;
		if (frm.doctype === "DocType" && frm.doc?.name) return frm.doc.name;
		return frm.doctype;
	}

	function install_base_css() {
		if (document.getElementById("form-tab-style-base-css")) return;

		const style = document.createElement("style");
		style.id = "form-tab-style-base-css";
		style.textContent = `
			.form-tab-style-tabs {
				border-bottom: 0 !important;
				display: flex !important;
				gap: 5px !important;
				margin: 0 0 18px !important;
				width: 100% !important;
			}
			.form-tab-style-tabs.form-tab-style-one-line {
				flex-wrap: nowrap !important;
				overflow: visible !important;
			}
			.form-tab-style-tabs > li,
			.form-tab-style-tabs > .nav-item {
				flex: 1 1 0 !important;
				margin: 0 !important;
				min-width: 0 !important;
			}
			.form-tab-style-tabs a,
			.form-tab-style-tabs .nav-link {
				align-items: center !important;
				border: 0 !important;
				border-radius: 3px !important;
				box-shadow: 0 1px 6px rgba(31, 63, 54, 0.05) !important;
				display: flex !important;
				flex-direction: column !important;
				font-size: 10.5px !important;
				font-weight: 700 !important;
				gap: 5px !important;
				justify-content: center !important;
				line-height: 1.3 !important;
				min-width: 0 !important;
				overflow: hidden !important;
				padding: 9px 5px !important;
				text-align: center !important;
				text-decoration: none !important;
				white-space: normal !important;
				width: 100% !important;
			}
			.form-tab-style-icon {
				color: currentColor !important;
				display: block !important;
				height: 22px !important;
				line-height: 1 !important;
				margin-bottom: 2px !important;
				width: 22px !important;
			}
			.form-tab-style-icon svg {
				display: block !important;
				height: 22px !important;
				width: 22px !important;
			}
		`;
		document.head.appendChild(style);
	}

	function svg_icon(name) {
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
			settings: `<svg ${attrs}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.1 2.1-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20h-3v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L6.6 16.6l.1-.1A1.7 1.7 0 0 0 7 14.6a1.7 1.7 0 0 0-1.6-1H5v-3h.4A1.7 1.7 0 0 0 7 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.1-2.1.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V4h3v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.1 2.1-.1.1A1.7 1.7 0 0 0 19 9.4a1.7 1.7 0 0 0 1.6 1H21v3h-.4a1.7 1.7 0 0 0-1.2 1.6Z"/></svg>`,
			star: `<svg ${attrs}><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2 7.5 14 3 9.6l6.2-.9L12 3Z"/></svg>`,
			heart: `<svg ${attrs}><path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>`,
			file: `<svg ${attrs}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6"/></svg>`,
			briefcase: `<svg ${attrs}><path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1"/><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 12h18"/></svg>`,
			calendar: `<svg ${attrs}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
			"map-pin": `<svg ${attrs}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
		};
		return icons[name] || "";
	}

	function get_tabs(frm) {
		const scope = frm.page?.wrapper ? $(frm.page.wrapper) : frm.$wrapper;
		return scope.find(".form-tabs a.nav-link, .form-tabs a, .form-tabs-list a.nav-link, .form-tabs-list a");
	}

	function tab_fields(frm) {
		if (frm.doctype === "DocType" && Array.isArray(frm.doc?.fields)) {
			return frm.doc.fields.filter((df) => df.fieldtype === "Tab Break");
		}
		return (frm.meta?.fields || []).filter((df) => df.fieldtype === "Tab Break");
	}

	function style_key(row) {
		return row.tab_fieldname || row.tab_label || "";
	}

	function to_int(value, fallback) {
		const parsed = parseInt(value, 10);
		return Number.isFinite(parsed) ? parsed : fallback;
	}

	function apply_styles(frm, rows) {
		if (!frm || !rows) return;
		install_base_css();

		const fields = tab_fields(frm);
		const by_key = {};
		rows.forEach((row) => {
			by_key[style_key(row)] = row;
		});

		const tabs = get_tabs(frm);
		const container = tabs.first().closest(".form-tabs, .form-tabs-list, ul, nav");
		container.addClass("form-tab-style-tabs");
		if (rows.some((row) => to_int(row.one_line_tabs, 0))) {
			container.addClass("form-tab-style-one-line");
		}

		container.off("click.form_tab_style").on("click.form_tab_style", "a", () => {
			setTimeout(() => apply_current_form(true), 50);
		});

		tabs.each(function (index) {
			const tab = $(this);
			const fieldname = tab.attr("data-fieldname") || tab.data("fieldname") || fields[index]?.fieldname;
			const label = tab.clone().children(".form-tab-style-icon").remove().end().text().trim();
			const row = by_key[fieldname] || by_key[label];
			if (!row) return;

			const active =
				tab.hasClass("active") ||
				tab.attr("aria-selected") === "true" ||
				tab.parent().hasClass("active");
			const bg = active ? row.active_background_color : row.inactive_background_color;
			const color = active ? row.active_text_color : row.inactive_text_color;
			const height = to_int(row.tab_height, 74);

			tab.css({
				background: bg || "",
				color: color || "",
				height: `${height}px`,
				"min-height": `${height}px`,
			});
			tab.find("*").css({ color: color || "", stroke: color || "" });

			tab.children(".form-tab-style-icon").remove();
			if (row.icon && row.icon !== "none") {
				tab.prepend(`<span class="form-tab-style-icon" aria-hidden="true">${svg_icon(row.icon)}</span>`);
			}
		});
	}

	function add_menu(frm) {
		if (!frm?.page || frm.__form_tab_style_menu_added) return;
		if (!frappe.user_roles?.includes("System Manager")) return;
		frm.__form_tab_style_menu_added = true;
		frm.page.add_menu_item(__("Customize Tab Styles"), () => open_dialog(frm), true);
	}

	function load_styles(doctype) {
		if (cache[doctype]) return Promise.resolve(cache[doctype]);
		return frappe.call({
			method: METHOD_GET,
			args: { doctype },
		}).then((r) => {
			cache[doctype] = r.message || [];
			return cache[doctype];
		});
	}

	function apply_current_form(force) {
		const frm = window.cur_frm;
		const doctype = target_doctype(frm);
		if (!frm || !doctype) return;

		const key = `${doctype}:${frm.docname || frm.doc?.name || ""}`;
		if (!force && key === last_key) return;
		last_key = key;
		add_menu(frm);

		load_styles(doctype).then((rows) => {
			apply_styles(frm, rows);
			setTimeout(() => apply_styles(frm, rows), 200);
		});
	}

	function open_dialog(frm) {
		const doctype = target_doctype(frm);
		const fields = tab_fields(frm);
		const rows = cache[doctype] || [];
		const by_fieldname = {};
		rows.forEach((row) => {
			by_fieldname[row.tab_fieldname] = row;
		});

		const table_data = fields.map((df, index) => {
			const existing = by_fieldname[df.fieldname] || {};
			return {
				enabled: existing.enabled ?? 1,
				tab_fieldname: df.fieldname,
				tab_label: df.label || df.fieldname,
				icon: existing.icon || ICONS[index + 1] || "none",
				inactive_background_color: existing.inactive_background_color || "#f4f4f4",
				inactive_text_color: existing.inactive_text_color || "#4d555a",
				active_background_color: existing.active_background_color || "#2f8b5d",
				active_text_color: existing.active_text_color || "#ffffff",
				tab_height: existing.tab_height || 74,
				one_line_tabs: existing.one_line_tabs ?? 1,
			};
		});

		const dialog = new frappe.ui.Dialog({
			title: __("Customize Tab Styles") + ` - ${doctype}`,
			size: "extra-large",
			fields: [
				{
					fieldname: "styles",
					fieldtype: "Table",
					label: __("Tabs"),
					cannot_add_rows: true,
					in_place_edit: true,
					data: table_data,
					fields: [
						{ fieldname: "enabled", fieldtype: "Check", label: __("Enabled"), in_list_view: 1 },
						{ fieldname: "tab_fieldname", fieldtype: "Data", label: __("Tab Fieldname"), read_only: 1, in_list_view: 1 },
						{ fieldname: "tab_label", fieldtype: "Data", label: __("Tab Label"), read_only: 1, in_list_view: 1 },
						{ fieldname: "icon", fieldtype: "Select", label: __("Icon"), options: ICONS.join("\n"), in_list_view: 1 },
						{ fieldname: "inactive_background_color", fieldtype: "Color", label: __("Inactive Background"), in_list_view: 1 },
						{ fieldname: "inactive_text_color", fieldtype: "Color", label: __("Inactive Text"), in_list_view: 1 },
						{ fieldname: "active_background_color", fieldtype: "Color", label: __("Active Background"), in_list_view: 1 },
						{ fieldname: "active_text_color", fieldtype: "Color", label: __("Active Text"), in_list_view: 1 },
						{ fieldname: "tab_height", fieldtype: "Int", label: __("Height"), in_list_view: 1 },
						{ fieldname: "one_line_tabs", fieldtype: "Check", label: __("One Line"), in_list_view: 1 },
					],
				},
			],
			primary_action_label: __("Save"),
			primary_action(values) {
				frappe.call({
					method: METHOD_SAVE,
					args: {
						doctype,
						styles: values.styles || [],
					},
					freeze: true,
				}).then((r) => {
					cache[doctype] = r.message || [];
					apply_styles(frm, cache[doctype]);
					dialog.hide();
					frappe.show_alert({ message: __("Tab styles saved"), indicator: "green" });
				});
			},
		});

		dialog.show();
	}

	install_base_css();
	if (frappe.router?.on) {
		frappe.router.on("change", () => {
			setTimeout(() => apply_current_form(true), 300);
			setTimeout(() => apply_current_form(true), 900);
		});
	}
	setInterval(() => apply_current_form(false), 1200);
})();
