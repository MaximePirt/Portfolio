// Anchors of the page, in page order. Shared by the header capsule and the mobile menu.
export const NAV_ITEMS = [
	{ id: 'home', labelKey: 'nav.home' },
	{ id: 'presentation', labelKey: 'nav.presentation' },
	{ id: 'project', labelKey: 'nav.projects' },
	{ id: 'activity', labelKey: 'nav.activity' },
	{ id: 'contact', labelKey: 'nav.contact' },
]

export const SECTION_IDS = NAV_ITEMS.map((item) => item.id)
