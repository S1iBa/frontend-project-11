export default (data) => {
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
  console.log(infoItems);
  return {
    title: feedTitle,
    description: feedDescription,
    link: feedLink,
    items: infoItems,
  };
};
