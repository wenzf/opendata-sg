import invariant from "tiny-invariant";
import { BACKEND_CONFIG } from "~/config/backend.server"
import { APIResponse, DataAPI, FetchAPI } from "~/types"

invariant('SESSION_SECRET', 'SESSION_SECRET not set')


const {
    DATA_API: {
        PARAMS: {
            OFFSET,
            WHERE,
            SELECT_ITEMS_DEFAULT,
            SELECT_ITEMS_NO_IMAGE,
            LIMIT,
            ORDER_BY_PROP,
            SELECT
        }
    }
} = BACKEND_CONFIG;


/**
 * search params for API (helper)
 */
const constructParams = (params: string[]) => {
    let paramsFragments = ''
    for (let i = 0; i < params.length; i += 1) {
        if (i > 0) paramsFragments += '&'
        paramsFragments += params[i]
    }
    return paramsFragments
}


/**
 *  fetch API (helper)
 */
const fetchAPI = async ({
    endpoint,
    params,
    offset
}: FetchAPI): Promise<APIResponse | null> => {
    try {
        let path = endpoint + constructParams(params)
        if (offset) path += OFFSET + offset
        const res = await fetch(new URL(path))
        const toJson = await res.json();
        if (toJson) return toJson
        return null
    } catch (error: Error | unknown) {
        return null
    }
}

/**
 *  get API data by configuration
 */
export const dataAPI = async ({
    ...props
}: DataAPI) => {
    const {
        offset,
        endpoint,
        limit,
        includeImage,
    } = props
    const select = includeImage ? SELECT_ITEMS_DEFAULT : SELECT_ITEMS_NO_IMAGE
    const nextYear = new Date().getUTCFullYear() + 1
    const where = WHERE + encodeURIComponent(`published < ${nextYear}`) // exclude wrong entries dated in far future
    const res = await fetchAPI({
        endpoint: endpoint,
        params: [
            where,
            LIMIT + limit,
            ORDER_BY_PROP.replace('{{PROP}}', 'published'),
            SELECT + select
        ],
        offset
    })
    if (res) return res
    return res
}