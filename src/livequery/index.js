//import { combineLivequery } from '../../../redux-livequery';
import { combineLivequery } from 'redux-livequery';

import completeNotActiveQuery from './completeNotActiveQuery';
const rootLivequery = combineLivequery(
  completeNotActiveQuery
);
export default rootLivequery;