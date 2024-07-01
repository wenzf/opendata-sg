import { Params } from "@remix-run/react"
import { NS_CONTENT_CATEGORY, PUBLIC_CONFIG } from "~/config"

import texts from "~/texts"
import { BreadCrumbBase, ContentCategoryKeys, ContentItemPublic } from "~/types"

const {
    ROUTE_FRAGMENTS: {
        KANTON, STADT, MITTEILUNGEN, POLIZEI, VERNEHMLASSUNGEN, ARTIKEL, SUCHE,
        IMPRESSUM
    },
    PAGE_HANDLES: { FEED, ARTICLE, SEARCH }
} = PUBLIC_CONFIG
const { KTME, KTVE, STME, STPO } = NS_CONTENT_CATEGORY


/**
 * returns content types by param on search route (helper)
 */
export const contentCategoryBySearchLocationParam = (
    searchLocation: string | undefined
): ContentCategoryKeys[] | null => {
    if (!searchLocation) return Object.keys(NS_CONTENT_CATEGORY) as ContentCategoryKeys[]
    const locationsSplit = searchLocation.split('+')
    const capitalized = locationsSplit.map((it) => it.toUpperCase())
    if (capitalized.every((key) => key in NS_CONTENT_CATEGORY)) {
        return capitalized as ContentCategoryKeys[]
    } else {
        return null
    }
}



const slugByTitle = (title: string): string => {
    const text = title.toLowerCase()
    const allowedChars = new Set("abcdefghijklmnopqrstuvwxyz0123456789 äéöèéü ".split(""));
    const clean = text.split("").filter((char) => allowedChars.has(char)).join("");
    const slug = clean.replaceAll(' ', "-");
    return encodeURIComponent(slug)
}


/**
 * returns path fragments by content types (helper)
 */
export const contentRouteByContentCategory = (
    contentCategory: ContentCategoryKeys
) => {
    let path = ''
    if (contentCategory === KTME) {
        path += `/${KANTON}/${MITTEILUNGEN}`
    } else if (contentCategory === KTVE) {
        path += `/${KANTON}/${VERNEHMLASSUNGEN}`
    } else if (contentCategory === STME) {
        path += `/${STADT}/${MITTEILUNGEN}`
    } else if (contentCategory === STPO) {
        path += `/${STADT}/${POLIZEI}`
    }
    return path
}


export const articlePathByContentCategoryAndPublishedAndTitle = (
    contentCategory: ContentCategoryKeys,
    published: number,
    title: string
) => {
    return `${contentRouteByContentCategory(contentCategory)}/${ARTIKEL}/${published.toString(32)}/${slugByTitle(title)}`
}


const sortByPublished = (a: ContentItemPublic, b: ContentItemPublic) => {
    if (a.published > b.published) return -1;
    if (a.published < b.published) return 1;
    return 0
}


function removeCanonicalDuplicate(
    contentItems: ContentItemPublic[]
): ContentItemPublic[] {
    const seen = new Set<string>();
    const result: ContentItemPublic[] = [];
    for (const obj of contentItems) {
        const key = obj.canonical;
        if (!seen.has(key)) {
            seen.add(key);
            result.push(obj);
        }
    }
    return result;
}

/**
 * sort feed times by date and remvoe duplicates
 */
export const prettyFeed = (
    contentItems: ContentItemPublic[]
): ContentItemPublic[] => {
    if (!contentItems?.length) return []
    const pretty = removeCanonicalDuplicate(contentItems)
    return pretty.sort(sortByPublished)
}


export const contentTypeByParams = (
    params: Params
): null | ContentCategoryKeys => {
    const { section, category } = params;
    if (!section || !category) return null
    if (section === KANTON) {
        if (category === MITTEILUNGEN) {
            return KTME
        } else if (category === VERNEHMLASSUNGEN) {
            return KTVE
        } else {
            return null
        }
    } if (section === STADT) {
        if (category === POLIZEI) {
            return STPO
        } else if (category === MITTEILUNGEN) {
            return STME
        } else {
            return null
        }
    } else {
        return null
    }
}

/**
 * pre configure breadcrumbs
 */
export const createBreadCrumbProps = ({ params, page }: {
    params: Params
    page: keyof typeof PUBLIC_CONFIG.PAGE_HANDLES
}): BreadCrumbBase[] => {
    const { section, category, pageNum, searchTerm } = params
    const {
        labels: { nav: { Kanton, Stadt, Mitteilungen, Vernehmlassungen, Artikel,
            Polizei, Home, Seite, Suche, Begriff, Impressum } }
    } = texts

    const breadCrumbRoot: BreadCrumbBase[] = [{ label: Home, path: "/" }]

    if (page === PUBLIC_CONFIG.PAGE_HANDLES.IMPRESSUM) {
        breadCrumbRoot.push({
            label: Impressum,
            path: `/${IMPRESSUM}`
        })
    } else if (page === FEED || page === ARTICLE) {
        if (section === STADT) {
            breadCrumbRoot.push({
                label: Stadt,
                path: `/${STADT}`
            })
            if (category === MITTEILUNGEN) {
                breadCrumbRoot.push({
                    label: Mitteilungen,
                    path: `/${STADT}/${MITTEILUNGEN}`
                })
            } else if (category === POLIZEI) {
                breadCrumbRoot.push({
                    label: Polizei,
                    path: `/${STADT}/${POLIZEI}`
                })
            }
        } else if (section === KANTON) {
            breadCrumbRoot.push({
                label: Kanton,
                path: `/${KANTON}`
            })
            if (category === MITTEILUNGEN) {

                breadCrumbRoot.push({
                    label: Mitteilungen,
                    path: `/${KANTON}/${MITTEILUNGEN}`
                })
            } else if (category === VERNEHMLASSUNGEN) {
                breadCrumbRoot.push({
                    label: Vernehmlassungen,
                    path: `/${KANTON}/${VERNEHMLASSUNGEN}`
                })
            }
        }
        if (page === FEED) {
            if (pageNum) {
                breadCrumbRoot.push({
                    label: `${Seite} ${pageNum}`
                })
            }
        } else if (page === ARTICLE) {
            breadCrumbRoot.push({
                label: Artikel
            })
        }
    } else if (page === SEARCH) {
        breadCrumbRoot.push({
            label: Suche,
            path: `/${SUCHE}`
        })
        if (searchTerm) {
            breadCrumbRoot.push({
                label: `${Begriff} "${searchTerm}"`,
            })
        }
    }
    return breadCrumbRoot
}