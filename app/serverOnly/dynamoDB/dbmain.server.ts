import arc from "@architect/functions";
import invariant from 'tiny-invariant'
import { NS_CONTENT_ITEM_PUBLIC } from "~/config";
import { BACKEND_CONFIG, dbIndexInit } from "~/config/backend.server";
import {
    AsyncSuccess, ContentCategoryKeys, ContentItemInternal, ContentItemPublic,
    DbUpdateIndexProps, DdbIndex
} from "~/types";


invariant('SESSION_SECRET', 'SESSION_SECRET not set')


/**
 * store any data to db
 */
export async function dbPutAny({ pk, sk, payload }: {
    pk: string,
    sk: number,
    payload: Record<string, string | number> | DdbIndex
}) {
    const db = await arc.tables();
    const res = await db.main.put({ pk, sk, ...payload })
    return res
}


/**
 * data for feeds; reduced, without article body
 */
export async function dbGetContentList({ pk, limit }: {
    pk: ContentCategoryKeys,
    limit: number
}): Promise<ContentItemPublic[]> {
    const db = await arc.tables();
    const res = await db.main.query({
        Limit: limit,
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: { ":pk": pk },
        ScanIndexForward: false,
        ProjectionExpression: Object.values(NS_CONTENT_ITEM_PUBLIC).map((it) => it).toString().replace('body,', '')
    })
    if (res) return res?.Items
    return []
}

/**
 * data for paginated feed requests; reduced, without article body
 */
export async function dbGetContentListPaginated({ pk, positionLow, positionHigh }: {
    pk: ContentCategoryKeys,
    positionLow: number,
    positionHigh: number
}): Promise<ContentItemPublic[]> {
    const db = await arc.tables();
    const res = await db.main.query({
        FilterExpression: "index_position > :positionLow AND index_position < :positionHigh",
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: { ":pk": pk, ":positionLow": positionLow - 1, ":positionHigh": positionHigh + 1 },
        ScanIndexForward: false,
        ProjectionExpression: Object.values(NS_CONTENT_ITEM_PUBLIC).map((it) => it).toString().replace('body,', '')
    })
    if (res) return res?.Items
    return []
}


/**
 * data for searches; reduced, without article body
 */
export async function dbGetContentListSearch({ pk, searchTerm, lastEvaluatedKey }: {
    pk: ContentCategoryKeys
    searchTerm: string
    lastEvaluatedKey?: string
}): Promise<ContentItemPublic[] | null> {
    let optionalLast = {}
    if (lastEvaluatedKey) optionalLast = { ExclusiveStartKey: { pk, sk: lastEvaluatedKey } };
    const db = await arc.tables();
    const res = await db.main.query({
        FilterExpression: "contains (search_string, :search_string)",
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: { ":pk": pk, ":search_string": decodeURIComponent(searchTerm) },
        ScanIndexForward: false,
        ProjectionExpression: Object.values(NS_CONTENT_ITEM_PUBLIC).map((it) => it).toString().replace('body,', ''),
        ...optionalLast
    })
    if (res) return res.Items
    return null
}


/**
 * reduced set for news sitemap
 */
export async function dbGetContentListForNewsSitemap({ pk }: {
    pk: ContentCategoryKeys
}): Promise<ContentItemPublic[]> {
    const db = await arc.tables();
    const nowPlusTwoDays = Date.now() + 172_800_000 // 2 days
    const res = await db.main.query({
        FilterExpression: "published < :published",
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: { ":pk": pk, ":published": nowPlusTwoDays },
        ScanIndexForward: false,
        ProjectionExpression: 'title, published, canonical',
    })
    if (res) return res.Items
    return res
}

/**
 * reduced set for common sitemap
 */
export async function dbGetContentListForCommonSitemap({ pk }: {
    pk: ContentCategoryKeys
}): Promise<ContentItemPublic[]> {
    const db = await arc.tables();
    const res = await db.main.query({
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: { ":pk": pk },
        ScanIndexForward: false,
        ProjectionExpression: 'published, canonical',
    })
    if (res) return res.Items
    return []
}

/**
 * bulk put content items
 */
export async function dbPutContentBulk(bulk: ContentItemInternal[]) {
    const db = await arc.tables();
    for (let i = 0; i < bulk.length; i += 1) {
        const oneItem = bulk[i]
        const payload = {
            ...oneItem,
            pk: oneItem.content_category,
            sk: oneItem.published
        }
        await db.main.put(payload)
    }
    return 'ok'
}

/**
 * get one content item
 */
export async function dbGetContent({ pk, sk }: {
    pk: ContentCategoryKeys,
    sk: number
}): Promise<ContentItemPublic | null> {
    const db = await arc.tables();
    const dat = await db.main.get({ pk, sk })
    if (dat) return dat
    return null
}


/**
 * get index file, seed if none is present for init
 */
export async function dbGetIndex(): Promise<DdbIndex | null> {
    try {
        const db = await arc.tables();
        const dat = await db.main.get(BACKEND_CONFIG.DDB.INDEX_PK_SK)
        // init seed
        if (!dat) {
            await dbPutAny({ ...BACKEND_CONFIG.DDB.INDEX_PK_SK, payload: dbIndexInit })
            return dbIndexInit
        } else {
            return dat
        }
    } catch {
        return null
    }
}


/**
 * index updater
 */
export async function dbUpdateIndex(
    props: DbUpdateIndexProps[]
): Promise<AsyncSuccess> {
    try {
        const db = await arc.tables();
        let UpdateExpression = 'SET '
        const ExpressionAttributeValues: Record<string, number> = {}
        let counter = 0
        for (let i = 0; i < props.length; i += 1) {
            const { category, update } = props[i]
            for (let j = 0; j < update.length; j += 1) {
                UpdateExpression += `${category}.${update[j][0]} = :i${counter}, `
                ExpressionAttributeValues[`:i${counter}`] = update[j][1]
                counter += 1
            }
        }
        UpdateExpression = UpdateExpression.slice(0, -2)
        const res = await db.main.update({
            Key: BACKEND_CONFIG.DDB.INDEX_PK_SK,
            UpdateExpression,
            ExpressionAttributeValues
        })
        // @ts-expect-error wrong type in arc
        const statusCode = res?.$metadata?.httpStatusCode
        if (statusCode === 200) return { success: true }
        return { success: false }
    } catch {
        return { success: false }
    }
}


/**
 * counter updater
 */
export async function dbUpdateContentItemCounter({ pk, sk, human }: {
    pk: ContentCategoryKeys, sk: number, human: boolean
}) {
    try {
        const db = await arc.tables();
        const itemToUpdate = human ? 'views_human' : 'views_bot'
        const res = await db.main.update({
            Key: { pk, sk },
            UpdateExpression: `SET ${itemToUpdate} = ${itemToUpdate} +:i`,
            ExpressionAttributeValues: { ":i": 1 }
        })
        return res
    } catch {
        return null
    }
}


/*
// scan for dev
export async function dbScanMain(startKey?: string) {
    let optional = {};
    if (startKey) optional = { ExclusiveStartKey: startKey }
    const db = await arc.tables();
    const dat = await db.main.scan({
        Limit: 200,
        //  ProjectionExpression: 'user_name, user_name_path',
        ...optional,

    })
    return dat
}
*/