const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' );

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
                use: [
                    'svg-react-loader',
                    'svgo-loader',
                ],
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
