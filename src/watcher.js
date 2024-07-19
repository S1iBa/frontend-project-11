import onChange from 'on-change';
import {
  renderError,
  renderContent,
  renderForm,
  renderModal,
} from './render.js';

export default (state) => onChange(state, (path, value) => {
  switch (path) {
    case 'submitForm.state': {
      renderForm(value);
      break;
    }
    case 'submitForm.validationError': {
      renderError(value);
      break;
    }
    case 'submitForm.errors': {
      renderError(value);
      break;
    }
    case 'rssData.posts': {
      renderContent(state.rssData.feeds, state.rssData.posts, state.linkState.viewedPosts);
      break;
    }
    case 'rssData.modalPostId': {
      renderModal(state.rssData.modalPostId);
      break;
    }
    case 'linkState.viewedPosts': {
      renderContent(state.rssData.feeds, state.rssData.posts, state.linkState.viewedPosts);
      break;
    }
    default: {
      break;
    }
  }
});
