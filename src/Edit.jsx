import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import {Input,Button} from 'reactstrap'
class Edit extends Component {
    constructor(props) {
        super(props)
        const {todo} = props;
        const {id} = props.match.params;
        const singleTodo = todo.find(item => item.id === +id)
        this.state = {
            inputValue: singleTodo.title,
            id: singleTodo.id,
            singleTodo
        }
    }
    goBack = () => {
        this.props.history.push('/')
    }
    onChange = (e) => {
        this.setState({inputValue:e.target.value})
    }
    cancel = () => {
        const {singleTodo} = this.state
        this.setState({inputValue:singleTodo.title})
    }
    render() {
        const {inputValue, id}=this.state
        return (
            <div className='App'>
                <Button onClick={this.goBack} color="secondary" className='mb-3'>Go Back</Button>
                <div className='header'>
                    <Input autoFocus onChange={this.onChange}  value={inputValue}/>
                </div>
                <Button onClick={()=>{this.props.saveOnEdit(inputValue,id);this.props.history.push('/')}} color="primary" className='mr-2 mt-3'>Save</Button>
                {/* <Button onCLick={this.saved} color="primary" className='mr-2 mt-3'>Save</Button> */}
                <Button onClick={this.cancel} color="secondary" className="mt-3" >Cancel</Button>
            </div>
        )
    }
}
export default withRouter(Edit)