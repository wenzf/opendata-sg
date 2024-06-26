import { DdbIndex } from "~/types"
import { NS_CONTENT_CATEGORY } from "./index"


export const BACKEND_CONFIG = Object.freeze({
    DATA_API: {
        ENDPOINTS: {
            KANTON_VERNEHMLASSUNGEN: "https://daten.sg.ch/api/explore/v2.1/catalog/datasets/newsfeed-vernehmlassungen-kanton-stgallen/records?",
            KANTON_MITTEILUNGEN: "https://daten.sg.ch/api/explore/v2.1/catalog/datasets/newsfeed-medienmitteilungen-kanton-stgallen/records?",
            STADTPOLIZEI_MITTEILUNGEN: 'https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/newsfeed-stadtpolizei-stgallen-medienmitteilungen/records?',
            STADT_MITTEILUNGEN: 'https://daten.stadt.sg.ch/api/explore/v2.1/catalog/datasets/newsfeed-stadtverwaltung-stgallen/records?'
        },
        PARAMS: {
            WHERE_LIKE_PROP_KEYWORD: "where={{PROP}}%20like%20%22{{KEYWORD}}%22",
            LIMIT: "limit=",
            ORDER_BY_PROP: "order_by={{PROP}}%20DESC",
            SELECT: "select=",
            OFFSET: "&offset=",
            WHERE: "where=",
            SELECT_ITEMS_DEFAULT: encodeURIComponent('published, link, title, bild_url, description, bild'),
            SELECT_ITEMS_NO_IMAGE: encodeURIComponent('published, link, title, description')
        }
    },
    DDB: {
        INDEX_PK_SK: { pk: 'IDX', sk: 1 },
      //  LAST_RESET_PK_SK: { pk: 'IDX', sk: 2 }
    },
    DATA_UPDATE_INTERVAL_TIME_IN_MS: 60 * 1000 * 60 * 6,
    DATA_RESET_INTERVAL_TIME_IN_MS: 1000 * 60 * 60 * 48
})


export const NS_DDB_INDEX_KEYS = Object.freeze({
    total_count: 'total_count',
    last_crawl: 'last_crawl'
})


export const NS_CONTENT_ITEM_INTERNAL = {
    search_string: "search_string",
    index_position: "index_position"
}


export const dbIndexInit: DdbIndex = Object.freeze({
    [NS_CONTENT_CATEGORY.KTME]: {
        [NS_DDB_INDEX_KEYS.total_count]: 0,
        [NS_DDB_INDEX_KEYS.last_crawl]: 0
    },
    [NS_CONTENT_CATEGORY.KTVE]: {
        [NS_DDB_INDEX_KEYS.total_count]: 0,
        [NS_DDB_INDEX_KEYS.last_crawl]: 0
    },
    [NS_CONTENT_CATEGORY.STME]: {
        [NS_DDB_INDEX_KEYS.total_count]: 0,
        [NS_DDB_INDEX_KEYS.last_crawl]: 0
    },
    [NS_CONTENT_CATEGORY.STPO]: {
        [NS_DDB_INDEX_KEYS.total_count]: 0,
        [NS_DDB_INDEX_KEYS.last_crawl]: 0
    },
    last_reset: 0
})
