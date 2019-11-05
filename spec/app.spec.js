/* eslint-env jest, browser */
import App from '../src/javascripts/modules/app'
jest.mock('../src/javascripts/lib/zafclienthelper', () => {
  return {
    resizeContainer: jest.fn(),
    getAppSettings: jest.fn().mockReturnValue(Promise.resolve({
      userId: '123',
      orderNumberTickeFieldId: ''
    })),
    getCurrentUserDetails: jest.fn().mockReturnValue(Promise.resolve({
      locale: 'en'
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
    })
  })
})
