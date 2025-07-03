import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Link } from 'react-router-dom';

const VirtualizedItemList = ({ items, height = 600 }) => {
  const ITEM_HEIGHT = 70; // Height of each item including margin

  // Memoize the item renderer for better performance
  const ItemRenderer = useMemo(() => {
    return ({ index, style }) => {
      const item = items[index];
      
      if (!item) return null;
      
      return (
        <div style={style}>
          <div className="item">
            <Link to={'/items/' + item.id} className="item-link">
              <span className="item-name">{item.name}</span>
              <span className="item-category">({item.category})</span>
              <span className="item-price">${item.price.toLocaleString()}</span>
            </Link>
          </div>
        </div>
      );
    };
  }, [items]);

  // Calculate optimal height based on number of items
  const listHeight = useMemo(() => {
    const maxHeight = Math.min(height, items.length * ITEM_HEIGHT);
    return Math.max(maxHeight, 200); // Minimum height of 200px
  }, [height, items.length]);

  if (items.length === 0) {
    return (
      <div className="virtualized-container" style={{ height: 200 }}>
        <div className="no-items">No items to display</div>
      </div>
    );
  }

  return (
    <div className="virtualized-container">
      <List
        height={listHeight}
        itemCount={items.length}
        itemSize={ITEM_HEIGHT}
        width="100%"
        className="virtualized-list"
        overscanCount={5} // Render 5 extra items for smoother scrolling
      >
        {ItemRenderer}
      </List>
    </div>
  );
};

export default VirtualizedItemList; 