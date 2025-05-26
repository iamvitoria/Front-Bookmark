import React, { useState } from 'react';

export default function Sidebar({ favorites, onCreateFolder, folders, onSelectFolder }) {
  const [folderName, setFolderName] = useState('');

  const handleCreateFolder = () => {
    if (folderName.trim() === '') return;
    onCreateFolder(folderName);
    setFolderName('');
  };

  return (
    <aside style={styles.sidebar}>
      <h3>Favoritos</h3>

      <div style={styles.folderForm}>
        <input
          type="text"
          placeholder="Nova pasta"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleCreateFolder} style={styles.button}>
          Criar
        </button>
      </div>

      <h4>Pastas</h4>
      <ul style={styles.list}>
        {folders && folders.length > 0 ? (
          folders.map(folder => (
            <li 
              key={folder.id} 
              style={{ ...styles.item, cursor: 'pointer', color: '#2c3e50' }} 
              onClick={() => onSelectFolder(folder.id)}
            >
              {folder.name}
            </li>
          ))
        ) : (
          <li style={{ color: '#999' }}>Nenhuma pasta</li>
        )}
      </ul>

      <h4>Links salvos</h4>
      <ul style={styles.list}>
        {favorites.length === 0 && <li style={{ color: '#999' }}>Nenhum favorito</li>}
        {favorites.map(link => (
          <li key={link.id} style={styles.item}>
            <a href={link.url} target="_blank" rel="noreferrer">{link.title}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '220px',
    background: '#f4f6f8',
    padding: '20px',
    borderRight: '1px solid #ddd',
    height: 'calc(100vh - 60px)',
    overflowY: 'auto'
  },
  folderForm: {
    display: 'flex',
    marginBottom: '15px',
    gap: '5px'
  },
  input: {
    flex: 1,
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  button: {
    padding: '6px 10px',
    backgroundColor: '#2c3e50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  list: {
    listStyle: 'none',
    paddingLeft: 0,
    marginTop: '10px'
  },
  item: {
    marginBottom: '12px'
  }
};
