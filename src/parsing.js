export default (data) => {
    if (data.querySelector('parsererror')) {
      throw new Error('parsererror');
    }
    console.log(data);
    const channel = data.querySelector('channel');
    console.log(channel);
    const channelItems = [...channel.querySelectorAll('item')];

    const feedTitle = channel.querySelector('title').textContent;
    const feedDescription = channel.querySelector('description').textContent;
    const feedLink = channel.querySelector('link').textContent;
    const infoItems = channelItems.map((item) => {
      const title = item.querySelector('title').textContent;
      const link = item.querySelector('link').textContent;
      const description = item.querySelector('description').textContent;
      description.trim();
      return { title, description, link };
    });
    return {
      feedInfo: { feedTitle, feedDescription, feedLink },
      infoItems,
    };
};


//   const channel = data.querySelector('channel');
//   const channelItems = [...channel.querySelectorAll('item')];
//   const feedTitle = channel.querySelector('title').textContent;
//   const feedDescription = channel.querySelector('description').textContent;
//   const feedLink = channel.querySelector('link').textContent;

//   const infoItems = [...channelItems].map((item) => {
//     const title = item.querySelector('title').textContent;
//     const link = item.querySelector('link').textContent;
//     const description = item.querySelector('description').textContent;
//     description.trim();
//     return { title, link, description };
//   });
//   return {
//     feedInfo: { feedTitle, feedDescription, feedLink },
//     infoItems,
//   };
// };

// return getRss(inputData)
// .then(data => {
//     const feed = {
//         title: data.querySelector('channel title').textContent,
//         description: data.querySelector('channel description').textContent,
//         id: getId(),
//       };

//     const arr3 = [];
//     const arr2 = [];
//     const items = data.querySelectorAll('item');
//     Array.from(items).forEach((item) => {
//         arr3.push({
//             title: item.querySelector("title").textContent,
//             description: item.querySelector("description").textContent,
//             id: getId(),
//         })
//     });
//     arr2.push(feed)
//     state.rssData.posts = arr3;
//     state.rssData.feeds = arr2;
// }).catch((e) => {
//    state.submitForm.errors = e.message;
// })