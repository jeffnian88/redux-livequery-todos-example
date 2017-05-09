import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './App.css';
import moment from 'moment';
import { getComposedState, getCompleteTaskList, getFilteredTask } from './livequery/query';
class HomePage extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
		if (!this.unsub1) {
			this.unsub1 = getComposedState((composedState) => {
				console.log("getComposedState callback was invoked!");
				this.setState({ composedState });
			});
		}
		if (!this.unsub2) {
			this.unsub2 = getCompleteTaskList((completeTaskList) => {
				console.log("getFavoriteList callback was invoked!");
				this.setState({ completeTaskList });
			});
		}
	}
	handleFilteredKeyWordChange(e) {
		let keyword = e.target.value;
		// sanity-check parameter
		if (!keyword || keyword.length === 0) {
			let keyword = e.target.value;
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
		this.unsubscribeForFilter = getFilteredTask(keyword, (filteredTaskList) => {
			console.log("getFilteredTask callback was invoked!");
			this.setState({ filteredTaskList });
		});
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
		let { taskList, completeTaskSet } = task || {};
		let taskListOut = Object.keys(taskList || []).map((key) => {
			let task = taskList[key];
			return (
				<div key={key}>
					<h4>
						{task.content}
						<input type="text" value={task.content} onChange={(e) => this.props.onUpdateTask({ id: key, content: e.target.value })} />
						-
						Created: {moment(task.created).format()}
						<button type="button" onClick={() => this.props.onMarkCompleteTask(key)} disabled={key in completeTaskSet}>
							COMPLETE
							</button>
					</h4>
				</div >
			);
		});

		let { completeTaskList } = this.state;
		let completeTaskListOut = (completeTaskList || []).map((each) => {
			let { completeTaskSet, task, key } = each;
			return (
				<div key={key}>
					<h4>
						{task.content} -
						Spent Time: {moment.duration((completeTaskSet.completed - task.created) / 1000, 'secands').humanize()}
						<button type="button" onClick={() => this.props.onUnMarkCompleteTask(key)}>
							UNCOMPLETE
							</button>
					</h4>
				</div >
			);
		});

		let filteredTaskListOut = Object.keys(this.state.filteredTaskList || []).map((key) => {
			let task = this.state.filteredTaskList[key];
			return (
				<div key={key}>
					<h4>
						{task.content}
					</h4>
				</div >
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
				{taskListOut}
				<br />

				<p className="App-intro">
					Your Complete Task List
				</p>
				{completeTaskListOut}
				<br />

				<p className="App-intro">
					Please enter filter keyword
					<br />
					<input type="text" onChange={this.handleFilteredKeyWordChange.bind(this)} />
				</p>
				<p className="App-intro">
					All Filtered Task List
        </p>
				{filteredTaskListOut}
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
		}
	};
}
// Only bind action to react component
export default connect(null, mapDispatchToProps)(HomePage);
