import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Masonry } from "react-plock";
import FeedItem from "~/components/forPages/FeedItem";
import { NS_CONTENT_CATEGORY, PUBLIC_CONFIG } from "~/config";
import { handleDataFeedRequest } from "~/serverOnly/forLoader/handleDataFeedRequest.server";
import texts from "~/texts";
import { ContentCategoryKeys } from "~/types";
import { prettyFeed } from "~/utils/forContent";

const {
  PAGE_HANDLES: { HOME }, DOMAIN_NAME, DEFAULT_OG_IMAGE, MASONRY_CONFIG,
  ENTRIES_SHOWN_IN_FEED
} = PUBLIC_CONFIG


export const handle = {
  page: HOME
}


export const loader: LoaderFunction = async () => {
  const { KTME, KTVE, STME, STPO } = NS_CONTENT_CATEGORY
  const requestedContentTypes: ContentCategoryKeys[] = [KTME, KTVE, STME, STPO]
  const res = await handleDataFeedRequest({
    requestedContentTypes,
    offset: 0,
    itemsPerRequest: ENTRIES_SHOWN_IN_FEED

  })
  return json(res)
}


export const meta: MetaFunction = () => {
  const { metasAndTitles: { home: { metaDescription, title } } } = texts
  return [
    { title },
    { name: "description", content: metaDescription },
    {
      tagName: "link",
      rel: "canonical",
      href: DOMAIN_NAME,
    },
    {
      property: "og:image",
      content: DEFAULT_OG_IMAGE()
    }
  ];
};


export default function Index() {
  const loaderData = useLoaderData<typeof loader>()
  const feed = prettyFeed(loaderData?.feed)
  const { metasAndTitles: { home: { h1 } } } = texts

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
          showCatLink={true}
           />
        )}
        config={MASONRY_CONFIG}
      />
    </main>
  );
}
