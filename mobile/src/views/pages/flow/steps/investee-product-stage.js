import { Text, View } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { ScrollView } from 'react-native'
import { connect } from 'react-redux'
import I18n from '../../../../../locales/i18n'
import { PRODUCT_STAGES } from '../../../../enums'
import { signUpActions } from '../../../../signup'
import { FlowButton } from '../../../design/buttons'
import { FlowContainer } from '../../../design/container'
import { FlowListItem } from '../../../design/list-items'
import { StepTitle } from '../../../design/step-title'
import { Subheader } from '../../../design/subheader'
import { InvesteeFundingStage } from './index'

class InvesteeProductStage extends React.Component {

  static BACKGROUND_COLOR = '#172D5C'

  constructor (props) {
    super(props)
    this.state = {
      selected: this.props.investee.productStage,
      // used to stop validation until Save button is hitted for the first time
      // unless field are already filled (editing)
      showValidationError: this.props.investee.productStage !== -1
    }
    this.state.isFormValid = this.isFormValid()
  }

  render () {
    return (
      <FlowContainer>
        <View style={ { flex: 1, justifyContent: 'flex-start' } }>
          <ScrollView contentContainerStyle={ { flexGrow: 1 } }>
            <View style={ { marginLeft: 32, marginRight: 32, marginTop: 32 } }>
              <StepTitle text={ I18n.t('flow_page.product_stage.title') }/>
            </View>
            <Subheader
              color={'white'}
              text={ I18n.t(`flow_page.product_stage.header`) }
            />
            { PRODUCT_STAGES.map((size) => {
              return (
                <FlowListItem
                  multiple={ false }
                  key={ `product-stage-item-${size.index}` }
                  text={ I18n.t(`common.product_stages.${size.slug}`) }
                  onSelect={ () => this.handleChange(size.index) }
                  selected={ this.state.selected === size.index }
                />
              )
            }) }
            {this.state.showValidationError && this.state.selected === -1 && (
                <View style={ { margin: 8 } }>
                  <Text style={ { color: 'red', alignSelf: 'center' } }>
                    {I18n.t('flow_page.product_stage.error_missing_product_stage')}
                  </Text>
                </View>
            )}
          </ScrollView>
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

  isFormValid = () => {
    return this.state.selected !== -1
  }

  validateForm = () => {
    const isFormValid = this.isFormValid()
    this.setState({ isFormValid })
  }

  handleSubmit = () => {
    // after first time hitting Save button, flip flag to enable showing validation errors
    if (!this.state.showValidationError) {
      this.setState( { showValidationError: true } )
    }
    if (this.state.isFormValid) {
      this.props.save({
        productStage: this.state.selected
      })
      this.props.onFill({
        nextStep: InvesteeFundingStage
      })
    }
  }

  handleChange = (index) => {
    this.setState({
      selected: index
    }, this.validateForm)
  }
}

InvesteeProductStage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(InvesteeProductStage)
