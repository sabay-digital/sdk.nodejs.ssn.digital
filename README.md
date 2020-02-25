# sdk.nodejs.ssn.digital

SDK NodeJS for **SSN**.

## Installation

Add the following to your `package.json`:

```json
{
	"sdk.nodejs.ssn.digital": "git+https://node-sdk:NgDzyF_yYszpry62sYxF@git.sabay.com/payment-network/sdk/sdk.nodejs.ssn.digital#master"
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
