import { omit } from 'lodash';
const initialData = { "taskList": [{ "content": "task1", "created": 1507174715692 }, { "content": "task2", "created": 1507174717457 }, { "content": "task3", "created": 1507174719657 }, { "content": "task4", "created": 1507174721623 }], "completeSet": { "0": { "completeTimestamp": 1507174722825 }, "2": { "completeTimestamp": 1507174724097 } }, "activeSet": { "1": { "activeTimestamp": 1507174723514 }, "2": { "activeTimestamp": 1507174724681 } }, "completeOrActiveSet": { "0": { "completeTimestamp": 1507174722825 }, "1": { "activeTimestamp": 1507174723514 }, "2": { "activeTimestamp": 1507174724681, "completeTimestamp": 1507174724097 } } };
export default function taskReducer(state = initialData, action = {}) {
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
			const completeSet = { ...state.completeSet, [id]: { completeTimestamp: Date.now() } };
			const activeSet = state.activeSet;
			return {
				...state,
				completeSet,
				completeOrActiveSet: mergeTwoSet(activeSet, completeSet)
			};
		}
		case "MARK_TASK_ACTIVE": {
			const { id } = action.meta;
			const activeSet = { ...state.activeSet, [id]: { activeTimestamp: Date.now() } };
			const completeSet = state.completeSet;
			return {
				...state,
				activeSet,
				completeOrActiveSet: mergeTwoSet(activeSet, completeSet)
			};
		}
		case "UNMARK_TASK_COMPLETE": {
			const { id } = action.meta;
			const completeSet = omit(state.completeSet, id);
			const activeSet = state.activeSet;
			return {
				...state,
				completeSet,
				completeOrActiveSet: mergeTwoSet(activeSet, completeSet)
			};
		}
		case "UNMARK_TASK_ACTIVE": {
			const { id } = action.meta;
			const activeSet = omit(state.activeSet, id);
			const completeSet = state.completeSet;
			return {
				...state,
				activeSet,
				completeOrActiveSet: mergeTwoSet(activeSet, completeSet)
			};
		}
		default:
			return state;
	}
}
function mergeTwoSet(set1, set2) {
	const keys = { ...set1, ...set2 };
	let newSet = {};
	for (const key in keys) {
		newSet[key] = Object.assign({}, set1[key], set2[key]);
	}
	return newSet;
}