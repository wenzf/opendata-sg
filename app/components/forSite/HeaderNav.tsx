import { NavLink } from "@remix-run/react"
import { PUBLIC_CONFIG } from "~/config"
import texts from "~/texts"

const {
    Kanton, Stadt, Mitteilungen,
    Polizei, Vernehmlassungen, Suche
} = texts.labels.nav


const {
    ROUTE_FRAGMENTS: {
        KANTON, MITTEILUNGEN, STADT, POLIZEI,
        VERNEHMLASSUNGEN, SUCHE
    }
} = PUBLIC_CONFIG


export const HeaderNav = () => (
    <nav className="site_navs_scroll">
        <table className="site_navs">
            <colgroup span={2} className="knt" />
            <colgroup span={2} className="knt" />
            <colgroup span={2} className="std" />
            <tbody>
                <tr>
                    <td rowSpan={2}>
                        <NavLink end className="nav1" to="/">
                            <div className="css_logo">SG</div>
                        </NavLink>
                    </td>
                    <td rowSpan={2}>
                        <NavLink className="nav1" to={`/${KANTON}`}>{Kanton}</NavLink>
                    </td>
                    <td>
                        <NavLink className="nav2" to={`/${KANTON}/${MITTEILUNGEN}`}>
                            {Mitteilungen}
                        </NavLink>
                    </td>
                    <td rowSpan={2}>
                        <NavLink className="nav1" to={`/${STADT}`}>{Stadt}</NavLink>
                    </td>
                    <td>
                        <NavLink className="nav2" to={`/${STADT}/${MITTEILUNGEN}`}>
                            {Mitteilungen}
                        </NavLink>
                    </td>
                    <td rowSpan={2}>
                        <NavLink className="nav1" to={`/${SUCHE}`}>{Suche}</NavLink>
                    </td>
                </tr>
                <tr>
                    <td>
                        <NavLink className="nav2" to={`/${KANTON}/${VERNEHMLASSUNGEN}`}>
                            {Vernehmlassungen}
                        </NavLink>
                    </td>
                    <td>
                        <NavLink className="nav2" to={`/${STADT}/${POLIZEI}`}>
                            {Polizei}
                        </NavLink>
                    </td>
                </tr>
            </tbody>
        </table>
    </nav>
)
