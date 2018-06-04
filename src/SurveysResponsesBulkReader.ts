import { Readable, ReadableOptions } from "stream";
import ResponsesBulkReader from "./ResponsesBulkReader";
import SurveysReader, { RequestOptions } from "./SurveysReader";

class SurveysResponsesBulkReader extends Readable {
  private readonly readableOptions: ReadableOptions;
  private readonly requestOptions: RequestOptions;
  private readonly surveysReader: SurveysReader;
  private responsesBulkReader?: ResponsesBulkReader;
  private surveysReaderEnded = false;
  /**
   * @example new SurveysResponsesBulkReader('152299598', {
   *   headers: { authorization: 'bearer xxxxx.yyyyy.zzzzz' }
   * })
   */
  public constructor(
    requestOptions: RequestOptions,
    readableOptions: ReadableOptions = {}
  ) {
    super({ ...readableOptions, objectMode: true });
    this.requestOptions = requestOptions;
    this.readableOptions = readableOptions;
    this.surveysReader = new SurveysReader(
      this.requestOptions,
      this.readableOptions
    )
      .on("data", (survey: { id: string }) => {
        this.surveysReader.pause();
        this.initResponsesBulkReader(survey.id);
      })
      .on("end", () => {
        this.surveysReaderEnded = true;
      })
      .on("error", error => {
        process.nextTick(() => this.emit("error", error));
      });
  }

  public initResponsesBulkReader(id: string) {
    if (this.responsesBulkReader) {
      throw new Error("Impossible");
    }
    this.responsesBulkReader = new ResponsesBulkReader(
      id,
      this.requestOptions,
      this.readableOptions
    )
      .on("data", response => {
        const more = this.push(response);
        if (this.responsesBulkReader && !more) {
          this.responsesBulkReader.pause();
        } else if (!this.responsesBulkReader) {
          throw new Error("Impossible");
        }
      })
      .on("end", () => {
        if (this.surveysReaderEnded) {
          process.nextTick(() => this.emit("end"));
        } else {
          delete this.responsesBulkReader;
          this.surveysReader.resume();
        }
      })
      .on("error", error => {
        process.nextTick(() => this.emit("error", error));
      });
  }

  public _read() {
    if (this.responsesBulkReader) {
      this.responsesBulkReader.resume();
    } else if (!this.surveysReaderEnded) {
      this.surveysReader.resume();
    }
  }
}

export default SurveysResponsesBulkReader;
export { SurveysResponsesBulkReader, ReadableOptions, RequestOptions };
