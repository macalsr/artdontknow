import list from 'reducers/sketch_book/sketch_bookListReducers';
import form from 'reducers/sketch_book/sketch_bookFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
