import { Button, Card, Form, Left, ListItem, Switch, Text, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { StyleSheet } from 'react-native'
import CountryPicker from 'react-native-country-picker-modal'
import { Chip, Selectize } from 'react-native-material-selectize'
import { connect } from 'react-redux'
import validator from 'validator'
import I18n from '../../../../../locales/i18n'
import { SKILLS, TRAITS } from '../../../../enums'
import { signUpActions } from '../../../../signup'
import ValidatedInput from '../../../components/validated-input/validated-input'

class EmployeeKeywords extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      skills: this.props.employee.skills,
      traits: this.props.employee.traits,
      mostInfo: this.props.employee.mostInfo,
      relocate: this.props.employee.relocate,
      remote: this.props.employee.remote,
      country: this.props.employee.country || {
        cca2: 'US',
        countryName: 'United States of America',
        callingCode: '1'
      },
      city: this.props.employee.city
    }
    this.state.isFormValid = this.isFormValid()
  }

  validateSelectedSkills = (selectedSkills) => {
    return selectedSkills.length > 0 && selectedSkills.length < 4
  }

  validateSelectedTraits = (selectedTraits) => {
    return selectedTraits.length > 0 && selectedTraits.length < 4
  }

  validateMostInfo = (mostInfo) => {
    return mostInfo.length > 0
  }

  isFormValid = () => {
    const { skills, traits, mostInfo } = this.state
    const skillsFilled = this.validateSelectedSkills(skills)
    const traitsFilled = this.validateSelectedTraits(traits)
    const mostInfoFilled = this.validateMostInfo(mostInfo)
    return skillsFilled && traitsFilled && mostInfoFilled
  }

  validateForm = () => {
    const isFormValid = this.isFormValid()
    this.setState({ isFormValid })
  }

  onChipAdded = (collection, chipToAdd, callBack) => {
    const itemsCopy = [ ...this.state[ collection ] ]
    itemsCopy.push(chipToAdd)
    this.setState({ [ collection ]: itemsCopy }, this.validateForm)
    callBack(true)
  }

  onChipRemoved = (collection, chipToRemove, callBack) => {
    const itemsCopy = [ ...this.state[ collection ] ]
    const idOfChipToRemove = chipToRemove.id
    const filteredChips = itemsCopy.filter(singleChip => singleChip.id !== idOfChipToRemove)
    this.setState({ [ collection ]: filteredChips }, this.validateForm)
    callBack(true)
  }

  handleFieldChange = (newValue, name) => {
    this.setState({
      [ name ]: newValue
    }, this.validateForm)
  }

  validateJobCity = (city) => {
    return !validator.isEmpty(city)
  }

  render () {
    return (
      <Card style={ { padding: 8 } }>
        <Text style={ { fontSize: 24 } }>{ I18n.t('flow_page.employee.skills.header') }</Text>
        <Selectize
          selectedItems={ this.state.skills }
          items={ SKILLS }
          label={ I18n.t('flow_page.employee.skills.title') }
          textInputProps={ {
            placeholder: I18n.t('flow_page.employee.skills.placeholder')
          } }
          renderRow={ (id, onPress, item) => (
            <ListItem style={ styles.listRow } key={ id } onPress={ () => this.onChipAdded('skills', item, onPress) }>
              <Text>{ item.text }</Text>
            </ListItem>
          ) }
          renderChip={ (id, onClose, item, style, iconStyle) => (
            <Chip
              key={ id }
              iconStyle={ iconStyle }
              onClose={ () => this.onChipRemoved('skills', item, onClose) }
              text={ item.text }
              style={ style }
            />
          ) }
        />
        { !this.validateSelectedSkills(this.state.skills) && (
          <Text style={ styles.errorText }>{ I18n.t('flow_page.employee.skills.error') }</Text>
        ) }
        <Text style={ { fontSize: 24 } }>{ I18n.t('flow_page.employee.traits.header') }</Text>
        <Selectize
          selectedItems={ this.state.traits }
          items={ TRAITS }
          label={ I18n.t('flow_page.employee.traits.title') }
          textInputProps={ {
            placeholder: I18n.t('flow_page.employee.traits.placeholder')
          } }
          renderRow={ (id, onPress, item) => (
            <ListItem style={ styles.listRow } key={ id } onPress={ () => this.onChipAdded('traits', item, onPress) }>
              <Text>{ item.text }</Text>
            </ListItem>
          ) }
          renderChip={ (id, onClose, item, style, iconStyle) => (
            <Chip
              key={ id }
              iconStyle={ iconStyle }
              onClose={ () => this.onChipRemoved('traits', item, onClose) }
              text={ item.text }
              style={ style }
            />
          ) }
        />
        { !this.validateSelectedTraits(this.state.traits) && (
          <Text style={ styles.errorText }>{ I18n.t('flow_page.employee.traits.error') }</Text>
        ) }
        <Text style={ { fontSize: 24 } }>{ I18n.t('flow_page.employee.most_info.header') }</Text>
        <Form>
          <ValidatedInput floatingLabel
                          value={ this.state.mostInfo }
                          labelText={ I18n.t('flow_page.employee.most_info.placeholder') }
                          isError={ !this.validateMostInfo(this.state.mostInfo) }
                          errorMessage={ I18n.t('flow_page.employee.most_info.error') }
                          onChangeText={ (newValue) => this.handleFieldChange(newValue, 'mostInfo') }/>
        </Form>
        <Text style={ { fontSize: 24 } }>{ I18n.t('flow_page.employee.location.header') }</Text>
          <CountryPicker
              style={ { marginTop: 16 } }
              onChange={ value => {
                  this.setState({
                      country: { cca2: value.cca2, countryName: value.name, calling: value.callingCode }
                  })
              } }
              filterable
              closeable
              cca2={ this.state.country.cca2 }
              translation="eng"
              styles={ {
                  touchFlag: {
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      height: 24
                  },
              } }
          >

              <View style={ {
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  height: 19
              } }>
                  { CountryPicker.renderFlag(this.state.country.cca2) }
                  <Text style={ { marginLeft: 8 } }>{ this.state.country.countryName }</Text>
              </View>
          </CountryPicker>
          <ValidatedInput floatingLabel
                          style={ { marginTop: 16 } }
                          multiline={ true }
                          numberOfLines={ 5 }
                          value={ this.state.city }
                          labelText={ I18n.t('flow_page.employee.job.city') }
                          isError={ !this.validateJobCity(this.state.city) }
                          errorMessage={ I18n.t('common.errors.incorrect_job_city') }
                          onChangeText={ (newValue) => this.handleFieldChange(newValue, 'city') }/>
        <ListItem>
          <Left>
            <Switch
              onValueChange={ () => this.handleCheck('relocate') }
              value={ this.state.relocate }/>
            <Text style={ { marginLeft: 8 } }>{ I18n.t('flow_page.employee.relocate') }</Text>
          </Left>
        </ListItem>
        <ListItem style={ { marginBottom: 16 } }>
          <Left>
            <Switch
              onValueChange={ () => this.handleCheck('remote') }
              value={ this.state.remote }/>
            <Text style={ { marginLeft: 8 } }>{ I18n.t('flow_page.employee.remote') }</Text>
          </Left>
        </ListItem>
        <Button success
                rounded
                block
                disabled={ !this.state.isFormValid }
                onPress={ this.handleSubmit }
                style={ { marginTop: 16 } }>
          <Text>{ I18n.t('common.next') }</Text>
        </Button>
      </Card>
    )
  }

  handleCheck = field => {
    this.setState({
      [ field ]: !this.state[ field ]
    })
  }

  handleSubmit = () => {
    this.props.save({
      skills: this.state.skills,
      traits: this.state.traits,
      mostInfo: this.state.mostInfo,
    })
    this.props.onFill({
      done: true
    })
  }
}

const styles = StyleSheet.create({
  listRow: {
    paddingVertical: 8,
    paddingHorizontal: 10
  },
  errorText: {
    alignSelf: 'center',
    color: 'red'
  }
})

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
