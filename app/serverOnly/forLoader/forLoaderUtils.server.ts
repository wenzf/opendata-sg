import { ContentCategoryKeys, DdbIndex } from "~/types";
import { dbGetIndex } from "../dynamoDB/dbmain.server";
import { BACKEND_CONFIG } from "~/config/backend.server";
import { Params } from "@remix-run/react";
import { NS_CONTENT_CATEGORY, PUBLIC_CONFIG } from "~/config";
import { json } from "react-router";

export const checkIfDataIsCurrent = async (
    checkItems: ContentCategoryKeys[]
): Promise<{ dataStatus: boolean[], idx: DdbIndex } | null> => {
    const now = Date.now();
    const idx = await dbGetIndex();
    if (idx === null) return null
    const res: boolean[] = []
    for (let i = 0; i < checkItems.length; i += 1) {
        if (now > idx[checkItems[i]].last_crawl + BACKEND_CONFIG.DATA_UPDATE_INTERVAL_TIME_IN_MS) {
            res.push(false)
        } else {
            res.push(true)
        }
    }
    return {
        idx,
        dataStatus: res
    }
}


export const contentTypesAndItemsPerRequestByParams = (params: Params): {
    requestedContentTypes: ContentCategoryKeys[]
    itemsPerRequest: number
} => {
    const { category, section } = params;
    const {
        ROUTE_FRAGMENTS: {
            KANTON,
            STADT,
            MITTEILUNGEN,
            VERNEHMLASSUNGEN,
            POLIZEI
        },
        ENTRIES_SHOWN_IN_FEED
    } = PUBLIC_CONFIG

    const { KTME, KTVE, STME, STPO } = NS_CONTENT_CATEGORY


    let requestedContentTypes: ContentCategoryKeys[]
    let itemsPerRequest = ENTRIES_SHOWN_IN_FEED

    if (section === KANTON) {

        if (!category) {
            requestedContentTypes = [KTME, KTVE]
            itemsPerRequest *= 0.5
        } else if (category === MITTEILUNGEN) {
            requestedContentTypes = [KTME]
        } else if (category === VERNEHMLASSUNGEN) {
            requestedContentTypes = [KTVE]
        } else {
            throw json({}, { status: 404 })
        }


    } else if (section === STADT) {

        if (!category) {
            requestedContentTypes = [STME, STPO]
            itemsPerRequest *= 0.5
        } else if (category === MITTEILUNGEN) {
            requestedContentTypes = [STME]
        } else if (category === POLIZEI) {
            requestedContentTypes = [STPO]
        } else {
            throw json({}, { status: 404 })
        }

    } else {
        throw json({}, { status: 404 })
    }
    return { requestedContentTypes, itemsPerRequest }
}



/*

export const slugFromPath = (path: string): string | null => {
    const splitPath = path.split('/')

    if (splitPath.length === 4) return splitPath[4]

    return null
}

*/