var {
  CreatePayment,
  ResolvePA,
  VerifyTrust,
  SignTxn,
  SignTxnService,
  SubmitTxn
} = require('./payments/index')

module.exports = {
  CreatePayment,
  ResolvePA,
  VerifyTrust,
  SignTxn,
  SignTxnService,
  SubmitTxn,
  VerifySignature
}

// const from = 'GCDOUWMTDCD6CBWZJRMJHAPRMTIR6FPN7EW774OFV3R7ZT6DVZNW2BGM'
// const to = 'GBDUGGSX77F3RXSCTJM4HR5SGKP63XBRDKXB3QVOTM6LVDOHVEE2PEE2' 
// const issuer = 'GCDOUWMTDCD6CBWZJRMJHAPRMTIR6FPN7EW774OFV3R7ZT6DVZNW2BGM'
// const amount = '1' 
// const memo = '37837941' 
// const assetCode = 'USD' 
// const apiUrl = 'https://api.master.ssn.digital/v1'

// CreatePayment(from, to, issuer, amount, memo, assetCode, apiUrl)
// .then(res => {
//   console.log(res)
// })
// .catch(err => {
//   console.log(err)
// })


// const xdr = 'AAAAAC7eWgo9IdmS5gooior5q3VkSfbGnVb26B3rSjFop10lATEtAAAMFYIAAAAJAAAAAQAAAAAAAAAAAAAAAF5Et08AAAABAAAACDM3ODM3OTQxAAAAAgAAAAEAAAAAhupZkxiH4QbZTFiTgfFk0R8V7fkt//HFruP8z8OuW20AAAABAAAAAEdDGlf/y7jeQppZw8eyMp/t3DEarh3Crps8uo3HqQmnAAAAAVVTRAAAAAAAhupZkxiH4QbZTFiTgfFk0R8V7fkt//HFruP8z8OuW20AAAAAAJiWgAAAAAEAAAAAhupZkxiH4QbZTFiTgfFk0R8V7fkt//HFruP8z8OuW20AAAABAAAAAKUGWAe3RxWrp9YirEcbho/QDkp0oyPiPD6ry5czjoEXAAAAAAAAAAAADDUAAAAAAAAAAAFop10lAAAAQGwuNA/29y28iWLrrusVCW3/nVAoglbq68fM11J9NRIXyYNKwajdLNY5WvVFmf7yq6Y1RNHVO/kS22lJQlZgogA='
// const signer = 'SA77E3SZNROBZO44OW2EFJELROVCKMDLM74A66ECY4FWSAF3LRIP5Y4M'
// const networkPassphrase = 'ssn_master_network'
// SignTxn(xdr, signer, networkPassphrase)
//   .then(res => {
//     console.log(res)
//   })
//   .catch(err => {
//     console.log(err)
//   })


// const xdr = 'AAAAAC7eWgo9IdmS5gooior5q3VkSfbGnVb26B3rSjFop10lATEtAAAMFYIAAAAJAAAAAQAAAAAAAAAAAAAAAF5Et08AAAABAAAACDM3ODM3OTQxAAAAAgAAAAEAAAAAhupZkxiH4QbZTFiTgfFk0R8V7fkt//HFruP8z8OuW20AAAABAAAAAEdDGlf/y7jeQppZw8eyMp/t3DEarh3Crps8uo3HqQmnAAAAAVVTRAAAAAAAhupZkxiH4QbZTFiTgfFk0R8V7fkt//HFruP8z8OuW20AAAAAAJiWgAAAAAEAAAAAhupZkxiH4QbZTFiTgfFk0R8V7fkt//HFruP8z8OuW20AAAABAAAAAKUGWAe3RxWrp9YirEcbho/QDkp0oyPiPD6ry5czjoEXAAAAAAAAAAAADDUAAAAAAAAAAAJop10lAAAAQGwuNA/29y28iWLrrusVCW3/nVAoglbq68fM11J9NRIXyYNKwajdLNY5WvVFmf7yq6Y1RNHVO/kS22lJQlZgogBLS+6OAAAAQAg+2/Pn6wvEHOOusSLB5s4b2UVVMhQ9nZ7MyxRVIiZSt6dAEc2nd4E0bjFZFvdmlOugAa6/j1Q9vDUZ6l0qBAE='
// const signerApiUrl = 'https://cashier-signer01.master.ssn.digital/api/sign'
// SignTxnService(xdr, signerApiUrl)
//   .then(res => {
//     console.log(res)
//     // data: {
//     //  xdr_string: 'AAAAAKg7eyXshGEyW4UmRefLkA/kVrdsXxWCjU6vhYgfUf+RATEtAAALpqMAAAAPAAAAAQAAAAAAAAAAAAAAAF5D2X4AAAABAAAACDM3ODM3OTQxAAAAAgAAAAEAAAAAHCeqGJ/xbFJSIRG7uP1xReBr3r44O1v/iiFiHppsAQ0AAAABAAAAAEdDGlf/y7jeQppZw8eyMp/t3DEarh3Crps8uo3HqQmnAAAAAVVTRAAAAAAAHCeqGJ/xbFJSIRG7uP1xReBr3r44O1v/iiFiHppsAQ0AAAAAAJiWgAAAAAEAAAAAHCeqGJ/xbFJSIRG7uP1xReBr3r44O1v/iiFiHppsAQ0AAAABAAAAAKUGWAe3RxWrp9YirEcbho/QDkp0oyPiPD6ry5czjoEXAAAAAAAAAAAADDUAAAAAAAAAAAMfUf+RAAAAQAevPm0HY/7etJqu/iFgEqsSy10PlL7Cb5dSGgPz6LUT6LQxWFKHYWjgDtnEuqjcj4pMiGGCKOyiQwFBnI6G1gd103tzAAAAQH1Id1kU+CP8l4TwTdS+Rg1VZqKNoy+/DHCPMx//IleJ+FCcQbLa7JZQ6GPyx5V7ff77iN0vjaB0/9zdBo0PKAPWxLOCAAAAQKDcJVl8Up/8tgh4lKblegru+vvbw7G6MsP3L6KXPJfFfGwRRnbeiC4MlnJomoJ5VwQkN1P7uVnkVHcqWOcghAo='
//    // }
//   })
//   .catch(err => {
//     console.log(err)
//   })



