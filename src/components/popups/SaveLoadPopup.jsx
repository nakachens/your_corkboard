import React, { useState } from 'react';
import SavedProjectItem from '../ui/SavedProjectItem';

function SaveLoadPopup({ onClose, onSave, onLoad, onSaveChanges, savedProjects, currentHasUnsavedChanges, currentProjectName }) {
  const [projectName, setProjectName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const hasLoadedProject = currentProjectName && currentProjectName !== 'My Corkboard';

  const handleDeleteProject = (projectName, e) => {
    e.stopPropagation();
    const projects = JSON.parse(localStorage.getItem('corkboardProjects') || '{}');
    delete projects[projectName];
    localStorage.setItem('corkboardProjects', JSON.stringify(projects));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'url(/corkboard/buttons/PANEL_LONG.png) no-repeat center center',
          backgroundSize: '100% 100%',
          border: 'none',
          padding: '25px',
          paddingBottom: '60px',
          paddingLeft: '25',
          width: '400px',
          maxHeight: '90%',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ marginLeft: '50px',paddingLeft:'30px', margin: 0, fontFamily: 'monospace', color: '#3E2B27' }}> Save/Load</h3>
          <button
          onClick={onClose}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          style={{
            background: 'url(/corkboard/buttons/X.png) no-repeat center center',
            backgroundSize: 'contain',
            color: 'transparent',
            border: 'none',
            padding: '0',
            width: '60px',
            height: '40px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            transform: 'scale(1)',
            transition: 'transform 0.2s'
            }}
            >
        </button>
        </div>

        {/* UNSAVED WARNING */}
        {currentHasUnsavedChanges && (
          <div style={{
            background: '#fcf5df',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            padding: '8px',
            marginBottom: '10px',
            marginLeft:'-15px',
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#856404'
          }}>
            ⚠️ You have unsaved changes!
          </div>
        )}

        {/* saving section */}
        <div style={{ marginBottom: '10px' }}>
          {hasLoadedProject && currentHasUnsavedChanges && (
            <button
              onClick={() => {
                onSaveChanges(currentProjectName);
              }}
              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
              style={{
                width: '100%',
                background: 'url(/corkboard/buttons/BIG_BTN.png) no-repeat center center',
                backgroundSize: '100% 100%',
                color: '#A96833',
                border: 'none',
                padding: '12px',
                height: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                fontFamily: 'monospace',
                marginBottom: '8px',
                transition: 'filter 0.2s'
              }}
            >
              Save Changes to "{currentProjectName}"
            </button>
          )}

          {!showSaveInput ? (
            <button
              onClick={() => setShowSaveInput(true)}
              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
              style={{
                width: '100%',
                background: 'url(/corkboard/buttons/BIG_BTN.png) no-repeat center center',
                backgroundSize: '100% 100%',
                 color: '#6c3407',
                border: 'none',
                padding: '12px',
                height: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                fontFamily: 'monospace',
                transition: 'filter 0.2s'
              }}
            >
              Save As New Project
            </button>
          ) : (
            <div>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name..."
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '8px',
                  border: '2px solid #8B7355',
                  borderRadius: '5px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    if (projectName.trim()) {
                      onSave(projectName.trim());
                      setProjectName('');
                      setShowSaveInput(false);
                    }
                  }}
                  style={{
                    flex: 1,
                    background: 'url(/corkboard/buttons/SAVEFIRST2_BTN.png) no-repeat center center',
                    backgroundSize: 'contain',
                    color: 'transparent',
                    border: 'none',
                    padding: '0',
                    marginLeft: '50px',
                    height: '35px',
                    cursor: 'pointer',
                    fontFamily: 'monospace'
                  }}
                >
                </button>
                <button
                  onClick={() => {
                    setShowSaveInput(false);
                    setProjectName('');
                  }}
                  style={{
                    flex: 1,
                    background: 'url(/corkboard/buttons/CANCEL2_BTN.png) no-repeat center center',
                    backgroundSize: 'contain',
                    color: 'transparent',
                    border: 'none',
                    padding: '0',
                    marginRight: '50px',
                    height: '37px',
                    cursor: 'pointer',
                    fontFamily: 'monospace'
                  }}
                >
                </button>
              </div>
            </div>
          )}
        </div>

        {/* load section*/}
        <div>
          <h4 style={{ fontFamily: 'monospace', color: '#3E2B27', margin: '0 0 8px 0', paddingTop:'8px', paddingBottom:'8px' }}>
            Saved Projects:
          </h4>
     
          {/* SCROLLABLE CONTAINER */}
          <div 
            style={{ 
              maxHeight: '150px',
              overflowY: 'auto',
              overflowX: 'hidden',
              paddingRight: '5px',
              scrollbarWidth: 'thin',
              scrollbarColor: '#D4A574 #F5E6D3',
            }}
            className="custom-scrollbar"
          >
            {savedProjects.length === 0 ? (
              <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#666', textAlign: 'center' }}>
                No saved projects yet
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {savedProjects.map((project, index) => (
                  <SavedProjectItem
                    key={index}
                    project={project}
                    onLoad={onLoad}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaveLoadPopup;