import { Button, Card, Container, Content, Form, Icon, Input, Item, Label, Text } from 'native-base'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import { connect } from 'react-redux'
import validator from 'validator'
import I18n from '../../../../locales/i18n'
import { PAGES_NAMES } from '../../../navigation/pages'
import { signUpActions } from '../../../signup'

export class SignupPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      phone: '',
      isFormValid: false
    }
  }

  validateForm = () => {
    const isEmailValid = validator.isEmail(this.state.email)
    const isPasswordValid = validator.isLength(this.state.password, { min: 8, max: undefined })
    const isPhoneValid = validator.isMobilePhone(this.state.phone, 'any') && validator.isLength(this.state.phone,
      { min: 9, max: 20 })
    const isFormValid = isEmailValid && isPasswordValid && isPhoneValid
    this.setState({ isFormValid })
  }

  handleSubmit = () => {
    if (this.state.isFormValid) {
      this.props.navigation.navigate(PAGES_NAMES.FLOW_PAGE)
    }
  };

  handleFieldChange = (newValue, name) => {
    this.setState({
      [ name ]: newValue
    }, this.validateForm)
  }

  handleSubmit = async () => {
    const { email, password, phone } = this.state
    const { signup, navigation } = this.props
    try {
      await signup({
        email, password, phone
      })
      navigation.navigate(PAGES_NAMES.FLOW_PAGE)
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    return (
      <Container>
        <Content padder>
          <Card style={ { padding: 8 } }>
            <Form>
              <Item floatingLabel>
                <Icon active name='email' type='MaterialCommunityIcons'/>
                <Label>{ I18n.t('signup_page.email_placeholder') }</Label>
                <Input keyboardType={ 'email-address' }
                       onChangeText={ (newValue) => this.handleFieldChange(newValue, 'email') }
                       value={ this.state.email }/>
              </Item>
              <Item floatingLabel>
                <Icon active name='lock'/>
                <Label>{ I18n.t('signup_page.password_placeholder') }</Label>
                <Input secureTextEntry={ true }
                       onChangeText={ (newValue) => this.handleFieldChange(newValue, 'password') }
                       value={ this.state.password }/>
              </Item>
              <Item floatingLabel>
                <Icon active name='phone' type='MaterialCommunityIcons'/>
                <Label>{ I18n.t('signup_page.phone_placeholder') }</Label>
                <Input keyboardType={ 'phone-pad' }
                       onChangeText={ (newValue) => this.handleFieldChange(newValue, 'phone') }
                       value={ this.state.phome }
                />
              </Item>
            </Form>
            <Button
              success
              rounded
              block
              disabled={ !this.state.isFormValid }
              style={ styles.button }
              onPress={ () => this.handleSubmit() }>
              <Text>{ I18n.t('signup_page.button') }</Text>
            </Button>
          </Card>
        </Content>
      </Container>
    )
  }
}

const styles = EStyleSheet.create({
  button: {
    marginTop: 30
  },
  pickerPlaceHolder: {
    color: '#bfc6ea'
  }
})

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    signup: data => dispatch(signUpActions.signup(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage)
