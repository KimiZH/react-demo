define([
    'react',
    'jsx!./main.jsx'
], function (
    React,
    jsxMain
) {
    React.render(
        jsxMain,
        document.getElementById('containerBody')
    );
});