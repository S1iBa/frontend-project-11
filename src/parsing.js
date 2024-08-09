import axios from 'axios';
// import { data } from 'jquery';

const getRss = (url) => axios
.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
.then((resp) => (new DOMParser().parseFromString(resp.data.contents, 'text/xml')))
.catch((e) => {
  watchedState.submitForm.state = 'failed';
  watchedState.submitForm.errors = e.name;
});


export default (data) => {
  // return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  // .then((response) => {
    const xml = new DOMParser().parseFromString(data, 'text/xml');

    if (xml.querySelector('parsererror')) {
      const error = new Error('parsererror');
      error.isParseError = true;
      throw error;
    }

    const channel = xml.querySelector('channel');
    const channelItems = [...channel.querySelectorAll('item')];
    const feedTitle = channel.querySelector('title').textContent;
    const feedDescription = channel.querySelector('description').textContent;
    const feedLink = channel.querySelector('link').textContent;

    const infoItems = [...channelItems].map((item) => {
      const title = item.querySelector('title').textContent;
      const link = item.querySelector('link').textContent;
      const description = item.querySelector('description').textContent.trim();   

      return { title, link, description };
    });

    return {
      title: feedTitle,
      description: feedDescription,
      link: feedLink,
      items: infoItems, 
    };
  
  // .catch(error => {
  //   watchedState.submitForm.state = 'failed';
  //   watchedState.submitForm.errors = error.name;
  // });


  // const parsedData = new DOMParser().parseFromString(resp.data.contents, 'text/xml');
  // if (data.querySelector('parsererror')) {
  //   throw new Error('parsererror');
  // }

  // const channel = parsedData.querySelector('channel');
  // const channelItems = [...channel.querySelectorAll('item')];
  // const feedTitle = channel.querySelector('title').textContent;
  // const feedDescription = channel.querySelector('description').textContent;
  // const feedLink = channel.querySelector('link').textContent;
  // console.log(feedLink);
  // const infoItems = channelItems.map((item) => {
  //   const title = item.querySelector('title').textContent;
  //   const link = item.querySelector('link').textContent;
  //   const description = item.querySelector('description').textContent;
  //   description.trim();
  //   return { title, description, link };
  // });
  // return {
  //   feedInfo: { feedTitle, feedDescription, feedLink },
  //   infoItems,
  // };

  // axios
  // .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(singleUrl)}`)
  // .then((resp) => (new DOMParser().parseFromString(resp.data.contents, 'text/xml')))
  // .then((data) => {
  // // if (data.querySelector('parsererror')) {
  // //   throw new Error('parsererror');
  // // }
  // console.log(data);
  // const channel = data.querySelector('channel');
  // const channelItems = [...channel.querySelectorAll('item')];
  // const feedTitle = channel.querySelector('title').textContent;
  // const feedDescription = channel.querySelector('description').textContent;
  // const feedLink = channel.querySelector('link').textContent;
  // console.log(feedLink);
  // const infoItems = channelItems.map((item) => {
  //   const title = item.querySelector('title').textContent;
  //   const link = item.querySelector('link').textContent;
  //   const description = item.querySelector('description').textContent;
  //   description.trim();
  //   return { title, description, link };
  // });
  // return {
  //   feedInfo: { feedTitle, feedDescription, feedLink },
  //   infoItems,
  // };
  // })
  // .catch((e) => {
  //   state.submitForm.state = 'failed';
  //   state.submitForm.errors = e.message;
  // })
};
