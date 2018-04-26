const path = require('path');

module.exports = {

  //Entry Point.
  entry: path.resolve(__dirname)+ '/src/MainComponent.js',

  //output point.
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  //Modules required.
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react'],
        plugins: ['react-html-attrs']
      }
    }
    ]
  }

}