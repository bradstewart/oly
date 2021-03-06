import * as autoprefixer from "autoprefixer";
import * as ExtractTextPlugin from "extract-text-webpack-plugin";
import { Rule } from "webpack";
import { IToolsOptions } from "./interfaces";

/**
 * Typescript loader factory
 */
export function typescriptLoaderFactory(): Rule {
  return {
    exclude: /node_modules/,
    test: /\.tsx?$/,
    use: [{
      loader: "ts-loader",
      options: {
        silent: true,
        transpileOnly: true,
        compilerOptions: {
          module: "es2015",
        },
      },
    }],
  };
}

/**
 * CSS loader factory
 */
export function cssLoaderFactory(): Rule {
  return {
    loader: ExtractTextPlugin.extract({
      fallback: "style-loader",
      use: [{loader: "css-loader", options: {sourceMap: true}}],
    }),
    test: /\.css$/,
  };
}

/**
 * Less loader factory
 *
 * @param lessLoaderOptions   less options
 */
export function lessLoaderFactory(lessLoaderOptions: object = {}): Rule {
  return {
    loader: ExtractTextPlugin.extract({
      fallback: "style-loader",
      use: [
        {loader: "css-loader", options: {sourceMap: true}},
        {loader: "postcss-loader", options: {sourceMap: true, plugins: () => [autoprefixer]}},
        {loader: "less-loader", options: {sourceMap: true, ...lessLoaderOptions}},
      ],
    }),
    test: /\.(css|less)$/,
  };
}

/**
 * Sass loader factory
 *
 * @param sassLoaderOptions  sass options
 */
export function sassLoaderFactory(sassLoaderOptions: object = {}): Rule {
  return {
    loader: ExtractTextPlugin.extract({
      fallback: "style-loader",
      use: [
        {
          loader: "css-loader",
          options: {sourceMap: true},
        },
        {
          loader: "postcss-loader",
          options: {sourceMap: true, plugins: () => [autoprefixer]},
        },
        {
          loader: "sass-loader",
          options: {sourceMap: true, ...sassLoaderOptions},
        },
      ],
    }),
    test: /\.(css|scss|sass)$/,
  };
}

/**
 * Image loader factory
 */
export function imageLoaderFactory(options: IToolsOptions): Rule {
  return {
    test: /\.(png|jpeg|jpg|svg)$/,
    use: [{
      loader: "file-loader",
      options: {
        name: options.hash
          ? "images/[name].[hash].[ext]"
          : "images/[name].[ext]",
      },
    }],
  };
}

/**
 * Font loader factory
 */
export function fontLoaderFactory(options: IToolsOptions) {
  return {
    test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
    use: [{
      loader: "file-loader",
      options: {
        name: options.hash
          ? "fonts/[name].[hash].[ext]"
          : "fonts/[name].[ext]",
      },
    }],
  };
}
