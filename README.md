# OpenData SG

**Newssite prototype for media releases**

- [odsg.ch](https://odsg.ch)
- A open data and web experiment using media releases of St. Gallen (Switzerland). Text content and images come from publicly accessible Rest APIs. Initially, the text content of the releases is formatted as HTML, it's partially reformatted to a more suitable structure. The data is then stored in a database in order to improve the loading speed of the articles and because some APIs limit the number of daily requests.
- The focus is on quick development, low hostig costs, user-friendliness for visitors, web standards for accessibility and that content can be easily indexed by search engines.


## Intial situation

The canton and the city of St. Gallen publish press releases on separate platforms that are less optimized for search engines. The aim is to make those press releases accessible on one platform, to optimize them for search engines and to improve the loading speed. 


## Setup

- Built with [Remix](https://github.com/remix-run), a fullstack SSR web framework built on top of `react` and `react-router`
- Deployed on AWS, using [Arc Template](https://github.com/remix-run/remix/tree/main/templates/classic-remix-compiler/arc), [DynamoDB](https://aws.amazon.com/dynamodb/)
- Data from [opendata.swiss](https://opendata.swiss)

### APIs

- [Newsfeed Medienmitteilungen Stadtverwaltung St.Gallen](https://opendata.swiss/de/dataset/newsfeed-medienmitteilungen-stadtverwaltung-st-gallen)
- [Newsfeed Vernehmlassungen Kanton St.Gallen](https://opendata.swiss/de/dataset/newsfeed-vernehmlassungen-kanton-st-gallen)
- [Newsfeed Medienmitteilungen Kanton St.Gallen](https://opendata.swiss/de/dataset/newsfeed-medienmitteilungen-kanton-st-gallen)
- [Newsfeed Medienmitteilungen der Stadtpolizei St.Gallen](https://opendata.swiss/de/dataset/newsfeed-medienmitteilungen-der-stadtpolizei-st-gallen)



## Key components

| name | file |           function        | noteworthy dependencies |
|---|---|------------------------------------------------------------------------------------|---|
|`dataAPI`|[dataAPI.server.ts](./app/serverOnly/dataAPI/dataAPI.server.ts)| fetching data from API |[dataAPIConfigConstructor](./app/serverOnly/dataAPI/dataAPIConfigConstructor.server.ts)|
|*database calls*|[dbmain.server.ts](./app/serverOnly/dynamoDB/dbmain.server.ts)| interactions with DynamoDB ||
|`extractAndModifyTextContent`|[markupUtils.server.ts](./app/serverOnly/dataAPI/markupUtils.server.ts)| re-format text content: extract article lead (used for *meta description*), replace subtitles formatted in `<b>` with `<h2>` tags |[linkdom](https://github.com/linkdom/linkdom), [sanitize-html](https://github.com/apostrophecms/sanitize-html)|
|`prettyMarkup`|[prettyMarkup.server.ts](./app/serverOnly/dataAPI/prettyMarkup.server.ts)| convert article to the internal datastructure by configuration ||
|`handleDataFeedRequest`|[handleDataFeedRequest.server.ts](./app/serverOnly/forLoader/handleDataFeedRequest.server.ts)| data reqeust by route params: check for last update, fetch data from API, store new data |`extractAndModifyTextContent`,  `prettyMarkup`,  `dataAPI`,  *database calls*|



## Keeping database in sync with data from APIs

Search engines make several requests every day to websites that regularly have new content in order to index them. As the setup is event-driven, these requests are used to synchronize the website content with the data from the APIs. For each request from visitors or search engines to a feed page, the last time data was retrieved from the API is checked and if the time was a long time ago. If so, an API request is made and its results are compared with the last saved status and updated if necessary.

- 1: The request arrives, an index file is read from the database. This contains the timestamp of when API was requested the and the number of entries (`total_results`) per API. If the last query was longer ago than `DATA_UPDATE_INTERVAL_TIME_IN_MS`, continue in step 2, otherwise, step 3b
- 2: Request to the API. Update the index file. If `total_results` from the response matches the entry in the index file, continue with step 3b, otherwise, step 3a.
- 3a: The data from the API from the previous step is converted into the internal data structure and saved in the database. The response is then sent to the client.
- 3b: Content is retrieved from the database and sent to the client.



## Development and deployment

Remix has several deploymet pipelines for different services or can be hostet on any node or node-like runtime. This respository uses AWS services since they offer a reasonable cost-benefit ratio for such projects. 

The project uses the a standard template for development and deployment. For development and deployment follow the guides.
- [Install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- [Arc template](https://github.com/remix-run/remix/tree/main/templates/classic-remix-compiler/arc)
- [Arc quick start](https://arc.codes/docs/en/get-started/quickstart)
- [Arc deployment](https://arc.codes/docs/en/reference/cli/deploy)
- [Deployment on AWS with custom domain](https://arc.codes/docs/en/guides/domains/registrars/route53-and-cloudfront)


```sh
    $ npm run dev
```

### Setting enviroment variables

```sh
    $ npx arc env --add --env staging SESSION_SECRET $(openssl rand -hex 32)
    $ npx arc env --add --env production SESSION_SECRET $(openssl rand -hex 32)
    $ npx arc env --add --env testing SESSION_SECRET $(openssl rand -hex 32)
    $ npx arc env --add --env staging ARC_APP_SECRET $(openssl rand -hex 32)
    $ npx arc env --add --env production ARC_APP_SECRET $(openssl rand -hex 32)
    $ npx arc env --add --env testing ARC_APP_SECRET $(openssl rand -hex 32)
```

### Possible troubles

- Are environment variables set? See above.
- Are server functions on Github set (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)?
- Are AWS access keys set correctly?
- Did you modify the project and see hydration errors in the browser console? This indicates that the server side markup is not identical with the client side rendered version. Reasons can be incorrect HTML markup which is corrected client side and therefore doesn't match with the backend rendered version. Another possibility is formatted timestamps without defined timezones. In such cases the markup from the server would use server time which might not match with client time, leading to different markups.
- Error: 500 after deployment? This might be due to an issue in the deployment pipeline. Delete `.cache`, `public/build`, all files in `server/*` run `npm run build` and deploy agan.


