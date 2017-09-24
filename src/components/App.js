import React, {Component} from 'react'
import Order from './Order'
import OrderList from './OrderList'
import {Switch, Route, BrowserRouter} from 'react-router-dom'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orders: [],
      products: [],
      clients: []
    }
    this.addOrderToOrderList = this.addOrderToOrderList.bind(this)
    this.removeOrderFromList = this.removeOrderFromList.bind(this)
    this.loadData = this.loadData.bind(this)
  }
  componentDidMount() {
    // console.log('app mounted');
    ['orders', 'products', 'clients'].forEach(this.loadData)
  }
  loadData(dataType) {
    fetch('http://localhost:1112/' + dataType).then(responce => responce.json()).then(json => {
      // console.log(json);
      this.setState({[dataType]: json})
    }).catch(error => {
      console.log(error)
    });
  }
  addOrderToOrderList(order) {
    var orderIndex = this.state.orders.findIndex(currOrder => currOrder.id === order.id)
    if (orderIndex > -1) {
      this.setState({
        orders: this.state.orders.slice(0, orderIndex).concat(order).concat(this.state.orders.slice(orderIndex + 1))
      })
    } else {
      this.setState({orders: this.state.orders.concat(order)})
    }
    // console.log(order);
  }
  removeOrderFromList(orderId) {
    let orderIndex = this.state.orders.findIndex(order => order.id === orderId)
    this.setState({
      orders: this.state.orders.slice(0, orderIndex).concat(this.state.orders.slice(orderIndex + 1))
    })
  }
  render() {
    if (!this.state.clients.length)
      return null
    console.log('app rendering', this.state.orders)
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' render={() => <OrderList orders={this.state.orders}/>}/>
          <Route path='/order/:order_id' render={({match}) => {
            const order = this.state.orders.find(order => order.id === match.params.order_id);
            return order
              ? <Order {...order} addOrder={this.addOrderToOrderList}
                                  clients={this.state.clients}
                                  delOrder={this.removeOrderFromList}
                                  products={this.state.products}/>
              : <OrderList orders={this.state.orders}/>
          }}/>
          <Route path='/newOrder'
                 render={() =>
                   <Order id={this.state.orders.length + 1 + ''}
                          clients={this.state.clients}
                          products={this.state.products}
                          delOrder={this.removeOrderFromList}
                          addOrder={this.addOrderToOrderList}
                          newOrder={true}
                    />
                  }
          />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App
