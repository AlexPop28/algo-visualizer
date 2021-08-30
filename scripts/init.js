const addScript = (src) => {
  let script = document.createElement('script');
  script.src = src;
  script.type = 'text/javascript';
  script.onload = () => {}
  document.head.appendChild(script);
}

const addScriptAfterJQuery = (src) => {
  if (window.jQuery) {
    addScript(src);
  } else {
    setTimeout(() => addScriptAfterJQuery(src), 10);
  }
}

const initHead = () => {
  const head = document.head;
  head.innerHTML = `
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap-theme.min.css">
    <link rel="stylesheet" href="styles/dark.css" id="theme">
    <link rel="stylesheet" href="styles/toc.css">
    <link rel="stylesheet" href="styles/styles.css">
    <link rel="icon" type="image/png" href="images/favicon.png"/>
  ` + head.innerHTML;


  addScript('https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML');
  addScript('https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js');
  addScriptAfterJQuery('https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js');
  addScriptAfterJQuery('https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js');
}
initHead();
