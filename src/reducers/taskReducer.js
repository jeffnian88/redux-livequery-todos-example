export default function taskReducer(state = { taskList: [], isComplete: {}, isActive: {} }, action = {}) {
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
		case "MARK_COMPLETE_TASK": {
			let { id } = action.meta;
			return {
				...state,
				isComplete: { ...state.isComplete, [id]: { completed: Date.now() } }
			};
		}
		case "UNMARK_COMPLETE_TASK": {
			let { id } = action.meta;
			return {
				...state,
				isComplete: Object.keys(state.isComplete).reduce((result, key) => {
					if (key !== id) {
						result[key] = state.isComplete[key];
					}
					return result;
				}, {})
			};
		}
		case "MARK_ACTIVE_TASK": {
			let { id } = action.meta;
			return {
				...state,
				isActive: { ...state.isActive, [id]: { active: Date.now() } }
			};
		}
		case "UNMARK_ACTIVE_TASK": {
			let { id } = action.meta;
			return {
				...state,
				isActive: Object.keys(state.isActive).reduce((result, key) => {
					if (key !== id) {
						result[key] = state.isActive[key];
					}
					return result;
				}, {})
			};
		}
		case "SET_COMPLETE_OR_ACTIVE": {
			let { isCompleteOrActive } = action.payload;
			return {
				...state,
				isCompleteOrActive: isCompleteOrActive
			};
		}
		case "SET_COMPLETE_NOT_ACTIVE": {
			let { isCompleteNotActive } = action.payload;
			return {
				...state,
				isCompleteNotActive: isCompleteNotActive
			};
		}
		default:
			return state;
	}
}