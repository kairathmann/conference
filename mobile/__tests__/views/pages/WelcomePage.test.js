import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import React from 'react'
import { PAGES_NAMES } from '../../../src/navigation'
import { OutlineWhiteButton, PrimaryButton } from '../../../src/views/design/buttons'
import WelcomePage from '../../../src/views/pages/welcome/welcome-page'

Enzyme.configure({ adapter: new Adapter() })

describe('WelcomePage Component', () => {
  jest.useFakeTimers()

  it('renders without crashing', () => {
    const navigation = { navigate: jest.fn() }
    const rendered = shallow(<WelcomePage navigation={ navigation }/>)
    expect(rendered).not.toBe(null)
  })

  it('clicking login button should change navigation to LOGIN_PAGE', () => {
    const navigation = { navigate: jest.fn() }
    const wrapper = shallow(<WelcomePage navigation={ navigation }/>)
    const loginButton = wrapper.find(PrimaryButton).first()
    const loginButtonProps = loginButton.props()
    // Click Button
    loginButtonProps.onPress()
    expect(navigation.navigate.mock.calls.length).toBe(1)
    expect(navigation.navigate.mock.calls[ 0 ][ 0 ]).toBe(PAGES_NAMES.LOGIN_PAGE)
  })

  it('clicking sign up button should change navigation to SIGNUP_PAGE', () => {
    const navigation = { navigate: jest.fn() }
    const wrapper = shallow(<WelcomePage navigation={ navigation }/>)
    const signUpButton = wrapper.find(OutlineWhiteButton).first()
    const signUpButtonProps = signUpButton.props()
    // Click Button
    signUpButtonProps.onPress()
    expect(navigation.navigate.mock.calls.length).toBe(1)
    expect(navigation.navigate.mock.calls[ 0 ][ 0 ]).toBe(PAGES_NAMES.SIGNUP_PAGE)
  })
})
