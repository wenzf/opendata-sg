import { NS_CONTENT_CATEGORY } from "~/config"
import { NS_DDB_INDEX_KEYS } from "~/config/backend.server"

/**
 * GENERAL
 */

export type AsyncSuccess = { success: boolean }

export type Theme =  "light" | "dark" | ""


/**
 * DB
 */

export type ContentCategoryKeys = keyof typeof NS_CONTENT_CATEGORY
export type DdbIndexKeys = keyof typeof NS_DDB_INDEX_KEYS
export type DdbIndex = Record<ContentCategoryKeys, Record<DdbIndexKeys, number>, {last_reset: number}>

export type DbUpdateIndexProps = {
    category: ContentCategoryKeys
    update: [DdbIndexKeys, number][]
}


/**
 * CONTENT
 */

export interface ContentImage  {
    image_url: string,
    image_dimensions: number[],
    color_summary: string[],
    alt_description: string
}

export type ImageHTMLProps = {
    image: ContentImage | null
    use_case: "thumbnail" | "article"
    position: number
}


export interface ContentItemPublic {
    title: string
    intro: string
    body: string
    published: number
    content_category: ContentCategoryKeys
    original_link: string
    image: ContentImage | null
    views_human: number
    views_bot: number,
    canonical: string
    
}

export interface ContentItemInternal extends ContentItemPublic {
    search_string: string // lower case, no dots or commas for search
    index_position: number // position API DB for pagination
}


export interface BreadCrumbBase {
    label: string,
    path?: string
    //  position: number,
}

export interface BreadCrumbFragmentProp extends BreadCrumbBase {
    isLast: boolean
    position: number,
}

export interface TextsAndMetas {
    h1: string,
    title: string,
    metaDescription: string
}

/**
 * API
 */

export type APIResponse = {
    total_count: number
    results: APIResult[]
}

export type APIResult = {
    link: string
    title: string
    description: string
    published: string
    bild_url?: string
    bild?: APIBild
}

export type APIBild = {
    thumbnail: boolean
    filename: string
    format: string
    width: number
    mimetype: string
    id: string
    last_synchronized: string
    color_summary: string[]
    height: number
    url: string
}

export interface BaseAPI {
    endpoint: string
    offset?: number
}

export interface FetchAPI extends BaseAPI {
    params: string[]
}

export interface DataAPI extends BaseAPI {
    limit?: number
    includeImage?: boolean
}

export interface DataAPIConfig {
    endpoint: string
    limit: number
    offset: number
    includeImage: boolean
    modificationRule: PrettyMarkupModificationRule[]
    contentCategory: ContentCategoryKeys
}

/**
 * utils
 */

export type PrettyMarkupModificationRule = {
    selector: string;
    replacement: string;
    extractText?: boolean;
    extractAlt?: boolean
    maxLenReplaceText?: number
};