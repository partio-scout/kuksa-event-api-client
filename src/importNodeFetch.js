// This is a workaround to get the dynamic import unharmed to the build outputs.
// Since typescript is configured to produce commonjs code, it transpiles the dynamic import
// call to a require. This won't work with node-fetch as it's an ESM.
//
// This workaround should be no longer necessary in a later typescript version when the
// module: node12 configuration lands
module.exports = {
  importNodeFetch: () =>
    import('node-fetch').then((nodeFetchExports) => nodeFetchExports.default),
}
