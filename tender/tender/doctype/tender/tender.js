frappe.ui.form.on("Tender", {
	refresh(frm) {
		apply_tender_tab_fallback(frm);
		setTimeout(() => apply_tender_tab_fallback(frm), 300);
	},
	onload_post_render(frm) {
		apply_tender_tab_fallback(frm);
		setTimeout(() => apply_tender_tab_fallback(frm), 300);
	},
});

function apply_tender_tab_fallback(frm) {
	if (window.tender_form_tab_style) {
		window.tender_form_tab_style.apply_current_form(true);
	}

	if (!document.getElementById("tender-tab-fallback-style")) {
		const style = document.createElement("style");
		style.id = "tender-tab-fallback-style";
		style.textContent = `
			.tender-fallback-tabs {
				display: flex !important;
				flex-wrap: nowrap !important;
				gap: 5px !important;
				width: 100% !important;
			}
			.tender-fallback-tabs > li,
			.tender-fallback-tabs > .nav-item {
				flex: 1 1 0 !important;
				min-width: 0 !important;
			}
			.tender-fallback-tabs a,
			.tender-fallback-tabs .nav-link {
				align-items: center !important;
				background: #f4f4f4 !important;
				border: 0 !important;
				border-radius: 3px !important;
				color: #4d555a !important;
				display: flex !important;
				flex-direction: column !important;
				font-size: 10.5px !important;
				font-weight: 700 !important;
				gap: 5px !important;
				height: 74px !important;
				justify-content: center !important;
				line-height: 1.3 !important;
				min-width: 0 !important;
				padding: 9px 5px !important;
				text-align: center !important;
				width: 100% !important;
			}
			.tender-fallback-tabs a.active,
			.tender-fallback-tabs a[aria-selected="true"],
			.tender-fallback-tabs .nav-link.active,
			.tender-fallback-tabs .nav-link[aria-selected="true"],
			.tender-fallback-tabs .nav-item.active > a,
			.tender-fallback-tabs .nav-item.active > .nav-link {
				background: #2f8b5d !important;
				color: #ffffff !important;
			}
			.tender-fallback-tabs a.active *,
			.tender-fallback-tabs a[aria-selected="true"] *,
			.tender-fallback-tabs .nav-link.active *,
			.tender-fallback-tabs .nav-link[aria-selected="true"] *,
			.tender-fallback-tabs .nav-item.active > a *,
			.tender-fallback-tabs .nav-item.active > .nav-link * {
				color: #ffffff !important;
				stroke: #ffffff !important;
			}
			.tender-fallback-icon,
			.tender-fallback-icon svg {
				display: block !important;
				height: 22px !important;
				width: 22px !important;
			}
		`;
		document.head.appendChild(style);
	}

	const icons = ["grid", "clock", "list", "table", "paperclip", "news", "home", "columns"];
	const scope = frm.page?.wrapper ? $(frm.page.wrapper) : frm.$wrapper;
	const tabs = scope.find(
		".form-tabs a.nav-link, .form-tabs a, .form-tabs button, .form-tabs [role='tab'], " +
		".form-tabs-list a.nav-link, .form-tabs-list a, .form-tabs-list button, .form-tabs-list [role='tab']"
	);
	if (!tabs.length) return;

	const container = tabs.first().closest(".form-tabs, .form-tabs-list, ul, nav");
	container.addClass("tender-fallback-tabs");
	container.off("click.tender_fallback").on("click.tender_fallback", "a", () => {
		setTimeout(() => apply_tender_tab_fallback(frm), 50);
	});

	tabs.each(function (index) {
		const tab = $(this);
		const is_active =
			tab.hasClass("active") ||
			tab.hasClass("selected") ||
			tab.attr("aria-selected") === "true" ||
			tab.attr("data-active") === "true" ||
			tab.parent().hasClass("active") ||
			tab.css("font-weight") === "700" ||
			tab.css("font-weight") === "bold";
		const color = is_active ? "#ffffff" : "#4d555a";

		tab.css({
			"align-items": "center",
			"background": is_active ? "#2f8b5d" : "#f4f4f4",
			"border": "0",
			"border-radius": "3px",
			"box-shadow": is_active ? "0 4px 10px rgba(47, 139, 93, 0.28)" : "0 1px 6px rgba(31, 63, 54, 0.05)",
			"color": color,
			"display": "flex",
			"flex-direction": "column",
			"font-size": "10.5px",
			"font-weight": "700",
			"gap": "5px",
			"height": "74px",
			"justify-content": "center",
			"line-height": "1.3",
			"min-width": "0",
			"padding": "9px 5px",
			"text-align": "center",
			"text-decoration": "none",
			"white-space": "normal",
			"width": "100%",
		});
		tab.find("*").css({ color: color, stroke: color });
		tab.children(".tender-fallback-icon").remove();
		tab.prepend(`<span class="tender-fallback-icon" aria-hidden="true">${tender_fallback_icon(icons[index] || "grid")}</span>`);
	});
}

function tender_fallback_icon(name) {
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
