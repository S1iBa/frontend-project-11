import axios from 'axios';
import i18next from 'i18next';
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
      errors: [],
    },
    rssData: {
      feeds: [],
      posts: [],
      urlList: [],
      modalPostId: [],
    },
    linkState: {
      viewedPosts: [],
    },
  };
  const watchedState = watcher(state);
  const getRss = (url) => axios
    .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((resp) => (new DOMParser().parseFromString(resp.data.contents, 'text/xml')))
    .catch(() => {
      watchedState.submitForm.state = 'failed';
      watchedState.submitForm.errors = i18next.t('networkRequest');
    });

  const updatePosts = (existedState, urlList) => {
    urlList.reverse().forEach((singleUrl) => {
      getRss(singleUrl).then((data) => {
        const { infoItems } = parsing(data);
        const id = uniqueId();
        const { posts } = existedState.rssData;
        const updatedPosts = infoItems.map(({ title, description, link }) => ({
          id,
          title,
          description,
          link,
        }));
        const newPosts = _.differenceWith(updatedPosts, posts, _.isEqual);
        existedState.rssData.posts = [...newPosts, ...existedState.rssData.posts];
      })
        .then(() => {
          const postsElements = document.querySelectorAll('.btn-sm');
          postsElements.forEach((post) => {
            const { viewedPosts } = existedState.linkState;
            const linkID = post.getAttribute('data-bs-link');
            post.addEventListener('click', (event) => {
              event.preventDefault();
              const id = event.target.dataset.postId;
              watchedState.rssData.modalPostId = id;
              watchedState.linkState.viewedPosts = [linkID, ...viewedPosts];
            });
          });
        })
        .then(() => {
          const postsContainer = document.querySelector('.posts');
          const links = postsContainer.querySelectorAll('a');
          const { viewedPosts } = existedState.linkState;
          links.forEach((link) => {
            const linkID = link.getAttribute('href');
            link.addEventListener('click', () => {
              watchedState.linkState.viewedPosts = [linkID, ...viewedPosts];
            });
          });
        });
    });
    setTimeout(() => updatePosts(state, urlList), 5000);
  };

  const addBtn = document.querySelector('.addBtn');
  addBtn.textContent = i18next.t('add');
  const closeModalBtn = document.querySelector('.btn-secondary');
  closeModalBtn.textContent = i18next.t('close');
  const goModalBtn = document.querySelector('.btn-primary');
  goModalBtn.textContent = i18next.t('go');
  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.submitForm.errors = [];
    watchedState.submitForm.state = 'processing';
    const formData = document.querySelector('#url-input');
    const urlValue = formData.value;
    const validatedValue = validateString(urlValue, state.rssData.urlList);
    validatedValue
      .then(() => {
        getRss(urlValue)
          .then((data) => {
            const parsedData = parsing(data);
            const { feeds, posts, urlList } = state.rssData;
            const { feedInfo, infoItems } = parsedData;
            const id = uniqueId();
            watchedState.rssData.feeds = [{ id, ...feedInfo }, ...feeds];
            const newPosts = infoItems.map(({ title, link, description }) => ({
              id,
              title,
              description,
              link,
            }));
            watchedState.rssData.posts = [...newPosts, ...posts];
            watchedState.rssData.urlList = [urlValue, ...urlList];
            watchedState.submitForm.state = 'finished';
          })
          .then(() => updatePosts(watchedState, state.rssData.urlList))
          .catch((err) => {
            watchedState.submitForm.state = 'failed';
            if (err.message === 'parsererror') {
              watchedState.submitForm.errors = i18next.t('rssNotValid');
            }
          });
      })
      .catch((err) => {
        watchedState.submitForm.state = 'failed';
        if (err.type === 'url') {
          watchedState.submitForm.errors = i18next.t('additionURL');
        } if (err.type === 'notOneOf') {
          watchedState.submitForm.errors = i18next.t('rssHasAlredy');
        }
      });
  });
};
