define([
    'react',
    'jsx!./widget/hello-world/main.jsx'
], function (
    React,
    Test
) {
    return <div><Test data-test="ABC">test</Test></div>;
});
