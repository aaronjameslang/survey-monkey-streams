import Reader, { ReadableOptions, RequestOptions } from "./Reader";

class SurveysReader extends Reader {
    /**
     * @example new Reader({
     *   headers: { authorization: 'bearer xxxxx.yyyyy.zzzzz' }
     * })
     */
    constructor(requestOptions: RequestOptions, readableOptions: ReadableOptions = {}) {
        super({ ...requestOptions, url: "surveys"}, readableOptions);
    }
}

export default SurveysReader;
export {
    SurveysReader,
    ReadableOptions,
    RequestOptions,
};
