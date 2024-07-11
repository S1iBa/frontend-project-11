import axios from 'axios';
import i18next from 'i18next';
import validateString from './validate.js';
import parsing from './parsing.js';
import watcher from './watcher.js';
import language from './traslate/languages.js'
import uniqueId from './utilits.js';
import _ from 'lodash';


export default () => {
  i18next.init({
    lng: 'ru',
    debug: true,
    resources: language,
  });

  const getRss = (url) => axios
    .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then(resp => new DOMParser().parseFromString(resp.data.contents, "text/xml"))
    .catch((e) => console.log(e));


  const updatePosts = (state, urlList) => {
    urlList.reverse().forEach(({ id, link }) => {
        getRss(link).then((data) => {
            const { infoItems } = parsing(data);
            console.log(infoItems);
            // const validUrl = validateString(link, state.rssData.urlList);
            const { posts } = state.rssData;
            const updatedPosts = infoItems.map(({ title, description, link }) => ({
                id,
                title,
                description,
                link,
            }));
            const newPosts = _.differenceWith(updatedPosts, posts, _.isEqual);
            state.rssData.posts = [...newPosts, ...state.rssData.posts];
        });
    });
    setTimeout(() => updatePosts(state, urlList), 5000);
  };

  const state = {
      // validationInfo: {
      //   isValid: true,
      //   invalidationType: "",
      // },
      submitForm: {
          state: 'filling',
          validationError: '',
          errors: [],
      },
      rssData: {
          feeds: [],
          posts: [],
          urlList: [],
      },
  };

  const addBtn = document.querySelector('.addBtn');
  addBtn.textContent = i18next.t('add');
  const closeModalBtn = document.querySelector('.closeModalBtn');
  closeModalBtn.textContent = i18next.t('close');
  const goModalBtn = document.querySelector('.goModalBtn');
  goModalBtn.textContent = i18next.t('go');

  const watchedState = watcher(state);
  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.submitForm.errors = [];
    watchedState.submitForm.state = 'processing';
    const formData = new FormData(e.target);
    const urlValue = formData.get('value');
    validateString(urlValue, state.rssData.urlList)
    .then(() => {
      getRss(urlValue)
        .then((data) => {
          const parsedData = parsing(data);
          const { feeds, posts, urlList } = state.rssData;
          const { feedInfo, infoItems } = parsedData;
          const id = uniqueId();
          watchedState.rssData.feeds = [{ id, ...feedInfo}, ...feeds];
          const newPosts = infoItems.map(({ title, link, description }) => ({
              id,
              title,
              description,
              link,
          }));
          watchedState.rssData.posts = [ ...newPosts, ...posts ];
          watchedState.rssData.urlList = [{ id, link: urlValue }, ...urlList];
          watchedState.submitForm.state = 'finished';
          })
          .then(() => {
              watchedState.submitForm.state = 'filling';
          })
          .catch((err) => {
            console.log(err);
            watchedState.submitForm.state = 'failed';
            watchedState.submitForm.errors = [
              i18next.t('submitProcess.errors.rssNotValid'),
            ];
          })
          .then(() => updatePosts(watchedState, state.rssData.urlList));
    })
    .catch(e => {
      watchedState.submitForm.errors.push(e.type);
  });
  console.log(watchedState.submitForm.errors)
  });

  const myModalEl = document.getElementById('myModal')
  myModalEl.addEventListener('hidden.bs.modal', function (event) {
    const button = event.relatedTarget;
  
    const modalBody = myModalEl.querySelector('#description');
    modalBody.textContent = description;

    const modalTitle = myModalEl.querySelector('#title');
    modalTitle.textContent = title;

    const modalLink = myModalEl.querySelector('#link');
    modalLink.href = link;
  });
};
