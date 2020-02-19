var axios = require('axios')
var querystring = require('querystring')
var StellarSDK = require('stellar-sdk')

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
      resolve(true)
    }
    resolve(false)
  }).catch(reject)
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
  ).then(result => resolve(result)).catch(reject)
})

module.exports = {
  CreatePayment,
  ResolvePA,
  VerifyTrust,
  SignTxn,
  SignTxnService,
  SubmitTxn,
  VerifySignature
}
