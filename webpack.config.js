const Dotenv = require('dotenv-webpack');
const path = require( 'path' );

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'libraries',
    libraryTarget: 'window',
    chunkFormat: false
  },
  plugins: [
    new Dotenv({
      path: './.env',
    }),
  ],
  mode: 'production'
};