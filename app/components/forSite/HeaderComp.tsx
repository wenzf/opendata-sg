import { Theme } from "~/types"
import SearchAllCats from "../generics/SearchAllCats"
import HeaderBreadcrumbs from "./HeaderBreadcrumbs"
import { HeaderNav } from "./HeaderNav"
import ThemeComp from "../generics/ThemeComp"
import { SetStateAction } from "react"


type HeaderCompProps = {
    themeSetter: (e: SetStateAction<Theme>) => void
    theme: Theme
    prefsDarkmode: boolean
}

/**
 *  site header view
 */
export const HeaderComp = ({ themeSetter, theme, prefsDarkmode }:
     HeaderCompProps) => (
    <header>
        <HeaderBreadcrumbs />
        <div className="header_comp">
            <HeaderNav />
            <div className="header_top_right">
                <SearchAllCats />
                <ThemeComp
                    prefsDarkmode={prefsDarkmode}
                    themeSetter={themeSetter}
                    theme={theme}
                />
            </div>
        </div>
    </header>
)
