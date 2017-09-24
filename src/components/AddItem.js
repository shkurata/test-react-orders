import React from 'react'

const AddItem = (props) => {
let selected, quantity;
return (
  <div>
    Add Item: <select ref={ sel => {selected = sel}}>
      {props.products.map((product, index) =>
        <option key={product.id} value={index}>{product.description} - ${product.price}</option>
      )}
    </select>
    <input type="number" min="1" defaultValue="1" ref={ qnty => {quantity = qnty}}/>
    
    <input type="button" onClick={() => {props.addItemToOrder(selected.value, quantity.value)}} value="Add item"/>
  </div>
)}

export default AddItem;
