import request, { Options as RequestOptions } from "request";
import { Readable, ReadableOptions } from "stream";

/**
 * Reader implements [`Readable`](//nodejs.org/api/stream.html#stream_stream_readable),
 *   and can consume any survey monkey endpoint which returns data as a
 *   paged list.
 *
 * This data can then be process by registering event handlers,
 *   using [`pipe`](//nodejs.org/api/stream.html#stream_readable_pipe_destination_options)
 *   to forward the data to a [`Writable`](//nodejs.org/api/stream.html#stream_writable_streams),
 *   or by calling [`read`](//nodejs.org/api/stream.html#stream_readable_read_size).
 *   See the [Node.js Stream API](//nodejs.org/api/stream.html) docs for more detail.
 *
 * Events:
 *   - [`data`](//nodejs.org/api/stream.html#stream_event_data)`: object`
 *
 *     Reader is an object-mode Readable stream, and as such this
 *     event will have an object payload, the shape of which will
 *     depend on the endpoint. It could be a survey, a response, etc.
 *
 *   - [`end`](//nodejs.org/api/stream.html#stream_event_end),
 *     [`error`](//nodejs.org/api/stream.html#stream_event_error)
 *
 *     See [Node.js Stream API](//nodejs.org/api/stream.html)
 *
 *   - `page: page: object, response: `[`IncomingMessage`](//nodejs.org/api/http.html#http_class_http_incomingmessage)
 *
 *     Emitted every time a page of data is received from the API,
 *     can be useful for tracking API usage limits and accessing raw
 *     data. Receives two arguments: the parsed body of the page, and
 *     the raw response object including headers, etc.
 *
 *   - `progress: {count: number, total:number}`
 *
 *     Emitted when new data have been buffered.
 */
class Reader extends Readable {
  /** Number of data buffered */
  private count = 0;
  /** Index of last received page */
  private page = 0;
  /** Function to perform HTTP communication */
  private readonly request: request.DefaultUriUrlRequestApi<
    request.Request,
    request.CoreOptions,
    request.OptionalUriUrl
  >;
  /** Guard against simultaneous requests */
  private semaphore = 1;

  /**
   * @param requestOptions
   *   See [`request`](//www.npmjs.com/package/request#requestoptions-callback)
   * @param readableOptions
   *   See [Readable](//nodejs.org/api/stream.html#stream_new_stream_readable_options)
   *
   * @example
   *     new Reader({
   *       url: 'surveys',
   *       headers: { authorization: 'bearer xxxxx.yyyyy.zzzzz' }
   *     })
   * @example
   *     new Reader({
   *       url: 'surveys/322001503/responses/bulk',
   *       qs: { per_page: 1000 },
   *       headers: { authorization: 'bearer xxxxx.yyyyy.zzzzz' }
   *     }, {
   *       highWaterMark: 5000
   *     })
   */
  public constructor(
    requestOptions: RequestOptions,
    readableOptions: ReadableOptions = {},
  ) {
    super({ ...readableOptions, objectMode: true });
    this.request = request.defaults({
      ...requestOptions,
      baseUrl: "https://api.surveymonkey.net/v3/",
      json: true,
    });
  }

  /**
   * No `size` parameter as this is an object stream
   */
  public _read() {
    if (this.semaphore <= 0) {
      return;
    }
    this.semaphore -= 1;

    this.request(
      { qs: { page: this.page + 1 } },
      (error: Error, response: request.Response, body: any) => {
        if (error) {
          this.emit("error", error);
          return;
        }
        if (response.statusCode >= 300) {
          this.emit("error", response);
          return;
        }
        if (body.error) {
          this.emit("error", body.error);
          return;
        }
        // Page events allow tracking API limit consumption
        this.emit("page", body); // TODO include response
        let more = true; // Initialise as true, in case data is empty
        body.data.forEach((datum: object) => {
          more = this.push(datum);
          this.count += 1;
        });
        this.semaphore += 1; // After this.push, which calls this._read
        // Progress events count *buffered* data, which may not yet be read
        this.emit("progress", {
          count: this.count,
          total: body.total,
        });
        if (!body.links.next) {
          this.push(null);
          return;
        }
        this.page = body.page; // Update page count before recursing
        if (more) {
          this._read();
        }
      },
    );
  }
}

export default Reader;
export { Reader, ReadableOptions, RequestOptions };
