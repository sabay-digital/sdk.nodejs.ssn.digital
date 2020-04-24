# sdk.nodejs.ssn.digital

SDK NodeJS for **SSN**.

## Installation

Add the following to your `package.json`:

```json
{
	"sdk.nodejs.ssn.digital": "git+https://github.com/sabay-digital/sdk.nodejs.ssn.digital#master"
}
```
### VerifySignature

This function can be used to verify a signature for a specified message and siging key
```javascript
var { VerifySignature } = require('sdk.nodejs.ssn.digital');

const publicKey = "GCDOUWMTDCD6CBWZJRMJHAPRMTIR6FPN7EW774OFV3R7ZT6DVZNW2BGM"
const signature = "4a70b93fe07659fd853f10a83f4d444ff4689bfcf34bbbdd73399db2741b4eaec055edc141d6e078ab4cb4ae42eb04a8e9e6989e3b4ac1ca5b5e6202fe04f201"
const message = "51dd0e7b9199a93fbfcd565764d5df013e689a5489c0fe0fb754987269c09db3" 
const api = "https://api.master.ssn.digital/v1"

VerifySignature(message, signature, publicKey, api).then(result => {
  console.log(result)
}).catch(error =>  console.log(error))
```

### VerifyTrust

This function can be used to verify trust line, if an account accepts an asset
```javascript
var { VerifyTrust } = require('sdk.nodejs.ssn.digital');

const destination = "GBDUGGSX77F3RXSCTJM4HR5SGKP63XBRDKXB3QVOTM6LVDOHVEE2PEE2"
const asset = "USD"
const assetIssuer = "GCDOUWMTDCD6CBWZJRMJHAPRMTIR6FPN7EW774OFV3R7ZT6DVZNW2BGM" 
const api = "https://api.master.ssn.digital/v1"

VerifyTrust(destination, asset, assetIssuer, api).then(result => {
  console.log(result)
}).catch(error =>  console.log(error))
```
### VerifySigner

This function can be used to verify singer account of ssn_account
```javascript
var { VerifySigner } = require('sdk.nodejs.ssn.digital');

const signer = "GAKRDOUGEJI2JPE2M4JUYUQXM2BVIZWKCI2ZAXY5ZJPXSNPZW3EPBF6X"
const ssnAccount = "GCDOUWMTDCD6CBWZJRMJHAPRMTIR6FPN7EW774OFV3R7ZT6DVZNW2BGM"
const api = "https://api.master.ssn.digital/v1"

VerifySigner(signer, ssnAccount, api).then(result => {
  console.log(result)
}).catch(error =>  console.log(error))
```

### VerifyHomeDomain

This function can be used to verify home domain load from ssn_account and match with home domain from payment address
```javascript
var { VerifyHomeDomain } = require('sdk.nodejs.ssn.digital');

const homeDomain = "pp.master.mysabay.com"
const ssnAccount = "GCDOUWMTDCD6CBWZJRMJHAPRMTIR6FPN7EW774OFV3R7ZT6DVZNW2BGM"
const api = "https://api.master.ssn.digital/v1"

VerifyHomeDomain(ssnAccount, homeDomain, api).then(result => {
  console.log(result)
}).catch(error =>  console.log(error))
```

### ResolvePA

This function can be used to resolve payment address
```javascript
var { ResolvePA } = require('sdk.nodejs.ssn.digital');

const paymentAddress = "37837954*master.mysabay.com"
const hash = "431326289191edb3dc94f90e1e0e5d8899bf7ecb196c00cc3b9506dc7ed05eff"
const signature = "2fa7689f88ebb464536418c32dfd4f36d3936ffcdad3d4b8c55531963bd1645dabdb431b7db6f56dd940e591e8f2a65c7776f3254e892c96a183179fb2fb8c0d"
const signer = "GAYJ2HEGE4XGITUE2GQ7VA73ZT3V3Z4C47YLCEINTHTKTIEXACDNXJM3"
const ssnAcc = "GARXYJB3ZUJ7DNQTDWYE5PWO356ZOXD26NQJZPPM7CDAQP5YPWAWHD36"
const resolverURL = "https://pa.master.ssn.digital/v2"

ResolvePA((paymentAddress, hash, signature, signer, ssnAcc, resolverURL).then(result => {
  console.log(result)
}).catch(error =>  console.log(error))
```

### CreatePayment

This function can be used create a payment for SSN
```javascript
var { CreatePayment } = require('sdk.nodejs.ssn.digital');

const from = "GCDOUWMTDCD6CBWZJRMJHAPRMTIR6FPN7EW774OFV3R7ZT6DVZNW2BGM"
const to = "GBDUGGSX77F3RXSCTJM4HR5SGKP63XBRDKXB3QVOTM6LVDOHVEE2PEE2"
const assetIssuer = "GCDOUWMTDCD6CBWZJRMJHAPRMTIR6FPN7EW774OFV3R7ZT6DVZNW2BGM"
const memo = "37837954"
const assetCode = "SC" // sabay coin
const amount = "40"
const api = "https://api.master.ssn.digital/v1"

CreatePayment(from, to, amount, assetCode, assetIssuer, memo, api).then(result => {
  console.log(result)
}).catch(error =>  console.log(error))
```

### SignTxn

This function can be used sign transaction takes a base64 encoded XDR envelope
```javascript
var { SignTxn } = require('sdk.nodejs.ssn.digital');

const xdr = "xdr_string" 
const networkPassphrase = "ssn_master_network"


SignTxn(xdr, signer, networkPassphrase).then(result => {
  console.log(result)
}).catch(error =>  console.log(error))
```

### SignTxnService

This function can be used sign transaction service takes a base64 encoded XDR envelope
```javascript
var { SignTxnService } = require('sdk.nodejs.ssn.digital');

const xdr = "xdr_string"
const signer = "https://cashier-signer01.master.ssn.digital/api/sign"


SignTxnService(xdr, signer).then(result => {
  console.log(result)
}).catch(error =>  console.log(error))
```

### SubmitTxn

This function can be used submit transaction to ssn network
```javascript
var { SubmitTxn } = require('sdk.nodejs.ssn.digital');

const xdr = "xdr_string"
const api = "https://api.master.ssn.digital/v1"


SubmitTxn(xdr, api).then(result => {
  console.log(result)
}).catch(error =>  console.log(error))
```

### Generate Resolver Request

This function can be used for generate request body for resolver
```javascript
var { GenerateResolverRequest } = require('sdk.nodejs.ssn.digital');

const ssnAccountSK = "SCKUT7ZF634URNLYO77EN7SFDNOYVGEOZD7MWKNLUJ5TF4KC6EAOAFIZ"
const message = "Hello"

GenerateResolverRequest(ssnAccountSK, message).then(result => {
  console.log(result)
})
```

# ssn-utils

Utilities helper functions.
  
### promiseDelay(ms = 500) : {Promise}

Delay for some sort of seconds and do the next promise

```javascript

var { promiseDelay } = require('sdk.nodejs.ssn.digital');

const  fnPromise = () => {
  return  new  Promise(resolve  => {
    const  number = Math.random();
    resolve(number);
  });
};

promiseDelay()
  .then(() => {
    return  fnPromise();
  })
  .then(number  => {  
    console.log(number);
  });

```

### promiseRetry(fn, delay = 500, limit = 3) : {Promise}

Retry the promise again when it's failed with some sort of delay in `ms` and limit of times

```javascript

var { promiseRetry } = require('sdk.nodejs.ssn.digital');

const  fnPromise = () => {
  return  new  Promise((resolve, reject) => {
    const  number = Math.random();
    // this promise will failed sometimes
    if (number > 0.1) {
      reject(number);
    } else {
      resolve(number);
    }
  });
};

promiseRetry(fnPromise)
  .then(number  => {
    console.log(number);
  })
  .catch(number  => {
    console.error(number);
  });

```

### now() : {string}

Get today's datetime

```javascript

var { now } = require('sdk.nodejs.ssn.digital');

console.log(now()); // 2019-05-16 14:53:38

```

### today() : {string}

Get today's date

```javascript

var { today } = require('sdk.nodejs.ssn.digital');

console.log(now()); // 2019-05-16

```

### toLocalDateTime(datetime = new Date()) : {string}

Convert UTC Datetime to Local Datetime

```javascript

var { toLocalDateTime } = require('sdk.nodejs.ssn.digital');

console.log(toLocalDateTime('2019-05-07T08:51:00Z')); // 2019-05-07 14:51:00

```

### toLocalDate(datetime = new Date()) : {string}

Convert UTC Datetime to Local Date

```javascript

var { toLocalDate } = require('sdk.nodejs.ssn.digital');

console.log(toLocalDate('2019-05-07T08:51:00Z')); // 2019-05-07

```

### chString(value) : {string}

Wrap the provided value with a single quote for using in ClickHouse query with column type `string`

```javascript

var { chString } = require('sdk.nodejs.ssn.digital');

const  value = 'foo';

console.log(chString(value)); // return 'foo' NOT foo

```

### parseDate(String date) : {string|null}

Validate if the `date` value is valid and return valid format of date or null.

```javascript

var { parseDate } = require('sdk.nodejs.ssn.digital');

// Invalid date input

const  date = 'foo';

console.log(parseDate(date)); // return null

// Valid date input

const  date = '2019-07-22 00:00:00';

console.log(parseDate(date)); // return '2019-07-22'

```
# ssn-stream-error-slack

Send the error in the Stream to slack

### streamErrorSlack(slackWebHook, error) : {void}

Send an error in the stream file to Slack channel.

```javascript
var { streamErrorSlack } = require('sdk.nodejs.ssn.digital');

const error = new Error('Something went wrong');

// will send an error to slack channel
streamErrorSlack(slackWebHook, error);
```

# ssn-constants

The package that stored the frequently used constant values on SSN.

## Usage

```javascript
var ssnConstants = require('sdk.nodejs.ssn.digital');

console.log(ssnConstants.STATUS_PENDING); // pending
```

## Variables

```javascript
const STATUS_PENDING = 'pending';
const STATUS_VERIFYING = 'verifying';
const STATUS_COMPLETED = 'completed';
const STATUS_FAILED = 'failed';
const STATUS_CANCELED = 'canceled';
const STATUS_REJECTED = 'rejected';
```
# apiResponse

The package is use for api response standard format with options send to slack.

```javascript
const { apiResponse } = require('sdk.nodejs.ssn.digital');

// NOTE: Please use in middleware as example below:

module.exports = function (req, res, next) {
  const opts = {
    slack: true | false, // by default false is not send to slack
    name: 'environment',
    url: 'slack webhook url'
  }

  apiResponse(req, res, opts)
  next()
}
```