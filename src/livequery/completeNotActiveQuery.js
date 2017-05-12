//import { rxQuerySimple } from '../../../redux-livequery';
import { rxQuerySimple } from 'redux-livequery';
export default function completeNotActiveQuery(store) {
	console.log("completeNotActiveQuery()");
	let selector0 = (state) => state.task.isComplete;
	let selector1 = (state) => state.task.isActive;
	rxQuerySimple([selector0, selector1], ['isComplete', 'isActive'], (completeActive) => {
		// equal SQL =>
		// select * from isComplete OUTER JOIN isActive on isComplete.child_key == isActive.child_key
		console.log("got latest completeActive", completeActive);
		// you can do whatever you want here
		// ex: filter, reduce, map
		let isCompleteNotActive = {};
		for (let key in completeActive.isComplete) {
			if (!(key in completeActive.isActive)) {
				isCompleteNotActive[key] = completeActive.isComplete[key];
			}
		}

		// set data into redux state
		store.dispatch({ type: "SET_COMPLETE_NOT_ACTIVE", payload: { isCompleteNotActive } });
	}, 0);
}