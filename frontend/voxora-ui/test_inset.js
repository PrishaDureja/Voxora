const React = require('react');
const ReactDOMServer = require('react-dom/server');

const element = React.createElement('div', { style: { inset: 10 } });
console.log(ReactDOMServer.renderToString(element));
