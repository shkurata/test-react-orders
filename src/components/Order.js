import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Redirect} from 'react-router-dom'
import AddItem from './AddItem'
import ProductList from './ProductList'

class Order extends Component {
  constructor(props) {
    super(props)
    this.state = {
      "id": this.props.id,
      "customer-id": this.props['customer-id'] || null,
      "items": this.props.items || [],
      "total": this.props.total || 0,
      "products": this.props.products,
      "clients": this.props.clients,
      "clicked": false
    }
    this.addItemToOrder = this.addItemToOrder.bind(this)
    this.removeItem = this.removeItem.bind(this)
    this.addOrder = this.addOrder.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    if (!this.state.items || (nextProps.items && nextProps.items.length > this.state.items.length)) {
      this.setState({
        "id": nextProps.id,
        "customer-id": nextProps['customer-id'],
        "items": nextProps.items,
        "total": nextProps.total,
        "products": nextProps.products,
        "clients": nextProps.clients
      })
    }
  }
  addItemToOrder(index, qnty) {
    var product = this.state.products[index];
    this.setState({
      items: this.state.items.concat([
        {
          "product-id": product.id,
          "quantity": qnty,
          "unit-price": product.price,
          "total": qnty * product.price
        }
      ]),
      "total": (+ this.state.total + + qnty * product.price).toFixed(2)
    })
  }
  addOrder() {
    if (this.state["customer-id"] && this.state.items[0]) {
      const order = {
        "id": this.state.id,
        "customer-id": this.state['customer-id'],
        "items": this.state.items,
        "total": this.state.total
      }
      this.props.addOrder(order)
      this.setState({clicked: true})
    }
  }
  removeItem(index) {
    this.setState({
      total: (this.state.total - this.state.items[index].total).toFixed(2),
      items: this.state.items.slice(0, index).concat(this.state.items.slice(index + 1))
    })
  }
  render() {
    // console.log('order: ', this.props, this.state);
    const products = this.state.products
    const clients = this.state.clients
    if (!products.length || !clients.length)
      return null;

    // console.log('from order', products, clients, this.state, this.props);
    return (
      <div>
        <p>Order #{this.props.id}</p>
        {this.props.newOrder
          ? (
            <div>
              <label>Customer:
              </label>
              <select defaultValue="0" onChange={(e) => {
                this.setState({"customer-id": e.target.value})
              }}>
                <option disabled value="0">--Select customer--</option>
                {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
              </select><br/><br/>
            </div>
          )
          : (
            <p>Customer: {clients.find(customer => customer.id === this.props['customer-id']).name}</p>
          )
        }

        <AddItem addItemToOrder={this.addItemToOrder} products={this.state.products}/>
        <ProductList items={this.state.items}
                     total={this.state.total}
                     products={this.state.products}
                     removeItem={this.removeItem}/>
        <input type="button" value="Save order" onClick={this.addOrder}/>
        <input type="button" value="Delete order"
               onClick={() => this.props.delOrder(this.state.id)}/>
        {this.state.clicked && <Redirect to="/"/>}
      </div>
    )
  }
}

Order.PropTypes = {
  addOrder: PropTypes.func.isRequired,
  delOrder: PropTypes.func.isRequired,
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      "id": PropTypes.number.isRequired,
      "name": PropTypes.string.isRequired,
      "since": PropTypes.string.isRequired,
      "revenue": PropTypes.number.isRequired
    }).isRequired
  ).isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      "id": PropTypes.number.isRequired,
      "description": PropTypes.string.isRequired,
      "category": PropTypes.number.isRequired,
      "price": PropTypes.number.isRequired
    }).isRequired
  ).isRequired,
  id: PropTypes.string,
  newOrder: PropTypes.bool
}

export default Order
