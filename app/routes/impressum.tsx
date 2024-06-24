import { MetaFunction } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { PUBLIC_CONFIG } from "~/config"
import texts from "~/texts"

const { DEFAULT_OG_IMAGE, DOMAIN_NAME, ROUTE_FRAGMENTS: { IMPRESSUM } } = PUBLIC_CONFIG
const {
    metasAndTitles: { impressum },
    labels: { source: { ST, KT, KT_API_URL, ST_API_URL } }
} = texts


export const meta: MetaFunction = () => {
    return [
        { title: impressum.title },
        { name: 'description', content: impressum.metaDescription },
        {
            tagName: "link",
            rel: "canonical",
            href: `${DOMAIN_NAME}/${IMPRESSUM}`
        },
        {
            property: "og:image",
            content: DEFAULT_OG_IMAGE()
        }
    ]
}


export default function Impressum() {
    return (
        <main className="page_article">
            <div className="title_frame">
                <h1 className="sp">{impressum.h1}</h1>
            </div>

            <div className="page_content sp">
                <p>OpenData St. Gallen ist ein privates Open Data und Open Source Projekt. Daten bzw. Textinhalte und Bilder der Medienmitteilungen stammen von Stadt und Kanton St. Gallen, welche die Daten im Rahmen der Open Government Initiative zur freien Verfügung stellen. Der Quellcode der Webseite ist offen einsehbar.</p>
                <p>Öffentliche Mitteilungen sollen Interessierten in benutzerfreundlichen Form zur Verfügung gestellt werden. Desweiteren können sich Entwickler am Quellcode orientieren, um Probleme zu lösen, die sich in Zusammenhang mit ähnlichen Projekten ergeben können.</p>
                <p>Privacy: Die Webseite verwendet keine Tracking-Tools.</p>


                <div className="article_footer">
                    <div className="article_source_block">
                        Daten
                        <ul >
                            <li>
                                <Link to={KT_API_URL}>
                                    API {KT}
                                </Link>
                            </li>
                            <li>
                                <Link to={ST_API_URL}>
                                    API {ST}
                                </Link>
                            </li>
                            <li>
                                <Link to="https://opendata.swiss">
                                    Opendata.swiss
                                </Link>
                            </li>

                        </ul>
                    </div>

                    <div className="article_source_block">
                        Webseite
                        <ul >

                            <li>
                                <Link to="https://github.com">
                                    Source Code
                                </Link>
                            </li>

                            <li>
                                Entwicklung:{' '}
                                <Link to="https://wefrick.com">
                                    Wenzel Frick
                                </Link>
                            </li>

                            <li>
                                Kontakt:{' '}
                                <Link to="mailto:hello@wefrick.com">
                                    hello@wefrick.com
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <picture className="page_image" style={{ padding: '4rem' }}>
                    <img src="/_static/icons/android-chrome-512x512.png" width={512} height={512} alt="Medienmitteilungen St. Gallen Logo" />
                </picture>

            </div>

        </main>
    )
}