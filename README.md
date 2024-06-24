# OpenData St. Gallen

**Newssite prototype for media releases**

- [odsg.ch](https://odsg.ch)

A full-stack open data web project with media releases from the Canton of St. Gallen in Switzerland. The text content comes from publicly accessible Rest APIs. The text content of the releases is formatted as HTML, the HTML is partially reformatted. The data is then stored in a database. This is done to improve the loading speed of the articles and because some APIs limit the number of daily accesses. 

The focus is on low costs for the technical infrastructure, user-friendliness for visitors, web standards for accessibility and that content can be easily indexed by search engines.


## Setup

- Built with [Remix](https://github.com/remix-run)
- Deployed on AWS, using [Arc Template](https://github.com/remix-run/remix/tree/main/templates/classic-remix-compiler/arc)
- [DynamoDB](https://aws.amazon.com/dynamodb/)
- Using data from [opendata.swiss](https://opendata.swiss)



## Key components

| name | file | function | noteworthy dependencies | 
|`dataAPI`| [/app/serverOnly/dataAPI/dataAPI.server.ts](./app/serverOnly/dataAPI/dataAPI.server.ts) | fetching data from API | [dataAPIConfigConstructor](./app/serverOnly/dataAPI/dataAPIConfigConstructor.server.ts) |
| *database* | [/app/serverOnly/dynamoDB/dbmain.server.ts](./app/serverOnly/dynamoDB/dbmain.server.ts) | interactions with DynamoDB | |
| `extractAndModifyTextContent` | [/app/serverOnly/dataAPI/markupUtils.server.ts](./app/serverOnly/dataAPI/markupUtils.server.ts) |re-format text content: extract article lead (used for *meta description*), replace subtitles formatted in `<b>` with `<h2>` tags |  [linkdom](https://github.com/linkdom/linkdom), [sanitize-html](https://github.com/apostrophecms/sanitize-html)|
|`prettyMarkup` | [./app/serverOnly/dataAPI/prettyMarkup.server.ts](./app/serverOnly/dataAPI/prettyMarkup.server.ts) | convert article to the internal datastructure by configuration ||
|`handleDataFeedRequest`| [/app/serverOnly/forLoader/handleDataFeedRequest.server.ts](./app/serverOnly/forLoader/handleDataFeedRequest.server.ts) | data reqeust by route params: check for last update, fetch data from API, store new data | `extractAndModifyTextContent`,  `prettyMarkup`,  `dataAPI`,  *database* |


## Keeping database in sync with data from APIs

Search engines make several requests every day to websites that regularly have new content in order to index them. As the setup is event-driven, these requests are used to synchronize the website content with the data from the APIs. For each request from visitors or search engines to a feed page, the last time data was retrieved from the API is checked and if the time was a long time ago. If so, an API request is made and its results are compared with the last saved status and updated if necessary.

- 1: when the request arrives, an index file is read from the database. This contains the timestamp of when API was requested the and the number of entries (`total_results`) per API. If the last query was longer ago than `DATA_UPDATE_INTERVAL_TIME_IN_MS`, continue in step 2, otherwise, step 3b
- 2: request to the API. Update the index file. If `total_results` from the response matches the entry in the index file, continue with step 3b, otherwise, step 3a.
- 3a: The data from the API from the previous step is converted into the internal data structure and saved in the database. The response is then sent to the client
- 3b: Content is retrieved from the database and sent to the client.


## Development and deployment

Remix has several deploymet pipelines for different services or can be hostet on any node or node-like runtime. This respository uses AWS services since they offer a reasonable cost-benefit ratio for such projects. 

The project uses the a standard template for development and deployment. Just follow the guides.
- [Install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- [Arc template](https://github.com/remix-run/remix/tree/main/templates/classic-remix-compiler/arc)
- [Arc quick start](https://arc.codes/docs/en/get-started/quickstart)
- [Arc deployment](https://arc.codes/docs/en/reference/cli/deploy)
- [Deployment on AWS with custom domain](https://arc.codes/docs/en/guides/domains/registrars/route53-and-cloudfront)


```sh
 npm run dev
```

### Enviroment variables

```sh
npx arc env --add --env staging SESSION_SECRET $(openssl rand -hex 32)
npx arc env --add --env production SESSION_SECRET $(openssl rand -hex 32)
npx arc env --add --env testing SESSION_SECRET $(openssl rand -hex 32)
npx arc env --add --env staging ARC_APP_SECRET $(openssl rand -hex 32)
npx arc env --add --env production ARC_APP_SECRET $(openssl rand -hex 32)
npx arc env --add --env testing ARC_APP_SECRET $(openssl rand -hex 32)
```

### Possible Troubles

- Did you set environment variables? See above.
- Did you set secrets for the server functions on Github?
- Are AWS access keys set correctly?
- Did you modify the project and see hydration errors in the browser console? This indicates that the server side markup is not identical with the client side rendered version. Reasons for is is often incorrect HTML markup which is corrected client side and therefore doesn't match with the backend rendered version. Another possibility is formatted timestamps without defined timezones. In such cases the markup from the server would use server time which might not match with client time, leading to different markups.


