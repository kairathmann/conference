import { Container, Content, Text } from 'native-base'
import React from 'react'
import { Image, View } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import validator from 'validator'
import I18n from '../../../../locales/i18n'
import BlackLogo from '../../../assets/logos/ico_black.png'
import PoweredLuna from '../../../assets/logos/login_logo.png'
import { PAGES_NAMES } from '../../../navigation/pages'
import { signUpActions } from '../../../signup'
import Header from '../../components/header/header'
import { BlackButton } from '../../design/buttons'
import InputValidated from '../../design/input-validated'
import { auth as styles } from '../../styles/common'

export class SignupPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      // used to stop validation until Sign Up button is hitted for the first time
      showValidationError: false,
      isFormValid: false
    }
  }

  validateEmail = (email) => {
    return validator.isEmail(email)
  }

  validatePassword = (password) => {
    return validator.isLength(password, { min: 8, max: undefined })
  }

  validateForm = () => {
    const isEmailValid = this.validateEmail(this.state.email)
    const isPasswordValid = this.validatePassword(this.state.password)
    const isFormValid = isEmailValid && isPasswordValid
    this.setState({ isFormValid })
  }

  handleFieldChange = (newValue, name) => {
    if (this.props.isError) {
      this.props.clearErrors()
    }
    this.setState({
      [ name ]: newValue
    }, this.validateForm)
  }

  handleSubmit = () => {
    const { email, password } = this.state
    const { signup } = this.props
    if (this.state.isFormValid) {
      signup({ email, password })
    }
    // after first time hitting Sign Up button, flip flag to enable showing validation errors
    if (!this.state.showValidationError) {
      this.setState( { showValidationError: true } )
    }
  }

  render () {
    const isEmailFieldError = (!this.validateEmail(this.state.email) || this.props.isError) && this.state.showValidationError
    const emailErrorMessage = this.props.isError ? this.props.errorMessage : I18n.t('common.errors.incorrect_email')
    return (
      <SafeAreaView style={ { flex: 1, backgroundColor: '#FFFFFF' } } forceInset={ { top: 'always' } }>
        <Container>
          <Content>
            <Header
              title={ I18n.t('signup_page.title') }
              titleStyle={ { color: 'black' } }
              rightIconSource={ BlackLogo }/>
            <View style={ styles.contentContainer }>
              <View style={ styles.inputContainer }>
                <InputValidated value={ this.state.email }
                                isError={ isEmailFieldError }
                                overrideStatus={ !this.state.showValidationError }
                                overrideStatusType={'regular'}
                                errorMessage={ emailErrorMessage }
                                keyboardType='email-address'
                                labelText={ I18n.t('signup_page.email_placeholder').toUpperCase() }
                                placeholder="email@domain.com"
                                onChangeText={ (newValue) => this.handleFieldChange(newValue, 'email') }/>
              </View>
              <View style={ styles.inputContainer }>
                <InputValidated value={ this.state.password }
                                isSecure
                                isError={ !this.validatePassword(this.state.password) && this.state.showValidationError }
                                overrideStatus={ !this.state.showValidationError }
                                overrideStatusType={'regular'}
                                errorMessage={ I18n.t('common.errors.incorrect_password') }
                                labelText={ I18n.t('signup_page.password_placeholder').toUpperCase() }
                                placeholder='********'
                                onChangeText={ (newValue) => this.handleFieldChange(newValue, 'password') }/>
              </View>
              <View style={ styles.lunaContainer }>
                <Image style={ { width: 123, height: 52 } } source={ PoweredLuna }/>
              </View>
              <View style={ styles.button }>
                <BlackButton
                  disabled={ this.state.showValidationError && !this.state.isFormValid }
                  text={ I18n.t('signup_page.button') }
                  onPress={ () => this.handleSubmit() }/>
              </View>
              <View style={ styles.textStyling }>
                <Text>{ I18n.t('signup_page.change_mind') }</Text>
                <Text onPress={ () => this.props.navigation.navigate(PAGES_NAMES.LOGIN_PAGE) }
                      style={ styles.login }>{ I18n.t('signup_page.login') }</Text>
              </View>
              <View style={ styles.policyAndConditionsWrapper }>
                <Text style={ styles.policyAndConditions }
                      onPress={ () => this.props.navigation.navigate(PAGES_NAMES.PRIVACY_POLICY_PAGE) }>
                  { I18n.t('signup_page.privacy_policy') }
                </Text>
                <Text style={ styles.policyAndConditions }>
                  &amp;
                </Text>
                <Text style={ styles.policyAndConditions }
                      onPress={ () => this.props.navigation.navigate(PAGES_NAMES.TERMS_OF_SERVICE_PAGE) }>
                  { I18n.t('signup_page.terms_and_conditions') }
                </Text>
              </View>
            </View>
          </Content>
        </Container>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => {
  return {
    isError: state.signUp.auth.signup.isError,
    errorMessage: state.signUp.auth.signup.errorMessage
  }
}

const mapDispatchToProps = dispatch => {
  return {
    signup: data => dispatch(signUpActions.signup(data)),
    clearErrors: () => dispatch(signUpActions.clearSignUpError())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage)
