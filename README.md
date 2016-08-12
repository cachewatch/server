# CacheWatch

This is a server with creates a cache form HTML by account in bitcoin. Look the [API][6].

## Why down the service?

The main reasons are

* The apps isomeptrics
* The project did not receive profits

> A donations in bitcoin [1BhBb3rKHSQPRjPjuPj46xX24RUPQn3hRm](bitcoin:1BhBb3rKHSQPRjPjuPj46xX24RUPQn3hRm)

## Requisites

* [Bitcoin Wallet][2]
* [GitHub App][5]

Bat use [OpenShift][9] or install

* [NodeJs][7]
* [MongoDB][8]

### Tecnology

* Angular (v1.*)
* SASS (SCSS)
* Browserify
* Jade (Now PUG)
* ExpressJs
* MongooseJs
* PassportJs
* MarkDown
* MomentJs
* UglifyJs
* vHost (For ExpressJs)

## Environment Variables

Put the settings the server.

| Var | Type | Requiere | Description |
| --- | ---- |:--------:| ------------ |
| `CACHE_WATCH` | String | YES | The name of of the hearder Eg. `x-cache-watch` |
| `COMPRESS_CSS` | Boolean | NO | Compress the CSS |
| `COMPRESS_JS` | Boolean | NO | Compress the JavaScript in browers |
| `HTTPS_ACTIVE` | Boolean | NO | Use [Https][1] |
| `BITCOIN_MASTER` | String | YES | Bitcoin account master |
| `BLOCKCHAIN_ID` | String | YES | Id form the [BlockChain][2] |
| `BLOCKCHAIN_SECRET1` | String | YES | Password principal form the [BlockChain][2] |
| `BLOCKCHAIN_SECRET2` | String | YES | Password secondary form the [BlockChain][2] |
| `GITHUB_ID` | String | YES | Id form app in [Github][5] |
| `GITHUB_SECRET` | String | YES | Secreet form app in [Github][5] |
| `OPENSHIFT_APP_DNS` | String | NO | The fully-qualified domain namespace of the application [OpenShift][3] |
| `OPENSHIFT_APP_NAME` | String | YES | The name of the application [OpenShift][3] |
| `OPENSHIFT_APP_UUID` | String | YES | The UUID of the application [OpenShift][3] |
| `OPENSHIFT_DATA_DIR` | String | NO | A persistent data directory [OpenShift][3] |
| `IS_FREE` | Number | NO | The number free pages :D |
| `IS_MAX` | Number | NO | Is the max number cache for the service |
| `KONSTANT` | Number | NO | How many per page in the cache in Bitcoin Eg. 0.00001 |
| `LANG_BASIC` | String | YES | Language principal Eg. en |
| `OPENSHIFT_MONGODB_DB_HOST` | String | YES | The host name or IP address used to connect to the mongodb [OpenShift][3] |
| `OPENSHIFT_MONGODB_DB_PORT` | Number | YES | The host name or port used to connect to the mongodb [OpenShift][3] |
| `OPENSHIFT_NODEJS_IP` | String | YES | The host name or IP address used to connect to the nodejs [OpenShift][3] |
| `OPENSHIFT_NODEJS_PORT` | Number | YES | The host name or port used to connect to the nodejs [OpenShift][3] |
| `PUBLIC_DATA` | String | NO | Is the temporal files |
| `URL_DOMAIN` | String | YES | Is the website Eg. cache.watch |
| `URL_SERVICE` | String | YES | Is the API Eg. service.cache.watch |

## Install and Start

Is simple

	$ npm install

And start

	$ npm start

[1]: https://en.wikipedia.org/wiki/HTTPS
[2]: https://blockchain.info/
[3]: https://developers.openshift.com/managing-your-applications/environment-variables.html
[4]: https://blockchain.info/es/wallet/payment-notifications
[5]: https://github.com/settings/developers
[6]: https://devolper.cache.watch/
[7]: http://nodejs.org/
[8]: http://mongodb.org/
[9]: https://developers.openshift.com/languages/nodejs/index.html
