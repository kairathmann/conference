import { Body, Button, Card, CheckBox, Form, Icon, Input, Item, Label, ListItem, Text } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import I18n from '../../../../../locales/i18n'
import { InvestorTicketSize } from './index'

const investments = [
    'protocols',
    'app_tokens',
    'security_tokens'
]

class InvestorInvestIn extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      investments: []
    }
  }

  handleSubmit = () => {
    this.props.onFill({ nextStep: InvestorTicketSize })
  }

  handleCheckboxClick = fieldName => {
      let investments = [...this.state.investments]
      const investmentIndex = investments.indexOf(fieldName)
      if (investmentIndex !== -1) {
          investments = investments.filter(singleInvestemnt => singleInvestemnt !== fieldName)
      } else {
          investments.push(fieldName)
      }
      this.setState({ investments })
  }

  isCheckboxSelected = fieldName => {
      return this.state.investments.indexOf(fieldName) !== -1;
  }

  render () {
    return (
      <Card style={ { padding: 8 } }>
        <Text style={ { fontSize: 24 } }>{ I18n.t('flow_page.investor.invest_in.title') }</Text>
            {investments.map(singleInvestment => {
                return (
                    <ListItem key={`investment-item-${singleInvestment}`}>
                      <CheckBox
                        onPress={ () => this.handleCheckboxClick(singleInvestment)}
                        checked={ this.isCheckboxSelected(singleInvestment)}
                      />
                      <Body>
                        <Text>{ I18n.t(`flow_page.investor.invest_in.investment_topics.${singleInvestment}`) }</Text>
                      </Body>
                    </ListItem>
                );
            })}
        <Button success
                rounded
                block
                disabled={ this.state.investments.length === 0}
                onPress={ this.handleSubmit }
                style={ { marginTop: 16 } }>
          <Text>{ I18n.t('common.next') }</Text>
        </Button>
      </Card>
    )
  }
}

InvestorInvestIn.propTypes = {
  onFill: PropTypes.func.isRequired
}

export default InvestorInvestIn
