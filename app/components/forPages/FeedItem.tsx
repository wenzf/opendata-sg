import { NavLink, createPath } from "@remix-run/react";
import { ContentItemPublic } from "~/types";
import { readableAndIsoTimeByUnixEpoch } from "~/utils/time";
import ContentCategoryLink from "../generics/ContentCategoryLink";
import { ImageHTML } from "../generics/ImageHtml";


export default function FeedItem({ contentItem, position, showCatLink }: {
    contentItem: ContentItemPublic,
    position: number
    showCatLink: boolean
}) {
    const { title, intro, canonical, published, content_category, image } = contentItem
    const { readable, iso } = readableAndIsoTimeByUnixEpoch(published)
    const path = createPath({ pathname: canonical })
   
    return (
        <section className={`preview ${content_category.toLowerCase()}`}>
            {showCatLink ? (
                <ContentCategoryLink contentCategory={content_category} />
            ) : null}
            <time className="sp" dateTime={iso}>{readable}</time>
            <NavLink end to={path} className="preview_inner">
                <ImageHTML position={position} image={image} use_case="thumbnail" />
                <h2 className="sp">{title}</h2>
                <p className="sp">{intro}</p>
            </NavLink>
        </section>
    )
}