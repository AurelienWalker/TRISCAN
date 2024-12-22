const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs'); // Pour charger les fichiers de certificat

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true, // Nettoie le dossier dist avant chaque build
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 5003,
    hot: true,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')), // Clé SSL locale
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem')),    // Certificat SSL local
    },
    host: '0.0.0.0', // Permet l'accès depuis le réseau local
  },
};