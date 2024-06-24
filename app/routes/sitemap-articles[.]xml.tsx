import type { LoaderFunction } from "@remix-run/node";
import { NS_CONTENT_CATEGORY, PUBLIC_CONFIG } from "~/config";
import { dbGetContentListForCommonSitemap } from "~/serverOnly/dynamoDB/dbmain.server";
import { ContentCategoryKeys } from "~/types";
import { isoTimeByUnixEpoch } from "~/utils/time";


export const loader: LoaderFunction = async () => {
    const { DOMAIN_NAME } = PUBLIC_CONFIG;
    const allCats: ContentCategoryKeys[] = Object.values(NS_CONTENT_CATEGORY)
    const allCalls = []
    for (let i = 0; i < allCats.length; i += 1) {
        allCalls.push(dbGetContentListForCommonSitemap({ pk: allCats[i] }))
    }
    const allRes = await Promise.all(allCalls)
    const allResFlat = allRes.flat()

    let urlSet = ''
    for (let i = 0; i < allResFlat.length; i += 1) {
        const isoDate = isoTimeByUnixEpoch(allResFlat[i].published)
        const oneEntry = `<url><loc>${encodeURI(DOMAIN_NAME + allResFlat[i].canonical)}</loc><lastmod>${isoDate}</lastmod></url>`
        urlSet += oneEntry
    }
    
    const markup = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlSet}</urlset>`

    return new Response(markup, {
        status: 200,
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "x-content-type-options": "nosniff",
            "Cache-Control": `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
        },
    });
}

