# Client for the Kuksa event information api

Kuksa is the membership registry and event sign up database for the Finnish scouts. It provides an endpoint for querying information about events and the scouts signed up for them. This package provides a client for that api.

## Building
To build this package, install all dependencies with `npm install`, then run `npm run build` to build the js library.

## Developing
This package is built with typescript, which is basically javascript + type information. For more information on typescript, see http://www.typescriptlang.org/.

## Releasing
To create a new release, on the master branch run [npm version](https://docs.npmjs.com/cli/version) and upload the created archive to github.

The `npm version` command will create a new commit that changes the version number and a tag that will be pushed to github.
