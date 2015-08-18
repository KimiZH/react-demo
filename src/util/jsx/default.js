define({
    load: function (name, req, onload, config) {
        //req has the same API as require().
        req([name], function (value) {
            onload(value);
        });
    }
});
