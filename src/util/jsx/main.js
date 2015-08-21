define(['JSXTransformer'], function (JSXTransformer) {
    var fs, getXhr,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        fetchText = function () {
            throw new Error('Environment unsupported.');
        },
        buildMap = {},
        global = new Function("return this;")(),
        isLeIE7 = global.navigator && (~~(global.navigator.appVersion.replace(/.*?MSIE\s([\d\.]+).*/ig, "$1")) <= 7);

    if (typeof process !== "undefined" &&
               process.versions &&
               !!process.versions.node) {

        fs = require.nodeRequire('fs');

        fetchText = function (name, path, callback, config) {
            callback(fs.readFileSync(path, 'utf8'));
        };
    } else if ((typeof window !== "undefined" && window.navigator && window.document) || typeof importScripts !== "undefined") {
        getXhr = function () {
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            if (!xhr) {
                throw new Error("getXhr(): XMLHttpRequest not available");
            }

            return xhr;
        };

        fetchText = function (name, path, callback, config) {
            var url = path;

            url = url.replace(/^https?:\/\/.*?\//ig, '/');

            var xhr = getXhr();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function (evt) {
                if (xhr.readyState === 4) {
                    callback(xhr.responseText);
                }
            };
            xhr.send(null);
        };
    } else if (typeof Packages !== 'undefined') {
        fetchText = function (name, path, callback, config) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(path),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    line = line.substring(1);
                }

                stringBuffer.append(line);

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }

            callback(content);
        };
    }

    return {
        load: function (name, parentRequire, load, config) {
            var jsxOptions = config.jsx || {},
                transformOptions = {
                    harmony: !!jsxOptions.harmony,
                    stripTypes: !!jsxOptions.stripTypes
                },
                path = parentRequire.toUrl(name);

            fetchText(name, path, function (text) {
                try {
                    text = JSXTransformer.transform(text, transformOptions).code;
                    // text = 'define([\'react\'], function(React){return ' + text + ';});';
                } catch (err) {
                    err.message = "In " + path + ", " + err.message;
                    throw err;
                }

                if (config.isBuild) {
                    buildMap[name] = text;
                }

                if (!config.isBuild) {
                    text += "\r\n//@ sourceURL=" + path;
                }

                function loadName() {
                    load.fromText(name, text);

                    parentRequire([name], function (value) {
                        load(value);
                    });
                };

                if (isLeIE7) {
                    setTimeout(loadName, 0);
                }
                else {
                    loadName();
                }
            }, config);
        }
    }
});

// define({
//     load: function (name, req, onload, config) {
//         //req has the same API as require().
//         req([name], function (value) {
//             onload(value);
//         });
//     }
// });