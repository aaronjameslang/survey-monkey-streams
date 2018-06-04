import Reader, { ReadableOptions, RequestOptions } from "./Reader";

class SurveysReader extends Reader {
  /**
   * @example new SurveysReader({
   *   headers: { authorization: 'bearer xxxxx.yyyyy.zzzzz' }
   * })
   */
  constructor(
    requestOptions: RequestOptions,
    readableOptions: ReadableOptions = {}
  ) {
    super({ ...requestOptions, url: "surveys" }, readableOptions);
  }
}

export default SurveysReader;
export { SurveysReader, ReadableOptions, RequestOptions };
