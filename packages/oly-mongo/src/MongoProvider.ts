import { Db, MongoClient } from "mongodb";
import { Class, env, IDeclarations, inject, Logger, state } from "oly-core";
import { IDocument } from "./interfaces";
import { Repository } from "./Repository";

/**
 * Mongodb Provider.
 * Manage connection + repository synchronization (ensure indexes).
 */
export class MongoProvider {

  /**
   * database connection url
   */
  @env("OLY_MONGO_URL")
  public readonly url: string = "mongodb://localhost/my-app-dev";

  /**
   * database connection
   */
  @state
  public connection: Db;

  /**
   * logger
   */
  @inject
  protected logger: Logger;

  /**
   * Inline Repository Instantiation.
   *
   * @param documentType Model Definition
   */
  public repository<T extends IDocument>(documentType: Class<T>): Repository<T> {
    return new class InlineRepository extends Repository<T> { // tslint:disable-line
      protected type = documentType;
    };
  }

  /**
   *
   */
  protected createConnection(): Promise<Db> {
    return MongoClient.connect(this.url);
  }

  /**
   * Create new connection then synchronize all repositories.
   *
   * @param declarations    Kernel declarations
   */
  protected async onStart(declarations: IDeclarations) {

    this.logger.info(`open connection to ${this.url}`);

    this.connection = await this.createConnection();

    for (const declaration of declarations) {
      if (declaration.instance && declaration.instance instanceof Repository) {
        await declaration.instance.sync();
      }
    }
  }

  /**
   * Close connection.
   */
  protected onStop() {
    this.logger.info(`close connection`);
    return this.connection.close(true);
  }
}
