import React, { useState } from 'react';

export default function Sidebar({ onCreateFolder, folders, setSelectedFolder, selectedFolder, onEditFolder, onDeleteFolder }) {
  const [folderName, setFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const user_id = localStorage.getItem("user_id");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFolderId, setEditFolderId] = useState(null);
  const [editFolderName, setEditFolderName] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteFolderId, setDeleteFolderId] = useState(null);
  const [deleteFolderName, setDeleteFolderName] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'https://project3-2025a-giulia-vitoria.onrender.com';

  const openDeleteModal = (folder) => {
    setDeleteFolderId(folder.id);
    setDeleteFolderName(folder.name);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteFolderId(null);
    setDeleteFolderName('');
  };

  const handleConfirmDelete = () => {
    if (deleteFolderId) {
      onDeleteFolder(deleteFolderId);
      closeDeleteModal();
    }
  };
  
  const openEditModal = (folder) => {
    setEditFolderId(folder.id);
    setEditFolderName(folder.name);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditFolderId(null);
    setEditFolderName('');
  };

  const handleSaveEdit = () => {
    if (editFolderName.trim() !== '') {
      onEditFolder(editFolderId, editFolderName);
      closeEditModal();
    }
  };
  
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
                      openEditModal(folder);
                      closeMenu(folder.id);
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
                      openDeleteModal(folder);
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

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Aqui você decide o que fazer ao adicionar link
                      // Pode ser um modal, redirecionamento ou só um console.log
                      alert(`Adicionar link à pasta: ${folder.name}`);
                      closeMenu(folder.id);
                    }}
                    onMouseEnter={() => setHoveredMenuItem({ folderId: folder.id, item: 'adicionar' })}
                    onMouseLeave={() => setHoveredMenuItem({ folderId: null, item: null })}
                    style={{
                      ...styles.menuItem,
                      backgroundColor:
                        hoveredMenuItem.folderId === folder.id && hoveredMenuItem.item === 'adicionar' ? '#dfe6e9' : 'transparent',
                    }}
                  >
                    Adicionar Link
                </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      {isEditModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Editar Pasta</h3>
            <input
              type="text"
              value={editFolderName}
              onChange={(e) => setEditFolderName(e.target.value)}
              style={styles.input}
            />
            <div style={styles.modalButtons}>
              <button onClick={handleSaveEdit} style={styles.button}>Salvar</button>
              <button onClick={closeEditModal} style={styles.cancelButton}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Excluir Pasta</h3>
            <p><strong>{deleteFolderName}</strong></p>
            <div style={styles.modalButtons}>
              <button onClick={handleConfirmDelete} style={styles.button}>Excluir</button>
              <button onClick={closeDeleteModal} style={styles.cancelButton}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
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
  },
  modalOverlay: {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
},
modalContent: {
  background: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  width: '300px',
  textAlign: 'center'
},
cancelButton: {
  padding: '6px 10px',
  backgroundColor: '#ccc',
  color: '#000',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
},
modalButtons: {
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center', 
  gap: '10px'
}
};
