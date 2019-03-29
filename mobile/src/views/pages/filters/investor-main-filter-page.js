import { Body, Icon, Left, List, ListItem, Right, Text, View } from 'native-base'
import React from 'react'
import { ScrollView } from 'react-native'
import { connect } from 'react-redux'
import I18n from '../../../../locales/i18n'
import WhiteLogo from '../../../assets/logos/ico_white.png'
import {
  FUNDING_STAGES,
  GIVEAWAY_TYPES,
  PRODUCT_STAGES,
  REGIONS_FILTER,
  TICKET_SIZES,
  TOKEN_TYPES
} from '../../../enums'
import { PAGES_NAMES } from '../../../navigation'
import * as searchActions from '../../../search/actions'
import { NavigationHeader } from '../../components/header/header'
import { FlowButton } from '../../design/buttons'
import { ImagePageContainer } from '../../design/image-page-container'
import { filters as styles } from './styles'

class InvestorMainFilter extends React.Component {
  handleFilterItemClick = (filterSetting) => {
    this.props.navigation.navigate(PAGES_NAMES.FILTER_PAGE, {
      gradient: {
        colors: [ 'rgba(0, 0, 0, 1)', 'rgba(20,25,46, .5)', 'rgba(44, 101, 226, .5)', 'rgba(0,0,0,1)' ],
        levels: [ 0, 0.4, 0.95, 1 ]
      },
      filterSetting, 'filterField': 'investor'
    })
  }

  handleSubmit = () => {
    const { goBack } = this.props.navigation
    this.props.updateInvestors(this.props.filters)
    goBack()
  }

  render () {
    const fields = [
      { items: TOKEN_TYPES, key: 'token_types', stateKey: 'tokenType' },
      { items: TICKET_SIZES, key: 'ticket_size', stateKey: 'ticketSize' },
      { items: FUNDING_STAGES, key: 'funding_stages', stateKey: 'fundingStage' },
      { items: GIVEAWAY_TYPES, key: 'giveaway', stateKey: 'giveaway' },
      { items: PRODUCT_STAGES, key: 'product_stages', stateKey: 'productStage' },
      { items: REGIONS_FILTER, key: 'regions', stateKey: 'region' }
    ]

    return (
      <ImagePageContainer
        customGradient={ {
          colors: [ 'rgba(0, 0, 0, 1)', 'rgba(20,25,46, .5)', 'rgba(44, 101, 226, .5)', 'rgba(0,0,0,1)' ],
          levels: [ 0, 0.4, 0.95, 1 ]
        } }>
        <NavigationHeader
          onBack={ () => this.props.navigation.goBack() }
          title={ I18n.t('search_page.investor_filter.main_title') }
          rightIconSource={ WhiteLogo }/>
        <ScrollView>
          <View style={ styles.header }>
            <Text style={ styles.headerText }>{ I18n.t('search_page.investor_filter.header') }</Text>
          </View>
          <List style={ styles.filterList }>
            {
              fields.map((filterSetting, index) => (
                <ListItem thumbnail key={ index } style={ styles.investorFilterItem }
                          onPress={ () => this.handleFilterItemClick(filterSetting) }>
                  <Left>
                    <Text
                      style={ styles.Text }>{ I18n.t(`filter_page.type.${filterSetting.key === 'regions' ? 'nationality' : filterSetting.key}`) }</Text>
                  </Left>
                  <Body style={ styles.nonBorder }>
                  </Body>
                  <Right>
                    <Icon name="arrow-forward"/>
                  </Right>
                </ListItem>
              ))
            }
          </List>
          <View style={ styles.saveButtonContainer }>
            <FlowButton
              style={ styles.saveButton }
              onPress={ this.handleSubmit }>
              <Text style={ styles.buttonCaption }>{ I18n.t('common.next') }</Text>
            </FlowButton>
          </View>
        </ScrollView>
      </ImagePageContainer>
    )
  }
}

const mapStateToProps = state => {
  return {
    filters: state.filter.investor
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateInvestors: filters => dispatch(searchActions.updateInvestors(filters))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InvestorMainFilter)
