# gce-output-stream [![Build Status](https://travis-ci.org/stephenplusplus/gce-output-stream.svg)](https://travis-ci.org/stephenplusplus/gce-output-stream)
> Get a stream of output from a Google Compute Engine instance

```sh
$ npm install --save gce-output-stream
```
```js
var outputStream = require('gce-output-stream')

outputStream({
    projectId: 'grape-spaceship-123',
    zone: 'us-central1-a',
    name: 'app-http-server'
  })
  .on('data', function (line) {
    // one line of output
  })
```


#### Authorization

This module uses [google-auto-auth](https://github.com/stephenplusplus/google-auto-auth) to get the required access token. If you don't meet the **[requirements for automatic authentication](https://github.com/stephenplusplus/google-auto-auth#automatic-if)**, you will need to provide the same configuration object detailed in that readme.

```js
outputStream({ keyFile: 'key.json' })
```


### API

#### outputStream = require('gce-output-stream')

#### stream = outputStream(config)

- Type: `Stream`

An output stream with the results of iterative calls to [`getSerialOutput`](https://cloud.google.com/compute/docs/reference/v1/instances/getSerialPortOutput). Each data event emitted is a single line.

##### config.projectId

- Type: `String`
- **Required**

The projectId your instance is hosted under.

##### config.name

- Type: `String`
- **Required**

The name of your instance.

##### config.zone

- Type: `String`
- **Required**

The name of the zone the instance is running in. (Ex: `us-central1-a`)

##### config.authClient

- Type: [`GoogleAutoAuth`](http://gitnpm.com/google-auto-auth)
- *Optional*

If you want to re-use an auth client from [google-auto-auth](http://gitnpm.com/google-auto-auth), pass an instance here.

###### config.authConfig

- Type: `object`
- *Optional*

See [`authConfig`](https://github.com/stephenplusplus/google-auto-auth#authconfig).

##### config.port

- Type: `Number`
- *Optional*
- Default: `1`

The COM or serial port to retrieve data from. Acceptable values are `1`-`4`.
