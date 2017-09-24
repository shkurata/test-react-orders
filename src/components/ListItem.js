import React from 'react'
import PropTypes from 'prop-types'

const ListItem = ({text, removeItem}) => (
<li>
  {text}
  <input type="button" value="Remove" onClick={removeItem}/>
</li>
)


ListItem.PropTypes = {
  text: PropTypes.string.isRequired,
  removeItem: PropTypes.func.isRequired
}

export default ListItem
