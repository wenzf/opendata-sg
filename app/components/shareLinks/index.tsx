import { iconsConfig } from "./constants/iconsConfig";
import { SocialNetworks } from "./types";

import { mkSVG } from "./utils/misc";

export function ShareLinksDEV({ socialNetworks, url, title }: { socialNetworks: SocialNetworks[], url: string, title?: string }) {

    const collectConfig = [];

    for (let i = 0; i < socialNetworks.length; i += 1) {
        try {
            collectConfig.push(iconsConfig[socialNetworks[i]])
        } catch {
            throw Error(`${socialNetworks[i]} is not supported. Type error?`)
        }
    }

    const tree = []

    for (let i = 0; i < collectConfig.length; i += 1) {

        tree.push(mkSVG([...collectConfig[i], 32, true, 0]))
    }

    return (
        <div>
            {tree}
        </div>
    )

    //    const st = iconsConfig.email
    //    return mkSVG([...st, 32, true, 0])
}
