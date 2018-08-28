import { Form, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { ScrollView } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { connect } from 'react-redux'
import validator from 'validator'
import I18n from '../../../../../locales/i18n'
import { signUpActions } from '../../../../signup'
import { FlowButton } from '../../../design/buttons'
import { FlowContainer } from '../../../design/container'
import FlowInputValidated from '../../../design/flow-input-validated'
import FlowInput from '../../../design/flow-inputs'
import { StepTitle } from '../../../design/step-title'
import { Subheader } from '../../../design/subheader'
import { InvesteeIndustry } from './index'

class InvesteeProjectSetup extends React.Component {

  static BACKGROUND_COLOR = '#172D5C'

  constructor (props) {
    super(props)
    this.state = {
      ...{ projectName, projectTagline, projectDescription } = this.props.investee
    }
    this.state.isFormValid = this.isFormValid()
  }

  render () {
    return (
      <FlowContainer>
        <ScrollView contentContainerStyle={ { flexGrow: 1 } }>
          <View style={ { marginLeft: 32, marginRight: 32, marginTop: 32 } }>
            <StepTitle
              text={ I18n.t('flow_page.project_setup.title') }
            />
          </View>

          <Subheader
            text={ I18n.t('flow_page.project_setup.header') }
          />
          <View style={ styles.contentContainer }>
            <Form>
              <View style={ styles.inputContainer }>
                <FlowInputValidated
                  floatingLabel
                  value={ this.state.projectName }
                  placeholder={ I18n.t('flow_page.project_setup.project_name') }
                  labelText={ I18n.t('flow_page.project_setup.project_name') }
                  isError={ !this.validateProjectName(this.state.projectName) }
                  errorMessage={ I18n.t('common.errors.incorrect_project_name') }
                  onChangeText={ (newValue) => this.handleFieldChange(newValue, 'projectName') }/>
              </View>
              <View style={ styles.inputContainer }>
                <FlowInput
                  floatingLabel
                  placeholder={ I18n.t('flow_page.project_setup.project_tagline') }
                  labelText={ I18n.t('flow_page.project_setup.project_tagline') }
                  value={ this.state.projectTagline }
                  maxLength={ 60 }
                  status='regular'
                  onChangeText={ newValue => this.handleFieldChange(newValue, 'projectTagline') }/>
              </View>
              <View style={ styles.inputContainer }>
                <FlowInput
                  floatingLabel
                  multiline
                  numberOfLines={ 5 }
                  maxLength={ 250 }
                  value={ this.state.projectDescription }
                  placeholder={ I18n.t('flow_page.project_setup.project_description') }
                  labelText={ I18n.t('flow_page.project_setup.project_description') }
                  status='regular'
                  onChangeText={ newValue => this.handleFieldChange(newValue, 'projectDescription') }/>
              </View>
            </Form>
          </View>
        </ScrollView>
        <View style={ { margin: 8 } }>
          <FlowButton
            disabled={ !this.state.isFormValid }
            text={ I18n.t('common.next') }
            onPress={ this.handleSubmit }
          />
        </View>
      </FlowContainer>
    )
  }

  validateProjectName = (projectName) => {
    return validator.isLength(projectName, { min: 3 })
  }

  isFormValid = () => {
    const { projectName } = this.state
    const nameLength = this.validateProjectName(projectName)

    return nameLength
  }

  validateForm = () => {
    const isFormValid = this.isFormValid()
    this.setState({ isFormValid })
  }

  handleSubmit = () => {
    this.props.save({
      projectName: this.state.projectName,
      projectTagline: this.state.projectTagline,
      projectDescription: this.state.projectDescription
    })
    this.props.onFill({
      nextStep: InvesteeIndustry
    })
  }
  handleFieldChange = (value, name) => {
    this.setState({
      [ name ]: value
    }, this.validateForm)
  }
}

const styles = EStyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  inputContainer: {
    flex: 1,
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 16
  }
})

InvesteeProjectSetup.propTypes = {
  onFill: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    investee: state.signUp.investee
  }
}

const mapDispatchToProps = dispatch => {
  return {
    save: investeeInfo => dispatch(signUpActions.saveProfileInvestee(investeeInfo))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InvesteeProjectSetup)
