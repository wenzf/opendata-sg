export const PUBLIC_CONFIG = Object.freeze({
    SITE_NAME: 'OpenData St. Gallen',
    DOMAIN_NAME: 'https://odsg.ch',
    DOMAIN_NAME_DEV: 'http://localhost:3333',
    ROUTE_FRAGMENTS: {
        MITTEILUNGEN: 'mitteilungen',
        VERNEHMLASSUNGEN: 'vernehmlassungen',
        KANTON: 'kanton',
        STADT: 'stadt',
        SUCHE: 'suche',
        SEITE: 'seite',
        POLIZEI: 'polizei',
        NOT_FOUND: '/404',
        ARTIKEL: 'artikel',
        BEGRIFF: 'begriff',
        IMPRESSUM: 'impressum'
    },
    ENTRIES_SHOWN_IN_FEED: 2,
    STYLES: {
        FEED: {
            IMAGE_MAX_WIDTH_LOW: 420,
            IMAGE_MAX_WIDTH_HIGH: 840
        },
        ARTICLE: {
            IMAGE_MAX_WIDTH_LOW: 512,
            IMAGE_MAX_WIDTH_HIGH: 1240
        }
    },
    MASONRY_CONFIG: {
        columns: [1, 2, 3, 4],
        gap: [12, 16, 16, 16],
        media: [512, 768, 1024, 1240],
    },
    PAGE_HANDLES: {
        HOME: 'HOME',
        SEARCH: 'SEARCH',
        ARTICLE: 'ARTICLE',
        FEED: 'FEED'
    },
    DEFAULT_OG_IMAGE(): string {
        return PUBLIC_CONFIG.DOMAIN_NAME + '/_static/icons/android-chrome-512x512.png'
    }
})


export const NS_CONTENT_CATEGORY = Object.freeze({
    KTME: "KTME",
    KTVE: "KTVE",
    STPO: "STPO",
    STME: "STME"
})


export const NS_CONTENT_ITEM_PUBLIC = Object.freeze({
    title: "title",
    intro: "intro",
    body: "body",
    published: "published",
    content_category: "content_category",
    original_link: "orginal_link",
    image: "image",
    views_human: "views_human",
    views_bot: "views_bot",
    image_url: "image_url",
    image_dimensions: "image_dimensions",
    color_summary: "color_summary",
    alt_description: "alt_description",
    canonical: "canonical"
})


export const KEYWORDS_TO_BE_REMOVED_FROM_SEARCH_TEXT = [
    "das", "und", "wer", "was", "wo", "wie", "mit", "auf", "an", "warum", "darum",
    "um", "im", "in", "ist", "hat", "sind", "haben", "wir", "haben", "uns", "aber",
    "kann", "können", "für", "auch", "den", "der", "die", "dies", "diese", "diesen",
    "dieser", "dem", "zu", "zum", "zur"
]


export const SPECIAL_CHARS_TO_BE_REMOVED_FROM_SEARCH_TEXT = [
    " .", ". ", ",", ":", "\"", "'", "?", "!", "<p>", "</p>", "<div>", "</div>", "<ul>",
    "</ul>", "<li>", "</li>", "<strong>", "</strong>", "<b>", "<b/>", "<ol>", "</ol>",
    "<span>", "</span>", "<a href=mailto", "</a>", "(", ")", "[", "]", "/", "<h2>",
    "</h2>", "&nbsp;"
]

export const SHARE_OPTIONS = {
    LINKEDIN: {
        
    }
}

export const ThemeOptions = {
    light: 'light',
    dark: 'dark'
}