

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};

    Object.assign(fallback,{
        // "path": require.resolve("path-browserify"),
        // "os": require.resolve("os-browserify/browser")
        "fs": false,
        "tls": false,
        "net": false,
        "path": false,
        "zlib": false,
        "http": false,
        "https": false,
        "stream": false,
        "crypto": false,
        "os": false,
        "crypto-browserify": false
    });
    config.resolve.fallback = fallback;

    return config;
}