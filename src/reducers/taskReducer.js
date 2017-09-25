export default function taskReducer(state = { taskList: [], completeSet: {}, activeSet: {} }, action = {}) {
	switch (action.type) {
		case "ADD_NEW_TASK": {
			let { content } = action.payload;
			return {
				...state,
				taskList: [...state.taskList, { content, created: Date.now() }]
			};
		}
		case "UPDATE_TASK": {
			let { id, content } = action.payload;
			let numId = parseInt(id, 10);
			return {
				...state,
				taskList: state.taskList.map((each, index) => index === numId ? { content, updated: Date.now() } : each)
			};
		}
		case "MARK_TASK_COMPLETE": {
			const { id } = action.meta;
			state = {
				...state,
				completeSet: { ...state.completeSet, [id]: { completed: Date.now() } }
			};
			return { ...state, completeOrActiveSet: { ...state.completeSet, ...state.activeSet } };
		}
		case "UNMARK_TASK_COMPLETE": {
			const { id } = action.meta;
			state = {
				...state,
				completeSet: Object.keys(state.completeSet).reduce((nextSet, key) => {
					if (key !== id) {
						nextSet[key] = state.completeSet[key];
					}
					return nextSet;
				}, {})
			};
			return { ...state, completeOrActiveSet: { ...state.completeSet, ...state.activeSet } };
		}
		case "MARK_TASK_ACTIVE": {
			const { id } = action.meta;
			state = {
				...state,
				activeSet: { ...state.activeSet, [id]: { active: Date.now() } }
			};
			return { ...state, completeOrActiveSet: { ...state.completeSet, ...state.activeSet } };
		}
		case "UNMARK_TASK_ACTIVE": {
			const { id } = action.meta;
			state = {
				...state,
				activeSet: Object.keys(state.activeSet).reduce((result, key) => {
					if (key !== id) {
						result[key] = state.activeSet[key];
					}
					return result;
				}, {})
			};
			return { ...state, completeOrActiveSet: { ...state.completeSet, ...state.activeSet } };
		}
		default:
			return state;
	}
}