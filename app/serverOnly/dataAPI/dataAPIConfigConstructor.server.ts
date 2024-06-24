import { NS_CONTENT_CATEGORY } from "~/config";
import { BACKEND_CONFIG } from "~/config/backend.server";
import { ContentCategoryKeys, DataAPIConfig, PrettyMarkupModificationRule } from "~/types";

const {
    DATA_API: {
        ENDPOINTS: {
            STADT_MITTEILUNGEN,
            STADTPOLIZEI_MITTEILUNGEN,
            KANTON_MITTEILUNGEN,
            KANTON_VERNEHMLASSUNGEN
        }
    },
} = BACKEND_CONFIG


const modificationRulesDefault: PrettyMarkupModificationRule[] = [
    { selector: 'strong>p', replacement: 'remove', extractText: true },
    { selector: 'p>b', replacement: 'h2', maxLenReplaceText: 300 },
    { selector: '.newsbild>a>img', replacement: 'remove', extractAlt: true },
];


const modificationRulesNoImage: PrettyMarkupModificationRule[] = [
    { selector: 'strong>p', replacement: 'remove', extractText: true },
    { selector: 'p>b', replacement: 'h2', maxLenReplaceText: 300 },
];


export const dataAPIConfigConstructor = (
    jobsForAPI: ContentCategoryKeys[],
    offset: number,
    limit: number
): DataAPIConfig[] => {
    const { KTME, KTVE, STME, STPO } = NS_CONTENT_CATEGORY
    const apiConfig = []
    const baseConfig = { limit, offset }

    for (let i = 0; i < jobsForAPI.length; i += 1) {
        const oneContentCategory = jobsForAPI[i]
        if (oneContentCategory === KTME) {
            const oneConfig = {
                ...baseConfig,
                endpoint: KANTON_MITTEILUNGEN,
                modificationRule: modificationRulesDefault,
                contentCategory: oneContentCategory,
                includeImage: true
            }
            apiConfig.push(oneConfig)
        } else if (oneContentCategory === KTVE) {
            const oneConfig = {
                ...baseConfig,
                endpoint: KANTON_VERNEHMLASSUNGEN,
                modificationRule: modificationRulesNoImage,
                contentCategory: oneContentCategory,
                includeImage: false
            }
            apiConfig.push(oneConfig)
        } else if (oneContentCategory === STPO) {
            const oneConfig = {
                ...baseConfig,
                endpoint: STADTPOLIZEI_MITTEILUNGEN,
                modificationRule: modificationRulesDefault,
                contentCategory: oneContentCategory,
                includeImage: true
            }
            apiConfig.push(oneConfig)
        } else if (oneContentCategory === STME) {
            const oneConfig = {
                ...baseConfig,
                endpoint: STADT_MITTEILUNGEN,
                modificationRule: modificationRulesDefault,
                contentCategory: oneContentCategory,
                includeImage: true
            }
            apiConfig.push(oneConfig)
        }
    }
    return apiConfig
}