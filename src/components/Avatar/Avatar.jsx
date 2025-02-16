import React from 'react';
import './Avatar.css';

const Avatar = ({ name, imageUrl, size = 'md' }) => {
  if (imageUrl) {
    return (
      <img 
        src={imageUrl} 
        alt={`Foto de ${name}`} 
        className={`avatar avatar-${size}`}
      />
    );
  }

  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const colors = [
    '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e',
    '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
    '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12',
    '#d35400', '#c0392b', '#7f8c8d'
  ];
  
  // Gera uma cor consistente baseada no nome
  const colorIndex = name ? name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length : 0;
  const backgroundColor = colors[colorIndex];

  return (
    <div 
      className={`avatar avatar-${size} avatar-initial`}
      style={{ backgroundColor }}
    >
      {initial}
    </div>
  );
};

export default Avatar; 