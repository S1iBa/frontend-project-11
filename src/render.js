import i18next from "i18next";

export const renderError = (feedback) => {
    const info = document.querySelector('.feedback');
    info.textContent = '';
    info.textContent= feedback.join('');
};

export const renderForm = (feedback) => {
    const input = document.querySelector('#url-input');
    const submitBtn = document.querySelector('#submit');
    switch (feedback) {
        case 'failed': {
          input.classList.add('is-invalid');
          submitBtn.removeAttribute('disabled');
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
          break;
        }
      }
};

export const renderContent = (feeds, posts) => {
    // console.log(feeds);
    const postsContainer = document.querySelector('.posts');
    const feedsContainer = document.querySelector('.feeds');
    feedsContainer.innerHTML = '';
    postsContainer.innerHTML = '';
    const postsTitle = document.createElement('h2');
    const feedsTitle = document.createElement('h2');
    feedsTitle.textContent = i18next.t('feeds_title');
    postsTitle.textContent = i18next.t('posts_title');
    feedsContainer.append(feedsTitle);
    postsContainer.append(postsTitle);
    const feedsList = document.createElement('ul');
    feedsList.classList.add('list-group', 'mb-5');
    const postList = document.createElement('ul');
    postList.classList.add('list-group');

    feeds.forEach(({id, feedTitle, feedDescription}) => {
    // console.log(feedTitle);
      const feedElem = document.createElement('li');
      feedElem.classList.add('list-group-item');
      const headerElem = document.createElement('h3');
      headerElem.textContent = feedTitle;
      const descrElem = document.createElement('p');
      descrElem.textContent = feedDescription;
      feedElem.append(headerElem);
      feedElem.append(descrElem);
      const items = posts.filter((post) => post.id === id);
      items.forEach(({title, link, description}) => {
          const postElem = document.createElement('li');
          postElem.classList.add(
              'list-group-item',
              'd-flex',
              'justify-content-between',
              'align-items-start',
            );
          const postUrl = document.createElement('a');
          postUrl.href = link;
          postUrl.classList.add('font-weight-bold');
          postUrl.textContent = title;
          const button = document.createElement('button');
          button.textContent = i18next.t('viewing');
          button.classList.add('btn', 'btn-primary', 'btn-sm');
          button.setAttribute('type', 'button');
          button.setAttribute('data-toggle', 'modal');
          button.setAttribute('data-target', '#myModal');
          button.setAttribute('data-description', description);
          button.setAttribute('data-title', title);
          button.setAttribute('data-link', link);
          button.addEventListener('click', (event) => {

            event.preventDefault();
            // state.isModalActive = true;
            const button = event.relatedTarget;
            const description = button.dataset.description;
            const title = button.dataset.title;
            const link = button.dataset.link;
        
            const modalBody = document.querySelector('#description');
            modalBody.textContent = description;
        
            const modalTitle = document.querySelector('#title');
            modalTitle.textContent = title;
        
            const modalLink = document.querySelector('#link');
            modalLink.href = link;
          });
          postElem.append(postUrl);
          postElem.append(button);
          postList.append(postElem);
      })
      feedsList.append(feedElem);
    });
    feedsContainer.append(feedsList);
    postsContainer.append(postList);
    const form = document.querySelector('.rss-form');
    form.reset();
};
