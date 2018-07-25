import { Body, Button, Container, Content, List, ListItem, Right, Text } from 'native-base'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { notificationsActions } from '../../../notifications'

class NotificationsPage extends Component {

  componentDidMount () {
    this.props.fetchNotifications()
  }

  handleReadClick = (notification) => {
    this.props.readNotification(notification)
  }

  handleReadAllClick = () => {
    this.props.readNotificationsAll()
  }

  calculateUnreadNotifications = () => {
    return this.props.notifications.filter(not => !not.isRead).length
  }

  render () {
    return (
      <Container>
        <Content>
          { this.calculateUnreadNotifications() > 0 &&
          <ListItem itemDivider style={ { alignContent: 'flex-end', justifyContent: 'flex-end' } }>
            <Button small transparent danger onPress={ this.handleReadAllClick }>
              <Text>Mark all as read</Text>
            </Button>
          </ListItem>
          }
          <List>
            { this.props.notifications.map(not =>
              <NotificationItem
                onRead={ () => this.handleReadClick(not) }
                data={ not }
                key={ not.id }/>
            ) }
          </List>
        </Content>
      </Container>
    )
  }
}

function NotificationItem ({ data, onRead }) {
  return (
    <ListItem noIndent avatar style={ { backgroundColor: 'white' } }>
      <Body>
      <Text>{ data.title }</Text>
      <Text note>{ data.content }</Text>
      </Body>
      <Right>
        <Button small transparent danger disabled={ data.isRead } onPress={ onRead }>
          <Text>{ data.isRead ? 'Readed' : 'Mark as read' }</Text>
        </Button>
      </Right>
    </ListItem>
  )
}

NotificationsPage.propTypes = {
  fetchNotifications: PropTypes.func.isRequired,
  readNotification: PropTypes.func.isRequired,
  readNotificationsAll: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    notifications: state.notifications.list,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchNotifications: () => dispatch(notificationsActions.fetchNotifications()),
    readNotification: (notification) => dispatch(notificationsActions.readNotification(notification)),
    readNotificationsAll: () => dispatch(notificationsActions.readNotificationsAll())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsPage)