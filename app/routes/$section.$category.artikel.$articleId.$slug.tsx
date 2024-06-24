import { LoaderFunction, MetaFunction, json, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { isbot } from "isbot"
import ContentItem from "~/components/forPages/ContentItem"
import { PUBLIC_CONFIG } from "~/config"
import { dbGetContent, dbUpdateContentItemCounter } from "~/serverOnly/dynamoDB/dbmain.server"
import { contentTypesAndItemsPerRequestByParams } from "~/serverOnly/forLoader/forLoaderUtils.server"

const { DOMAIN_NAME, STYLES: { ARTICLE: IMAGE_MAX_WIDTH_HIGH }, PAGE_HANDLES: { ARTICLE } } = PUBLIC_CONFIG


export const handle = {
    page: ARTICLE
}


export const meta: MetaFunction<typeof loader> = ({ data }) => {
    const optionalImage = data?.image?.image_url ? {
        property: "og:image",
        content: `${data?.image?.image_url.replace('image.originalsize', `image.imageWidth__${IMAGE_MAX_WIDTH_HIGH}`)}`
    } : {}

    return [
        { title: data.title },
        { name: 'description', content: data.intro },
        {
            tagName: "link",
            rel: "canonical",
            href: `${DOMAIN_NAME}${data.canonical}`
        },
        { ...optionalImage }
    ]
}


export const loader: LoaderFunction = async ({ params, request }) => {
    const { articleId } = params
    if (!articleId) return json({}, { status: 404 })
    const sk = parseInt(articleId, 32)
    const { requestedContentTypes } = contentTypesAndItemsPerRequestByParams(params)
    const res = await dbGetContent({ pk: requestedContentTypes[0], sk })
    if (res?.canonical) {
        const path = new URL(request.url).pathname
        const isBot = isbot()
        await dbUpdateContentItemCounter({ pk: requestedContentTypes[0], sk, human: !isBot })
        if (!isBot) {
            res.views_human = res.views_human + 1
        } else {
            res.views_bot = res.views_bot + 1
        }

        if (res.canonical === path) {
            return json(res)
        } else {
            return redirect(res.canonical, { status: 302 })
        }
    } else {
        return json({}, { status: 404 })
    }
}


export default function Article() {
    const loaderData = useLoaderData<typeof loader>()
    return <ContentItem contentItem={loaderData} />
}