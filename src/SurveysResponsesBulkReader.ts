import { Readable, ReadableOptions } from "stream";
import ResponsesBulkReader from "./ResponsesBulkReader";
import SurveysReader, { RequestOptions } from "./SurveysReader";

class SurveysResponsesBulkReader extends Readable {
  private readonly readableOptions: ReadableOptions;
  private readonly requestOptions: RequestOptions;
  private responsesBulkReader?: ResponsesBulkReader;
  private readonly surveysReader: SurveysReader;
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
    );
    this.surveysReader.on("data", (survey: { id: string }) => {
      this.surveysReader.pause();
      this.initResponsesBulkReader(survey.id);
    });
    this.surveysReader.on("end", () => {
      this.surveysReaderEnded = true;
    });
  }

  public initResponsesBulkReader(id: string) {
    if (this.responsesBulkReader) {
      throw new Error();
    }
    this.responsesBulkReader = new ResponsesBulkReader(
      id,
      this.requestOptions,
      this.readableOptions
    );
    this.responsesBulkReader.on("data", response => {
      const more = this.push(response);
      if (this.responsesBulkReader && !more) {
        this.responsesBulkReader.pause();
      } else if (!this.responsesBulkReader) {
        this.emit("error"); // TODO sync
      }
    });
    this.responsesBulkReader.on("end", () => {
      if (this.surveysReaderEnded) {
        this.emit("end"); // TODO sync
      } else {
        delete this.responsesBulkReader;
        this.surveysReader.resume();
      }
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
