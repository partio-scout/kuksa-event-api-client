# Client for the Kuksa event information api

Kuksa is the membership registry and event sign up database for the Finnish scouts. It provides an endpoint for querying information about events and the scouts signed up for them. This package provides a client for that api.

## Using
The main entry point for the library is the `getEventApi`-function. It takes as a parameter a configuration object with the following properties:

|Property name | description                                             |
|--------------|---------------------------------------------------------|
|endpoint      | the full base url for the api, without a trailing slash |
|username      | username for http basic auth                            |
|password      | password for http basic auth                            |
|eventId       | the id of the event we want to access                   |
|proxy         | optional proxy server url                               |

As a return value you'll get an event api object. It contains several functions for fetching various datasets through the api. All of the functions return [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), and optionally take an object specifying a date range. If the date range is specified, only objects which have changed within that range will be returned. For a list of all functions, see [eventApi.ts](src/eventApi.ts).

Note that local group = 'lippukunta', and camp group = 'leirilippukunta'.

## Building
To build this package, install all dependencies with `npm install`, then run `npm run build` to build the js library.

## Developing
This package is built with typescript, which is basically javascript + type information. For more information on typescript, see http://www.typescriptlang.org/.

## Releasing
To create a new release, on the master branch run [npm version](https://docs.npmjs.com/cli/version) and upload the created archive to github.

The `npm version` command will create a new commit that changes the version number and a tag that will be pushed to github.
