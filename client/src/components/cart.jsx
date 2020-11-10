import React, { Component } from 'react';
import _ from 'lodash';
import './css/cart.css';
import {getCart,deleteItem,deleteItems} from '../services/cartService';
import Select from '../components/common/select';
import { toast,ToastContainer } from 'react-toastify';

class Cart extends Component {
    state={
        items:[],
        sum:0,
        size:['L','XL','S','XXL','XS']
    }

    componentDidMount = async () =>{
        const itms = await getCart();
        const data = itms.data;
        this.setState({items:data});
        let sum=0;

        data.map(s=>(
            sum=sum+s.price
        ))
        this.setState({sum});
    }

    handleDelete = async (item) =>{
        
        const originalItems = this.state.items;

        const items = this.state.items.filter(m => m._id !== item._id);
        this.setState({ items });
    
        try{
          await deleteItem(item._id);
          this.setState({sum:this.state.sum-item.price});
        }
        catch(ex){
          if(ex.response && ex.response.status===404) 
            toast.error('item already deleted');
    
            this.setState({items:originalItems});
        }
     }

     handlePay = async () => {

        const originalItems = this.state.items;
        this.setState({items:[]});
        
        try{
            await deleteItems();
            toast.success(`Successfully paid ₹ ${this.state.sum}`);
            this.setState({sum:0});
            window.location='/';

        }
        catch(ex){
            if(ex.response && ex.response.status===400) 
                toast.error('Invalid User');

            this.setState({items:originalItems});
        }
     }
    

    render(){

        const {user} = this.props;
        const {items,sum} = this.state;
            return (
                <div className="container-fluid xx">
                    <br />
                    <br />
                    <br />
                    <br />
                    <h1 className="sheading">Shopping Cart</h1>
                    <table className="table container">
                        <thead>
                            <tr className="trow">
                                <th className="tdata" scope="col">#</th>
                                <th className="tdata" scope="col">Item</th>
                                <th className="tdata" scope="col">Size</th>
                                <th className="tdata" scope="col">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            {user && items.map(item => (
                                <tr
                                    className="trow"
                                    key={Math.random()}                                
                                >
                                    <td className="tdata">{_.indexOf(items,item) + 1}</td>
                                    <td className="tdata">{item.title}</td>
                                    <td className="tdata">L</td>
                                    <td className="tdata">₹ {item.price}</td>
                                    <td className="remove clickable" onClick={() => this.handleDelete(item)}>
                                        Remove
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <br />
                    <h4 className="cart-value">Total Cart Value: ₹ {sum}</h4>
                    <div className="pay-button">
                        {sum!==0 && <button className="btn btn-primary" onClick={this.handlePay}>Pay Now</button>}
                    </div>
                    <br />
                    <br />
                    <br />
                    <ToastContainer />
                    
                </div>
            );
    }
}


export default Cart;