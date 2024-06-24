import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction,
 //  LoaderFunction 
  } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
 // json,
//  useLoaderData,
} from "@remix-run/react";
import stylesRoot from './styles/index.css';
import { HeaderComp } from "./components/forSite/HeaderComp";
// import { dbScanMain } from "./serverOnly/dynamoDB/dbmain.server";
import FooterComp from "./components/forSite/FooterComp";
import { useContext, useEffect, useState } from "react";
import { Theme } from "./types";
import { PUBLIC_CONFIG } from "./config";
import { NonceContext } from "./utils/csp/NonceContext";


export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesRoot }
];

/*
export const loader: LoaderFunction = async () => {
   const scan = await dbScanMain()

   return json({ scan })
}
*/

export default function App() {
//  const loaderDataR = useLoaderData<typeof loader>()
  const [theme, setTheme] = useState<Theme>('')
  const [prefsDarkMode, setPrefsDarkmode] = useState<boolean>(false)
  const cspNonce = useContext(NonceContext);

 // console.log({ loaderDataR })

  useEffect(() => {
    if (typeof window === "object") {
      const themeFromStorage = window.localStorage.getItem('theme')
      if (themeFromStorage !== null) {
        setTheme(themeFromStorage as Theme)
      }
      else {
        const preferesDark = window.matchMedia('(prefers-color-scheme: dark)')
        if (preferesDark) {
          setPrefsDarkmode(true)
        } else {
          setPrefsDarkmode(false)
        }
      }
    }
  }, [])

  let rootURL
  if (process.env.NODE_ENV === 'production') {
    rootURL = PUBLIC_CONFIG.DOMAIN_NAME
  } else {
    rootURL = PUBLIC_CONFIG.DOMAIN_NAME_DEV
  }

  return (
    <html lang="de-CH">
      <head  itemScope itemType="https://schema.org/SpeakableSpecification">
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preload" as="font" href={`${rootURL}/_static/fonts/Lato-Regular.woff2`} type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" href={`${rootURL}/_static/fonts/Lato-Bold.woff2`} type="font/woff2" crossOrigin="anonymous" />
        <link rel="icon" href={`${rootURL}/_static/favicon.ico`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`${rootURL}/_static/icons/apple-touch-icon.png`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`${rootURL}/_static/icons/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${rootURL}/_static/icons/favicon-16x16.png`} />
        <link rel="manifest" href={`${rootURL}/_static/site.webmanifest`} />
        <meta name="robots" content="max-image-preview:large" />
        <meta itemProp="cssSelector" content=".sp" />
        <Meta />
        <Links />
      </head>
      <body className={theme} itemScope itemType="https://schema.org/WebSite">
      <meta itemProp="url" content={PUBLIC_CONFIG.DOMAIN_NAME}/>
        <HeaderComp prefsDarkmode={prefsDarkMode} theme={theme} themeSetter={setTheme} />
        <Outlet />
        <FooterComp />
        <ScrollRestoration nonce={cspNonce} />
        <Scripts nonce={cspNonce} />
        {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
      </body>
    </html>
  );
}
