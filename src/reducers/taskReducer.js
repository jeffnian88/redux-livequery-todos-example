import update from 'immutability-helper';

export default function taskReducer(state = { taskList: [], isComplete: {}, isActive: {} }, action = {}) {
	switch (action.type) {
		case "ADD_NEW_TASK": {
			let { content } = action.payload;
			return update(state, { taskList: { $push: [{ content, created: Date.now() }] } });
		}
		case "UPDATE_TASK": {
			let { id, content } = action.payload;
			return update(state, { taskList: { [id]: { $merge: { content, updated: Date.now() } } } });
		}
		case "MARK_COMPLETE_TASK": {
			let { id } = action.meta;
			return update(state, { isComplete: { [id]: { $set: { completed: Date.now() } } } });
		}
		case "UNMARK_COMPLETE_TASK": {
			let { id } = action.meta;
			return update(state, { isComplete: { $apply: function (x) { let y = Object.assign({}, x); delete y[id]; return y; } } });
		}
		case "MARK_ACTIVE_TASK": {
			let { id } = action.meta;
			return update(state, { isActive: { [id]: { $set: { active: Date.now() } } } });
		}
		case "UNMARK_ACTIVE_TASK": {
			let { id } = action.meta;
			return update(state, { isActive: { $apply: function (x) { let y = Object.assign({}, x); delete y[id]; return y; } } });
		}
		default:
			return state;
	}
}