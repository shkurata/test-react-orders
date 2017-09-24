import React, { Component } from 'react';
import { Switch, Route, BrowserRouter, Link } from 'react-router-dom';
import $ from 'jquery';
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
    this.addItemToOrder = this.addItemToOrder.bind(this);
  }

  getOrders() {
    this.setState({
      orders: [order1, order2, order3]// loading data from the files
    })
  }

  sendOrdersToNet() {
    $.ajax({
      url: '',
      method: 'post',
      dataType: 'json',
      data: this.state.orders
    }).done(function(msg) {
      console.log(msg);
    });
  }

  getDataFromNet() {
    var url = '';
    fetch(url)
      .then(response => response.json())
      .then(json => {
        console.log(json);
        //use the data
      })
      .catch(error => {
        console.log(error);
      });
  }

  addItemToOrder(orderID, itemInx, quantity) {
    var newOrders = this.state.orders;
    var index = newOrders.findIndex(order => order.id === orderID);
    var item = products[itemInx];
    var order = newOrders[index];
    var oldSameItemIndex = order.items.findIndex(oldItem => oldItem['product-id'] === item.id);
    if (oldSameItemIndex === -1) {
      var newItem = {
        'product-id': item.id,
        'quantity': quantity,
        'unit-price': item.price,
        'total': (item.price * quantity).toFixed(2)
      };
      order.items.push(newItem);
      order.total = parseFloat(order.total, 10) + parseFloat(newItem.total, 10);
    } else {
      order.items[oldSameItemIndex].quantity = +order.items[oldSameItemIndex].quantity + +quantity;
      order.items[oldSameItemIndex].total = (+order.items[oldSameItemIndex].total + +item.price * quantity).toFixed(2);
      order.total = (+order.total + +item.price * quantity).toFixed(2);
    }
    this.setState({
      orders: newOrders
    });
  }

  removeProductFromOrder(orderID, itemIndex) {
    var newOrders = this.state.orders;
    var index = newOrders.findIndex(order => order.id === orderID);
    newOrders[index].total = parseFloat(newOrders[index].total, 10) - parseFloat(newOrders[index].items[itemIndex].total, 10);
    newOrders[index].items.splice(itemIndex, 1);
    this.setState({
      orders: newOrders
    });
  }

  sendOrderList(order) {
    console.log('Order ' + order.id + ' is sent!');
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
            <Order order={this.state.orders.find(order => order.id === match.params.order_id)}
                  remove={this.removeProductFromOrder}
                  addItem={this.addItemToOrder}
                  sendOrder={this.sendOrderList}/>
          }/>
        </Switch>
      </BrowserRouter>
    )
  }
}


class OrderList extends Component {
  render() {
    return (
      <div>
        <h1>Orders</h1>
        <ul>
          {this.props.orders.map(order =>
            <li key={order.id}>
              <Link to={`/order/${order.id}`}>
                Order number {order.id} - total: {order.total}
              </Link>
            </li>
          )}
        </ul>
      </div>
    )
  }
}
class Order extends Component {
  constructor() {
    super();
    this.showNewTotal = this.showNewTotal.bind(this);
  }
  showNewTotal(e) {
    e.preventDefault();
    this.total.value = (products[this.itemInx.value].price * this.qnty.value).toFixed(2);
  }
  render() {
    const order = this.props.order;
    if (!order) return null;
    return (
      <div>
        <h1>Order #{order.id}</h1>
        <p>Customer: <b>{findCustomer(order['customer-id']).name}</b></p>
        Products:
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit-price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) =>
              <tr key={index}>
                <td>{findProduct(item['product-id']).description}</td>
                <td>{item.quantity}</td>
                <td>€{item['unit-price']}</td>
                <td>€{item.total}</td>
                <td><button onClick={() => this.props.remove(order.id, index)}>Remove</button></td>
              </tr>)}
          </tbody>
        </table>
        <p>Total amount: €{order.total}</p>
        <hr/>
        Add item:
        <select ref={(itemInx) => {this.itemInx = itemInx;}}
                onChange={this.showNewTotal}
                defaultValue={products.length}>
          <option disabled value={products.length}>&lt;---choose an item---&gt;</option>
          {products.map((product, index) =>
            <option key={product.id} value={index}>
              {product.description}, price: {product.price}
            </option>)}
        </select><br/>
        Quantity: <input type='number' style={inputStyle} ref={(qnty) => {this.qnty = qnty;}} onChange={this.showNewTotal} min='1' defaultValue="1"/><br/>
        Price: €<input type='number' style={inputStyle} disabled ref={(total) => {this.total = total;}} defaultValue="0"/> total <br/><br/>
        <input type='button'  onClick={() => this.props.addItem(order.id, this.itemInx.value, this.qnty.value)} value='Add product to this order'/>
        <hr/>
        <button onClick={() => this.props.sendOrder(order)}>Place order</button>
      </div>
    );
  }
}

const inputStyle = {
  width: '100px'
};

const findCustomer = (customer_id) => customers.find(customer => customer.id === customer_id);

const findProduct = (product_id) => products.find(product => product.id === product_id);


export default App;
