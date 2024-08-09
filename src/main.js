import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import validateString from './validate.js';
import parsing from './parsing.js';
import watcher from './watcher.js';
import language from './traslate/languages.js';
import uniqueId from './utilits.js';

export default () => {
  i18next.init({
    lng: 'ru',
    debug: true,
    resources: language,
    interpolation: {
      escapeValue: false,
    },
  });

  const state = {
    submitForm: {
      state: 'filling',
      validationError: '',
      errors: '',
    },
    rssData: {
      feeds: [],
      posts: [],
      urlList: [],
      modalPostId: '',
    },
    linkState: {
      viewedPosts: [],
    },
  };
  const watchedState = watcher(state);

  const postsContainer = document.querySelector('.posts');
  const form = document.querySelector('.rss-form');

  const errorHandler = (err) => {
    if (err.isAxiosError) {
      watchedState.submitForm.errors = 'AxiosError';
    } if (err.isParseError) {
      watchedState.submitForm.errors = 'parsererror';
    } else {
      watchedState.submitForm.errors = err.type;
    }
  };

  const updatePosts = (urlList) => {
    urlList.forEach((singleUrl) => {
      axios
        .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(singleUrl)}`)
        .then((resp) => {
          const parsed = parsing(resp.data.contents);
          const compatator = (a, b) => a.title === b.title;
          const { feeds, posts } = state.rssData;
          const newPosts = _.differenceWith(parsed.items, state.rssData.posts, compatator);
          const feedId = feeds.find((feed) => feed.url === singleUrl).id;
          const newIdPosts = newPosts.map((item) => ({ ...item, id: feedId }));
          newIdPosts.forEach((newIdPost) => {
            watchedState.rssData.posts = [newIdPost, ...posts];
          });
        })
        .catch((err) => {
          watchedState.submitForm.state = 'failed';
          errorHandler(err);
        })
        .finally(setTimeout(() => updatePosts(watchedState.rssData.urlList), 5000));
    });
  };

  const fetchData = (url) => axios
    .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((resp) => {
      const parsedData = parsing(resp.data.contents);
      const { feeds, posts, urlList } = state.rssData;
      const { title, description, items } = parsedData;
      const id = uniqueId();
      watchedState.rssData.feeds = [{
        id, title, description, url,
      }, ...feeds];
      const newPosts = items.map((item) => ({ ...item, id }));
      watchedState.rssData.posts = [...newPosts, ...posts];
      watchedState.rssData.urlList = [url, ...urlList];
      watchedState.submitForm.state = 'finished';
    })
    .catch((e) => {
      watchedState.submitForm.state = 'failed';
      errorHandler(e);
    })
    .finally(setTimeout(() => updatePosts(watchedState.rssData.urlList), 5000));

  postsContainer.addEventListener('click', (event) => {
    const id = event.target.dataset.postId;
    const postLink = event.target.dataset.bsLink;
    watchedState.rssData.modalPostId = id;
    watchedState.linkState.viewedPosts.push(postLink);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.submitForm.errors = [];
    watchedState.submitForm.state = 'processing';
    const formData = document.querySelector('#url-input');
    const urlValue = formData.value;
    validateString(urlValue, state.rssData.urlList)
      .then(({url}) => fetchData(url))
      .catch((error) => {
        watchedState.submitForm.state = 'failed';
        errorHandler(error);
      });
  });
};
