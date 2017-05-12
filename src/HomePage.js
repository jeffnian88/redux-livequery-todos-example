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
				// equal SQL => select * from task
				console.log("got latest composedState", composedState);
				// you can do whatever you want here
				// ex: filter, reduce, map

				this.setState({ composedState });
			}, 0);
		}
		if (!this.unsub2) {
			let selector0 = (state) => state.task.isComplete;
			let selector1 = (state) => state.task.taskList;
			this.unsub2 = rxQueryBasedOnObjectKeys([selector0, selector1], ['isComplete', 'task'], (completeTaskList) => {
				// equal SQL =>
				// select * from isComplete LEFT JOIN taskList on isComplete.child_key == taskList.child_key
				console.log("got latest completeTaskList", completeTaskList);
				// you can do whatever you want here
				// ex: filter, reduce, map

				this.setState({ completeTaskList });
			}, 0);
		}
		if (!this.unsub3) {
			let selector0 = (state) => state.task.isComplete;
			let selector1 = (state) => state.task.isActive;
			let selector2 = (state) => state.task.taskList;
			this.unsub3 = rxQueryInnerJoin([selector0, selector1, selector2], ['isComplete', 'isActive', 'task'], (completeAndActiveTaskList) => {
				// equal SQL =>
				// select * from isComplete INNER JOIN isActive on isComplete.child_key == isActive.child_key
				//                          INNER JOIN taskList on isActive.child_key == taskList.child_key
				console.log("got latest completeAndActiveTaskList", completeAndActiveTaskList);
				// you can do whatever you want here
				// ex: filter, reduce, map

				this.setState({ completeAndActiveTaskList });
			}, 0);
		}
		if (!this.unsub4) {
			let selector0 = (state) => state.task.isComplete;
			let selector1 = (state) => state.task.isActive;
			this.unsub4 = rxQueryOuterJoin([selector0, selector1], ['isComplete', 'isActive'], (completeOrActive) => {
				// equal SQL =>
				// select * from isComplete OUTER JOIN isActive on isComplete.child_key == isActive.child_key
				console.log("got latest completeOrActive", completeOrActive);
				// you can do whatever you want here
				// ex: filter, reduce, map
				let isCompleteOrActive = {};
				completeOrActive.forEach((each) => {
					let { key, isComplete, isActive } = each;
					isCompleteOrActive[key] = Object.assign({}, isComplete, isActive);
				});

				// set data into redux state, not local state
				this.props.onCompleteOrActiveSet(isCompleteOrActive);
			}, 0);
		}
		if (!this.unsub5) {
			let selector0 = (state) => state.task.isCompleteOrActive;
			let selector1 = (state) => state.task.taskList;
			this.unsub5 = rxQueryInnerJoin([selector0, selector1], ['isCompleteOrActive', 'task'], (completeOrActiveTaskList) => {
				// equal SQL =>
				// select * from isCompleteOrActive INNER JOIN taskList on isCompleteOrActive.child_key == taskList.child_key
				console.log("got latest completeOrActiveTaskList", completeOrActiveTaskList);
				// you can do whatever you want here
				// ex: filter, reduce, map

				this.setState({ completeOrActiveTaskList });
			}, 0);
		}
		if (!this.unsub6) {
			let selector0 = (state) => state.task.isCompleteNotActive;
			let selector1 = (state) => state.task.taskList;
			this.unsub6 = rxQueryInnerJoin([selector0, selector1], ['isCompleteNotActive', 'task'], (completeNotActiveTaskList) => {
				// equal SQL =>
				// select * from isCompleteOrActive INNER JOIN taskList on isCompleteOrActive.child_key == taskList.child_key
				console.log("got latest completeNotActiveTaskList", completeNotActiveTaskList);
				// you can do whatever you want here
				// ex: filter, reduce, map

				this.setState({ completeNotActiveTaskList });
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
		this.unsubscribeForFilter = rxQuerySimple([(state) => state.task.taskList], ['taskList'], (val) => {
			console.log("got latest val", val);
			let { taskList } = val;
			// you can do whatever you want here
			// ex: filter, reduce, map
			let filteredTaskList = taskList.filter((each) => {
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
					(key:{key}) {task.content} -
					Created: {moment(task.created).format('H:mm:ss')}
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
					Edit:<input type="text" value={task.content} onChange={(e) => this.props.onUpdateTask({ id: key, content: e.target.value })} />
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
				<hr />

				<p className="App-intro">
					Your Complete Task List
				</p>
				<TaskList taskList={this.state.completeTaskList}
					onUnMarkCompleteTask={this.props.onUnMarkCompleteTask}
					onUnMarkActiveTask={this.props.onUnMarkActiveTask} />
				<hr />

				<p className="App-intro">
					Your Complete and Active Task List
				</p>
				<TaskList taskList={this.state.completeAndActiveTaskList}
					onUnMarkCompleteTask={this.props.onUnMarkCompleteTask}
					onUnMarkActiveTask={this.props.onUnMarkActiveTask} />
				<hr />

				<p className="App-intro">
					Your Complete or Active Task List
				</p>
				<TaskList taskList={this.state.completeOrActiveTaskList}
					onUnMarkCompleteTask={this.props.onUnMarkCompleteTask}
					onUnMarkActiveTask={this.props.onUnMarkActiveTask} />
				<hr />

				<p className="App-intro">
					Your Complete Not Active Task List
				</p>
				<TaskList taskList={this.state.completeNotActiveTaskList}
					onUnMarkCompleteTask={this.props.onUnMarkCompleteTask}
					onUnMarkActiveTask={this.props.onUnMarkActiveTask} />
				<hr />




				<p className="App-intro">
					Please enter filter keyword
					<br />
					<input type="text" onChange={this.handleFilteredKeyWordChange.bind(this)} />
				</p>

				<p className="App-intro">
					All Filtered Task List
        </p>
				<ul>
					{(this.state.filteredTaskList || []).map((each, key) => {
						let task = each;
						return (
							<li key={key}>
								{task.content}
							</li>
						);
					})}
				</ul>
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
		onCompleteOrActiveSet: (isCompleteOrActive) => {
			dispatch({ type: "SET_COMPLETE_OR_ACTIVE", payload: { isCompleteOrActive } });
		},

	};
}
// Only bind action to react component
export default connect(null, mapDispatchToProps)(HomePage);

const TaskList = ({ taskList = [], onUnMarkCompleteTask, onUnMarkActiveTask }) => {
	let taskListOut = taskList.map((each) => {
		let { isComplete, isActive, task, key } = each;
		let { isCompleteOrActive, isCompleteNotActive } = each;
		let { completed } = isComplete || isCompleteOrActive || isCompleteNotActive || {};
		let { active } = isActive || isCompleteOrActive || {};

		let completedBtn = "", activeBtn = "";
		if (completed) {
			completedBtn = <button type="button" onClick={() => onUnMarkCompleteTask(key)}>UNCOMPLETE</button>;
		}
		if (active) {
			activeBtn = <button type="button" onClick={() => onUnMarkActiveTask(key)}>INACTIVE</button>;
		}
		return (
			<li key={key}>
				(key:{key}) {task.content} -
				{completed ? ` Complete Time: ${moment(completed).format('H:mm:ss')}` : ""}
				{active ? ` Active Time: ${moment(active).format('H:mm:ss')}` : ""}
				{completedBtn}{activeBtn}
			</li >

		);
	});

	return (
		<ul>
			{taskListOut}
		</ul>
	);
}