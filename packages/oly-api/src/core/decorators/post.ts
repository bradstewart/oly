import { route } from "../../router/decorators/route";

/**
 * Create a POST route.
 *
 * ```ts
 * class A {
 *  @post("/") create() {}
 * }
 * ```
 *
 * @param path    Relative path
 */
export const post = (path: string) => route({method: "POST", path});
