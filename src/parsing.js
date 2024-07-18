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
