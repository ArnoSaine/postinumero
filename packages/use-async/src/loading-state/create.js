import { constructor } from '../create';
import recall from './recall.js';
import useAsync from './useAsync.js';
import useAsyncSafe from './useAsyncSafe.js';

export default constructor([useAsync, recall, useAsyncSafe]);
