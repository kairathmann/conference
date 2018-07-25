import { Button, Container, Text } from 'native-base'
import PropTypes from 'prop-types'
import React from 'react'
import { Image } from 'react-native'
import ErrorIcon from './error.png'

function ErrorMessage ({ message, onRetry, retryMessage = 'Try again' }) {
  return (
    <Container style={ { flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
      <Image style={{ width: 128, height: 128, marginBottom: 16}} source={ ErrorIcon }/>
      <Text style={{ marginBottom: 16, fontWeight: 'bold'}}>{ message }</Text>
      <Button bordered dark onPress={ onRetry } style={ { alignSelf: 'center'}}>
        <Text>{ retryMessage }</Text>
      </Button>
    </Container>
  )
}

ErrorMessage.propsTypes = {
  message: PropTypes.string.isRequired,
  retryButton: PropTypes.string,
  onRetry: PropTypes.func.isRequired
}

export default ErrorMessage
