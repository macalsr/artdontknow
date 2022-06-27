import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { showSnackbar } from '../../components/Snackbar';

const actions = {
  doNew: () => {
    return {
      type: 'SKETCH_BOOK_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'SKETCH_BOOK_FORM_FIND_STARTED',
      });

      axios.get(`/sketch_book/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'SKETCH_BOOK_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'SKETCH_BOOK_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/sketch_book'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'SKETCH_BOOK_FORM_CREATE_STARTED',
      });

      axios.post('/sketch_book', { data: values }).then((res) => {
        dispatch({
          type: 'SKETCH_BOOK_FORM_CREATE_SUCCESS',
        });
        showSnackbar({ type: 'success', message: 'Sketch_book created' });
        dispatch(push('/admin/sketch_book'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'SKETCH_BOOK_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'SKETCH_BOOK_FORM_UPDATE_STARTED',
      });

      await axios.put(`/sketch_book/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'SKETCH_BOOK_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        showSnackbar({ type: 'success', message: 'Profile updated' });
      } else {
        showSnackbar({ type: 'success', message: 'Sketch_book updated' });
        dispatch(push('/admin/sketch_book'));
      }
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'SKETCH_BOOK_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
