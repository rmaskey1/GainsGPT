

module.exports = {
    // const fallback = config.resolve.fallback || {};

    // Object.assign(fallback,{
    //     "path": require.resolve("path-browserify"),
    //     "os": require.resolve("os-browserify/browser")
    // });
    // config.resolve.fallback = fallback;

    // return config;

    resolve: {
        fallback: {
            fs: false,
            path: false,
            os: false,
            stream: false,
            crypto: false,
            http: false,
            https: false,
            zlib: false,
            buffer: false,
            util: false,
            assert: false,
            url: false,
        },
    },
}