import { Entry, Options, Rule } from "webpack";

/**
 * Easy configuration.
 */
export interface IToolsOptions {

  /**
   * Required webpack file entries.
   */
  entry: string | string[] | Entry;

  /**
   * Current working directory.
   * Default is `process.cwd()`.
   */
  root?: string;

  /**
   * Enable css extractor.
   * Default is true.
   */
  extract?: boolean;

  /**
   * Webpack devtool.
   * Default if production: false, otherwise: 'source-maps'
   */
  sourceMaps?: Options.Devtool;

  /**
   * Set hash to all filenames.
   * Default is isProduction.
   */
  hash?: boolean;

  /**
   * Enable prod mode.
   * This will minimize bundle size but make compilation slower.
   * This options is also available with env variables.
   *
   * ```
   * NODE_ENV=production webpack
   * # or
   * webpack -p
   * ```
   *
   * Default is false.
   */
  production?: boolean;

  /**
   * Don't bundle files that match pattern.
   */
  exclude?: RegExp;

  /**
   * Add more env variable to process.env
   * NODE_ENV is already set by 'production: true' / -p ...
   */
  env?: { [key: string]: string };

  /**
   * Path to the dist directory.
   * Default is `${root}/www`.
   */
  dist?: string;

  /**
   * Path to the assets directory.
   * Assets are copied without any transformations in the dist directory.
   * Disable by default.
   */
  assets?: string;

  /**
   * Absolute path to the `index.html`.
   * Default is `oly-tools/webpack/index.html`
   */
  template?: string;

  /**
   * Override typescript loader.
   */
  typescriptLoader?: Rule;

  /**
   * Override font loader.
   */
  fontLoader?: Rule;

  /**
   * Override image loader.
   */
  imageLoader?: Rule;

  /**
   * Override style loader.
   */
  styleLoader?: Rule;
}
