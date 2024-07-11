import onChange from "on-change";
import { renderError, renderContent, renderForm } from "./render.js";

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
        renderContent(state.rssData.feeds, state.rssData.posts);
        break;
      }
    }
  });