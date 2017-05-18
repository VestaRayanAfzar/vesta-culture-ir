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
            delete json.devDependencies[''];
        },
        tsconfig: (json, target) => {
            json.compilerOptions.outDir = './';
            json.exclude = json.exclude = ["node_modules", "**/*.d.ts", "**/*.js"];
        }
    }
});

aid.createTasks();