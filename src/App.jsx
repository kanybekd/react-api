import React, { Component } from 'react'
import {Input, Button, Spinner} from "reactstrap"
import {BrowserRouter as Router, Switch,Route} from "react-router-dom"
import Edit from "./Edit.jsx"
import "./App.css"
import Todolist from './Todolist'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      newTodoValue: '',
      todo: [],
      activeTasks: [],
      doneTasks: [],
      doneOrActive: false,
      textHead: false,
      isLoading: false
    }
  }
  componentDidMount(){
    let {doneTasks, activeTasks} = this.state;
    const activeLocal = localStorage.getItem('activeTasks')
    const doneLocal = localStorage.getItem('doneTasks')
    if(activeLocal === null && doneLocal === null){
      setTimeout(() => {
      fetch('https://jsonplaceholder.typicode.com/todos')
      .then(res => res.json())
      .then(data => {
        data.forEach(item => {
          if(item.completed) doneTasks.push(item)
          else activeTasks.push(item)
        })
        this.setState({doneTasks, activeTasks, isLoading:true})
      })
      .catch(err => console.log("failed", err))
      }, 1000)
    } else {
      doneTasks = JSON.parse(localStorage.getItem('doneTasks'))
      activeTasks = JSON.parse(localStorage.getItem('activeTasks'))
      this.setState({doneTasks, activeTasks, isLoading:true})
    }
  }
  doneClicked = () => {
    let {doneTasks, activeTasks} = this.state;
    doneTasks = JSON.parse(localStorage.getItem('doneTasks'))
    activeTasks = JSON.parse(localStorage.getItem('activeTasks'))
    this.setState({doneTasks, activeTasks, doneOrActive: true})
  }

  activeClicked = () => {
    let {doneTasks, activeTasks} = this.state;
    doneTasks = JSON.parse(localStorage.getItem('doneTasks'))
    activeTasks = JSON.parse(localStorage.getItem('activeTasks'))
    this.setState({doneTasks, activeTasks, doneOrActive: false})
  }

  remove = (id) => {
    const {doneTasks,activeTasks} = this.state;
    const ind1 = doneTasks.findIndex(item => item.id === id)
    const ind2 = activeTasks.findIndex(item => item.id === id)
    if(ind1 > ind2){
      doneTasks.splice(ind1,1)
      this.setState({doneTasks})
    }
    else{
      activeTasks.splice(ind2,1)
      this.setState({activeTasks})
    }
    localStorage.setItem('activeTasks', JSON.stringify(activeTasks))
    localStorage.setItem('doneTasks', JSON.stringify(doneTasks))
  }

  done = (id) => {
    const {doneTasks, activeTasks} = this.state;
    activeTasks.forEach(item => {
      if(item.id === id) doneTasks.push(item)
    })
    const ind = activeTasks.findIndex(item => item.id === id)
    activeTasks.splice(ind,1)
    this.setState({doneTasks, activeTasks})
    localStorage.setItem('activeTasks', JSON.stringify(activeTasks))
    localStorage.setItem('doneTasks', JSON.stringify(doneTasks))
  }

  unDone = (id) => {
    const {doneTasks,activeTasks} = this.state;
    doneTasks.forEach(item => {
      if(item.id === id) activeTasks.push(item)
    })
    const ind = doneTasks.findIndex(item => item.id === id)
    doneTasks.splice(ind,1)
    this.setState({doneTasks, activeTasks})
    localStorage.setItem('activeTasks', JSON.stringify(activeTasks))
    localStorage.setItem('doneTasks', JSON.stringify(doneTasks))
  }

  saveOnEdit=(todo,id) => {
    const {doneTasks, activeTasks} = this.state;
    doneTasks.forEach(item => {
      if(item.id === id) item.title = todo
    })
    activeTasks.forEach(item => {
      if(item.id === id) item.title = todo
    })
    this.setState({doneTasks, activeTasks})
    localStorage.setItem('activeTasks', JSON.stringify(activeTasks))
    localStorage.setItem('doneTasks', JSON.stringify(doneTasks))
  }

  addNewTodo = () => {
    const {activeTasks, newTodoValue} = this.state;
    const existsOrNot = activeTasks.some(item => item.title === newTodoValue)
    const newArray = []
    activeTasks.forEach(item => newArray.push(item.id))
    if(newTodoValue !== '' && !existsOrNot){
      const newObj = {}
      newObj['id'] = Math.max(...newArray) + 1
      newObj['userId'] = 1
      newObj['title'] = newTodoValue
      newObj['completed'] = false
      activeTasks.push(newObj)
      this.setState({activeTasks, newTodoValue: '', textHead: false})
      localStorage.setItem('activeTasks', JSON.stringify(activeTasks))
    }

    if(existsOrNot){
      this.setState({textHead: true})
      setTimeout(() => {
        this.setState({textHead: false})
      }, 3000)
    }
}

  changeNewTodo = (e) => {
    this.setState({newTodoValue: e.target.value})
  }

  render() {

    const { activeTasks, doneTasks, textHead, doneOrActive, isLoading, newTodoValue} = this.state
    const ind = activeTasks.findIndex(item => item.title === newTodoValue);
    let clicked = doneOrActive ? doneTasks : activeTasks; 
    const textcontent = textHead && <div className ='message'><h4>"{newTodoValue}" Already exist. Check item # {ind+1}</h4></div>
    const loadContent = !isLoading ? <div className="spinner"><Spinner color="primary" /></div> : <Todolist todo={clicked} remove={this.remove} done={this.done} unDone={this.unDone} doneOrActive={doneOrActive}/>


    
   

    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <div className='App'>
              <div className='header'>
              {textcontent}
             
              <div className='input-and-add'>
              <Input onChange={this.changeNewTodo} value={this.state.newTodoValue} />
              <Button onClick={this.addNewTodo} color="primary">Add</Button>
              </div>


              </div>


              <div>
                <Button onClick={this.activeClicked} color="primary" className="my-2 mr-2">Active tasks {activeTasks.length}</Button>
                <Button onClick={this.doneClicked} color="secondary" className="my-2">Done {doneTasks.length}</Button>
              </div>
              {loadContent}
            </div>
          </Route>
          <Route path="/edit/:id">
            <Edit todo={clicked} saveOnEdit={this.saveOnEdit}/>
          </Route>
        </Switch>
      </Router>
    );
  }
}
