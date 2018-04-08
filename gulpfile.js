const vesta = require('@vesta/devmaid');

const indexer = new vesta.Indexer("src");
indexer.generate();

let pkgr = new vesta.Packager({
    root: __dirname,
    src: "src",
    targets: ['es5'],
    files: ['.npmignore', 'LICENSE', 'README.md'],
    publish: '--access=public',
});

pkgr.createTasks();