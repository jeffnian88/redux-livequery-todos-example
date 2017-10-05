import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './App.css';
import moment from 'moment';
//import { rxQueryLeftJoin, rxQueryInnerJoin, rxQuerySimple } from '../../redux-livequery';
import { rxQueryLeftJoin, rxQueryInnerJoin, rxQuerySimple } from 'redux-livequery';
class HomePage extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
		this.unsub = [];
	}
	componentDidMount() {
		const completeSelector = (state) => state.task.completeSet;
		const activeSelector = (state) => state.task.activeSet;
		const completeOrActiveSetSelector = (state) => state.task.completeOrActiveSet;
		const taskListSelector = (state) => state.task.taskList;

		const unsub1 = rxQueryLeftJoin([completeSelector, taskListSelector], ['completeSet', 'task'], (completeTaskList) => {
			// equal SQL =>
			// select * from completeSet LEFT JOIN taskList on completeSet.child_key == taskList.child_key
			console.log("got latest completeTaskList", completeTaskList);
			// you can do whatever you want here
			// ex: filter, reduce, map

			this.setState({ completeTaskList });
		}, 0);
		this.unsub.push(unsub1);

		const unsub2 = rxQueryInnerJoin([completeSelector, activeSelector, taskListSelector], ['completeSet', 'activeSet', 'task'], (completeAndActiveTaskList) => {
			// equal SQL =>
			// select * from completeSet INNER JOIN activeSet on completeSet.child_key == activeSet.child_key
			//                          INNER JOIN taskList on activeSet.child_key == taskList.child_key
			console.log("got latest completeAndActiveTaskList", completeAndActiveTaskList);
			// you can do whatever you want here
			// ex: filter, reduce, map

			this.setState({ completeAndActiveTaskList });
		}, 0);
		this.unsub.push(unsub2);

		const unsub3 = rxQueryInnerJoin([completeOrActiveSetSelector, taskListSelector], ['completeOrActiveSet', 'task'], (completeOrActiveTaskList) => {
			// equal SQL =>
			// select * from completeOrActiveSet INNER JOIN taskList on completeOrActiveSet.child_key == taskList.child_key
			console.log("got latest completeOrActiveTaskList", completeOrActiveTaskList);
			// you can do whatever you want here
			// ex: filter, reduce, map

			this.setState({ completeOrActiveTaskList });
		}, 0);
		this.unsub.push(unsub3);

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
		const { taskList, completeSet = {}, activeSet = {} } = this.props.taskRoot || {};
		const allTaskListOut = Object.keys(taskList || []).map((key) => {
			const task = taskList[key];
			return (
				<li key={key}>
					<big>{task.content}</big> - Created: {moment(task.created).format('H:mm:ss')}
					{
						(key in completeSet) ?
							<button type="button" onClick={() => this.props.onUnMarkCompleteTask(key)}>
								UNCOMPLETE
							</button>
							:
							<button type="button" onClick={() => this.props.onMarkCompleteTask(key)} >
								COMPLETE
							</button>
					}
					{
						(key in activeSet) ?
							<button type="button" onClick={() => this.props.onUnMarkActiveTask(key)}>
								UNACTIVE
							</button>
							:
							<button type="button" onClick={() => this.props.onMarkActiveTask(key)}>
								ACTIVE
							</button>
					}
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
				<ul>{allTaskListOut}</ul>
				<hr />

				<p className="App-intro">
					Complete and Active Task List
				</p>
				<TaskList
					taskList={this.state.completeAndActiveTaskList}
					onUnMarkCompleteTask={this.props.onUnMarkCompleteTask}
					onUnMarkActiveTask={this.props.onUnMarkActiveTask} />
				<hr />

				<p className="App-intro">
					Complete Task List
				</p>
				<TaskList
					taskList={this.state.completeTaskList}
					onUnMarkCompleteTask={this.props.onUnMarkCompleteTask}
					onUnMarkActiveTask={this.props.onUnMarkActiveTask} />
				<hr />

				<p className="App-intro">
					Complete or Active Task List
				</p>
				<TaskList
					taskList={this.state.completeOrActiveTaskList}
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

function mapStateToProps(state, ownProps) {
	return {
		taskRoot: state.task
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
			dispatch({ type: "MARK_TASK_COMPLETE", meta: { id } });
		},
		onUnMarkCompleteTask: (id) => {
			dispatch({ type: "UNMARK_TASK_COMPLETE", meta: { id } });
		},
		onMarkActiveTask: (id) => {
			dispatch({ type: "MARK_TASK_ACTIVE", meta: { id } });
		},
		onUnMarkActiveTask: (id) => {
			dispatch({ type: "UNMARK_TASK_ACTIVE", meta: { id } });
		},
	};
}
// Only bind action to react component
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

const TaskList = ({ taskList = [], onUnMarkCompleteTask, onUnMarkActiveTask }) => {
	const taskListOut = taskList.map((each) => {
		const { completeSet, activeSet, completeOrActiveSet, task, key } = each;
		const { completeTimestamp } = completeSet || completeOrActiveSet || {};
		const { activeTimestamp } = activeSet || completeOrActiveSet || {};

		let completedBtn = "", activeBtn = "";
		if (completeTimestamp) {
			completedBtn = <button type="button" onClick={() => onUnMarkCompleteTask(key)}>UNCOMPLETE</button>;
		}
		if (activeTimestamp) {
			activeBtn = <button type="button" onClick={() => onUnMarkActiveTask(key)}>INACTIVE</button>;
		}
		return (
			<li key={key}>
				<big>{task.content}</big> -
				{completeTimestamp ? ` Complete Time: ${moment(completeTimestamp).format('H:mm:ss')}` : ""}
				{completedBtn}
				{activeTimestamp ? ` Active Time: ${moment(activeTimestamp).format('H:mm:ss')}` : ""}
				{activeBtn}
			</li >
		);
	});

	return (
		<ul>
			{taskListOut}
		</ul>
	);
}