import Reader, { ReadableOptions, RequestOptions } from "./Reader";

class ResponsesBulkReader extends Reader {
  /**
   * @example new ResponsesBulkReader('152299598', {
   *   headers: { authorization: 'bearer xxxxx.yyyyy.zzzzz' }
   * })
   */
  public constructor(
    surveyId: string,
    requestOptions: RequestOptions,
    readableOptions: ReadableOptions = {},
  ) {
    super(
      { ...requestOptions, url: `surveys/${surveyId}/responses/bulk` },
      readableOptions,
    );
  }
}

export default ResponsesBulkReader;
export { ResponsesBulkReader, ReadableOptions, RequestOptions };
