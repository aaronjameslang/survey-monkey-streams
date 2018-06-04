import request, { Options as RequestOptions } from "request";
import { Readable, ReadableOptions } from "stream";

class Reader extends Readable {
  private page = 0;
  private readonly request: request.DefaultUriUrlRequestApi<
    request.Request,
    request.CoreOptions,
    request.OptionalUriUrl
  >;
  private semaphore = 1;

  /**
   * @example new Reader({
   *   url: 'surveys',
   *   headers: { authorization: 'bearer xxxxx.yyyyy.zzzzz' }
   * })
   * @example new Reader({
   *   url: 'surveys/322001503/responses/bulk',
   *   qs: { per_page: 1000 },
   *   headers: { authorization: 'bearer xxxxx.yyyyy.zzzzz' }
   * }, {
   *   highWaterMark: 5000
   * })
   */
  public constructor(
    requestOptions: RequestOptions,
    readableOptions: ReadableOptions = {}
  ) {
    super({ ...readableOptions, objectMode: true });
    this.request = request.defaults({
      ...requestOptions,
      baseUrl: "https://api.surveymonkey.net/v3/",
      json: true
    });
  }

  public _read() {
    // The size parameter is ignored,
    //   as page size is fixed from construction

    if (this.semaphore <= 0) {
      return;
    }
    this.semaphore -= 1;

    this.request(
      { qs: { page: this.page + 1 } },
      (error: Error, reponse: request.Response, body: any) => {
        if (error || body.error) {
          process.nextTick(() => this.emit("error", error || body.error));
          return;
        }
        // Page events allow progress checks and API limits
        this.emit("page", body);
        this.page = body.page;
        let more = true; // Initialise as true, in case data is empty
        body.data.forEach((datum: object) => {
          more = this.push(datum);
        });
        this.semaphore += 1;
        if (!body.links.next) {
          this.push(null);
          return;
        }
        if (more) {
          this._read();
        }
      }
    );
  }
}

export default Reader;
export { Reader, ReadableOptions, RequestOptions };
