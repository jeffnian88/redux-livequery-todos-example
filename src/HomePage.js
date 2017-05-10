import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './App.css';
import moment from 'moment';
//import { rxQueryBasedOnObjectKeys, rxQueryInnerJoin, rxQueryOuterJoin, rxQuerySimple } from '../../redux-livequery';
import { rxQueryBasedOnObjectKeys, rxQueryInnerJoin, rxQueryOuterJoin, rxQuerySimple } from 'redux-livequery';
class HomePage extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
		if (!this.unsub1) {
			let selector = (state) => state.task;
			this.unsub1 = rxQuerySimple([selector], ['task'], (composedState) => {
				// you can do whatever you want here
				// ex: filter, reduce, map
				console.log("got latest composedState");
				this.setState({ composedState });
			}, 0);
		}
		if (!this.unsub2) {
			let selector0 = (state) => state.task.isComplete;
			let selector1 = (state) => state.task.taskList;
			this.unsub2 = rxQueryBasedOnObjectKeys([selector0, selector1], ['isComplete', 'task'], (completeTaskList) => {
				console.log("got latest completeTaskList");
				this.setState({ completeTaskList });
			}, 0);
		}
		if (!this.unsub3) {
			let selector0 = (state) => state.task.isComplete;
			let selector1 = (state) => state.task.isActive;
			let selector2 = (state) => state.task.taskList;
			this.unsub3 = rxQueryInnerJoin([selector0, selector1, selector2], ['isComplete', 'isActive', 'task'], (completeActiveTaskList) => {
				console.log("got latest completeActiveTaskList");
				this.setState({ completeActiveTaskList });
			}, 0);
		}
		if (!this.unsub4) {
			let selector0 = (state) => state.task.isComplete;
			let selector1 = (state) => state.task.isActive;
			this.unsub4 = rxQueryOuterJoin([selector0, selector1], ['isComplete', 'isActive'], (completeOrActive) => {
				console.log("got latest completeOrActive", completeOrActive);
				let isActiveOrComplete = {};
				completeOrActive.forEach((each) => {
					let { key, isComplete, isActive } = each;
					isActiveOrComplete[key] = Object.assign({}, isComplete, isActive);
				});
				// set data into redux state, not local state
				this.props.onMergeActiveCompleteSet(isActiveOrComplete);
			}, 0);
		}
		if (!this.unsub5) {
			let selector0 = (state) => state.task.isActiveOrComplete;
			let selector1 = (state) => state.task.taskList;
			this.unsub5 = rxQueryInnerJoin([selector0, selector1], ['isActiveOrComplete', 'task'], (activeOrCompleteTaskList) => {
				console.log("got latest activeOrCompleteTaskList", activeOrCompleteTaskList);
				this.setState({ activeOrCompleteTaskList });
			}, 0);
		}
	}
	handleFilteredKeyWordChange(e) {
		let keyword = e.target.value;
		// sanity-check parameter
		if (!keyword || keyword.length === 0) {
			// if keyword is null or undefined, then clear it up
			if (this.state.filteredTaskList.length !== 0) {
				this.setState({ filteredTaskList: [] });
			}
			return;
		}

		// unsubscribe previous live query
		if (this.unsubscribeForFilter) {
			this.unsubscribeForFilter();
			delete this.unsubscribeForFilter;
		}

		// subscribe a new live query
		this.unsubscribeForFilter = rxQuerySimple([(state) => state.task.taskList], ['taskList'], (taskList) => {
			console.log("got latest taskList");
			// you can do whatever you want here
			// ex: filter, reduce, map
			let filteredTaskList = taskList.taskList.filter((each) => {
				return each.content.indexOf(keyword) > -1;
			});
			this.setState({ filteredTaskList });
		}, 0);
		//}, 500);//debounceTime
	}

	handleTaskTitleChange(e) {
		this.content = e.target.value;
	}
	handleADDPress() {
		let content = this.content;
		if (content && content.length !== 0) {
			this.props.onAddNewTask(content);
		}
	}
	render() {
		//console.log("[HomePage] render():", this);

		let { task } = this.state.composedState || {};
		let { taskList, isComplete, isActive } = task || {};
		let taskListOut = Object.keys(taskList || []).map((key) => {
			let task = taskList[key];
			return (
				<li key={key}>
					(key:{key}) {task.content}
						<input type="text" value={task.content} onChange={(e) => this.props.onUpdateTask({ id: key, content: e.target.value })} />
					- Created: {moment(task.created).format('H:mm:ss')}
					<button type="button" onClick={() => this.props.onMarkCompleteTask(key)} disabled={key in isComplete}>
						COMPLETE
							</button>
					<button type="button" onClick={() => this.props.onMarkActiveTask(key)} disabled={key in isActive}>
						ACTIVE
							</button>
					<button type="button" onClick={() => this.props.onUnMarkCompleteTask(key)} disabled={!(key in isComplete)}>
						UNCOMPLETE
							</button>
					<button type="button" onClick={() => this.props.onUnMarkActiveTask(key)} disabled={!(key in isActive)}>
						INACTIVE
							</button>
				</li >
			);
		});

		let { completeTaskList } = this.state;
		let completeTaskListOut = (completeTaskList || []).map((each) => {
			let { isComplete, task, key } = each;
			return (
				<li key={key}>
					(key:{key}) {task.content} - 
					Complete Time: {moment(isComplete.completed).format('H:mm:ss')},
					Spent Time: {moment.duration((isComplete.completed - task.created) / 1000, 'secands').humanize()}
					<button type="button" onClick={() => this.props.onUnMarkCompleteTask(key)}>
						UNCOMPLETE
							</button>
				</li >
			);
		});

		let { completeActiveTaskList } = this.state;
		let completeActiveTaskListOut = (completeActiveTaskList || []).map((each) => {
			let { isComplete, isActive, task, key } = each;
			return (
				<li key={key}>
					(key:{key}) {task.content} - 
					Complete Time: {moment(isComplete.completed).format('H:mm:ss')},
					Active Time: {moment(isActive.active).format('H:mm:ss')}
					<button type="button" onClick={() => this.props.onUnMarkCompleteTask(key)}>
						UNCOMPLETE
							</button>
					<button type="button" onClick={() => this.props.onUnMarkActiveTask(key)}>
						INACTIVE
							</button>
				</li >
			);
		});

		let { activeOrCompleteTaskList } = this.state;
		let activeOrCompleteTaskListOut = (activeOrCompleteTaskList || []).map((each) => {
			let { isActiveOrComplete, task, key } = each;
			return (
				<li key={key}>
					(key:{key}) {task.content} - 
					{isActiveOrComplete.completed ? ` Complete Time: ${moment(isActiveOrComplete.completed).format('H:mm:ss')},` : ""}
					{isActiveOrComplete.active ? ` Active Time: ${moment(isActiveOrComplete.active).format('H:mm:ss')}` : ""}
				</li >
			);
		});


		let filteredTaskListOut = Object.keys(this.state.filteredTaskList || []).map((key) => {
			let task = this.state.filteredTaskList[key];
			return (
				<li key={key}>
					{task.content}
				</li >
			);
		});

		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h2>Welcome to React</h2>
				</div>

				<p className="App-intro">
					Please enter a task
					<br />
					<input type="text" onChange={this.handleTaskTitleChange.bind(this)} />
					<button type="button" onClick={this.handleADDPress.bind(this)}>ADD</button>
				</p>

				<p className="App-intro">
					All Task List
        </p>
				<ul>{taskListOut}</ul>
				<br />

				<p className="App-intro">
					Your Complete Task List
				</p>
				<ul>{completeTaskListOut}</ul>
				<br />

				<p className="App-intro">
					Your Complete and Active Task List
				</p>
				<ul>{completeActiveTaskListOut}</ul>
				<br />

				<p className="App-intro">
					Your Complete or Active Task List
				</p>
				<ul>{activeOrCompleteTaskListOut}</ul>
				<br />


				<p className="App-intro">
					Please enter filter keyword
					<br />
					<input type="text" onChange={this.handleFilteredKeyWordChange.bind(this)} />
				</p>
				<p className="App-intro">
					All Filtered Task List
        </p>
				<ul>{filteredTaskListOut}</ul>
				<br />

			</div>
		);
	}
}
function mapDispatchToProps(dispatch, props) {
	return {
		onAddNewTask: (content) => {
			dispatch({ type: "ADD_NEW_TASK", payload: { content } });
		},
		onUpdateTask: ({ id, content }) => {
			dispatch({ type: "UPDATE_TASK", payload: { id, content } });
		},
		onMarkCompleteTask: (id) => {
			dispatch({ type: "MARK_COMPLETE_TASK", meta: { id } });
		},
		onUnMarkCompleteTask: (id) => {
			dispatch({ type: "UNMARK_COMPLETE_TASK", meta: { id } });
		},
		onMarkActiveTask: (id) => {
			dispatch({ type: "MARK_ACTIVE_TASK", meta: { id } });
		},
		onUnMarkActiveTask: (id) => {
			dispatch({ type: "UNMARK_ACTIVE_TASK", meta: { id } });
		},
		onMergeActiveCompleteSet: (isActiveOrComplete) => {
			dispatch({ type: "MERGE_ACTIVE_COMPLETE_SET", payload: { isActiveOrComplete } });
		},

	};
}
// Only bind action to react component
export default connect(null, mapDispatchToProps)(HomePage);
