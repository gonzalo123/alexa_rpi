const when = require('./steps/when')
const { init } = require('./steps/init')
const translation = require('../src/i18n/languageStrings').en.translation


describe('When we invoke the skill', () => {
  beforeAll(() => {
    init()
  })

  test('launch intent', async () => {
    const res = await when.we_invoke_intent(require('./events/use_skill'))
    const card = res.response.card
    expect(card.title).toBe(translation.SKILL_NAME)
    expect(card.content).toBe('red')
  })
})
