import React, { useState } from 'react';

export default function Sidebar({
  onCreateFolder = [],
  folders =[],
  setSelectedFolder = [],
  selectedFolder = [],
  onEditFolder = [],
  onDeleteFolder = [],
  savedLinks = [],
  onAddLinksToFolder = []
}) {
  const [folderName, setFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const user_id = localStorage.getItem("user_id");

  // Estados para edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFolderId, setEditFolderId] = useState(null);
  const [editFolderName, setEditFolderName] = useState('');

  // Estados para exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteFolderId, setDeleteFolderId] = useState(null);
  const [deleteFolderName, setDeleteFolderName] = useState('');

  // Estados para adicionar links
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [addLinkFolderId, setAddLinkFolderId] = useState(null);
  const [selectedLinks, setSelectedLinks] = useState([]);

  // Menus de opções nas pastas
  const [showMenus, setShowMenus] = useState({});

  // Hover para folder e itens do menu
  const [hoveredFolderId, setHoveredFolderId] = useState(null);
  const [hoveredMenuItem, setHoveredMenuItem] = useState({ folderId: null, item: null });

  const API_URL = process.env.REACT_APP_API_URL || 'https://project3-2025a-giulia-vitoria.onrender.com';

  // Abrir modal excluir
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

  // Abrir modal editar
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
      onEditFolder(editFolderId, editFolderName.trim());
      closeEditModal();
    }
  };

  // Abrir modal adicionar links
  const openAddLinkModal = (folder) => {
    setAddLinkFolderId(folder.id);
    setSelectedLinks([]);
    setIsAddLinkModalOpen(true);
  };

  const closeAddLinkModal = () => {
    setIsAddLinkModalOpen(false);
    setAddLinkFolderId(null);
    setSelectedLinks([]);
  };

  const toggleLinkSelection = (linkId) => {
    setSelectedLinks((prev) =>
      prev.includes(linkId) ? prev.filter((id) => id !== linkId) : [...prev, linkId]
    );
  };

  const handleAddSelectedLinks = () => {
    if (addLinkFolderId && selectedLinks.length > 0) {
      onAddLinksToFolder(addLinkFolderId, selectedLinks);
      closeAddLinkModal();
    }
  };

  // Toggle menu vertical (três pontos)
  const toggleMenu = (folderId) => {
    setShowMenus((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const closeMenu = (id) => {
    setShowMenus(prev => ({ ...prev, [id]: false }));
  };

  // Seleciona/deseleciona pasta
  const handleFolderClick = (id) => {
    setSelectedFolder(id === selectedFolder ? null : id);
  };

  // Criar pasta nova
  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      alert("Nome da pasta é obrigatório!");
      return;
    }

    setIsCreatingFolder(true);

    const payload = {
      name: folderName.trim(),
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
        name: folderName.trim(),
      };

      onCreateFolder(newFolder);
      setFolderName(""); // limpa o input
    } catch (error) {
      console.error('Erro ao criar pasta:', error);
      alert(error.message);
    } finally {
      setIsCreatingFolder(false);
    }
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

        {folders.map((folder) => (
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
                  toggleMenu(folder.id);
                }}
                style={styles.iconButton}
                aria-label="Abrir menu"
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
                      openAddLinkModal(folder);
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

      {/* Modal Editar Pasta */}
      {isEditModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Editar Pasta</h3>
            <input
              type="text"
              value={editFolderName}
              onChange={(e) => setEditFolderName(e.target.value)}
              style={styles.input}
              autoFocus
            />
            <div style={styles.modalButtons}>
              <button onClick={handleSaveEdit} style={styles.button}>
                Salvar
              </button>
              <button onClick={closeEditModal} style={styles.cancelButton}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Excluir Pasta */}
      {isDeleteModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Excluir Pasta</h3>
            <p>Tem certeza que deseja excluir a pasta <strong>{deleteFolderName}</strong>?</p>
            <div style={styles.modalButtons}>
              <button onClick={handleConfirmDelete} style={styles.button}>
                Excluir
              </button>
              <button onClick={closeDeleteModal} style={styles.cancelButton}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar Links */}
      {isAddLinkModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Adicionar Links à Pasta</h3>
            <div style={{ maxHeight: '200px', overflowY: 'auto', textAlign: 'left', marginBottom: '15px' }}>
              {savedLinks.length === 0 && <p>Nenhum link salvo disponível.</p>}
              {savedLinks.map((link) => (
                <label
                  key={link.id}
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedLinks.includes(link.id)}
                    onChange={() => toggleLinkSelection(link.id)}
                    style={{ marginRight: '8px' }}
                  />
                  {link.title || link.url}
                </label>
              ))}
            </div>
            <div style={styles.modalButtons}>
              <button
                onClick={handleAddSelectedLinks}
                disabled={selectedLinks.length === 0}
                style={{
                  ...styles.button,
                  backgroundColor: selectedLinks.length === 0 ? '#b2bec3' : '#2c3e50',
                  cursor: selectedLinks.length === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                Adicionar
              </button>
              <button onClick={closeAddLinkModal} style={styles.cancelButton}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

// Estilos simples para organizar visualmente
const styles = {
  sidebar: {
    width: '270px',
    padding: '15px',
    borderRight: '1px solid #ccc',
    height: '100vh',
    boxSizing: 'border-box',
    backgroundColor: '#f5f6fa',
    display: 'flex',
    flexDirection: 'column',
  },
  folderForm: {
    marginBottom: '15px',
    display: 'flex',
    gap: '8px',
  },
  input: {
    flex: 1,
    padding: '6px 8px',
    borderRadius: '4px',
    border: '1px solid #bbb',
    fontSize: '14px',
  },
  button: {
    padding: '6px 12px',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  cancelButton: {
    padding: '6px 12px',
    backgroundColor: '#d63031',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    marginLeft: '10px',
  },
  list: {
    listStyleType: 'none',
    paddingLeft: 0,
    margin: 0,
    flex: 1,
    overflowY: 'auto',
  },
  item: {
    cursor: 'pointer',
    userSelect: 'none',
  },
  link: {
    flex: 1,
    userSelect: 'none',
  },
  iconButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#555',
    padding: '0 4px',
  },
  menu: {
    position: 'absolute',
    right: '5px',
    top: '100%',
    backgroundColor: '#fff',
    boxShadow: '0 0 6px rgba(0,0,0,0.15)',
    borderRadius: '4px',
    zIndex: 1000,
    marginTop: '6px',
    minWidth: '120px',
  },
  menuItem: {
    display: 'block',
    padding: '8px 12px',
    backgroundColor: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    width: '350px',
    boxSizing: 'border-box',
    boxShadow: '0 0 15px rgba(0,0,0,0.25)',
    textAlign: 'center',
  },
  modalButtons: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'center',
  },
};
