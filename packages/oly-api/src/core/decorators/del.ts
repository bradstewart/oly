import { route } from "../../router/decorators/route";

/**
 * Define a route with the http method DELETE.
 *
 * ```ts
 * class A {
 *   @del("/") remove() {}
 * }
 * ```
 *
 * @param path    Relative path
 */
export const del = (path: string) => route({method: "DEL", path});
