import { View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { connect } from 'react-redux'
import validator from 'validator'
import I18n from '../../../../../locales/i18n'
import { signUpActions } from '../../../../signup'
import { FlowButton } from '../../../design/buttons'
import { FlowContainer } from '../../../design/container'
import FlowInputValidated from '../../../design/flow-input-validated'
import { FlowListSwitch } from '../../../design/list-items'
import { CountrySelect } from '../../../design/select'
import { StepTitle } from '../../../design/step-title'
import { Subheader } from '../../../design/subheader'

const errorStyleOverride = {
  border: {
    borderColor: '#f2b9cb',
    borderBottomColor: '#f2b9cb'
  },
  text: {
    color: '#f2b9cb'
  }
}

class EmployeeKeywords extends React.Component {

  static BACKGROUND_COLOR = '#c72355'

  constructor (props) {
    super(props)
    this.state = {
      skills: this.props.employee.skills,
      traits: this.props.employee.traits,
      mostInfo: this.props.employee.mostInfo,
      relocate: this.props.employee.relocate,
      remote: this.props.employee.remote,
      country: this.props.employee.country,
      city: this.props.employee.city,
      age: this.props.employee.age,
      experience: this.props.employee.experience,
      // used to stop validation until Save button is hitted for the first time
      // unless field are already filled (editing)
      showValidationError: this.props.employee.skills !== '' || this.props.employee.traits !== '' || this.props.employee.mostInfo !== ''
    }
    this.state.isFormValid = this.isFormValid()
  }

  validateSkills = (skills) => {
    return skills.length > 0
  }

  validateTraits = (traits) => {
    return traits.length > 0
  }

  validateMostInfo = (mostInfo) => {
    return mostInfo.length > 0
  }

  validateJobCity = (city) => {
    return !validator.isEmpty(city)
  }

  validateAge = (amount) => {
    return validator.isEmpty(amount) ? true : validator.isNumeric(amount) && Number(amount) >= 18 && Number(amount) <= 120
  }

  validateExperience = (amount) => {
    return validator.isEmpty(amount) ? true : validator.isNumeric(amount) && Number(amount) >= 0 && Number(amount) <= 120
  }

  isFormValid = () => {
    const { skills, traits, mostInfo, city, age, experience } = this.state
    const skillsFilled = this.validateSkills(skills)
    const traitsFilled = this.validateTraits(traits)
    const mostInfoFilled = this.validateMostInfo(mostInfo)
    const jobCityFilled = this.validateJobCity(city)
    const ageValid = this.validateAge(age)
    const experienceValid = this.validateExperience(experience)
    return skillsFilled && traitsFilled && mostInfoFilled && jobCityFilled && ageValid && experienceValid
  }

  validateForm = () => {
    const isFormValid = this.isFormValid()
    this.setState({ isFormValid })
  }

  handleFieldChange = (newValue, name) => {
    this.setState({
      [ name ]: newValue
    }, this.validateForm)
  }

  render () {
    return (
      <FlowContainer>
        <View style={ { flex: 1, justifyContent: 'flex-start' } }>
          <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={96} enabled={Platform.OS === 'ios'}>
            <ScrollView contentContainerStyle={ { flexGrow: 1 } }>
              <View style={ { marginLeft: 32, marginRight: 32, marginTop: 32 } }>
                <StepTitle text={ I18n.t('flow_page.employee.role.about') }/>
              </View>
              <Subheader
                color={'white'}
                text={ I18n.t('flow_page.employee.skills.title') }
              />
              <View style={ { marginLeft: 8, marginRight: 8 } }>
                <FlowInputValidated
                  overrideStatus={ !this.state.showValidationError }
                  overrideStatusType={'regular'}
                  floatingLabel
                  value={ this.state.skills }
                  labelText={ I18n.t('flow_page.employee.skills.placeholder') }
                  isError={ this.state.showValidationError && !this.validateSkills(this.state.skills) }
                  errorMessage={ I18n.t('flow_page.employee.skills.error') }
                  errorStyleOverride={ errorStyleOverride }
                  onChangeText={ (newValue) => this.handleFieldChange(newValue, 'skills') }/>
                <FlowInputValidated
                  overrideStatus={ !this.state.showValidationError }
                  overrideStatusType={'regular'}
                  floatingLabel
                  value={ this.state.traits }
                  labelText={ I18n.t('flow_page.employee.traits.placeholder') }
                  isError={ this.state.showValidationError && !this.validateTraits(this.state.traits) }
                  errorMessage={ I18n.t('flow_page.employee.traits.error') }
                  errorStyleOverride={ errorStyleOverride }
                  onChangeText={ (newValue) => this.handleFieldChange(newValue, 'traits') }/>
                <FlowInputValidated
                  overrideStatus={ !this.state.showValidationError }
                  overrideStatusType={'regular'}
                  floatingLabel
                  value={ this.state.mostInfo }
                  labelText={ I18n.t('flow_page.employee.most_info.placeholder') }
                  isError={ this.state.showValidationError && !this.validateMostInfo(this.state.mostInfo) }
                  errorMessage={ I18n.t('flow_page.employee.most_info.error') }
                  errorStyleOverride={ errorStyleOverride }
                  onChangeText={ (newValue) => this.handleFieldChange(newValue, 'mostInfo') }/>

              </View>
              <Subheader
                color={'white'}
                text={ I18n.t('flow_page.employee.condition.title') }
              />
              <FlowListSwitch
                text={ I18n.t('flow_page.employee.relocate') }
                switchText={ this.state.relocate ? I18n.t('common.yes') : I18n.t('common.no') }
                onToggle={ () => this.handleCheck('relocate') }
                selected={ this.state.relocate }
              />
              <FlowListSwitch
                text={ I18n.t('flow_page.employee.remote') }
                switchText={ this.state.remote ? I18n.t('common.yes') : I18n.t('common.no') }
                onToggle={ () => this.handleCheck('remote') }
                selected={ this.state.remote }
              />
              <CountrySelect
                onChange={ value => {
                  this.setState({ country: { cca2: value.cca2, countryName: value.name, calling: value.callingCode } })
                } }
                value={ this.state.country }
                placeholder={ I18n.t('flow_page.investee.project_location.country_picker_placeholder') }
              />
              <View style={ { marginLeft: 8, marginRight: 8 } }>
                <FlowInputValidated
                  overrideStatus={ !this.state.showValidationError }
                  overrideStatusType={'regular'}
                  floatingLabel
                  value={ this.state.city }
                  labelText={ I18n.t('flow_page.employee.job.city') }
                  isError={ this.state.showValidationError && !this.validateJobCity(this.state.city) }
                  errorMessage={ I18n.t('common.errors.incorrect_job_city') }
                  errorStyleOverride={ errorStyleOverride }
                  onChangeText={ (newValue) => this.handleFieldChange(newValue, 'city') }/>
              </View>
              <Subheader
                color={'white'}
                text={ I18n.t('flow_page.employee.more.title') }
              />
              <View style={ { marginLeft: 8, marginRight: 8 } }>
                <FlowInputValidated
                  overrideStatus={ !this.state.showValidationError }
                  overrideStatusType={'regular'}
                  floatingLabel
                  keyboardType={'numeric'}
                  value={ this.state.age }
                  placeholder={ I18n.t('flow_page.employee.age.placeholder') }
                  labelText={ I18n.t('flow_page.employee.age.placeholder') }
                  isError={ this.state.showValidationError && !this.validateAge(this.state.age) }
                  errorMessage={ I18n.t('flow_page.employee.age.error') }
                  onChangeText={ (newValue) => this.handleFieldChange(newValue, 'age') } />
              </View>
              <View style={ { marginLeft: 8, marginRight: 8 } }>
                <FlowInputValidated
                  overrideStatus={ !this.state.showValidationError }
                  overrideStatusType={'regular'}
                  floatingLabel
                  keyboardType={'numeric'}
                  value={ this.state.experience }
                  placeholder={ I18n.t('flow_page.employee.experience.placeholder') }
                  labelText={ I18n.t('flow_page.employee.experience.placeholder') }
                  isError={ this.state.showValidationError && !this.validateExperience(this.state.experience) }
                  errorMessage={ I18n.t('flow_page.employee.experience.error') }
                  onChangeText={ (newValue) => this.handleFieldChange(newValue, 'experience') } />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
        <View style={ { margin: 8 } }>
          <FlowButton
            text={ I18n.t('common.next') }
            disabled={ this.state.showValidationError && !this.state.isFormValid }
            onPress={ this.handleSubmit }
          />
        </View>
      </FlowContainer>
    )
  }

  handleCheck = field => {
    this.setState({
      [ field ]: !this.state[ field ]
    })
  }

  handleSubmit = () => {
    // after first time hitting Save button, flip flag to enable showing validation errors
    if (!this.state.showValidationError) {
      this.setState( { showValidationError: true } )
    }
    if (this.state.isFormValid) {
      this.props.save({
        skills: this.state.skills,
        traits: this.state.traits,
        mostInfo: this.state.mostInfo,
        relocate: this.state.relocate,
        remote: this.state.remote,
        country: this.state.country,
        city: this.state.city,
        age: this.state.age,
        experience: this.state.experience
      })
      this.props.onFill({
        done: true
      })
    }
  }
}

EmployeeKeywords.propTypes = {
  onFill: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    employee: state.signUp.employee
  }
}

const mapDispatchToProps = dispatch => {
  return {
    save: saveEmployee => dispatch(signUpActions.saveEmployee(saveEmployee))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeKeywords)
