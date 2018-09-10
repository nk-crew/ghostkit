const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' );
const md5 = require( 'md5' );

module.exports = {
    module: {
        loaders: [
            {
                test: /(\.jsx|\.esm.js)$/,
                loader: 'babel-loader',
            }, {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader', // creates style nodes from JS strings
                    }, {
                        loader: 'css-loader', // translates CSS into CommonJS
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
                            plugins: [ {
                                cleanupIDs: {
                                    prefix: `ghostkit-${ md5( resource ) }-`,
                                },
                            } ],
                        },
                    },
                } ),
            },
        ],
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    plugins: [
        new UglifyJsPlugin( {
            uglifyOptions: {
                output: {
                    comments: /^!/,
                },
            },
        } ),
    ],
};
