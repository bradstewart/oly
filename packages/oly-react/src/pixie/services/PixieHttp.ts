import { env, Global, inject, Kernel } from "oly";
import { HttpClient, IHttpRequest, IHttpResponse } from "oly-http";
import { Pixie } from "./Pixie";
import { PixieSession } from "./PixieSession";

/**
 * HttpClient with Pixie.
 *
 * All get|post|... requests are wrapped with Pixie#fly().
 */
export class PixieHttp extends HttpClient {

  /**
   * Force ApiRoot.
   */
  @env("PIXIE_HTTP_ROOT")
  public apiRoot: string = "";

  @inject
  protected kernel: Kernel;

  @inject
  protected pixie: Pixie;

  @inject
  protected session: PixieSession;

  /**
   *
   */
  public get root(): string {
    if (Global.isBrowser()) {

      return this.apiRoot || this.pixie.get<string>("API_PREFIX") || "/api";

    } else {

      // try to create API_ROOT based on oly-http an oly-api if available
      const port = this.kernel.state("HTTP_SERVER_PORT") || 3000;
      const host = this.kernel.state("HTTP_SERVER_HOST") || "localhost";
      const prefix = this.kernel.state("API_PREFIX") || "";

      if (prefix) {
        this.pixie.set("API_PREFIX", prefix);
      }

      return `http://${host}:${port}${prefix}`;
    }
  }

  /**
   * Create a new http request.
   * It's like HttpClient#request(), except that result
   * are stored into pixie data.
   * This data is reused browser-side after a server-side rendering.
   *
   * @param options   HttpClient request options
   */
  public request<T = any>(options: IHttpRequest): Promise<IHttpResponse<T>> {

    options.method = options.method || "GET";
    options.url = options.url || "/";
    options.headers = options.headers || {};

    if (options.url.indexOf("http") !== 0) {
      options.url = this.root + options.url;
    }

    if (this.session.tk) {
      options.headers["Authorization"] = `Bearer ${this.session.tk}`;
    }

    return super.request<T>(options);
  }

  public get<T = any>(url: string, options?: IHttpRequest): Promise<T> {
    return this.pixie.fly<T>(`GET_${url}`, () => super.get<T>(url, options));
  }

  public post<T = any>(url: string, body?: any, options?: IHttpRequest): Promise<T> {
    return this.pixie.fly<T>(`POST_${url}`, () => super.post<T>(url, body, options));
  }

  public put<T = any>(url: string, body?: any, options?: IHttpRequest): Promise<T> {
    return this.pixie.fly<T>(`PUT_${url}`, () => super.put<T>(url, body, options));
  }

  public del<T = any>(url: string, options?: IHttpRequest): Promise<T> {
    return this.pixie.fly<T>(`DEL_${url}`, () => super.del<T>(url, options));
  }
}
