import { LoaderFunction, MetaFunction, json } from "@remix-run/node"
import { useLoaderData, useParams } from "@remix-run/react"
import { Masonry } from "react-plock"
import FeedItem from "~/components/forPages/FeedItem"
import SearchChooseCats from "~/components/generics/SearchChooseCats"
import { PUBLIC_CONFIG } from "~/config"
import { dbGetContentListSearch } from "~/serverOnly/dynamoDB/dbmain.server"
import { contentCategoryBySearchLocationParam, prettyFeed } from "~/utils/forContent"
import { textsAndMetasForSearchRouteByParams } from "~/utils/forMetasAndTitles"
import { removeTrailingSlash } from "~/utils/misc"

const { DOMAIN_NAME, DEFAULT_OG_IMAGE, PAGE_HANDLES: { SEARCH }, MASONRY_CONFIG } = PUBLIC_CONFIG


export const handle = {
    page: SEARCH
}


export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
    const { textsAndMetas } = data
    const { pathname } = location
    return [
        { title: textsAndMetas.title },
        { name: 'description', content: textsAndMetas.metaDescription },
        {
            tagName: "link",
            rel: "canonical",
            href: removeTrailingSlash(DOMAIN_NAME + pathname),
        },
        {
            property: "og:image",
            content: DEFAULT_OG_IMAGE()
        }
    ]
}


export const loader: LoaderFunction = async ({ params }) => {
    const { searchLocation, searchTerm } = params
    const textsAndMetas = textsAndMetasForSearchRouteByParams(params)
    if (searchTerm) {
        const categories = contentCategoryBySearchLocationParam(searchLocation)
        if (categories) {
            const collectCalls = []
            for (let i = 0; i < categories?.length; i += 1) {
                collectCalls.push(dbGetContentListSearch({
                    pk: categories[i],
                    searchTerm: searchTerm.toLowerCase()
                }))
            }
            const allRes = await Promise.all(collectCalls)
            const flatRes = allRes.flat()
            return json({ feed: flatRes, textsAndMetas })
        } else {
            return json({}, { status: 404 })
        }
    } else {
        return json({ textsAndMetas })
    }
}


export default function SearchPage() {
    const params = useParams()
    const loaderData = useLoaderData<typeof loader>()
    const feed = prettyFeed(loaderData?.feed)

    return (
        <main className="page_feed">
            <div className="title_frame">
                <h1 className="sp">
                    {loaderData?.textsAndMetas?.h1}
                </h1>
            </div>
            <SearchChooseCats />
            {params?.searchTerm ? (
                <Masonry
                    className="masonry"
                    items={feed}
                    render={(it) => (
                        <FeedItem
                            position={111}
                            key={it.canonical}
                            contentItem={it}
                            showCatLink={true}
                        />
                    )}
                    config={MASONRY_CONFIG}
                />
            ) : null}
        </main>
    )
}