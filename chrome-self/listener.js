const context = {
  'WebPage': 'http://schema.org/WebPage',
  'device': 'http://schema.org/device',
  'dateCreated': 'http://schema.org/dateCreated',
  'about': 'http://schema.org/about'
}

function payload(historyItem) {
  const now = new Date();
  return {
    '@context': context,
    'device': 'chrome',
    'dateCreated': now.toISOString(),
    'about': {
      '@id': historyItem.url,
      '@type': 'WebPage',
      'url': '@id',
      'name': historyItem.title
    }
  };
}

chrome.history.onVisited.addListener(historyItem => {
  fetch('http://localhost:3000/', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload(historyItem))
  });
});
