import { Readable, ReadableOptions } from "stream";
import ResponsesBulkReader from "./ResponsesBulkReader";
import SurveysReader, { RequestOptions } from "./SurveysReader";

class SurveysResponsesBulkReader extends Readable {
  private readonly readableOptions: ReadableOptions;
  private readonly requestOptions: RequestOptions;
  private readonly surveysReader: SurveysReader;
  private responsesBulkReader?: ResponsesBulkReader;
  private surveyProgressCount = 0;
  private surveyProgressTotal = 0;
  private surveysReaderEnded = false;
  /**
   * @example new SurveysResponsesBulkReader('152299598', {
   *   headers: { authorization: 'bearer xxxxx.yyyyy.zzzzz' }
   * })
   */
  public constructor(
    surveyRequestOptions: RequestOptions,
    responseRequestOptions?: RequestOptions,
    readableOptions: ReadableOptions = {},
  ) {
    super({ ...readableOptions, objectMode: true });
    this.requestOptions = responseRequestOptions || surveyRequestOptions;
    this.readableOptions = readableOptions;
    this.surveysReader = this.initSurveysReader(
      surveyRequestOptions,
      readableOptions,
    );
  }

  public initSurveysReader(
    requestOptions: RequestOptions,
    readableOptions: ReadableOptions,
  ) {
    return new SurveysReader(requestOptions, readableOptions)
      .on("data", (survey: { id: string }) => {
        this.surveysReader.pause();
        this.surveyProgressCount += 1;
        this.emit("survey", survey);
        this.initResponsesBulkReader(survey.id);
      })
      .on("page", (page) => {
        this.surveyProgressTotal = page.total;
        this.emit("page", page, "survey");
      })
      .on("end", () => {
        this.surveysReaderEnded = true;
      })
      .on("error", (error) => {
        this.emit("error", error);
      })
      .pause();
  }

  public initResponsesBulkReader(id: string) {
    if (this.responsesBulkReader) {
      throw new Error("Impossible");
    }
    this.responsesBulkReader = new ResponsesBulkReader(
      id,
      this.requestOptions,
      this.readableOptions,
    )
      .on("data", (response) => {
        const more = this.push(response);
        if (this.responsesBulkReader && !more) {
          this.responsesBulkReader.pause();
        } else if (!this.responsesBulkReader) {
          throw new Error("Impossible");
        }
      })
      .on("page", (page) => {
        this.emit("page", page, "response");
      })
      .on("progress", (progress) => {
        this.emit("progress", {
          response: progress,
          survey: {
            count: this.surveyProgressCount,
            total: this.surveyProgressTotal,
          },
        });
      })
      .on("end", () => {
        if (this.surveysReaderEnded) {
          this.emit("end");
        } else {
          delete this.responsesBulkReader;
          this.surveysReader.resume();
        }
      })
      .on("error", (error) => {
        this.emit("error", error);
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
