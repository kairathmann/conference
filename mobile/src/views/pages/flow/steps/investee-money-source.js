import {
  View,
  Text
} from 'native-base'
import React from 'react'
import validator from 'validator'
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { connect } from 'react-redux'
import I18n from '../../../../../locales/i18n'
import { REGIONS } from '../../../../enums'
import { signUpActions } from '../../../../signup'
import { FlowButton } from '../../../design/buttons'
import { FlowContainer } from '../../../design/container'
import { FlowListItem } from '../../../design/list-items'
import { StepTitle } from '../../../design/step-title'
import { Subheader } from '../../../design/subheader'
import { InvesteeTokenType } from './index'
import FlowInputValidated from '../../../design/flow-input-validated'

const otherRegionConstantIndex = REGIONS.find(region => region.slug === "other").index

class InvesteeMoneySource extends React.Component {

  static BACKGROUND_COLOR = '#172D5C'

  constructor (props) {
    super(props)
    this.state = {
      amount: this.props.investee.amount,
      nationality: this.props.investee.investorNationality,
      regionOtherText: this.props.investee.regionOtherText,
      // used to stop validation until Save button is hitted for the first time
      // unless field are already filled (editing)
      showValidationError: this.props.investee.amount !== ''
    }
    this.state.isFormValid = this.isFormValid()
  }

  render () {
    return (
      <FlowContainer>
        <View style={ { flex: 1, justifyContent: 'flex-start' } }>
          <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={96} enabled={Platform.OS === 'ios'}>
            <ScrollView contentContainerStyle={ { flexGrow: 1 } }>
              <View style={ { marginLeft: 32, marginRight: 32, marginTop: 32 } }>
                <StepTitle text={ I18n.t('flow_page.money.title') }/>
              </View>
              <Subheader
                color={'white'}
                text={ I18n.t(`flow_page.money.amount`) }
              />
              <View style={styles.inputContainer}>
                <FlowInputValidated
                  overrideStatus={ !this.state.showValidationError }
                  overrideStatusType={'regular'}
                  floatingLabel
                  keyboardType={'numeric'}
                  value={ this.state.amount }
                  placeholder={ I18n.t('flow_page.money.amount') }
                  labelText={ I18n.t('flow_page.money.amount') }
                  isError={ this.state.showValidationError && !this.validateAmount(this.state.amount) }
                  errorMessage={ I18n.t('common.errors.incorrect_amount') }
                  onChangeText={ (newValue) => this.handleFieldChange(newValue, 'amount') } />
              </View>
              <Subheader
                color={'white'}
                text={ I18n.t(`flow_page.money.nationality`) }
              />
              { REGIONS.map((region) => {
                return (
                  <FlowListItem
                    multiple={ false }
                    key={ `region-item-${region.slug}` }
                    text={ I18n.t(`common.regions.${region.slug}`) }
                    onSelect={ () => this.handleChange(region.index) }
                    selected={ this.state.nationality === region.index }
                  />
                )
              }) }
              {this.state.showValidationError && this.state.nationality === 0 && (
                <View style={ { margin: 8 } }>
                  <Text style={ { color: 'red', alignSelf: 'center' } }>
                    {I18n.t('flow_page.money.error_missing_investor_nationality')}
                  </Text>
                </View>
              )}
              {this.state.nationality === otherRegionConstantIndex && (
                <View style={styles.inputContainer}>
                  <FlowInputValidated floatingLabel
                    overrideStatus={ !this.state.showValidationError }
                    overrideStatusType={'regular'}
                    value={ this.state.regionOtherText }
                    labelText={ I18n.t('flow_page.money.other_location_placeholder') }
                    isError={ this.state.showValidationError && this.state.regionOtherText.length > 40 }
                    errorMessage={ I18n.t('common.errors.incorrect_investor_custom_location') }
                    onChangeText={ (newValue) => this.handleFieldChange(newValue, 'regionOtherText') }/>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
        <View style={ { margin: 8 } }>
          <FlowButton
            text={ I18n.t('common.next') }
            disabled={ this.state.showValidationError && !this.state.isFormValid}
            onPress={ this.handleSubmit }
          />
        </View>
      </FlowContainer>
    )
  }

  validateAmount = (amount) => {
    return validator.isEmpty(amount) ? false : validator.isNumeric(amount) && Number(amount) < 2147483647
  }

  isFormValid = () => {
    const { amount, nationality, regionOtherText } = this.state
    const isAmountValid = this.validateAmount(amount)
    let isRegionValid = !(!nationality);
    if (nationality === otherRegionConstantIndex) {
      isRegionValid = regionOtherText.length <= 40
    }
    return isAmountValid && isRegionValid
  }

  validateForm = () => {
    const isFormValid = this.isFormValid()
    this.setState({ isFormValid })
  }

  handleChange = (newValue) => {
    this.setState({
      nationality: newValue
    }, this.validateForm)
  }

  handleFieldChange = (text, name) => {
    this.setState({
      [ name ]: text
    }, this.validateForm)
  }

  handleSubmit = () => {
    const { amount, isFormValid, nationality, regionOtherText, showValidationError } = this.state
    // after first time hitting Save button, flip flag to enable showing validation errors
    if (!showValidationError) {
      this.setState( { showValidationError: true } )
    }
    if (isFormValid) {
      this.props.save({
        money: true,
        amount: amount,
        investorNationality: nationality,
        regionOtherText: regionOtherText
      })
      this.props.onFill({
        nextStep: InvesteeTokenType
      })
    }
  }
}

const styles = EStyleSheet.create({
  inputContainer: {
    flex: 1,
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 16
  }
})

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

export default connect(mapStateToProps, mapDispatchToProps)(InvesteeMoneySource)
