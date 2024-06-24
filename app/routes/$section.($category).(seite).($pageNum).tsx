import { LoaderFunction, MetaFunction, json } from "@remix-run/node"
import { useLoaderData, useParams } from "@remix-run/react"
import { Masonry } from "react-plock";
import FeedItem from "~/components/forPages/FeedItem";
import PaginationComp from "~/components/forPages/PaginationComp";
import { PUBLIC_CONFIG } from "~/config";
import { contentTypesAndItemsPerRequestByParams } from "~/serverOnly/forLoader/forLoaderUtils.server";
import { handleDataFeedRequest } from "~/serverOnly/forLoader/handleDataFeedRequest.server";

import { prettyFeed } from "~/utils/forContent";
import { textAndMetasForFeedRoutesByParams } from "~/utils/forMetasAndTitles";
import { removeTrailingSlash } from "~/utils/misc";

const { PAGE_HANDLES: { FEED }, DOMAIN_NAME, DEFAULT_OG_IMAGE, ENTRIES_SHOWN_IN_FEED, MASONRY_CONFIG } = PUBLIC_CONFIG


export const handle = {
    page: FEED
}


export const meta: MetaFunction = ({ params, location }) => {
    const { title, metaDescription } = textAndMetasForFeedRoutesByParams(params)
    const { pathname } = location
    return [
        { title },
        { name: "description", content: metaDescription },
        {
            tagName: "link",
            rel: "canonical",
            href: DOMAIN_NAME + removeTrailingSlash(pathname),
        },
        {
            property: "og:image",
            content: DEFAULT_OG_IMAGE()
        }
    ]
}


export const loader: LoaderFunction = async ({ params }) => {
    const { pageNum } = params
    const contentTypesAndItemsPerRequest = contentTypesAndItemsPerRequestByParams(params)
    const { requestedContentTypes, itemsPerRequest } = contentTypesAndItemsPerRequest
    const offset = parseInt(pageNum ?? '0') * ENTRIES_SHOWN_IN_FEED
    const res = await handleDataFeedRequest({
        requestedContentTypes,
        itemsPerRequest,
        offset
    })
    return json(res)
}


export default function SectionRoute() {
    const params = useParams()
    const loaderData = useLoaderData<typeof loader>()
    const feed = prettyFeed(loaderData?.feed)
    const { h1 } = textAndMetasForFeedRoutesByParams(params)

    return (
        <main className="page_feed">
            <div className="title_frame">
                <h1 className="sp">{h1}</h1>
            </div>
            <Masonry
                className="masonry"
                items={feed}
                render={(it, ind) => (
                    <FeedItem
                        position={ind}
                        key={it.canonical}
                        contentItem={it}
                        showCatLink={params?.category === undefined}
                    />
                )}
                config={MASONRY_CONFIG}
            />
            <PaginationComp idx={loaderData.idx} params={params} />
        </main>
    )
}