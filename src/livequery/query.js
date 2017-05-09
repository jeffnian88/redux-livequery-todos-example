//import { rxQuerySimple } from '../../../redux-livequery';
import { rxQuerySimple } from 'redux-livequery';
export let resultValue = [];
export function getFilteredTask(keyword, cb) {
  let selector0 = (state) => state.task.taskList;// only subscribe task list

  let field0 = 'taskList';
  let unsub = rxQuerySimple([selector0], [field0], (resultValue) => {
    // you can do whatever you want here
    // ex: filter, reduce, map
    let filtered = resultValue.taskList.filter((each) => {
      return each.content.indexOf(keyword) > -1;
    });
    cb(filtered);
  }, 0);
  //}, 500);//debounceTime
  return unsub;
}

