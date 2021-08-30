const updateToc = () => {
  if (!window.jQuery) {
    setTimeout("updateToc();", 10);
    return;
  }
  for (let i = 1; i <= 6; ++i) {
    const headings = document.getElementsByTagName('h' + i);
    [].forEach.call(headings, (heading) => {
      heading.classList.add('heading');
    });
  }

  const list = document.getElementById('toc-list');
  list.innerHTML = '';

  const headings = document.getElementsByClassName('heading');
  [].forEach.call(headings, (heading) => {
    let item = '<li><a href="#' + heading.id + '">';
    if (heading.hasAttribute('data-toc-text')) {
      const text = heading.getAttribute('data-toc-text');
      if (text == 'ignore') {
        return;
      }
      item += heading.getAttribute('data-toc-text');
    } else {
      item += heading.innerHTML;
    }
    item += '</a></li>';
    list.innerHTML += item;
  });
}
updateToc();
