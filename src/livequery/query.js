import { rxQueryBasedOnObjectKeys, rxQueryInnerJoin, rxQuerySimple } from 'redux-livequery';
export let resultValue = [];
export function getComposedState(cb) {
  let selector0 = (state) => state.task;

  let field0 = 'task';
  let unsub = rxQuerySimple([selector0], [field0], (resultValue) => {
    // you can do whatever you want here
    // ex: filter, reduce, map
    cb(resultValue);
  }, 0);
  return unsub;
}
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

export function getCompleteTaskList(cb) {
  let selector0 = (state) => state.task.completeTaskSet;
  let selector1 = (state) => state.task.taskList;

  let field0 = 'completeTaskSet';
  let field1 = 'task'
  let unsub = rxQueryBasedOnObjectKeys([selector0, selector1], [field0, field1], (nextList) => {
    //let unsub = rxQueryInnerJoin([selector0, selector1], [field0, field1], (nextList) => {
    cb(nextList);
  }, 0);
  return unsub;
}
