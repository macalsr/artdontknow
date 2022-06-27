import auth from 'reducers/auth';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import users from 'reducers/users/usersReducers';

import sketch_book from 'reducers/sketch_book/sketch_bookReducers';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    auth,

    users,

    sketch_book,
  });
