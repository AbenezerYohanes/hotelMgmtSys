import React from 'react';

const MyCopyright = () => {
  const year = new Date().getFullYear();
  return (
    <div style={{padding: '0.5rem', textAlign: 'center', color: '#6b7280'}}>
      <small>© {year} SNG Hotels. All rights reserved.</small>
    </div>
  );
};

export default MyCopyright;
