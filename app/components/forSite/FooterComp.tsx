import { NavLink } from "@remix-run/react";
import { PUBLIC_CONFIG } from "~/config";


/**
 * site footer
 */
export default function FooterComp() {
    const { DOMAIN_NAME, ROUTE_FRAGMENTS: { IMPRESSUM } } = PUBLIC_CONFIG

    return (
        <footer>
            <div>
                <NavLink to={`/${IMPRESSUM}`}>Impressum</NavLink>
            </div>
            <div className="footer_right" itemScope itemType="https://schema.org/NewsMediaOrganization">
                <div className="css_logo">SG</div>
                <meta itemProp="alternateName" content="ODSG" />
                <meta itemProp="description" content="Medientmitteilungen Stadt und Kanton St. Gallen" />
                <link itemProp="logo" href={`${DOMAIN_NAME}/_static/icons/android-chrome-512x512.png`} />
                <link itemProp="url" href={DOMAIN_NAME} />
                <div itemProp="name">
                    <div>OpenData</div>
                    <div>St. Gallen</div>
                </div>
            </div>
        </footer>
    )
}