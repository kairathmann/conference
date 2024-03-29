import React from 'react'
import { KeyboardAvoidingView, Platform, StatusBar, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import I18n from '../../../../locales/i18n'
import { globalActions } from '../../../global'
import { PAGES_NAMES } from '../../../navigation'
import { navigate } from '../../../services/navigationService'
import { OutlineWhiteButton, PrimaryButton } from '../../design/buttons'
import FlowInput from '../../design/flow-inputs'
import { StepTitle } from '../../design/step-title'

class MessagePage extends React.Component {

  state = {
    message: ''
  }

  openLink (url) {
    this.props.navigation.navigate(PAGES_NAMES.WEBVIEW_PAGE, { uri: url })
  }

  handleSend = async () => {
    try {
      await this.props.sendMessage(this.state.message)
      this.setState({
        message: ''
      })
    } catch (err) {
    }
  }

  handleCancel = () => {
    this.setState({
      message: ''
    })
    this.props.hideMessage()
  }

  render () {
    const { showMessage, error, project } = this.props
    return (
      <React.Fragment>
        { showMessage && (
          <SafeAreaView style={ styles.messageContainer } forceInset={ { top: 'always' } }>
            <StatusBar
              translucent={ true }
              barStyle="light-content"
            />
            <KeyboardAvoidingView style={ { flex: 1, width: '100%' } } behavior="padding" enabled={ Platform.OS === 'ios' }>
              <ScrollView contentContainerStyle={ { flexGrow: 1 } }>
                <View style={ [ styles.content, { width: '100%' } ] }>
                  <View style={ { width: '100%', padding: 32 } }>
                    <StepTitle
                      text={ I18n.t('message_page.type_message') }/>
                    <FlowInput
                      floatingLabel={ true }
                      labelText={ I18n.t('message_page.message') }
                      value={ this.state.message }
                      multiline={ true }
                      numberOfLines={ 5 }
                      onChangeText={ value => this.setState({ message: value }) }
                      status={ this.state.message.length > 0 ? 'ok' : 'regular' }/>
                    {
                      error && (
                        <Text style={ { color: 'red', marginTop: 8 } }>{ error.errorMessage }</Text>
                      )
                    }
                    <View style={ { marginTop: 16 } }>
                      { project ?
                        <PrimaryButton
                          disabled={ this.state.message.length === 0 }
                          onPress={ this.handleSend }
                          text={ I18n.t('common.send') }
                        /> :
                        <React.Fragment>
                          <Text
                            style={ { color: 'white', fontWeight: 'bold', textAlign: 'center', marginBottom: 8 } }>{ I18n.t(
                            'message_page.no_project') }</Text>
                          <PrimaryButton
                            onPress={ () => {
                              this.props.openUrl('https://www.blockseoul.com/projects')
                              this.handleCancel()
                            } }
                            text={ I18n.t('common.setup') }
                          />
                        </React.Fragment>
                      }
                    </View>
                    <View style={ { marginTop: 16 } }>
                      <OutlineWhiteButton
                        onPress={ this.handleCancel }
                        text={ I18n.t('common.cancel') }/>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        ) }
      </React.Fragment>)
  }
}

const mapStateToProps = state => {
  return {
    investor: state.global.investor,
    error: state.global.showMessageError,
    project: state.profile.project
  }
}

const mapDispatchToProps = dispatch => {
  return {
    sendMessage: (msg) => dispatch(globalActions.sendMessage(msg)),
    hideMessage: () => dispatch(globalActions.hideMessage()),
    openUrl: uri => navigate(PAGES_NAMES.WEBVIEW_PAGE, { uri })
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MessagePage)

const styles = {
  messageContainer: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(20, 25, 46, .85)'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
}
