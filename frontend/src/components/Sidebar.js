import React, { useState } from 'react';

export default function Sidebar({ favorites, onCreateFolder, folders, setSelectedFolder, selectedFolder, onEditFolder, onDeleteFolder }) {
  const [folderName, setFolderName] = useState('');

  const handleFolderClick = (id) => {
    setSelectedFolder(id === selectedFolder ? null : id);
  }

  const handleCreateFolder = () => {
    if (folderName.trim() === '') return;
    onCreateFolder(folderName);
    setFolderName('');
  };

  return (
    <aside style={styles.sidebar}>
      <h3>Pastas</h3>

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

      <ul style={styles.list}>
        <li
          style={{ ...styles.item, fontWeight: 'bold' }}
          onClick={() => setSelectedFolder(null)}
        >
        </li>

        {folders.length === 0 && <li style={{ color: '#999' }}>Nenhuma pasta</li>}
        {folders.map(folder => (
          <li
            key={folder.id}
            style={{
              ...styles.item,
              backgroundColor: selectedFolder === folder.id ? '#dfe6e9' : 'transparent',
              padding: '5px',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onClick={() => handleFolderClick(folder.id)}
          >
            <span style={styles.link}>{folder.name}</span>
            <div>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  const newName = prompt('Novo nome da pasta:', folder.name);
                  if (newName) onEditFolder(folder.id, newName);
                }} 
                style={styles.iconButton}
              >
                ✏️
              </button>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (window.confirm('Tem certeza que deseja excluir esta pasta?')) {
                    onDeleteFolder(folder.id);
                  }
                }} 
                style={styles.iconButton}
              >
                🗑️
              </button>
            </div>
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
    paddingLeft: 0
  },
  item: {
    marginBottom: '12px',
    cursor: 'pointer'
  },
  link: {
    textDecoration: 'none',
    color: '#2c3e50'
  }
};
