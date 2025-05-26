import React, { useState } from 'react';

export default function Sidebar({ onCreateFolder, folders, setSelectedFolder, selectedFolder, onEditFolder, onDeleteFolder }) {
  const [folderName, setFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const user_id = localStorage.getItem("user_id");
  const API_URL = process.env.REACT_APP_API_URL || 'https://project3-2025a-giulia-vitoria.onrender.com';

  const handleFolderClick = (id) => {
    setSelectedFolder(id === selectedFolder ? null : id);
  };

  const handleCreateFolder = async () => {
    if (!folderName) {
      alert("Nome da pasta é obrigatório!");
      return;
    }

    setIsCreatingFolder(true);

    const payload = {
      name: folderName,
      user_id: parseInt(user_id),
    };

    try {
      const res = await fetch(`${API_URL}/folders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao criar pasta");

      const data = await res.json();

      const newFolder = {
        id: data.id,
        name: folderName
      };

      onCreateFolder(newFolder);
      setFolderName("");  // Limpa o input
    } catch (error) {
      console.error('Erro ao criar pasta:', error);
      alert(error.message);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const [showMenus, setShowMenus] = useState({});
  const closeMenu = (id) => {
    setShowMenus(prev => ({ ...prev, [id]: false }));
  };

  const [hoveredFolderId, setHoveredFolderId] = useState(null);
  const [hoveredMenuItem, setHoveredMenuItem] = useState({ folderId: null, item: null });

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
          disabled={isCreatingFolder}
        />
        <button
          onClick={handleCreateFolder}
          style={{ ...styles.button, backgroundColor: "#2c3e50" }}
          disabled={isCreatingFolder}
        >
          {isCreatingFolder ? 'Criando...' : 'Criar'}
        </button>
      </div>

      <ul style={styles.list}>
        {folders.length === 0 && <li style={{ color: '#999' }}>Nenhuma pasta</li>}

        {folders.map(folder => (
          <li
            key={folder.id}
            onClick={() => handleFolderClick(folder.id)}
            onMouseEnter={() => setHoveredFolderId(folder.id)}
            onMouseLeave={() => setHoveredFolderId(null)}
            style={{
              ...styles.item,
              backgroundColor:
                selectedFolder === folder.id
                  ? '#dfe6e9'
                  : hoveredFolderId === folder.id
                  ? '#b2bec3'
                  : 'transparent',
              padding: '5px',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              transition: 'background-color 0.3s ease'
            }}
          >
            <span style={styles.link}>{folder.name}</span>
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenus({ ...showMenus, [folder.id]: !showMenus[folder.id] });
                }}
                style={styles.iconButton}
              >
                &#8942;
              </button>

              {showMenus[folder.id] && (
                <div style={styles.menu}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newName = prompt('Novo nome da pasta:', folder.name);
                      if (newName) onEditFolder(folder.id, newName);
                      closeMenu(folder.id);
                    }}
                    onMouseEnter={() => setHoveredMenuItem({ folderId: folder.id, item: 'editar' })}
                    onMouseLeave={() => setHoveredMenuItem({ folderId: null, item: null })}
                    style={{
                      ...styles.menuItem,
                      backgroundColor:
                        hoveredMenuItem.folderId === folder.id && hoveredMenuItem.item === 'editar' ? '#dfe6e9' : 'transparent',
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Tem certeza que deseja excluir esta pasta?')) {
                        onDeleteFolder(folder.id);
                      }
                      closeMenu(folder.id);
                    }}
                    onMouseEnter={() => setHoveredMenuItem({ folderId: folder.id, item: 'excluir' })}
                    onMouseLeave={() => setHoveredMenuItem({ folderId: null, item: null })}
                    style={{
                      ...styles.menuItem,
                      backgroundColor:
                        hoveredMenuItem.folderId === folder.id && hoveredMenuItem.item === 'excluir' ? '#dfe6e9' : 'transparent',
                    }}
                  >
                    Excluir
                  </button>
                </div>
              )}
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
  },
  menu: {
    position: 'absolute',
    right: '0',
    top: '25px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 10
  },
  menuItem: {
    display: 'block',
    padding: '8px 12px',
    width: '100%',
    border: 'none',
    background: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    color: '#2c3e50'
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px'
  }
};
