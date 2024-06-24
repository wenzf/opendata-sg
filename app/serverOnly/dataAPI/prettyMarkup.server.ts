import { APIResponse, ContentCategoryKeys, ContentItemInternal, PrettyMarkupModificationRule } from '~/types';
import {  convertIsoTimeToUnixEpoche } from '~/utils/time';
import { KEYWORDS_TO_BE_REMOVED_FROM_SEARCH_TEXT, SPECIAL_CHARS_TO_BE_REMOVED_FROM_SEARCH_TEXT } from '~/config';
import { extractAndModifyTextContent, removeNewlinesAndTabsLoop, replacerNoWhitespce, replacerWithWhitespce } from './markupUtils.server';
import { articlePathByContentCategoryAndPublishedAndTitle } from '~/utils/forContent';


/**
 *  assemble article data to internal data strucutre
 */
export const prettyMarkup = (
    apiResponse: APIResponse,
    modificationRules: PrettyMarkupModificationRule[],
    contentCatgory: ContentCategoryKeys,
    offset: number
): ContentItemInternal[] => {
    const results = apiResponse.results;
    const total_count = apiResponse.total_count
    const outp = []

    if (results.length) {
        for (let i = 0; i < results.length; i += 1) {
            const oneResult = results[i]
            const published = convertIsoTimeToUnixEpoche(oneResult.published)
            if (published === null) break
            const oneDesc = oneResult.description
            const pretty = removeNewlinesAndTabsLoop(oneDesc);
            const modifiedAndExtracted = extractAndModifyTextContent(pretty, modificationRules)

            let image;
            if (oneResult.bild && oneResult.bild_url && modifiedAndExtracted.extractedAlt) {
                image = {
                    alt_description: modifiedAndExtracted.extractedAlt,
                    image_dimensions: [oneResult.bild.width, oneResult.bild.height],
                    color_summary: oneResult.bild.color_summary,
                    image_url: oneResult.bild_url
                }
            } else {
                image = null
            }

            const collectAllTexts = " " + modifiedAndExtracted.modifiedHTML + " " + oneResult.title + " " + modifiedAndExtracted.extractedText + " " + (modifiedAndExtracted?.extractedAlt ? modifiedAndExtracted.extractedAlt : '') + " ";
            const textsToLowerCase = collectAllTexts.toLowerCase()
            const noSpecialChars = replacerNoWhitespce(textsToLowerCase, SPECIAL_CHARS_TO_BE_REMOVED_FROM_SEARCH_TEXT)
            const search_string = replacerWithWhitespce(noSpecialChars, KEYWORDS_TO_BE_REMOVED_FROM_SEARCH_TEXT).trim()
            const canonical = articlePathByContentCategoryAndPublishedAndTitle(contentCatgory, published, oneResult.title)

            const oneEntry: ContentItemInternal = {
                body: modifiedAndExtracted.modifiedHTML,
                title: oneResult.title,
                intro: modifiedAndExtracted.extractedText,
                published,
                content_category: contentCatgory,
                original_link: oneResult.link,
                views_bot: 0,
                views_human: 0,
                image,
                search_string,
                index_position: total_count - i - offset,
                canonical
            }
            outp.push(oneEntry)
        }
    }
    return outp
}