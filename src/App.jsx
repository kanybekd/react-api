import React, { Component } from 'react'
import {Input, Button, Spinner} from "reactstrap"
import {BrowserRouter as Router,Link,Switch,Route} from "react-router-dom"
import Edit from "./Edit.jsx"

import "./App.css"
import Todolist from './Todolist'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      newTodoValue:'',
       todo:[],
       activeTasks:[],
       doneTasks:[],
       doneOrActive: false,
       textHead:false,
       isLoading:false
    }
  }
  componentDidMount(){
    const {doneTasks,activeTasks}=this.state
    const newDone=[...doneTasks]
    const newActive=[...activeTasks]
    setTimeout(()=>{
    fetch('https://jsonplaceholder.typicode.com/todos')
    .then(res => res.json())
    .then(data =>{
    data.forEach(item=>{
      if(item.completed){
        newDone.push(item) 
      }
      else{
        newActive.push(item)
        
      }
    })
    this.setState({doneTasks: newDone,activeTasks: newActive,isLoading:true})
    
    })
    .catch(err=>console.log("failed",err))
    },3000)
  }
  doneClicked=()=>{
    this.setState({doneOrActive: true})
  }
  activeClicked=()=>{
    this.setState({doneOrActive: false})
  }
  remove=(id)=>{
    const {doneTasks,activeTasks} = this.state;
    const newDone = [...doneTasks]
    const newActive = [...activeTasks]
    const ind1=newDone.findIndex(item=>item.id===id)
    const ind2=newActive.findIndex(item=>item.id===id)
    console.log(ind1,ind2)
    if(ind1>ind2){
      newDone.splice(ind1,1)
      this.setState({doneTasks:newDone})
    }
    else{
      newActive.splice(ind2,1)
      this.setState({activeTasks:newActive})
    }
  }
  done =(id) => {
    const {doneTasks,activeTasks} = this.state;
    const newDone = [...doneTasks]
    const newActive = [...activeTasks]
    const ind=newActive.findIndex(item=>{
      if(item.id===id){
          newDone.push(item)
          return true
      }
    })
    newActive.splice(ind,1)
    this.setState({doneTasks:newDone,activeTasks:newActive})
  }
  unDone =(id) => {
    const {doneTasks,activeTasks} = this.state;
    const newDone = [...doneTasks]
    const newActive = [...activeTasks]
    const ind=newDone.findIndex(item=>{
      if(item.id===id){
        newActive.push(item)
          return true
      }
    })
    newDone.splice(ind,1)
    this.setState({doneTasks:newDone,activeTasks:newActive})
    
  }
  saveOnEdit=(todo,id)=>{
    console.log(todo,id)
    const {doneTasks,activeTasks} = this.state;
    const newDone = [...doneTasks]
    const newActive = [...activeTasks]
    newDone.forEach(item=>{
      if(item.id===id){
        item.title=todo
      }})
    newActive.forEach(item=>{
      if(item.id===id){
        item.title=todo
      }})

      this.setState({doneTasks:newDone,activeTasks:newActive})


    }
    addNewTodo=()=>{
      const {activeTasks,newTodoValue} = this.state;
      const newActive=[...activeTasks]
      
      const existsOrNot=newActive.some(item=>item.title===newTodoValue)
      // console.log("maxxxxxx",Math.max(...newArray)+1)
      if(newTodoValue!=='' && !existsOrNot){
        const newObj= {}
        const newArray=[]
        newActive.forEach(item=>{
          newArray.push(item.id)
        })
        newObj['id']=Math.max(...newArray)+1
        newObj['userId']=1
        newObj['title']= newTodoValue
        newObj['completed']= false
        newActive.push(newObj)
        this.setState({activeTasks:newActive,newTodoValue:'',textHead:false})
      }
      // this.setState({})
      if(existsOrNot){
        this.setState({textHead:true})
      }
    
     
    }

    changeNewTodo=(e)=>{

      this.setState({newTodoValue:e.target.value})
      
    }
  render() {
    // console.log(this.state.newTodoValue)
    const {todo,activeTasks,doneTasks,textHead,doneOrActive, isLoading} = this.state
    let clicked= doneOrActive ? doneTasks : activeTasks; 
    
    const textcontent = textHead && <div className='message'><h2>Todo Already exist</h2></div>
    
    const loadContent = !isLoading ? <Spinner color="primary" />:<Todolist todo={clicked} remove={this.remove} done={this.done} unDone={this.unDone} doneOrActive={doneOrActive}/>
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <div className='App'>
              <div className='header'>
              
              {textcontent}
              <Input onChange={this.changeNewTodo} value={this.state.newTodoValue} />
              <Button onClick={this.addNewTodo} color="primary">Add</Button>
              </div>

              <div>
                <Button onClick={this.activeClicked} color="primary" className="my-2 mr-2">Active tasks {activeTasks.length}</Button>
                <Button onClick={this.doneClicked} color="secondary" className="my-2">Done {doneTasks.length}</Button>
              </div>

              {loadContent}
            </div>
          </Route>
          <Route path="/edit/:id">
            {/* <div>hellooooo</div> */}
            <Edit todo={clicked} saveOnEdit={this.saveOnEdit}/>
          </Route>
        </Switch>
  
      </Router>
    )

  }
}


