define([
    'react'
], function (
    React
) {
    return React.createClass({
        render: function() {
            return (
                <div>
                    Hello, world! ({this.props['data-test']})
                </div>
            );
        }
    });
});
