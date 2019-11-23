const log = require('../lib/log')
const Https = require('https')

const getConnectedEndpoints = (apiEndpoint, apiAccessToken) => {
  apiEndpoint = (apiEndpoint || '').replace('https://', '')

  return new Promise(((resolve, reject) => {
    var options = {
      host: apiEndpoint,
      path: '/v1/endpoints',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiAccessToken
      }
    }

    const request = Https.request(options, (response) => {
      response.setEncoding('utf8')
      let returnData = ''

      response.on('data', (chunk) => {
        returnData += chunk
      })

      response.on('end', () => {
        resolve(JSON.parse(returnData))
      })

      response.on('error', (error) => {
        reject(error)
      })
    })
    request.end()
  }))
}

const appendToSession = (handlerInput, key, value) => {
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()

  sessionAttributes[key] = value
  console.log(sessionAttributes)
  handlerInput.attributesManager.setSessionAttributes(sessionAttributes)
}

const getEndpointIdFromSession = (handlerInput) => {
  const attributesManager = handlerInput.attributesManager
  let sessionAttributes = attributesManager.getSessionAttributes()
  return sessionAttributes.endpointId
}

const getEndpointIdFromConnectedEndpoints = async (handlerInput) => {
  const { context } = handlerInput.requestEnvelope
  const { apiEndpoint, apiAccessToken } = context.System
  try {
    const response = await getConnectedEndpoints(apiEndpoint, apiAccessToken)
    log.info('v1/endpoints', response)
    const endpointId = (response.endpoints || []).length > 0 ?
      response.endpoints[0].endpointId :
      false

    return endpointId
  } catch (err) {
    console.log('ERRR', err)
    log.error(err)
    return false
  }
}

module.exports.appendToSession = appendToSession
module.exports.getEndpointIdFromConnectedEndpoints = getEndpointIdFromConnectedEndpoints
module.exports.getEndpointIdFromSession = getEndpointIdFromSession
