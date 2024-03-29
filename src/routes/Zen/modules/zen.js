// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_ZEN = 'REQUEST_ZEN'
export const RECIEVE_ZEN = 'RECIEVE_ZEN'
export const SAVE_CURRENT_ZEN = 'SAVE_CURRENT_ZEN'

// ------------------------------------
// Actions
// ------------------------------------

export function requestZen (){
  return {
    type: REQUEST_ZEN
  }
}

let availableId = 0
export function recieveZen (value){
  return {
    type: RECIEVE_ZEN,
    payload: {
      value,
      id: availableId++
    }
  }
}

export function saveCurrentZen (){
  return {
    type: SAVE_CURRENT_ZEN
  }
}

export const fetchZen = () => {
  return (dispatch) => {
    dispatch(requestZen())

    return fetch('https://api.github.com/zen')
      .then(data => data.text())
      .then(text => dispatch(recieveZen(text)))
  }
}

export const actions = {
  requestZen,
  recieveZen,
  fetchZen,
  saveCurrentZen
}

const ZEN_ACTION_HANDLERS = {
  [REQUEST_ZEN]: (state: ZenStateObject) => {
    return ({ ...state, fetching: true })
  },
  [RECIEVE_ZEN]: (state: ZenStateObject, action: {payload: ZenObject}) => {
    return ({ ...state, zens: state.zens.concat(action.payload), current: action.payload.id, fetching: false })
  },
  [SAVE_CURRENT_ZEN]: (state: ZenStateObject) => {
    return state.current != null ? ({ ...state, saved: state.saved.concat(state.current) }) : state
  }
}


// ------------------------------------
// Reducer
// ------------------------------------

const initialState: ZenStateObject = { fetching: false, current: null, zens: [], saved: [] }
export default function zenReducer (state = initialState, action) {
  const handler = ZEN_ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
