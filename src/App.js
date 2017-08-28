import React, { Component } from 'react';
import { Switch, Route, BrowserRouter, Link } from 'react-router-dom';

import './App.css';

import order1 from './data/order1.json'
import order2 from './data/order2.json'
import order3 from './data/order3.json'
import customers from './data/customers.json';
import products from './data/products.json';

class App extends Component {
  constructor(){
    super();
    this.state = {
      orders: []
    };
    this.removeProductFromOrder = this.removeProductFromOrder.bind(this);
  }

  getOrders() {
    this.setState({
      orders: [order1, order2, order3]
    })
  }

  removeProductFromOrder(orderID, itemIndex) {
    var newOrders = this.state.orders;
    var index = newOrders.findIndex(order => order.id === orderID);
    newOrders[index].total -= newOrders[index].items[itemIndex].total;
    newOrders[index].items.splice(itemIndex, 1);
    this.setState({
      orders: newOrders
    });
  }

  componentDidMount() {
    this.getOrders();
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' render={() => <OrderList orders={this.state.orders}/>}/>
          <Route path='/order/:order_id' render={({match}) =>
            <Order order={this.state.orders.find(order => order.id === match.params.order_id)} remove={this.removeProductFromOrder}/>
          }/>
        </Switch>
      </BrowserRouter>
    )
  }
}


class OrderList extends Component {
  render() {
    return (<ul>
    {this.props.orders.map(order =>
      <li key={order.id}>
        <Link to={`/order/${order.id}`}>
          Order number {order.num} - total: {order.total}
        </Link>
      </li>
    )}
    </ul>)
  }
}
class Order extends Component {
  render() {
    const order = this.props.order;
    var total = 1;
    return (
      <div>
        <h1>Order #{order.id}</h1>
        <p>Customer: <b>{findCustomer(order['customer-id']).name}</b></p>
        Products: <ul>
          {order.items.map((item, index) => <li key={index}>
            {findProduct(item['product-id']).description} - {item.quantity} pcs. x €{item['unit-price']} = €{item.total} total
            <input type="button" value="Remove" onClick={() => this.props.remove(order.id, index)}/>
            </li>)}
        </ul>
        <p>Total amount: €{order.total}</p>
        Add item: <select ref={(itemPrice) => {total *= itemPrice;} }>
          {products.map(product => <option>{product.description}, price: {product.price}</option>)}
        </select> quantity: <input type='number' ref={(qnty) => {total *= qnty;}} min='1' value='1'/>
        <input type='text' disabled name='total' value={total}/>
      </div>
    );
  }
}


const findCustomer = (customer_id) => customers.find(customer => customer.id === customer_id);

const findProduct = (product_id) => products.find(product => product.id === product_id);


export default App;
