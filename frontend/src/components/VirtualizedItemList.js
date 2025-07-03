import React from 'react';
import { FixedSizeList as List } from 'react-window';
import { Link } from 'react-router-dom';

const VirtualizedItemList = ({ items, height = 600 }) => {
  const ITEM_HEIGHT = 70; // Height of each item including margin

  const ItemRenderer = ({ index, style }) => {
    const item = items[index];
    
    return (
      <div style={style}>
        <div className="item">
          <Link to={'/items/' + item.id} className="item-link">
            <span className="item-name">{item.name}</span>
            <span className="item-category">({item.category})</span>
            <span className="item-price">${item.price}</span>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={ITEM_HEIGHT}
      width="100%"
      className="virtualized-list"
    >
      {ItemRenderer}
    </List>
  );
};

export default VirtualizedItemList; 