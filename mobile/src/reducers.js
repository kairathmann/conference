import { combineReducers } from 'redux'
import { globalReducer } from './global'
import { profileReducer } from './profile'
import { searchReducer } from './search'
import { signUpReducer } from './signup'
import { scheduleReducer } from './schedule'
import { filterReducer } from './filters'
import { startUpReducer } from './startup'

export default combineReducers({
  signUp: signUpReducer,
  search: searchReducer,
  global: globalReducer,
  schedule: scheduleReducer,
  profile: profileReducer,
  filter: filterReducer,
  startup: startUpReducer
})
