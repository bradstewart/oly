import { route } from "./route";

/**
 * Create a DEL route.
 *
 * ```typescript
 * class A {
 *  @del("/") remove() {}
 * }
 * ```
 *
 * @param path    Relative path
 */
export const del = (path: string) => route("DEL", path);
