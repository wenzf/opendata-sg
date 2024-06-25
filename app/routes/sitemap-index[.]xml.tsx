import type { LoaderFunction } from "@remix-run/node";
import { PUBLIC_CONFIG } from "~/config";


export const loader: LoaderFunction = () => {
    const { DOMAIN_NAME } = PUBLIC_CONFIG
    const sitemapPages = `<sitemap><loc>${DOMAIN_NAME}/sitemap-pages.xml</loc></sitemap>`
    const sitemapArticles = `<sitemap><loc>${DOMAIN_NAME}/sitemap-articles.xml</loc></sitemap>`
    const sitemapNews = `<sitemap><loc>${DOMAIN_NAME}/sitemap-news.xml</loc></sitemap>`
    const siteMapSet = sitemapPages + sitemapArticles + sitemapNews
    const markup = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${siteMapSet}</sitemapindex>`;

    return new Response(markup, {
        status: 200,
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "x-content-type-options": "nosniff",
            "Cache-Control": `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
        },
    });
}