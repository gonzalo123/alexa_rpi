const log = require('../lib/log')
const utils = require('../lib/utils')

const buildLEDDirective = (endpointId, color) => {
  return {
    type: 'CustomInterfaceController.SendDirective',
    header: {
      name: 'setColor',
      namespace: 'Custom.gonzalo123'
    },
    endpoint: {
      endpointId: endpointId
    },
    payload: {
      color: color
    }
  }
}

const ColorHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ColorIntent'
  },
  handle (handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
    const cardTitle = requestAttributes.t('SKILL_NAME')

    const endpointId = utils.getEndpointIdFromSession(handlerInput)
    if (!endpointId) {
      log.error('endpoint', error)
      return handlerInput.responseBuilder.
        speak(error).
        getResponse()
    }

    const color = handlerInput.requestEnvelope.request.intent.slots['color'].value
    log.info('color', color)
    log.info('endpointId', endpointId)

    return handlerInput.responseBuilder.
      speak(`Ok. The selected color is ${color}`).
      withSimpleCard(cardTitle, color).
      addDirective(buildLEDDirective(endpointId, color)).
      getResponse()
  }
}

module.exports = ColorHandler
