import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
// import validate from './validate';

const stateWrapper = {
    state: {
        urlList: [],
        validationInfo: {
            isValid: true,
            invalidationType: "",
        },
        rssData: {
            feeds: [],
            posts: [],
            links: [],
        },
        error: '', 
    }
};
const stateWrapperWatched = onChange(stateWrapper, function () {
    renderForm()
});


// #region validation
yup.setLocale({
    string: {
      notOneOf: () => ({key: 'urlAlreadyExist'}),
      url: () => ({key: 'invalidUrl'}),
    }
  });

const validateString = (urlString) => {
    const validationSchema = yup.object().shape({
        url: yup.string()
          .url()
          .required()
          .notOneOf(stateWrapperWatched.state.urlList),
      });
    return validationSchema.validate({ url: urlString })
};
//#endregion validation

//#region clicker
const clicker = () => {
        const form = document.querySelector('.rss-form');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const getInput = document.querySelector('#url-input');
            const urlValue = getInput.value;
            const validUrlPromise = validateString(urlValue);

            const oldState = stateWrapperWatched.state;
            console.log(stateWrapperWatched);

            validUrlPromise
                .then(() => {
                    console.log("success!");

                    // const newUrlList = oldState.urlList + [urlValue];
                    const addNewUrl = [...oldState.urlList];
                    addNewUrl.push(urlValue);
                    const newValidationInfo = {...oldState.validationInfo, isValid: true, invalidationType: ""};
                    const newState = {...oldState, validationInfo: newValidationInfo, urlList: addNewUrl};
                    
                    stateWrapperWatched.state = newState;
                    console.log(stateWrapperWatched);
                })
                .catch(e => {
                    console.log("error");
                    console.log(e);

                    const newValidationInfo = {...oldState.validationInfo, isValid: false, invalidationType: e.type};
                    const newState = {...oldState, validationInfo: newValidationInfo};

                    stateWrapperWatched.state = newState;
                    console.log(stateWrapperWatched);
                });
        });
    }
//#endregion clicker end

//#region render
const renderForm = () => {
    // console.log("render triggered!");
    // console.log(stateWrapperWatched);

    const form = document.querySelector('.rss-form');
    const processingText = document.querySelector('#feedback');
    const getInput = document.querySelector('#url-input');
    const postsContainer = document.querySelector('.posts');
    const feedsContainer = document.querySelector('.feeds');
    const savedPosts = stateWrapper.state.rssData.posts;
    const savedFeeds = stateWrapper.state.rssData.feeds;
    const ulFeeds= document.createElement('ul');
    ulFeeds.setAttribute('class', 'list-group border-0 rounded-0');
    const ulPosts = document.createElement('ul');
    ulPosts.setAttribute('class', 'list-group border-0 rounded-0')
    const h1 = document.createElement('h1');
    postsContainer.append(ulPosts);
    feedsContainer.append(ulFeeds);


    parsing(getInput.value, postsContainer, feedsContainer)
    updatePosts(stateWrapper.state.urlList);

    if (stateWrapperWatched.state.validationInfo.isValid === true) {
        getInput.classList.remove('invalid-url');
        stateWrapperWatched.state.validationInfo.isValid = true;
        getInput.removeAttribute('style', 'border: 1px solid red');
        processingText.textContent = 'RSS успешно загружен';
        // i18next.t('validationForm.isValid');
        // feedbackContainer.textContent = 'RSS успешно загружен';
        // feedbackContainer.classList('green');
        // console.log(savedFeeds);
        
        savedFeeds.forEach((elem) => {
            const feedsTitle = document.createElement('li');
            feedsTitle.setAttribute('class', 'list-group border-0 rounded-0')
            const feeds = document.createElement('li');
            feeds.setAttribute('class', 'list-group border-0 rounded-0')
            feedsTitle.textContent = elem.title;
            feeds.textContent = elem.description;
            h1.textContent = 'FEEDS'
            ulFeeds.append(h1);
            ulFeeds.append(feedsTitle);
            ulFeeds.append(feeds);
            // console.log(ulFeeds);
        })
        savedPosts.forEach((elem) => {
            const posts = document.createElement('li');
            posts.setAttribute('class', 'list-group border-0 rounded-0');
            const title = document.createElement('li');
            title.setAttribute('class', 'list-group border-0 rounded-0');
            title.innerHTML = elem.title;
            posts.innerHTML = elem.description;
            ulPosts.append(title);
            ulPosts.append(posts);
        })
        form.reset();
        getInput.focus();
        return;
    }
    switch (stateWrapperWatched.state.validationInfo.invalidationType) {
        case 'url': {
            getInput.classList.add('invalid-url');
            getInput.setAttribute('style', 'border: 1px solid red');
            processingText.textContent = i18next.t('validationForm.errors.errorURL');
            getInput.focus();
            break;
        }
        case 'notOneOf': {
            getInput.classList.add('invalid-url');
            getInput.setAttribute('style', 'border: 1px solid red');
            processingText.textContent = i18next.t('validationForm.errors.errorUniqueURL');
            getInput.focus();
            break;
        }
        case 'required': {
            getInput.classList.add('invalid-url');
            getInput.setAttribute('style', 'border: 1px solid red');
            processingText.textContent = i18next.t('validationForm.errors.errorRequared');
            getInput.focus();
            break;
        }
        default: {
            throw Error("Unable to parse invalidation type!");
        }
      }
}
//#endregion render end

//#region generate id  

const getId = () => {
    return getId.id++;
}
getId.id = 1;

//#endregion generate id end

//#region parsing

const parsing = (inputData) => {
    return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(inputData)}`)
    .then(response => {
        if (response.status === 200) return response})
    .then(response => new DOMParser().parseFromString(response.data.contents, "text/xml"))
    .then(data => {
        const feed = {
            title: data.querySelector('channel title').textContent,
            description: data.querySelector('channel description').textContent,
            id: getId(),
          };

        const arr3 = [];
        const arr2 = [];
        const items = data.querySelectorAll('item');
        Array.from(items).forEach((item) => {
            arr3.push({
                title: item.querySelector("title").textContent,
                description: item.querySelector("description").textContent,
                id: getId(),
            })
        });
        arr2.push(feed)
        stateWrapper.state.rssData.posts = arr3;
        stateWrapper.state.rssData.feeds = arr2;
    }).catch((e) => {
       stateWrapper.state.error = e.message;
    })
}
//#endregion parsing

//#region update posts

const getRss = (url) => axios
  .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then(response => {
    if (response.status === 200) return response})
    .then(response => new DOMParser().parseFromString(response.data.contents, "text/xml"))
  .catch((e) => stateWrapper.state.error = e.message);

const updatePosts = (urlList) => {
    const newArr = [];
    urlList.forEach(url => {
        getRss(url)
        .then(data => {
            const feed = {
                title: data.querySelector('channel title').textContent,
                description: data.querySelector('channel description').textContent,
                id: getId(),
              };
            newArr.push(feed)

            newArr.forEach(item => 
                item.filter(stateWrapper.state.urlList.includes())
                .concat()
                // console.log(`smthng like ${item.title}`)
                )
        })
        })

    setTimeout(() => updatePosts(), 5000)
};

//#endregion update posts


export default () => {
    console.log("got here");
    // вызываем обработчик пользовательского ввода
    clicker();
    // делает фокус на форме на старте приложения
    const form = document.querySelector('.rss-form');
    form.focus();
}