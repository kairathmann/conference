import { Button, Card, Content, Left, ListItem, Radio, Right, Text } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import I18n from '../../../../../locales/i18n'
import { FUNDING_STAGES } from '../../../../enums'
import { signUpActions } from '../../../../signup'
import { InvesteeTeamMembers } from './index'

class InvesteeFundingStage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: this.props.investee.fundingStage
    }
    this.state.isFormValid = this.isFormValid()
  }

  render () {
    return (
      <Card style={ { padding: 8 } }>
        <Text style={ { fontSize: 24 } }>{ I18n.t('flow_page.funding_stage.title') }</Text>
        <Content>
          {
            FUNDING_STAGES.map((option, index) => {
              return (
                <ListItem style={ { width: '100%' } } key={ option.slug } onPress={ () => this.handleChange(index) }>
                  <Left>
                    <Text>{ I18n.t(`common.funding_stages.${option.slug}`) }</Text>
                  </Left>
                  <Right>
                    <Radio
                      onPress={ () => this.handleChange(index) }
                      selected={ this.state.selected === index }/>
                  </Right>
                </ListItem>
              )
            })
          }
        </Content>
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

  isFormValid = () => {
    return this.state.selected !== -1
  }

  validateForm = () => {
    const isFormValid = this.isFormValid()
    this.setState({ isFormValid })
  }

  handleSubmit = () => {
    this.props.save({
      fundingStage: this.state.selected
    })
    this.props.onFill({
      nextStep: InvesteeTeamMembers
    })
  }

  handleChange = index => {
    this.setState({
      selected: index
    }, this.validateForm)
  }
}

InvesteeFundingStage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(InvesteeFundingStage)
