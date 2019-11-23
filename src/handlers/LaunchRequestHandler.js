const log = require('../lib/log')
const utils = require('../lib/utils')

const LaunchRequestHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },

  async handle (handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
    const endpointId = utils.getEndpointIdFromSession(handlerInput)
    const error = requestAttributes.t('NO_GADGETS_FOUND')
    const cardTitle = requestAttributes.t('SKILL_NAME')
    const reprompt = requestAttributes.t('FOLLOW_UP_MESSAGE')

    if (!endpointId) {
      log.error('endpoint', error)
      return handlerInput.responseBuilder.
        speak(error).
        getResponse()
    }

    return handlerInput.responseBuilder.
      speak(requestAttributes.t('GREETING_MESSAGE') + requestAttributes.t('HELP_MESSAGE')).
      reprompt(reprompt).
      withSimpleCard(cardTitle, requestAttributes.t('GREETING_MESSAGE')).
      getResponse()
  }
}

module.exports = LaunchRequestHandler

