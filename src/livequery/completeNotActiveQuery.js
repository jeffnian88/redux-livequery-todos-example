//import { rxQueryLeftOuterJoin } from '../../../redux-livequery';
import { rxQueryLeftOuterJoin } from 'redux-livequery';
export default function completeNotActiveQuery(store) {
	console.log("completeNotActiveQuery()");
	let selector0 = (state) => state.task.isComplete;
	let selector1 = (state) => state.task.isActive;
	rxQueryLeftOuterJoin([selector0, selector1], ['isComplete', 'isActive'], (completeNotActive) => {
		// equal SQL =>
		// select * from isComplete OUTER JOIN isActive on isComplete.child_key == isActive.child_key
		console.log("got latest completeNotActive", completeNotActive);
		// you can do whatever you want here
		// ex: filter, reduce, map
		let isCompleteNotActive = {};
		for (let value of completeNotActive) {
			isCompleteNotActive[value.key] = value.isComplete;
		}

		// set data into redux state
		store.dispatch({ type: "SET_COMPLETE_NOT_ACTIVE", payload: { isCompleteNotActive } });
	}, 0);
}