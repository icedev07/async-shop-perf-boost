import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async (active = true, params = {}) => {
    if (!active) return;
    
    setLoading(true);
    try {
      const { page = 1, pageSize = 10, search = '' } = params;
      const queryParams = new URLSearchParams();
      
      if (page) queryParams.append('page', page);
      if (pageSize) queryParams.append('pageSize', pageSize);
      if (search) queryParams.append('q', search);
      
      const url = `http://localhost:3001/api/items?${queryParams.toString()}`;
      const res = await fetch(url);
      const json = await res.json();
      
      if (active) {
        setItems(json.items || json); // Handle both new and legacy response formats
        setPagination(json.pagination || null);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  }, []);

  return (
    <DataContext.Provider value={{ 
      items, 
      pagination, 
      loading, 
      fetchItems 
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);