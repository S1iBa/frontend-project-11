import onChange from 'on-change';
import {
  renderError,
  renderContent,
  renderForm,
  renderModal,
} from './render.js';

export default (state) => onChange(state, (path, value) => {
  switch (path) {
    case 'formState.state': {
      renderForm(value);
      break;
    }
    case 'formState.validationError': {
      renderError(value);
      break;
    }
    case 'formState.error': {
      renderError(state.formState.error);
      break;
    }
    case 'rssData.posts': {
      renderContent(state.rssData.feeds, state.rssData.posts, state.linkState.viewedPosts);
      break;
    }
    case 'modalPostId': {
      renderModal(state.modalPostId);
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
