import update from 'immutability-helper';

export default function taskReducer(state = { taskList: [], completeTaskSet: {} }, action = {}) {
	switch (action.type) {
		case "ADD_NEW_TASK": {
			let { content } = action.payload;
			return update(state, { taskList: { $push: [{ content, created: Date.now() }] } });
		}
		case "MARK_COMPLETE_TASK": {
			let { id } = action.meta;
			return update(state, { completeTaskSet: { [id]: { $set: { completed: Date.now() } } } });
		}
		case "UNMARK_COMPLETE_TASK": {
			let { id } = action.meta;
			return update(state, { completeTaskSet: { $apply: function (x) { let y = Object.assign({}, x); delete y[id]; return y; } } });
		}
		default:
			return state;
	}
}