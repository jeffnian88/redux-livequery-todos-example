import { omit } from 'lodash';
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
			const completeSet = { ...state.completeSet, [id]: { completed: Date.now() } };
			return {
				...state,
				completeSet,
				completeOrActiveSet: { ...completeSet, ...state.activeSet }
			};
		}
		case "MARK_TASK_ACTIVE": {
			const { id } = action.meta;
			const activeSet = { ...state.activeSet, [id]: { active: Date.now() } };
			return {
				...state,
				activeSet,
				completeOrActiveSet: { ...state.completeSet, ...activeSet }
			};
		}
		case "UNMARK_TASK_COMPLETE": {
			const { id } = action.meta;
			const completeSet = omit(state.completeSet, id);
			return {
				...state,
				completeSet,
				completeOrActiveSet: { ...completeSet, ...state.activeSet }
			};
		}
		case "UNMARK_TASK_ACTIVE": {
			const { id } = action.meta;
			const activeSet = omit(state.activeSet, id);
			return {
				...state,
				activeSet,
				completeOrActiveSet: { ...activeSet, ...state.completeSet }
			};
		}
		default:
			return state;
	}
}