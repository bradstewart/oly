import { IAnyFunction, Kernel } from "oly-core";
import { ICompressOptions, ICorsOptions, IKoaContext, IServeOptions, KoaMiddleware } from "./interfaces";

// --
const koaStatic = require("koa-static");        // tslint:disable-line
const koaCompress = require("koa-compress");    // tslint:disable-line
const koaMount = require("koa-mount");          // tslint:disable-line
const koaHelmet = require("koa-helmet");        // tslint:disable-line
const koaCors = require("kcors");               // tslint:disable-line

/**
 * https://github.com/koajs/static
 *
 * @middleware
 * @param root - absolute/relative path to folder
 * @param options - Koa Static options
 */
export const serve = (root: string, options?: IServeOptions): KoaMiddleware => koaStatic(root, options);

/**
 * https://github.com/koajs/compress
 *
 * @middleware
 * @param options     Koa Compress options
 */
export const compress = (options?: ICompressOptions): KoaMiddleware => koaCompress(options);

/**
 * https://github.com/koajs/cors
 *
 * @middleware
 * @param options     Koa Cors Options
 */
export const cors = (options?: ICorsOptions): KoaMiddleware => koaCors(options);

/**
 * https://github.com/koajs/mount
 *
 * @middleware
 * @param path        url path ('/', or '/api', ...)
 * @param middleware  Middleware to mount
 */
export const mount = (path: string, middleware: KoaMiddleware): KoaMiddleware => koaMount(path, middleware);

/**
 * https://github.com/venables/koa-helmet
 *
 * @middleware
 * @param opt     helmet options
 */
export const helmet = (opt: object = {}): KoaMiddleware => koaHelmet(opt || {noCache: false});

/**
 * Attach a fresh kernel fork to the current koa context.
 *
 * @param kernel    Kernel to fork
 * @middleware
 */
export const context = (kernel: Kernel) => (ctx: IKoaContext, next: IAnyFunction) => {
  ctx.kernel = kernel.fork();
  return next();
};
