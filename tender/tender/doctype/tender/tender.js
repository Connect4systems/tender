frappe.ui.form.on("Tender", {
	refresh(frm) {
		set_tender_hijri_dates(frm, true);
		attach_tender_hijri_date_pickers(frm);
		apply_tender_tab_fallback(frm);
		setTimeout(() => apply_tender_tab_fallback(frm), 300);
	},
	onload_post_render(frm) {
		set_tender_hijri_dates(frm, true);
		attach_tender_hijri_date_pickers(frm);
		apply_tender_tab_fallback(frm);
		setTimeout(() => apply_tender_tab_fallback(frm), 300);
	},
	gregorian_date(frm) {
		set_tender_hijri_date(frm, "gregorian_date", "hijri_date");
	},
	offer_gregorian_date(frm) {
		set_tender_hijri_date(frm, "offer_gregorian_date", "offer_hijri_date");
	},
	open_gregorian_date(frm) {
		set_tender_hijri_date(frm, "open_gregorian_date", "open_hijri_date");
	},
	screening_gregorian_date(frm) {
		set_tender_hijri_date(frm, "screening_gregorian_date", "screening_hijri_date");
	},
});

function set_tender_hijri_dates(frm, only_if_empty = false) {
	const date_pairs = [
		["gregorian_date", "hijri_date"],
		["offer_gregorian_date", "offer_hijri_date"],
		["open_gregorian_date", "open_hijri_date"],
		["screening_gregorian_date", "screening_hijri_date"],
	];

	date_pairs.forEach(([gregorian_field, hijri_field]) => {
		set_tender_hijri_date(frm, gregorian_field, hijri_field, only_if_empty);
	});
}

function set_tender_hijri_date(frm, gregorian_field, hijri_field, only_if_empty = false) {
	if (only_if_empty && frm.doc[hijri_field]) return;

	const hijri_date = tender_gregorian_to_hijri(frm.doc[gregorian_field]);

	if ((frm.doc[hijri_field] || "") !== hijri_date) {
		frm.set_value(hijri_field, hijri_date);
	}
}

function tender_gregorian_to_hijri(gregorian_date) {
	if (!gregorian_date) return "";

	const date = new Date(`${gregorian_date}T00:00:00`);
	if (Number.isNaN(date.getTime())) return "";

	const parts = tender_gregorian_to_hijri_parts(date);

	return parts ? tender_format_hijri_date(parts) : "";
}

function tender_gregorian_to_hijri_parts(date) {
	if (!date || Number.isNaN(date.getTime())) return null;

	const formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
	const month_formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
		month: "long",
	});
	const parts = Object.fromEntries(
		formatter.formatToParts(date)
			.filter((part) => ["day", "month", "year"].includes(part.type))
			.map((part) => [part.type, tender_digits(part.value)])
	);
	const month_name = month_formatter.format(date);

	if (!parts.year || !parts.month || !parts.day) return null;

	return {
		day: Number(parts.day),
		month: Number(parts.month),
		month_name,
		year: Number(parts.year),
		gregorian_date: date,
	};
}

function tender_format_hijri_date(parts) {
	return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function tender_digits(value) {
	return String(value || "").replace(/\D/g, "");
}

function attach_tender_hijri_date_pickers(frm) {
	add_tender_hijri_picker_style();

	const date_pairs = [
		["gregorian_date", "hijri_date"],
		["offer_gregorian_date", "offer_hijri_date"],
		["open_gregorian_date", "open_hijri_date"],
		["screening_gregorian_date", "screening_hijri_date"],
	];

	date_pairs.forEach(([gregorian_field, hijri_field]) => {
		const control = frm.fields_dict[hijri_field];
		const input = control?.$input?.get(0);

		if (!input || input.dataset.tenderHijriPickerAttached) return;

		input.dataset.tenderHijriPickerAttached = "1";
		input.setAttribute("autocomplete", "off");
		input.addEventListener("focus", () => show_tender_hijri_picker(frm, gregorian_field, hijri_field, input));
		input.addEventListener("click", () => show_tender_hijri_picker(frm, gregorian_field, hijri_field, input));
	});
}

function show_tender_hijri_picker(frm, gregorian_field, hijri_field, input) {
	close_tender_hijri_picker();

	const anchor = tender_get_hijri_picker_anchor(frm, gregorian_field, hijri_field);
	const state = {
		frm,
		hijri_field,
		input,
		month: anchor.month,
		year: anchor.year,
	};
	const picker = document.createElement("div");
	picker.className = "tender-hijri-picker";
	picker.dataset.tenderHijriPicker = "1";
	document.body.appendChild(picker);

	render_tender_hijri_picker(picker, state);
	position_tender_hijri_picker(picker, input);

	setTimeout(() => {
		document.addEventListener("mousedown", tender_hijri_picker_outside_click);
		window.addEventListener("resize", close_tender_hijri_picker);
		window.addEventListener("scroll", close_tender_hijri_picker, true);
	}, 0);
}

function tender_get_hijri_picker_anchor(frm, gregorian_field, hijri_field) {
	const manual = tender_parse_hijri_value(frm.doc[hijri_field]);
	if (manual) return manual;

	const gregorian_value = frm.doc[gregorian_field];
	const gregorian_date = gregorian_value ? new Date(`${gregorian_value}T00:00:00`) : new Date();
	const parts = tender_gregorian_to_hijri_parts(gregorian_date);

	return parts || tender_gregorian_to_hijri_parts(new Date());
}

function tender_parse_hijri_value(value) {
	const text = String(value || "").trim();
	const numeric = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/) || text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
	if (numeric) {
		const year_first = numeric[1].length === 4;
		return {
			year: Number(year_first ? numeric[1] : numeric[3]),
			month: Number(numeric[2]),
			day: Number(year_first ? numeric[3] : numeric[1]),
		};
	}

	const year = Number((text.match(/\b(13|14|15)\d{2}\b/) || [])[0]);
	const day = Number((text.match(/\b\d{1,2}\b/) || [])[0]);
	const month = tender_hijri_months().findIndex((month_name) => text.toLowerCase().includes(month_name.toLowerCase())) + 1;

	return year && month ? { year, month, day: day || 1 } : null;
}

function render_tender_hijri_picker(picker, state) {
	const months = tender_hijri_months();
	const dates = tender_find_hijri_month_dates(state.year, state.month);
	const selected_day = tender_parse_hijri_value(state.frm.doc[state.hijri_field])?.day;
	const first_weekday = dates[0]?.gregorian_date.getDay() || 0;
	const blanks = Array.from({ length: first_weekday }, () => '<button type="button" class="tender-hijri-empty" tabindex="-1"></button>');
	const days = dates.map((parts) => {
		const active = parts.day === selected_day ? " tender-hijri-active" : "";
		return `<button type="button" class="tender-hijri-day${active}" data-day="${parts.day}">${parts.day}</button>`;
	});

	picker.innerHTML = `
		<div class="tender-hijri-header">
			<button type="button" class="tender-hijri-nav" data-action="prev" aria-label="Previous month">${tender_chevron_left()}</button>
			<select class="tender-hijri-month" aria-label="Hijri month">
				${months.map((month, index) => `<option value="${index + 1}" ${index + 1 === state.month ? "selected" : ""}>${month}</option>`).join("")}
			</select>
			<input class="tender-hijri-year" type="number" min="1300" max="1600" value="${state.year}" aria-label="Hijri year">
			<button type="button" class="tender-hijri-nav" data-action="next" aria-label="Next month">${tender_chevron_right()}</button>
		</div>
		<div class="tender-hijri-weekdays">
			<span>SU</span><span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span>
		</div>
		<div class="tender-hijri-days">${blanks.join("")}${days.join("")}</div>
	`;

	picker.querySelector('[data-action="prev"]').addEventListener("click", () => {
		state.month -= 1;
		if (state.month < 1) {
			state.month = 12;
			state.year -= 1;
		}
		render_tender_hijri_picker(picker, state);
	});
	picker.querySelector('[data-action="next"]').addEventListener("click", () => {
		state.month += 1;
		if (state.month > 12) {
			state.month = 1;
			state.year += 1;
		}
		render_tender_hijri_picker(picker, state);
	});
	picker.querySelector(".tender-hijri-month").addEventListener("change", (event) => {
		state.month = Number(event.target.value);
		render_tender_hijri_picker(picker, state);
	});
	picker.querySelector(".tender-hijri-year").addEventListener("change", (event) => {
		state.year = Number(event.target.value) || state.year;
		render_tender_hijri_picker(picker, state);
	});
	picker.querySelectorAll(".tender-hijri-day").forEach((button) => {
		button.addEventListener("click", () => {
			const selected = dates.find((parts) => parts.day === Number(button.dataset.day));
			if (!selected) return;

			state.frm.set_value(state.hijri_field, tender_format_hijri_date(selected));
			close_tender_hijri_picker();
		});
	});
}

function tender_find_hijri_month_dates(year, month) {
	const approximate = tender_approximate_gregorian_from_hijri(Number(year), Number(month), 15);
	const dates = [];

	for (let offset = -50; offset <= 50; offset += 1) {
		const date = new Date(approximate);
		date.setDate(approximate.getDate() + offset);
		const parts = tender_gregorian_to_hijri_parts(date);
		if (parts?.year === Number(year) && parts.month === Number(month)) {
			dates.push(parts);
		}
	}

	return dates.sort((first, second) => first.day - second.day);
}

function tender_approximate_gregorian_from_hijri(year, month, day) {
	const jd = Math.floor(day + Math.ceil(29.5 * (month - 1)) + (year - 1) * 354 + Math.floor((3 + 11 * year) / 30) + 1948438.5);
	let l = jd + 68569;
	const n = Math.floor((4 * l) / 146097);
	l -= Math.floor((146097 * n + 3) / 4);
	const i = Math.floor((4000 * (l + 1)) / 1461001);
	l = l - Math.floor((1461 * i) / 4) + 31;
	const j = Math.floor((80 * l) / 2447);
	const gregorian_day = l - Math.floor((2447 * j) / 80);
	l = Math.floor(j / 11);
	const gregorian_month = j + 2 - 12 * l;
	const gregorian_year = 100 * (n - 49) + i + l;

	return new Date(gregorian_year, gregorian_month - 1, gregorian_day);
}

function tender_hijri_months() {
	if (window.tender_hijri_month_names) return window.tender_hijri_month_names;

	window.tender_hijri_month_names = [];
	for (let month = 1; month <= 12; month += 1) {
		const dates = tender_find_hijri_month_dates(1447, month);
		window.tender_hijri_month_names.push(dates[0]?.month_name || String(month).padStart(2, "0"));
	}

	return window.tender_hijri_month_names;
}

function position_tender_hijri_picker(picker, input) {
	const rect = input.getBoundingClientRect();
	picker.style.left = `${rect.left + window.scrollX}px`;
	picker.style.top = `${rect.bottom + window.scrollY + 8}px`;
	picker.style.minWidth = `${Math.max(rect.width, 316)}px`;
}

function close_tender_hijri_picker() {
	document.querySelectorAll("[data-tender-hijri-picker]").forEach((picker) => picker.remove());
	document.removeEventListener("mousedown", tender_hijri_picker_outside_click);
	window.removeEventListener("resize", close_tender_hijri_picker);
	window.removeEventListener("scroll", close_tender_hijri_picker, true);
}

function tender_hijri_picker_outside_click(event) {
	if (event.target.closest("[data-tender-hijri-picker]")) return;
	close_tender_hijri_picker();
}

function add_tender_hijri_picker_style() {
	if (document.getElementById("tender-hijri-picker-style")) return;

	const style = document.createElement("style");
	style.id = "tender-hijri-picker-style";
	style.textContent = `
		.tender-hijri-picker {
			background: #ffffff;
			border: 1px solid #e5e7eb;
			border-radius: 12px;
			box-shadow: 0 14px 34px rgba(15, 23, 42, 0.16);
			padding: 12px;
			position: absolute;
			z-index: 2000;
		}
		.tender-hijri-header {
			align-items: center;
			display: grid;
			gap: 8px;
			grid-template-columns: 32px minmax(0, 1fr) 78px 32px;
			margin-bottom: 12px;
		}
		.tender-hijri-nav,
		.tender-hijri-day,
		.tender-hijri-empty {
			align-items: center;
			background: transparent;
			border: 0;
			border-radius: 6px;
			color: #333333;
			display: inline-flex;
			height: 36px;
			justify-content: center;
			padding: 0;
		}
		.tender-hijri-nav {
			color: #8a8f94;
		}
		.tender-hijri-nav:hover,
		.tender-hijri-day:hover {
			background: #f1f3f5;
		}
		.tender-hijri-month,
		.tender-hijri-year {
			background: #f8f9fa;
			border: 1px solid #e5e7eb;
			border-radius: 8px;
			color: #333333;
			height: 36px;
			min-width: 0;
			padding: 0 8px;
		}
		.tender-hijri-weekdays,
		.tender-hijri-days {
			display: grid;
			grid-template-columns: repeat(7, 1fr);
			text-align: center;
		}
		.tender-hijri-weekdays {
			color: #555b61;
			font-size: 12px;
			font-weight: 600;
			margin-bottom: 6px;
		}
		.tender-hijri-weekdays span {
			line-height: 28px;
		}
		.tender-hijri-day {
			font-size: 14px;
		}
		.tender-hijri-active {
			background: #2f8b5d;
			color: #ffffff;
			font-weight: 700;
		}
		.tender-hijri-active:hover {
			background: #287a51;
		}
		.tender-hijri-empty {
			pointer-events: none;
		}
		.tender-hijri-nav svg {
			height: 18px;
			width: 18px;
		}
	`;
	document.head.appendChild(style);
}

function tender_chevron_left() {
	return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
}

function tender_chevron_right() {
	return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';
}

function apply_tender_tab_fallback(frm) {
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
		tab.children(".tender-fallback-icon, .form-tab-style-icon").remove();
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
