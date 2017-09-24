import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const OrderList = ({orders}) => (
  <div>
    <h1>Orders</h1>
    <ul>
      {orders.map(order =>
        <li key={order.id}>
          <Link to={`/order/${order.id}`}>
            Order number {order.id} - total: {order.total}
          </Link>
        </li>
      )}
    </ul>
    <Link to={'/newOrder'}>
      <input type="button" value="Add order" />
    </Link>
  </div>
)

OrderList.PropTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      "id": PropTypes.number.isRequired,
      "customer-id": PropTypes.number.isRequired,
      "items": PropTypes.arrayOf(
        PropTypes.shape({
          "product-id": PropTypes.string.isRequired,
          "quantity": PropTypes.number.isRequired,
          "unit-price": PropTypes.number.isRequired,
          "total": PropTypes.number.isRequired
        }).isRequired
      ).isRequired,
      "total": PropTypes.number.isRequired
    })
  )
}

export default OrderList
