define([
    'react'
], function (
    React
) {
    return React.createClass({
        render: function() {
            return (
                React.createElement("div", null, 
                    "Hello, world! (", this.props['data-test'], ")"
                )
            );
        }
    });
});
