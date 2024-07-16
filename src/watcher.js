import onChange from "on-change";
import { renderError, renderContent, renderForm, renderModal } from "./render.js";

export default (state) => onChange(state, (path, value) => {
  console.log(path);
    switch (path) {
      case 'submitForm.state': {
        renderForm(value);
        console.log(path);
        break;
      }
      case 'submitForm.validationError': {
        renderError(value);
        console.log(path);
        break;
      }
      case 'submitForm.errors': {
        renderError(value);
        console.log(path);
        break;
      }
      case 'rssData.posts': {
        renderContent(state.rssData.feeds, state.rssData.posts);
        break;
      }
      case 'rssData.modalPostId': {
        renderModal(state.rssData.modalPostId);
        console.log(path);
        break;
      }
    }
  });