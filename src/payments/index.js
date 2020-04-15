var axios = require('axios')
var querystring = require('querystring')
var StellarSDK = require('stellar-sdk')
var crypto = require('crypto')
/**
 * @param {string} from
 * @param {string} to
 * @param {string} assetIssuer
 * @param {string} amount
 * @param {string} memo
 * @param {string} assetCode
 * @param {string} api
 *
 * @returns {Promise<Object>}
 */

const CreatePayment = (from, to, amount, assetCode, assetIssuer, memo, api) => {
  return new Promise((resolve, reject) => {
   
    // Create transaction channel accounts on the ssn api
    return axios.post(api + '/create/transaction',
      querystring.stringify({
        from: from,
        to: to,
        amount: amount,
        memo: memo,
        asset_code: assetCode,
        asset_issuer: assetIssuer
      })
    )
      .then(result => {
        if (result.data.status === 200) {
          return resolve(result.data.envelope_xdr)
        } 
        return reject(null)
      })
      .catch(reject)
   
  })
}

/**
 * @param {string} xdr
 * @param {string} signer
 * @param {string} networkPassphrase
 *
 * @returns {Promise<Object>}
 */

const SignTxn = (xdr, signer, networkPassphrase) => new Promise((resolve, reject) => {
  try {
    // Load Transaction
    const transaction = new StellarSDK.Transaction(xdr, networkPassphrase)

    // Generate keypair
    const localSignerKeypair = StellarSDK.Keypair.fromSecret(signer)

    // get signature on transaction from keypair
    const signature = transaction.getKeypairSignature(localSignerKeypair)

    // sign transaction
    transaction.addSignature(localSignerKeypair.publicKey(), signature)

    // convert transaction to XDRString
    const xdrString = transaction.toEnvelope().toXDR('base64')
    return resolve(xdrString)
  }
  catch (error) {
    return reject(error)
  }
})

/**
 * @param {string} xdr
 * @param {string} signer
 *
 * @returns {Promise<Object>}
 */
// SignTxnService takes a base64 encoded XDR envelope and sends it to the specified sign service API
const SignTxnService = (xdr, signer) => new Promise((resolve, reject) => {
  try {
    const signRequest = {
      xdr_string: xdr
    }
    return axios.post(signer, signRequest)
    .then(result => {
      return resolve(result.data.xdr_string)
    })
    .catch(reject)
  }
  catch (error) {
    return reject(error)
  }
})

/**
 * @param {string} xdr
 * @param {string} api
 *
 * @returns {Promise<Object>}
 */

const SubmitTxn = (xdr, api) => new Promise((resolve, reject) => {
  try {
    return axios.post(api + '/transactions',
      querystring.stringify({
        tx: xdr
      })
    )
    .then((result) => {
      return resolve(result.data)
    })
    .catch(reject)
  }
  catch (error) {
    return reject(error)
  }
})


/**
 * @param {string} paymentAddress
 * @param {string} hash
 * @param {string} signature
 * @param {string} signer
 * @param {string} ssnAcc
 * @param {string} resolverURL
 * @des `This is a generic function for verify trust`
 * @return {Promise}
 */

const ResolvePA = (paymentAddress, hash, signature, signer, ssnAcc, resolverURL) => {
  return new Promise((resolve, reject) => {
    try {
      // resolve network address from payment address
      return axios.post(resolverURL + '/resolve/' + paymentAddress,
        querystring.stringify({
          hash: hash,
          signature: signature,
          signer: signer,
          ssn_account: ssnAcc
        })
      ).then(result => {
        if (result.data.status && result.data.status !== 200) {
          reject(result.data)
        }
        
        resolve(result.data)
      })
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * @param {string} destination
 * @param {string} asset
 * @param {string} assetIssuer
 * @param {string} api
 * @des `This is a generic function for verify trust`
 * @return {Promise}
 */

const VerifyTrust = (destination, asset, assetIssuer, api) => new Promise((resolve, reject) => {
  axios.post(api + '/verify/trust',
    querystring.stringify({
      account: destination,
      asset_code: asset,
      asset_issuer: assetIssuer
    })
  ).then(result => {
    if (result.data.status === 200 && result.data.title === 'asset will be accepted by account') {
      return resolve(true)
    }
    return resolve(false)
  }).catch(error => {
    if (error.response.data.status !== 200) {
      console.log(error.response)
      return resolve(false)
    }
    // UNEXPECTED ERROR
    return reject(error)
  })
})

/**
 * @param {string} publicKey
 * @param {string} signature
 * @param {string} message
 * @param {string} api
 * @returns {Promise<Object>}
 */
const VerifySignature = (message, signature, publicKey, api) => new Promise((resolve, reject) => {
  // CALL TO SSN API FOR CHECK TRUSTLINE
  return axios.post(api + '/verify/signature',
    querystring.stringify({
      public_key: publicKey,
      signature: signature,
      message: message
    })
  ).then(result => {
    if (result.data.status === 200) {
      return resolve(true)
    }
    return resolve(false)
  }).catch(error => {
    if (error.response.data.status !== 200) {
      console.log(error.response)
      return resolve(false)
    }
    // UNEXPECTED ERROR
    return reject(error)
  })
})

/**
 * @desc VerifySigner checks whether the provided signer is a signer on an SSN account
 * @param {string} signer
 * @param {string} ssnAccount
 * @return {Boolean}
 */
const VerifySigner = (signer, ssnAccount, api) => new Promise((resolve, reject) => {
  return axios.post(api + '/verify/signer', querystring.stringify({
    signer: signer,
    ssn_account: ssnAccount
  }))
    .then(result => {
      if (result.data.status === 200) {
        return resolve(true)
      }

      return resolve(false)
    }).catch(error => {
      if (error.response.data.status !== 200) {
        console.log(error.response)
        return resolve(false)
      }
      // UNEXPECTED ERROR
      return reject(error)
    })
})

/**
 * @desc verify home domain load from network and match with the home domain from payment address
 * @param {string} ssnAccount
 * @param {string} homeDomain
 * @param {string} api
 * @returns {Promise}
 */
const VerifyHomeDomain = (ssnAccount, homeDomain, api) => new Promise((resolve, reject) => {
  return axios.get(api + '/accounts/' + ssnAccount)
    .then(account => {
      if (account.data.home_domain && account.data.home_domain === homeDomain) {
        return resolve(true)
      }
      return resolve(false)
    }).catch(error => {
      console.log(error)
      return resolve(false)
    })
})

/**
 * 
 * @param {string} ssnAccountSK 
 * @param {string} message 
 * @return {Object}
 */
const GenerateResolverRequest = (ssnAccountSK, message) => new Promise((resolve, reject) => {
  try {
    const keyPair = StellarSDK.Keypair.fromSecret(ssnAccountSK)

    // Generate sha256 hash
    const hash = crypto.createHash('sha256')
    hash.update(message)
    const sha256Hash = hash.digest('hex')
    const str = Buffer.from(sha256Hash, 'hex')
    console.log(sha256Hash)
    console.log(str)
    console.log(str.toString('hex'))
    // sign signature
    const signature = keyPair.sign(str)
    
    const requestBody = {
      ssn_account: keyPair.publicKey(),
      signer: keyPair.publicKey(),
      hash: sha256Hash,
      signature: signature.toString('hex')
    }
    
    return resolve(requestBody)
  } catch (error) {
    return reject(error)
  }
})


module.exports = {
  CreatePayment,
  ResolvePA,
  VerifyTrust,
  SignTxn,
  SignTxnService,
  SubmitTxn,
  VerifySignature,
  VerifySigner,
  VerifyHomeDomain,
  GenerateResolverRequest
}


const ssnAccountSK = "SALGX3VE6EP6DJL6YJLUDDO6GMA5ZFS62EC5YVCWSDRHVTCACHYEZ5R5"
const message = "http://localhost:3000/v1/charge/onetime/37837941*master.mysabay.com"

GenerateResolverRequest(ssnAccountSK, message).then(result => {
  console.log(result)
})
