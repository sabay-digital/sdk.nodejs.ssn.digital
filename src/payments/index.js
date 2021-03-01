const axios = require('axios')
const axiosRetry = require('axios-retry')
const querystring = require('querystring')
const StellarSDK = require('stellar-sdk')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
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

const CreatePayment = async(from, to, amount, assetCode, assetIssuer, memo, api) => {
  try {
    // retries if it is a network error or a 5xx error when request
    await axiosRetry(axios, {
      retryDelay: (retryCount) => {

        return retryCount * 1000
      },
      retries: 5
    })

    // Create transaction channel accounts on the ssn api
    const result = await axios.post(api + '/create/transaction',
      querystring.stringify({
        from: from,
        to: to,
        amount: amount,
        memo: memo,
        asset_code: assetCode,
        asset_issuer: assetIssuer
      })
    )
    if (result.data.status === 200) {
      return result.data.envelope_xdr
    }
    throw new Error(result.data)

  } catch (error) {
    throw new Error(error)
  }  
}

/**
 * @param {string} xdr
 * @param {string} signer
 * @param {string} networkPassphrase
 *
 * @returns {Promise<Object>}
 */

const SignTxn = async(xdr, signer, networkPassphrase) => {
  try {
    // Load Transaction
    const transaction =  new StellarSDK.Transaction(xdr, networkPassphrase)

    // Generate keypair
    const localSignerKeypair = await StellarSDK.Keypair.fromSecret(signer)

    // get signature on transaction from keypair
    const signature = await transaction.getKeypairSignature(localSignerKeypair)

    // sign transaction
    transaction.addSignature(localSignerKeypair.publicKey(), signature)

    // convert transaction to XDRString
    const xdrString = transaction.toEnvelope().toXDR('base64')
    return xdrString
  }
  catch (error) {
    throw new Error(error)
  }
}

/**
 * @param {string} xdr
 * @param {string} signer
 * @param {string} jwtkey
 *
 * @returns {Promise<Object>}
 */
// SignTxnService takes a base64 encoded XDR envelope and sends it to the specified sign service API
const SignTxnService = async(xdr, signer, jwtkey) => {

  try {
    // retries if it is a network error or a 5xx error when request
    await axiosRetry(axios, {
      retryDelay: (retryCount) => {
  
        return retryCount * 1000
      },
      retries: 5
    })

    const token = jwt.sign({ 
      exp: Math.floor(Date.now() / 1000) + 60,
      iss: "SSN",
      sub: "Sign txn request"
    }, Buffer.from(jwtkey, 'base64'))
  
    const signRequest = {
      envelope_xdr: xdr,
      access_token: token
    }

    const result = await axios.post(signer, signRequest)
    return result.data.envelope_xdr
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * @param {string} xdr
 * @param {string} api
 *
 * @returns {Promise<Object>}
 */

const SubmitTxn = async(xdr, api) => {
  try {
    // retries if it is a network error or a 5xx error when request
    await axiosRetry(axios, {
      retryDelay: (retryCount) => {

        return retryCount * 1000
      },
      retries: 5
    })

    const result = await axios.post(api + '/transactions', querystring.stringify({tx: xdr}))
    return result.data
  } catch (error) {
    throw new Error(error)
  }
}


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

const ResolvePA = async(paymentAddress, hash, signature, signer, ssnAcc, resolverURL) => {
  try {
    const result = await axios.post(resolverURL + '/resolve/' + paymentAddress,
      querystring.stringify({
        hash: hash,
        signature: signature,
        signer: signer,
        ssn_account: ssnAcc
      })
    )

    return result.data
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * @param {string} destination
 * @param {string} asset
 * @param {string} assetIssuer
 * @param {string} api
 * @des `This is a generic function for verify trust`
 * @return {Promise}
 */

const VerifyTrust = async(destination, asset, assetIssuer, api) => {
  try {
    const result = await axios.post(api + '/verify/trust',
                                    querystring.stringify({
                                      account: destination,
                                      asset_code: asset,
                                      asset_issuer: assetIssuer
                                    }))

    if (result.data.status === 200 && result.data.title === 'asset will be accepted by account') {
      return true
    }
    return false
  } catch (error) {
    throw new Error(error)
  } 
}

/**
 * @param {string} publicKey
 * @param {string} signature
 * @param {string} message
 * @param {string} api
 * @returns {Promise<Object>}
 */
const VerifySignature = async(message, signature, publicKey, api) => {
  // CALL TO SSN API FOR CHECK TRUSTLINE
  try {
    const result = await axios.post(api + '/verify/signature',
                                    querystring.stringify({
                                      public_key: publicKey,
                                      signature: signature,
                                      message: message
                                    }))

    if (result.data.status === 200) {
      return true
    }
    return false

  } catch (error) {
    throw new Error(error)
  }
}

/**
 * @desc VerifySigner checks whether the provided signer is a signer on an SSN account
 * @param {string} signer
 * @param {string} ssnAccount
 * @return {Boolean}
 */
const VerifySigner = async(signer, ssnAccount, api) => {
  try {
    const result = await axios.post(api + '/verify/signer', querystring.stringify({
      signer: signer,
      ssn_account: ssnAccount
    }))

    if (result.data.status === 200) {
      return true
    }

    return false

  } catch (error) {
    throw new Error(error)
  } 
}

/**
 * @desc verify home domain load from network and match with the home domain from payment address
 * @param {string} ssnAccount
 * @param {string} homeDomain
 * @param {string} api
 * @returns {Promise}
 */
const VerifyHomeDomain = async(ssnAccount, homeDomain, api) => {
  try {
    const account = await axios.get(api + '/accounts/' + ssnAccount)

    if (account.data.home_domain && account.data.home_domain === homeDomain) {
      return true
    }
    return false

  } catch (error) {
    throw new Error(error)
  }
}

/**
 * 
 * @param {string} ssnAccountSK 
 * @param {string} message 
 * @return {Object}
 */
const GenerateResolverRequest = async(ssnAccountSK, message) => {
  try {
    const keyPair = await StellarSDK.Keypair.fromSecret(ssnAccountSK)

    // Generate sha256 hash
    const hash = crypto.createHash('sha256')
    hash.update(message)
    const sha256Hash = hash.digest('hex')
    const str = Buffer.from(sha256Hash, 'hex')
    
    // sign signature
    const signature = keyPair.sign(str)
    
    const requestBody = {
      ssn_account: keyPair.publicKey(),
      signer: keyPair.publicKey(),
      hash: sha256Hash,
      signature: signature.toString('hex')
    }
    
    return requestBody
  } catch (error) {
    throw new Error(error)
  }
}


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