import { batchActions } from 'redux-batch-enhancer'
import { getErrorDataFromNetworkException } from '../common/utils'
import * as globalActions from '../global/actions'
import { LOAD_SCHEDULE, LOAD_SCHEDULE_SUCCESS, LOAD_SCHEDULE_ERROR } from './action-types'
import * as api from '../api/api'

export const fetchConferenceSchedule = () => async dispatch => {
  try {
    dispatch({ type: LOAD_SCHEDULE })
    const response = await api.fetchConferenceSchedule()
    const rowScheduleData = response.data.sections
    const mappedSchedule = rowScheduleData.map(singleSection => ({
      title: singleSection.name, days: singleSection.days.map(singleDay => ({
        date: singleDay.date,
        events: singleDay.rows.map(singleRow => ({
          startDate: singleRow.time,
          classes: singleRow.slots.map(singleSlot => ({
            label: singleSlot.kind.label,
            title: singleSlot.content ? singleSlot.content.title : singleSlot.kind.label,
            rooms: singleSlot.rooms ? singleSlot.rooms.map(singleRoom => singleRoom.name) : [],
            speakers: singleSlot.content ? [singleSlot.content.speaker.name, ...singleSlot.content.additionalSpeakers.map(singleAddSpeaker => singleAddSpeaker.name)] : [],
            description: singleSlot.content ? singleSlot.content.description : null,
            endDate: singleSlot.end
          }))
        }))
      }))
    }))
    dispatch({
      type: LOAD_SCHEDULE_SUCCESS,
      schedule: mappedSchedule
    })
  } catch (err) {
    const errorData = getErrorDataFromNetworkException(err)
    dispatch(batchActions([globalActions.showAlertError(errorData.errorMessage), {type: LOAD_SCHEDULE_ERROR }]))
  }
}
