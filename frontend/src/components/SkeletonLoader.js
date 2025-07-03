import React from 'react';

const SkeletonItem = () => (
  <div className="skeleton-item">
    <div className="skeleton-content">
      <div className="skeleton-name"></div>
      <div className="skeleton-category"></div>
      <div className="skeleton-price"></div>
    </div>
  </div>
);

const SkeletonLoader = ({ count = 5 }) => {
  return (
    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </div>
  );
};

export default SkeletonLoader; 