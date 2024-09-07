import i18next from 'i18next';
import _ from 'lodash';

export const renderError = (feedback) => {
  const info = document.querySelector('.feedback');
  info.textContent = '';
  if (feedback === 'axioserror') {
    info.textContent = i18next.t('networkRequest');
    return;
  } if (feedback === 'string') {
    info.textContent = i18next.t('additionURL');
    return;
  } if (feedback === 'notOneOf') {
    info.textContent = i18next.t('rssHasAlredy');
    return;
  } if (feedback === 'parsererror') {
    info.textContent = i18next.t('rssNotValid');
    return;
  } if (feedback === 'unknown') {
    info.textContent = i18next.t('unknownError');
  }
};

export const renderModal = (modalID) => {
  const postElem = document.querySelectorAll('.btn.btn-primary.btn-sm');
  postElem.forEach((post) => {
    const id = post.getAttribute('data-post-id');
    if (modalID === id) {
      const description = post.getAttribute('data-bs-description');
      const title = post.getAttribute('data-bs-title');
      const link = post.getAttribute('data-bs-link');

      const modalBody = document.querySelector('.modal-body');
      modalBody.textContent = description;

      const modalTitle = document.querySelector('.modal-title');
      modalTitle.textContent = title;

      const modalLink = document.querySelector('#link');
      modalLink.href = link;
      modalLink.setAttribute('target', '_blank');
    }
  });
};

export const renderForm = (feedback) => {
  const input = document.querySelector('#url-input');
  const submitBtn = document.querySelector('#submit');
  const info = document.querySelector('.feedback');
  const form = document.querySelector('.rss-form');
  info.textContent = '';
  switch (feedback) {
    case 'failed': {
      input.classList.add('is-invalid');
      submitBtn.removeAttribute('disabled');
      info.classList.add('text-danger');
      break;
    }
    case 'processing': {
      input.classList.remove('is-invalid');
      submitBtn.setAttribute('disabled', true);
      break;
    }
    case 'finished': {
      input.classList.remove('is-invalid');
      submitBtn.removeAttribute('disabled');
      info.classList.remove('text-danger');
      info.textContent = i18next.t('success');
      info.classList.add('text-success');
      form.reset();
      break;
    }
    default: {
      break;
    }
  }
};

export const renderContent = (feeds, posts, uiState) => {
  const postsContainer = document.querySelector('.posts');
  const feedsContainer = document.querySelector('.feeds');
  feedsContainer.innerHTML = '';
  postsContainer.innerHTML = '';
  const addBtn = document.querySelector('.addBtn');
  addBtn.textContent = i18next.t('add');
  const closeModalBtn = document.querySelector('.btn-secondary');
  closeModalBtn.textContent = i18next.t('close');
  const goModalBtn = document.querySelector('.btn-primary');
  goModalBtn.textContent = i18next.t('go');

  const cardBorderPosts = document.createElement('div');
  cardBorderPosts.classList.add('card', 'border-0');
  const cardBodyPosts = document.createElement('div');
  cardBodyPosts.classList.add('card-body');

  const cardBorderFeeds = document.createElement('div');
  cardBorderFeeds.classList.add('card', 'border-0');
  const cardBodyFeeds = document.createElement('div');
  cardBodyFeeds.classList.add('card-body');

  const postsTitle = document.createElement('h2');
  postsTitle.classList.add('card-title', 'h4');
  cardBodyPosts.append(postsTitle);

  const feedsTitle = document.createElement('h2');
  feedsTitle.classList.add('card-title', 'h4');
  cardBodyFeeds.append(feedsTitle);

  feedsTitle.textContent = i18next.t('feeds_title');
  postsTitle.textContent = i18next.t('posts_title');

  feedsContainer.append(cardBorderFeeds);
  postsContainer.append(cardBorderPosts);

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');

  const postList = document.createElement('ul');
  postList.classList.add('list-group', 'border-0', 'rounded-0');
  feeds.forEach(({ id, title: feedtitle, description: feedDescription }) => {
    const feedElem = document.createElement('li');
    feedElem.classList.add('list-group-item');
    const headerElem = document.createElement('h3');
    headerElem.textContent = feedtitle;
    const descrElem = document.createElement('p');
    descrElem.textContent = feedDescription;
    feedElem.append(headerElem, descrElem);
    const items = posts.filter((post) => post.id === id);
    items.forEach(({ title: postTitle, link: postLink, description: postDescription }) => {
      const postElem = document.createElement('li');
      postElem.classList.add(
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-start',
      );

      const button = document.createElement('button');
      button.textContent = i18next.t('viewing');
      button.classList.add('btn', 'btn-primary', 'btn-sm');
      button.setAttribute('type', 'button');
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#myModal');
      button.setAttribute('data-bs-description', postDescription);
      button.setAttribute('data-bs-title', postTitle);
      button.setAttribute('data-bs-link', postLink);
      button.setAttribute('data-post-id', _.uniqueId());

      const postUrl = document.createElement('a');
      postUrl.href = postLink;
      postUrl.setAttribute('target', '_blank');
      postUrl.setAttribute('rel', 'noopener noreferrer');
      const urlId = button.getAttribute('data-post-id');
      postUrl.setAttribute('data-bs-link', postLink);
      postUrl.setAttribute('data-post-id', urlId);
      postUrl.textContent = postTitle;
      postUrl.classList.remove('fw-bold');
      if (uiState.includes(postLink)) {
        postUrl.classList.add('fw-normal', 'link-secondary');
      } else {
        postUrl.classList.add('fw-bold');
      }
      postElem.append(postUrl, button);
      postList.append(postElem);
    });
    feedsList.append(feedElem);
  });
  cardBodyFeeds.append(feedsList);
  cardBodyPosts.append(postList);
  cardBorderFeeds.append(cardBodyFeeds);
  cardBorderPosts.append(cardBodyPosts);
};
