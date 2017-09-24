import React from 'react'
import PropTypes from 'prop-types'
import ListItem from './ListItem'

const ProductList = ({total, items, products, removeItem}) => (
  <div>
    <p>Total amount: ${total}</p>
    <p>{items.length ? 'Items list: ' : ''}</p>
    <ul>
      {items.map((item, index )=>
        <ListItem key={index}
                  text={
                    products.find(product =>
                      product.id === item['product-id']).description +
                      ' x ' + item.quantity + ' = $' + item.total
                  }
                  removeItem={() => removeItem(index)}
        />
      )}
    </ul>
  </div>
)

ProductList.PropTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      "product-id": PropTypes.string.isRequired,
      "quantity": PropTypes.number.isRequired,
      "unit-price": PropTypes.number.isRequired,
      "total": PropTypes.number.isRequired.isRequired,
    }).isRequired
  ).isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      "id": PropTypes.string.isRequired,
      "description": PropTypes.string.isRequired,
      "category": PropTypes.number.isRequired,
      "price": PropTypes.number.isRequired
    }).isRequired
  ).isRequired,
  total: PropTypes.number.isRequired,
  removeItem: PropTypes.func.isRequired
}

export default ProductList
