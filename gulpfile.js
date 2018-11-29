const { Indexer, Packager } = require("@vesta/devmaid");

const indexer = new Indexer("src");
indexer.generate();

let pkgr = new Packager({
    root: __dirname,
    src: "src",
    targets: ["es6"],
    files: [".npmignore", "LICENSE", "README.md"],
    publish: "--access=public",
});

module.exports = pkgr.createTasks();