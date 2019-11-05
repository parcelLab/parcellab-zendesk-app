/* eslint-env jest, browser */
import App from '../src/javascripts/modules/app'
jest.mock('../src/javascripts/lib/zafClient', () => {
  return {
    invoke: jest.fn(),
    metadata: jest.fn().mockReturnValue(Promise.resolve({
      settings: {
        userId: '123',
        orderNumberTickeFieldId: ''
      }
    })),
    get: jest.fn().mockReturnValue(Promise.resolve({
      currentUser: {
        name: 'Timmy Testface'
      }
    }))
  }
})

describe('ParcelLab App', () => {
  describe('Initialization Success', () => {
    beforeEach(async () => {
      document.body.innerHTML = '<section data-main id="root"><img class="loader" src="spinner.gif"/></section>'
      await new App({})
    })

    it('should render main stage with data', () => {
      expect(document.querySelector('#root')).not.toBe(null)
      expect(document.querySelector('h1').textContent).toContain('Hello Timmy Testface')
    })
  })
})
