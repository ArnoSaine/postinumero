import "dotenv/config";
import parseJsonValues from "../utils/parseJsonValues.js";
import unflat from "../utils/unflat.js";

export default unflat(parseJsonValues(process.env));
