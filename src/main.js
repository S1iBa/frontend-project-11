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
    modalPostId: '',
    formState: {
      state: 'filling',
      error: '',
    },
    rssData: {
      feeds: [],
      posts: [],
    },
    linkState: {
      viewedPosts: [],
    },
  };
  const watchedState = watcher(state);

  const postsContainer = document.querySelector('.posts');
  const form = document.querySelector('.rss-form');
  const updateInterval = 5000;
  const linkList = [];

  const errorHandler = (err) => {
    if (err.isAxiosError) {
      return 'axioserror';
    } if (err.isParseError) {
      return 'parsererror';
    } else {
      return console.log(err);
    }
  };

  const updatePosts = (feeds) => {
    feeds.forEach((feed) => {
      const feedUrl = feed.url;
      axios
        .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(feedUrl)}`)
        .then((resp) => {
          const parsed = parsing(resp.data.contents);
          const compatator = (a, b) => a.title === b.title;
          const { posts } = state.rssData;
          const newPosts = _.differenceWith(parsed.items, state.rssData.posts, compatator);
          const newIdPosts = newPosts.map((item) => ({ ...item, id: feed.id }));
          watchedState.rssData.posts = [...newIdPosts, ...posts];
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(setTimeout(() => updatePosts(watchedState.rssData.feeds), updateInterval));
    });
  };

  const fetchData = (url) => axios
    .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((resp) => {
      const parsedData = parsing(resp.data.contents);
      const { feeds, posts } = state.rssData;
      const { title, description, items } = parsedData;
      const id = uniqueId();
      watchedState.rssData.feeds = [{
        id, title, description, url,
      }, ...feeds];
      const newPosts = items.map((item) => ({ ...item, id }));
      watchedState.rssData.posts = [...newPosts, ...posts];
      watchedState.rssData.feeds.forEach((elem) => {
        if(!linkList.includes(elem.url)) {
          linkList.push(elem.url)}
      });
      watchedState.formState.state = 'finished';
    })
    .catch((e) => {
      watchedState.formState.state = 'failed';
      watchedState.formState.error = errorHandler(e);
    })
    .finally(setTimeout(() => updatePosts(watchedState.rssData.feeds), updateInterval));

  postsContainer.addEventListener('click', (event) => {
    const id = event.target.dataset.postId;
    if (id === undefined) {
      return
    }
    const postLink = event.target.dataset.bsLink;
    watchedState.modalPostId = id;
    watchedState.linkState.viewedPosts.push(postLink);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.formState.error = '';
    watchedState.formState.state = 'processing';
    const formData = document.querySelector('#url-input');
    const urlValue = formData.value;
    validateString(urlValue, linkList)
      .then(({ url }) => fetchData(url))
      .catch((error) => {
        watchedState.formState.state = 'failed';
        watchedState.formState.error = error.type;
      });
  });
};
