import { IClass, IClassOf } from "oly-core";
import { IField, IMetaNumber, IMetaString } from "../interfaces";
import { FieldMetadataUtil } from "../utils/FieldMetadataUtil";

export class JsonSanitizer {

  /**
   * Sanitize all fields of an object based on the definition.
   *
   * @param definition      Class definition
   * @param source          Json object data
   */
  public sanitizeClass<T>(definition: IClassOf<T>, source: T): T {

    const fields = FieldMetadataUtil.getFields(definition);
    for (const field of fields) {
      const key = field.name;
      if (source[key] != null) {
        source[key] = this.sanitizeField(field, source[key]);
      }
    }

    return source;
  }

  public sanitizeField(field: IField, value: any): any {
    const type = FieldMetadataUtil.getFieldType(field.type);
    if (type === "array" && !!field.of && Array.isArray(value)) {
      const item = typeof field.of === "function" ? {type: field.of, name: ""} : field.of;
      return value.map((v) => this.sanitizeField(item, v));
    } else if (type === "object" && typeof field.type === "function") {
      const definition = field.type as IClass;
      if (FieldMetadataUtil.hasFields(definition)) {
        return this.sanitizeClass(definition, value);
      } else {
        return value;
      }
    } else if (type === "boolean") {
      return value;
    } else if (type === "number") {
      return this.sanitizeNumber(field, value);
    } else if (type === "string") {
      return this.sanitizeString(field, value);
    } else {
      // nothing to do
      return value;
    }
  }

  /**
   * Sanitize a number field.
   *
   * @param field   Field number definition
   * @param value   Raw value
   * @returns       Sanitized number
   */
  public sanitizeNumber(field: IMetaNumber, value: number): number {

    return value;
  }

  /**
   * Sanitize a string field.
   *
   * @param field   Field string definition
   * @param value   Raw value
   * @returns       Sanitized string
   */
  public sanitizeString(field: IMetaString, value: string): string {

    if (field.trim !== false) {
      value = value.trim();
    }

    if (field.upper === true) {
      value = value.toUpperCase();
    }

    if (field.lower === true) {
      value = value.toLowerCase();
    }

    if (!!field.normalize) {
      if (typeof field.normalize === "string") {
        value = (value as any).normalize(field.normalize);
      } else {
        value = (value as any).normalize();
      }
    }

    return value;
  }
}
