import React, { Component } from 'react';
import {Table,Button} from "reactstrap";
import {Link} from "react-router-dom"
class Todolist extends Component {
    render() {
        const {todo, doneOrActive}=this.props;
        return (
            <div>
                <Table striped>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Content</th>
                        <th className='container1'>Action</th> 
                    </tr>
                    </thead>
                    <tbody>
                        {
                            todo.map((item,ind) =>{
                                let doneOrUndone;
                                if(doneOrActive){
                                    doneOrUndone = <Button onClick={() => this.props.unDone(item.id)} color="secondary" className='mr-2'>Undone</Button>
                                }
                                else{
                                    doneOrUndone = <Button onClick={() => this.props.done(item.id)} color="secondary" className='mr-2'>Done</Button>
                                }
                                return (           
                                    <tr key={item.id}>
                                        <th scope="row">{ind + 1}</th>
                                            <td>{item.title}</td>
                                        <td className='container'>
                                            <Link to={`/edit/${item.id}`}>
                                            <Button color="primary" className='mr-2'>Edit</Button>
                                            </Link>
                                            {doneOrUndone}
                                            <Button onClick={() => this.props.remove(item.id)} color="danger">Delete</Button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </div>
        )
    }
}
export default Todolist;