const vesta = require('@vesta/devmaid');

let aid = new vesta.TypescriptTarget({
    genIndex: true,
    targets: ['es5', 'es6'],
    files: ['.npmignore', 'LICENSE', 'README.md'],
    publish: '--access=public',
    transform: {
        package: (json, target) => {
            if (target === 'es5') {
                let version = json.dependencies['@vesta/core'];
                delete json.dependencies['@vesta/core'];
                json.dependencies['@vesta/core-es5'] = version;
            }
        }
    }
});

aid.createTasks();