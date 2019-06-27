const md5 = require( 'md5' );

module.exports = {
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel-loader',
            }, {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader', // creates style nodes from JS strings
                    }, {
                        loader: 'css-loader', // translates CSS into CommonJS
                        options: {
                            url: false,
                        },
                    }, {
                        loader: 'sass-loader', // compiles Sass to CSS
                    },
                ],
            }, {
                test: /\.svg$/,
                use: ( { resource } ) => ( {
                    loader: '@svgr/webpack',
                    options: {
                        svgoConfig: {
                            plugins: [
                                {
                                    removeViewBox: false,
                                },
                                {
                                    cleanupIDs: {
                                        prefix: `ghostkit-${ md5( resource ) }-`,
                                    },
                                },
                            ],
                        },
                    },
                } ),
            }, {
                test: /\.(gif|png|jpe?g)$/i,
                loader: 'base64-inline-loader',
            },
        ],
    },
    resolve: {
        extensions: [ '.js', '.jsx', '.json' ],
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
};
