/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

// popups
import ConfirmationPopup from './popups/ConfirmationPopup';
import SuccessPopup from './popups/SuccessPopup';
import NewProjectPopup from './popups/NewProjectPopup';
import SaveLoadPopup from './popups/SaveLoadPopup';
import SettingsPopup from './popups/SettingsPopup';
import DeleteConfirmation from './popups/DeleteConfirmation';
import ExportSuccessPopup from './popups/ExportSuccessPopup';
import StickerGalleryPopup from './popups/StickerGalleryPopup';
import GalleryPopup from './popups/GalleryPopup';

// UI
import InteractiveItem from './ui/InteractiveItem';
import ContextMenu from './ui/ContextMenu';
import SavedProjectItem from './ui/SavedProjectItem';

// main corkboard app
function CorkboardApp({ isFullscreen = true }) {
  const [stickyNotes, setStickyNotes] = useState([]);
  const [polaroids, setPolaroids] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [showStickerGallery, setShowStickerGallery] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentProjectName, setCurrentProjectName] = useState('My Corkboard');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [exportedImageBlob, setExportedImageBlob] = useState(null);
  const [exportedImageFilename, setExportedImageFilename] = useState('');
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [showNewProjectPopup, setShowNewProjectPopup] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [showLoadConfirm, setShowLoadConfirm] = useState(false);
  const [loadProjectName, setLoadProjectName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteProjectName, setDeleteProjectName] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isWindowFullscreen, setIsWindowFullscreen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [savedProjectsCache, setSavedProjectsCache] = useState([]);
  
  const clickAudioRef = useRef(null);
  const paperAudioRef = useRef(null);
  const musicAudioRef = useRef(null);
  const fileInputRef = useRef(null);
  const corkboardRef = useRef(null);

  const shouldShowToolbar = isFullscreen;
  const shouldShowHamburger = !isFullscreen;
  
  // assets preloader kinda
  /* useEffect(() => {
    const ensureAssetsLoaded = () => {
      //polaroids
      const polaroidUrls = Array.from({ length: 9 }, (_, i) => `/corkboard/polaroids/${i + 1}.png`);
      polaroidUrls.forEach(url => {
        const img = new Image();
        img.src = url;
      });

      //stickers
      const stickerUrls = [
        '/corkboard/sticker1.png', '/corkboard/sticker2.png', '/corkboard/sticker3.png',
        '/corkboard/sticker4.png', '/corkboard/sticker5.png', '/corkboard/sticker6.png',
        '/corkboard/sticker8.png', '/corkboard/sticker9.png', '/corkboard/sticker10.png',
        '/corkboard/sticker11.png', '/corkboard/sticker12.png', '/corkboard/sticker13.png',
        '/corkboard/sticker14.png', '/corkboard/sticker15.png', '/corkboard/sticker16.png',
        '/corkboard/sticker17.png'
      ];
      stickerUrls.forEach(url => {
        const img = new Image();
        img.src = url;
      });

      //background and pin
      const bgImg = new Image();
      bgImg.src = '/corkboard/corkboard.jpg';
      const pinImg = new Image();
      pinImg.src = '/corkboard/boardpin.png';
    };

    ensureAssetsLoaded();
  }, []); */
  useEffect(() => {
    const handleStorageChange = () => {
      setSavedProjectsCache(getSavedProjects());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('projectsUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('projectsUpdated', handleStorageChange);
    };
  }, []);
  
  // loading
useEffect(() => {
  try {
    const savedState = localStorage.getItem('corkboardCurrentState');
    if (savedState) {
      const state = JSON.parse(savedState);
      
      setStickyNotes((state.stickyNotes || []).map(note => ({
        id: note.id,
        position: note.position || { x: 100, y: 100 },
        size: note.size ? note.size : { width: 150, height: 150 },
        rotation: note.rotation || 0,
        zIndex: note.zIndex || 10,
        isAtBack: note.isAtBack || false,
        content: note.content || '',
        color: note.color || '#FFD0EC'
      })));
      
      setPolaroids((state.polaroids || []).map(polaroid => ({
        id: polaroid.id,
        src: polaroid.src,
        position: polaroid.position || { x: 200, y: 200 },
        size: polaroid.size ? polaroid.size : { width: 150, height: 180 },
        rotation: polaroid.rotation || 0,
        zIndex: polaroid.zIndex || 10,
        isAtBack: polaroid.isAtBack || false
      })));
      
      setStickers((state.stickers || []).map(sticker => ({
        id: sticker.id,
        src: sticker.src,
        position: sticker.position || { x: 200, y: 200 },
        size: sticker.size ? sticker.size : { width: 100, height: 100 },
        rotation: sticker.rotation || 0,
        zIndex: sticker.zIndex || 10,
        isAtBack: sticker.isAtBack || false
      })));
      
      setCurrentProjectName(state.projectName || 'My Corkboard');
    }
    setIsLoaded(true);
    setSavedProjectsCache(getSavedProjects());
  } catch (error) {
    console.error('Error loading state:', error);
    setIsLoaded(true);
  }
}, []);

  // auto-save
  useEffect(() => {
  if (!isLoaded) return;
  
  const timeoutId = setTimeout(() => {
    try {
      const state = {
        stickyNotes,
        polaroids,
        stickers,
        projectName: currentProjectName,
        timestamp: Date.now()
      };
      localStorage.setItem('corkboardCurrentState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }, 500);

  return () => clearTimeout(timeoutId);
}, [stickyNotes, polaroids, stickers, currentProjectName, isLoaded]);

  // savin unsaved work
  useEffect(() => {
    if (isLoaded && (stickyNotes.length > 0 || polaroids.length > 0 || stickers.length > 0)) {
      setHasUnsavedChanges(true);
    }
  }, [stickyNotes, polaroids, stickers, isLoaded]);

  // initialize audio
useEffect(() => {
  clickAudioRef.current = new Audio('/corkboard/audio/click.mp3');
  paperAudioRef.current = new Audio('/corkboard/audio/paper.mp3');
  musicAudioRef.current = new Audio('/corkboard/audio/music.mp3');
  
  if (musicAudioRef.current) {
    musicAudioRef.current.loop = true;
    musicAudioRef.current.volume = volume;
    
    // autoplay
    if (isPlaying) {
      musicAudioRef.current.play().catch(e => console.log('Music autoplay failed:', e));
    }
  }
  
  return () => {
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
      musicAudioRef.current = null;
    }
  };
}, []); 

  // update volume
useEffect(() => {
  if (musicAudioRef.current) {
    musicAudioRef.current.volume = volume;
  }
  if (clickAudioRef.current) {
    clickAudioRef.current.volume = volume;
  }
  if (paperAudioRef.current) {
    paperAudioRef.current.volume = volume;
  }
}, [volume]);

  // handle music play/pause
useEffect(() => {
  if (musicAudioRef.current) {
    if (isPlaying) {
      musicAudioRef.current.play().catch(e => console.log('Music play failed:', e));
    } else {
      musicAudioRef.current.pause();
    }
  }

  return () => {
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
      musicAudioRef.current.currentTime = 0; 
    }
  };
}, [isPlaying]);

//cleanup
useEffect(() => {
  return () => {
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
      musicAudioRef.current.currentTime = 0;
      musicAudioRef.current = null;
    }
    if (clickAudioRef.current) {
      clickAudioRef.current = null;
    }
    if (paperAudioRef.current) {
      paperAudioRef.current = null;
    }
  };
}, []);

  const playSound = (type) => {
  try {
    if (type === 'click' && clickAudioRef.current) {
      const audio = clickAudioRef.current.cloneNode();
      audio.volume = volume; 
      audio.play().catch(e => console.log('Audio play failed:', e));
    } else if (type === 'paper' && paperAudioRef.current) {
      const audio = paperAudioRef.current.cloneNode();
      audio.volume = volume; 
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  } catch (error) {
    console.log('Audio play failed:', error);
  }
};

  const handleAddStickyNote = () => {
  playSound('paper');
  // position setup
  const allZIndexes = [
    ...stickyNotes.map(n => n.zIndex),
    ...polaroids.map(p => p.zIndex),
    ...stickers.map(s => s.zIndex)
  ];
  const maxZ = allZIndexes.length > 0 ? Math.max(...allZIndexes) : 10;
  
  const newNote = {
    id: Date.now(),
    position: { x: 100 + stickyNotes.length * 20, y: 150 + stickyNotes.length * 20 },
    size: { width: 150, height: 150 },
    rotation: Math.random() * 10 - 5,
    zIndex: maxZ + 1, 
    isAtBack: false,
    content: '',
    color: ['#FFD0EC', '#EBD2BE', '#DCC7AF', '#BAE1FF', '#FFFFBA'][stickyNotes.length % 5]
  };
  setStickyNotes([...stickyNotes, newNote]);
  setShowMobileMenu(false);
};

  const handleAddPolaroid = (src) => {
  playSound('click');
  const allZIndexes = [
    ...stickyNotes.map(n => n.zIndex),
    ...polaroids.map(p => p.zIndex),
    ...stickers.map(s => s.zIndex)
  ];
  const maxZ = allZIndexes.length > 0 ? Math.max(...allZIndexes) : 10;
  
  const newPolaroid = {
    id: Date.now(),
    src: src,
    position: { x: 200 + polaroids.length * 30, y: 200 + polaroids.length * 30 },
    size: { width: 150, height: 180 },
    rotation: Math.random() * 10 - 5,
    zIndex: maxZ + 1,
    isAtBack: false
  };
  setPolaroids([...polaroids, newPolaroid]);
  setShowGallery(false);
  setShowMobileMenu(false);
};
  const handleAddSticker = (src) => {
  playSound('click');
  // postions for stickers
  const allZIndexes = [
    ...stickyNotes.map(n => n.zIndex),
    ...polaroids.map(p => p.zIndex),
    ...stickers.map(s => s.zIndex)
  ];
  const maxZ = allZIndexes.length > 0 ? Math.max(...allZIndexes) : 10;
  
  const newSticker = {
    id: Date.now(),
    src: src,
    position: { x: 200 + stickers.length * 20, y: 200 + stickers.length * 20 },
    size: { width: 100, height: 100 },
    rotation: Math.random() * 10 - 5,
    zIndex: maxZ + 1, 
    isAtBack: false
  };
  setStickers([...stickers, newSticker]);
  setShowStickerGallery(false);
  setShowMobileMenu(false);
};

  const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const allZIndexes = [
        ...stickyNotes.map(n => n.zIndex),
        ...polaroids.map(p => p.zIndex),
        ...stickers.map(s => s.zIndex)
      ];
      const maxZ = allZIndexes.length > 0 ? Math.max(...allZIndexes) : 10;
      
      const newSticker = {
        id: Date.now(),
        src: event.target.result,
        position: { x: 200, y: 200 },
        size: { width: 100, height: 100 },
        rotation: 0,
        zIndex: maxZ + 1, 
        isAtBack: false
      };
      setStickers([...stickers, newSticker]);
      playSound('click');
    };
    reader.readAsDataURL(file);
  }
  setShowMobileMenu(false);
};

  const toggleMusic = () => {
  setIsPlaying(prev => !prev);
};

  // saved projects
  const getSavedProjects = () => {
    try {
      const projects = JSON.parse(localStorage.getItem('corkboardProjects') || '{}');
      return Object.values(projects).sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error getting projects:', error);
      return [];
    }
  };

 const handleSaveProject = (projectName) => {
  try {
    const projects = JSON.parse(localStorage.getItem('corkboardProjects') || '{}');
    
    projects[projectName] = {
      name: projectName,
      stickyNotes: stickyNotes.map(note => ({
        id: note.id,
        position: note.position,
        size: note.size,
        rotation: note.rotation,
        zIndex: note.zIndex,
        isAtBack: note.isAtBack,
        content: note.content,
        color: note.color
      })),
      polaroids: polaroids.map(polaroid => ({
        id: polaroid.id,
        src: polaroid.src,
        position: polaroid.position,
        size: polaroid.size,
        rotation: polaroid.rotation,
        zIndex: polaroid.zIndex,
        isAtBack: polaroid.isAtBack
      })),
      stickers: stickers.map(sticker => ({
        id: sticker.id,
        src: sticker.src,
        position: sticker.position,
        size: sticker.size,
        rotation: sticker.rotation,
        zIndex: sticker.zIndex,
        isAtBack: sticker.isAtBack
      })),
      timestamp: Date.now()
    };
    
    localStorage.setItem('corkboardProjects', JSON.stringify(projects));
    setCurrentProjectName(projectName);
    setHasUnsavedChanges(false);
    
    setSuccessMessage(`AND DONE ! "${projectName}" saved successfully~`);
    setShowSuccessMessage(true);
    
    setSavedProjectsCache(getSavedProjects());
    window.dispatchEvent(new Event('projectsUpdated'));
    
    playSound('click');
  } catch (error) {
    console.error('Error saving project:', error);
    setSuccessMessage('ettoo.. try again..? maybe..?');
    setShowSuccessMessage(true);
  }
};

  // loading project
  const handleLoadProject = (projectName) => {
    if (hasUnsavedChanges) {
      setLoadProjectName(projectName);
      setShowLoadConfirm(true);
      return;
    }
    
    loadProjectDirectly(projectName);
  };

  

  const handleNewProjectClick = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedWarning(true);
    } else {
      setShowNewProjectPopup(true);
    }
    setShowSaveLoad(false);
  };

  // new project creation
  const handleCreateNewProject = (projectName) => {
    setStickyNotes([]);
    setPolaroids([]);
    setStickers([]);
    setCurrentProjectName(projectName);
    setHasUnsavedChanges(false);
    setShowNewProjectPopup(false);
    setShowUnsavedWarning(false);
    
    setSuccessMessage(`new corkboard "${projectName}" created! ♡`);
    setShowSuccessMessage(true);
    
    playSound('click');
  };
  
  const loadProjectDirectly = (projectName) => {
  try {
    const projects = JSON.parse(localStorage.getItem('corkboardProjects') || '{}');
    const project = projects[projectName];
    if (project) {
      console.log("Loading project data:", project); 
      
      setStickyNotes((project.stickyNotes || []).map(note => ({
        id: note.id,
        position: note.position || { x: 100, y: 100 },
        size: note.size ? note.size : { width: 150, height: 150 },
        rotation: note.rotation || 0,
        zIndex: note.zIndex || 10,
        isAtBack: note.isAtBack || false,
        content: note.content || '',
        color: note.color || '#FFD0EC'
      })));
      
      setPolaroids((project.polaroids || []).map(polaroid => ({
        id: polaroid.id,
        src: polaroid.src,
        position: polaroid.position || { x: 200, y: 200 },
        size: polaroid.size ? polaroid.size : { width: 150, height: 180 },
        rotation: polaroid.rotation || 0,
        zIndex: polaroid.zIndex || 10,
        isAtBack: polaroid.isAtBack || false
      })));
      
      setStickers((project.stickers || []).map(sticker => ({
        id: sticker.id,
        src: sticker.src,
        position: sticker.position || { x: 200, y: 200 },
        size: sticker.size ? sticker.size : { width: 100, height: 100 },
        rotation: sticker.rotation || 0,
        zIndex: sticker.zIndex || 10,
        isAtBack: sticker.isAtBack || false
      })));
      
      setCurrentProjectName(project.name);
      setHasUnsavedChanges(false);
      
      setSuccessMessage(`"${projectName}" loaded! ♡`);
      setShowSuccessMessage(true);
      setShowSaveLoad(false);
      setShowLoadConfirm(false);
      
      playSound('click');
    }
  } catch (error) {
    console.error('Error loading project:', error);
    setSuccessMessage('oopsie! failed to load. try again? ♡');
    setShowSuccessMessage(true);
  }
};

  // delete project
  const handleDeleteProjectClick = (projectName) => {
    setDeleteProjectName(projectName);
    setShowDeleteConfirm(true);
  };

  const handleDeleteProjectConfirm = () => {
    try {
      const projects = JSON.parse(localStorage.getItem('corkboardProjects') || '{}');
      delete projects[deleteProjectName];
      localStorage.setItem('corkboardProjects', JSON.stringify(projects));
      
      setSavedProjectsCache(getSavedProjects());
      window.dispatchEvent(new Event('projectsUpdated'));
      
      setShowDeleteConfirm(false);
      setDeleteProjectName('');
      
      setSuccessMessage(`"${deleteProjectName}" deleted! ♡`);
      setShowSuccessMessage(true);
      
      playSound('click');
    } catch (error) {
      console.error('Error deleting project:', error);
      setSuccessMessage('oopsie! failed to delete. try again? ♡');
      setShowSuccessMessage(true);
    }
  };

  // exporting
  const handleExportClick = () => {
    setShowExportConfirm(true);
  };

  const handleExportConfirm = async () => {
  setShowExportConfirm(false);
  
  const toolbar = document.querySelector('.toolbar');
  const hamburger = document.querySelector('.hamburger-menu');
  
  try {
    if (!corkboardRef.current) {
      setSuccessMessage('NOT READY!!! TRY AGAIN BUD..');
      setShowSuccessMessage(true);
      return;
    }

    let html2canvas;
    
    if (window.html2canvas) {
      html2canvas = window.html2canvas;
    } else {
      try {
        const module = await import('html2canvas');
        html2canvas = module.default;
      } catch (e) {
        setSuccessMessage('export needs html2canvas library! ♡');
        setShowSuccessMessage(true);
        return;
      }
    }
    
    if (toolbar) {
      toolbar.style.visibility = 'hidden';
    }
    if (hamburger) {
      hamburger.style.visibility = 'hidden';
    }
    
    const interactiveItems = document.querySelectorAll('.interactive-item');
    interactiveItems.forEach(item => {
      item.style.outline = 'none';
    });

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = corkboardRef.current.offsetWidth + 'px';
    tempContainer.style.height = corkboardRef.current.offsetHeight + 'px';
    document.body.appendChild(tempContainer);

    const bgImg = document.createElement('img');
    bgImg.src = '/corkboard/corkboard.jpg';
    bgImg.style.position = 'absolute';
    bgImg.style.top = '0';
    bgImg.style.left = '0';
    bgImg.style.width = '100%';
    bgImg.style.height = '100%';
    bgImg.style.objectFit = 'cover';
    tempContainer.appendChild(bgImg);

    const clonedContent = corkboardRef.current.cloneNode(true);
    clonedContent.style.position = 'absolute';
    clonedContent.style.top = '0';
    clonedContent.style.left = '0';
    clonedContent.style.width = '100%';
    clonedContent.style.height = '100%';
    clonedContent.style.background = 'none'; 
    tempContainer.appendChild(clonedContent);

    await new Promise((resolve) => {
      if (bgImg.complete) {
        resolve();
      } else {
        bgImg.onload = resolve;
        bgImg.onerror = resolve;
      }
    });

    await new Promise(resolve => setTimeout(resolve, 300));

    const canvas = await html2canvas(tempContainer, {
      backgroundColor: '#8B7355',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: tempContainer.offsetWidth,
      height: tempContainer.offsetHeight,
      x: 0,
      y: 0,
      windowWidth: tempContainer.offsetWidth,
      windowHeight: tempContainer.offsetHeight
    });

    document.body.removeChild(tempContainer);

    if (toolbar) {
      toolbar.style.visibility = 'visible';
    }
    if (hamburger) {
      hamburger.style.visibility = 'visible';
    }

    canvas.toBlob(async (blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = `${currentProjectName.replace(/\s+/g, '_')}_${Date.now()}.png`;
        link.download = filename;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);

        setExportedImageBlob(blob);
        setExportedImageFilename(filename);
        
        setShowExportSuccess(true);
        playSound('click');
      } else {
        setSuccessMessage('oopsie! failed to create image. try again? ♡');
        setShowSuccessMessage(true);
      }
    }, 'image/png', 1.0);
    
  } catch (error) {
    console.error('Error exporting image:', error);
    
    if (toolbar) {
      toolbar.style.visibility = 'visible';
    }
    if (hamburger) {
      hamburger.style.visibility = 'visible';
    }
    
    setSuccessMessage('export failed..');
    setShowSuccessMessage(true);
  }
};

  const handleShareFromPopup = async () => {
    if (!exportedImageBlob || !exportedImageFilename) {
      setSuccessMessage('no image to share! try again?');
      setShowSuccessMessage(true);
      return;
    }

    if (navigator.share && navigator.canShare) {
      try {
        const file = new File([exportedImageBlob], exportedImageFilename, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: currentProjectName,
            text: 'check out my corkboard! 🎨 ♡'
          });
          setShowExportSuccess(false);
        } else {
          setSuccessMessage('ur device cant share files! but its downloaded ♡');
          setShowSuccessMessage(true);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.log('Share failed:', err);
          setSuccessMessage('share cancelled! but its downloaded ♡');
          setShowSuccessMessage(true);
        }
      }
    } else {
      setSuccessMessage('sharing not supported! but its downloaded ♡');
      setShowSuccessMessage(true);
    }
  };

  const updateStickyNote = (id, field, value) => {
  console.log(`Updating sticky note ${id} ${field} to:`, value);
  setStickyNotes(prev => prev.map(note =>
    note.id === id ? { ...note, [field]: value } : note
  ));
};


  const deleteStickyNote = (id) => {
    setStickyNotes(stickyNotes.filter(note => note.id !== id));
    playSound('paper');
  };

  const duplicateStickyNote = (id) => {
    const note = stickyNotes.find(n => n.id === id);
    if (note) {
      const newNote = {
        ...note,
        id: Date.now(),
        position: { x: note.position.x + 20, y: note.position.y + 20 },
        zIndex: Math.max(...stickyNotes.map(n => n.zIndex)) + 1
      };
      setStickyNotes([...stickyNotes, newNote]);
      playSound('paper');
    }
  };

  const updatePolaroid = (id, field, value) => {
  console.log(`Updating polaroid ${id} ${field} to:`, value); 
  setPolaroids(prev => prev.map(p =>
    p.id === id ? { ...p, [field]: value } : p
  ));
};

  const deletePolaroid = (id) => {
    setPolaroids(polaroids.filter(p => p.id !== id));
    playSound('click');
  };

  const duplicatePolaroid = (id) => {
    const polaroid = polaroids.find(p => p.id === id);
    if (polaroid) {
      const newPolaroid = {
        ...polaroid,
        id: Date.now(),
        position: { x: polaroid.position.x + 20, y: polaroid.position.y + 20 },
        zIndex: Math.max(...polaroids.map(p => p.zIndex)) + 1
      };
      setPolaroids([...polaroids, newPolaroid]);
      playSound('click');
    }
  };

  const updateSticker = (id, field, value) => {
  console.log(`Updating sticker ${id} ${field} to:`, value); 
  setStickers(prev => prev.map(s =>
    s.id === id ? { ...s, [field]: value } : s
  ));
};

  const deleteSticker = (id) => {
    setStickers(stickers.filter(s => s.id !== id));
    playSound('click');
  };

  const duplicateSticker = (id) => {
    const sticker = stickers.find(s => s.id === id);
    if (sticker) {
      const newSticker = {
        ...sticker,
        id: Date.now(),
        position: { x: sticker.position.x + 20, y: sticker.position.y + 20 },
        zIndex: Math.max(...stickers.map(s => s.zIndex)) + 1
      };
      setStickers([...stickers, newSticker]);
      playSound('click');
    }
  };

//z-Index changes
const handleZIndexChange = (id, type, direction) => {
  const allItems = [
    ...stickyNotes.map(n => ({ id: n.id, zIndex: n.zIndex, type: 'note' })),
    ...polaroids.map(p => ({ id: p.id, zIndex: p.zIndex, type: 'polaroid' })),
    ...stickers.map(s => ({ id: s.id, zIndex: s.zIndex, type: 'sticker' }))
  ];
  
  const maxZ = Math.max(...allItems.map(item => item.zIndex), 10);
  const minZ = Math.min(...allItems.map(item => item.zIndex), 10);
  
  if (type === 'note') {
    setStickyNotes(stickyNotes.map(note => {
      if (note.id === id) {
        if (direction === 'front') {
          return { ...note, zIndex: maxZ + 1, isAtBack: false };
        } else if (direction === 'back') {
          const newZ = Math.max(6, minZ - 1);
          return { ...note, zIndex: newZ, isAtBack: true };
        } else if (direction === 'veryfront') {
          return { ...note, zIndex: maxZ + 1, isAtBack: false };
        }
      }
      return note;
    }));
  } else if (type === 'polaroid') {
    setPolaroids(polaroids.map(p => {
      if (p.id === id) {
        if (direction === 'front') {
          return { ...p, zIndex: maxZ + 1, isAtBack: false };
        } else if (direction === 'back') {
          // Use minZ - 1 but ensure it stays above 6 (stars are at 5)
          const newZ = Math.max(6, minZ - 1);
          return { ...p, zIndex: newZ, isAtBack: true };
        } else if (direction === 'veryfront') {
          return { ...p, zIndex: maxZ + 1, isAtBack: false };
        }
      }
      return p;
    }));
  } else if (type === 'sticker') {
    setStickers(stickers.map(s => {
      if (s.id === id) {
        if (direction === 'front') {
          return { ...s, zIndex: maxZ + 1, isAtBack: false };
        } else if (direction === 'back') {
          // Use minZ - 1 but ensure it stays above 6 (stars are at 5)
          const newZ = Math.max(6, minZ - 1);
          return { ...s, zIndex: newZ, isAtBack: true };
        } else if (direction === 'veryfront') {
          return { ...s, zIndex: maxZ + 1, isAtBack: false };
        }
      }
      return s;
    }));
  }
};

  // garland colors
  const garlandColors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#118AB2', '#EF476F', '#06D6A0', '#FF9E6D'];

   return (
   <div style={{
    width: '100%',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: 'url(/corkboard/corkboard.jpg)',
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
    }}>
      <div ref={corkboardRef} style={{ width: '100%', height: '100%', position: 'relative',overflow: 'visible',}}>
        
        {/* HAMBURGER MENU */}
        {shouldShowHamburger && (
          <div className="hamburger-menu" style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 150
            }}>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              style={{
                background: 'url(/corkboard/buttons/HAMBURGER_BTN.png) no-repeat center center',
                backgroundSize: 'contain',
                color: 'transparent',
                border: 'none',
                padding: '6px 12px',
                width: '100px',
                height: '30px',
                cursor: 'pointer',
                fontFamily: 'monospace'
              }}
            >
            </button>
            
            {showMobileMenu && (
              <div style={{
                position: 'absolute',
                top: '50px',
                left: '0',
                background: 'linear-gradient(to bottom, #BAA48B, #A96833)',
                border: '3px solid #8B7355',
                borderRadius: '8px',
                padding: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                minWidth: '200px',
                zIndex: 160,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <button
                  onClick={() => { playSound('click'); setShowSaveLoad(true); setShowMobileMenu(false); }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                  style={{
                    background: 'url(/corkboard/buttons/SAVELOAD_BTN.png) no-repeat center center',
                    backgroundSize: 'contain',
                    color: 'transparent',
                    border: 'none',
                    padding: '0',
                    width: '100%',
                    height: '30px',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    transition: 'filter 0.2s'
                  }}
                >
                </button>

                <button
                  onClick={() => { handleNewProjectClick(); setShowMobileMenu(false); }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                  style={{
                    background: 'url(/corkboard/buttons/NEWBOARD_BTN.png) no-repeat center center',
                    backgroundSize: 'contain',
                    color: 'transparent',
                    border: 'none',
                    padding: '0',
                    width: '100%',
                    height: '35px',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    transition: 'filter 0.2s'
                  }}
                >
                </button>

                <button
                  onClick={() => { playSound('click'); setShowGallery(true); setShowMobileMenu(false); }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                  style={{
                    background: 'url(/corkboard/buttons/POLAROIDS_BTN.png) no-repeat center center',
                    backgroundSize: 'contain',
                    color: 'transparent',
                    border: 'none',
                    padding: '0',
                    width: '100%',
                    height: '30px',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    transition: 'filter 0.2s'
                  }}
                >
                </button>

                <button
                  onClick={() => { playSound('click'); setShowStickerGallery(true); setShowMobileMenu(false); }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                  style={{
                    background: 'url(/corkboard/buttons/STICKERS_BTN.png) no-repeat center center',
                    backgroundSize: 'contain',
                    color: 'transparent',
                    border: 'none',
                    padding: '0',
                    width: '100%',
                    height: '30px',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    transition: 'filter 0.2s'
                  }}
                >
                </button>
                
                <button
                  onClick={() => { playSound('click'); fileInputRef.current.click(); setShowMobileMenu(false); }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                  style={{
                    background: 'url(/corkboard/buttons/UPLOAD_BTN.png) no-repeat center center',
                    backgroundSize: 'contain',
                    color: 'transparent',
                    border: 'none',
                    padding: '0',
                    width: '100%',
                    height: '35px',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    transition: 'filter 0.2s'
                  }}
                >
                </button>
                
                <button
                  onClick={() => { handleAddStickyNote(); setShowMobileMenu(false); }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                  style={{
                    background: 'url(/corkboard/buttons/STICKYNOTE_BTN.png) no-repeat center center',
                    backgroundSize: 'contain',
                    color: 'transparent',
                    border: 'none',
                    padding: '0',
                    width: '100%',
                    height: '30px',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    transition: 'filter 0.2s'
                  }}
                >
                </button>

                <button
                  onClick={() => { handleExportClick(); setShowMobileMenu(false); }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                  style={{
                    background: 'url(/corkboard/buttons/EXPORT_BTN.png) no-repeat center center',
                    backgroundSize: 'contain',
                    color: 'transparent',
                    border: 'none',
                    padding: '0',
                    width: '100%',
                    height: '35px',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    transition: 'filter 0.2s'
                  }}
                >
                </button>

                <button
                  onClick={() => { setShowSettings(true); setShowMobileMenu(false); }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                  style={{
                    background: 'url(/corkboard/buttons/SETTINGS_BTN.png) no-repeat center center',
                    backgroundSize: 'contain',
                    color: 'transparent',
                    border: 'none',
                    padding: '0',
                    width: '100%',
                    height: '35px',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    transition: 'filter 0.2s'
                  }}
                >
                </button>
              </div>
            )}
          </div>
        )}

        {/* EDITOR TOOLBAR */}
        {shouldShowToolbar && (
          <div className="toolbar" style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            background: 'linear-gradient(to right, #BAA48B, #A96833)',
            boxShadow: '2px 3px 0 0 #C1763A',
            border: '2px solid #8B7355',
            borderRadius: '6px',
            padding: '8px 12px',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            zIndex: 100,
            flexWrap: 'wrap'
            }}>

            {/* toolbar content*/}
            <span style={{ 
              fontFamily: 'monospace', 
              fontSize: '12px', 
              fontWeight: 'bold',
              color: '#3E2B27',
              marginRight: '10px'
            }}>
              {currentProjectName} {hasUnsavedChanges && '•'}
            </span>
            
            <button
            onClick={() => { playSound('click'); setShowSaveLoad(true); }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.1)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'brightness(1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            style={{
              background: 'url(/corkboard/buttons/SAVELOAD_BTN.png) no-repeat center center',
              backgroundSize: 'contain',
              color: 'transparent',
              border: 'none',
              padding: '6px 12px',
              width: '120px',
              height: '40px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              filter: 'brightness(1)',
              transform: 'scale(1)',
              transition: 'all 0.2s ease'
              }}
            >
            </button>

            <button
            onClick={handleNewProjectClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.1)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'brightness(1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            style={{
              background: 'url(/corkboard/buttons/NEWBOARD_BTN.png) no-repeat center center',
              backgroundSize: 'contain',
              color: 'transparent',
              border: 'none',
              padding: '6px 12px',
              width: '120px',
              height: '30px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              filter: 'brightness(1)',
              transform: 'scale(1)',
              transition: 'all 0.2s ease'
              }}
            >
            </button>

            <button
            onClick={() => { playSound('click'); setShowGallery(true); }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.1)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'brightness(1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            style={{
              background: 'url(/corkboard/buttons/POLAROIDS_BTN.png) no-repeat center center',
              backgroundSize: 'contain',
              color: 'transparent',
              border: 'none',
              padding: '6px 12px',
              width: '120px',
              height: '33px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              filter: 'brightness(1)',
              transform: 'scale(1)',
              transition: 'all 0.2s ease'
              }}
              >
              </button>

            <button
            onClick={() => { playSound('click'); setShowStickerGallery(true); }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.1)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'brightness(1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            style={{
              background: 'url(/corkboard/buttons/STICKERS_BTN.png) no-repeat center center',
              backgroundSize: 'contain',
              color: 'transparent',
              border: 'none',
              padding: '6px 12px',
              width: '120px',
              height: '33px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              filter: 'brightness(1)',
              transform: 'scale(1)',
              transition: 'all 0.2s ease'
              }}
              >
              </button>
            
            <button
            onClick={() => { playSound('click'); fileInputRef.current.click(); }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.1)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'brightness(1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            style={{
              background: 'url(/corkboard/buttons/UPLOAD_BTN.png) no-repeat center center',
              backgroundSize: 'contain',
              color: 'transparent',
              border: 'none',
              padding: '6px 12px',
              width: '120px',
              height: '30px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              filter: 'brightness(1)',
              transform: 'scale(1)',
              transition: 'all 0.2s ease'
              }}
              >

              </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            
            <button
            onClick={handleAddStickyNote}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.1)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'brightness(1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            style={{
              background: 'url(/corkboard/buttons/STICKYNOTE_BTN.png) no-repeat center center',
              backgroundSize: 'contain',
              color: 'transparent',
              border: 'none',
              padding: '6px 12px',
              width: '120px',
              height: '40px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              filter: 'brightness(1)',
              transform: 'scale(1)',
              transition: 'all 0.2s ease'
            }}
          >
          </button>

            <button
            onClick={handleExportClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.1)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'brightness(1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            style={{
              background: 'url(/corkboard/buttons/EXPORT_BTN.png) no-repeat center center',
              backgroundSize: 'contain',
              color: 'transparent',
              border: 'none',
              padding: '6px 12px',
              width: '120px',
              height: '30px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              filter: 'brightness(1)',
              transform: 'scale(1)',
              transition: 'all 0.2s ease'
            }}
          >
          </button>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => setShowSettings(true)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'brightness(1.1)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'brightness(1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                style={{
                  background: 'url(/corkboard/buttons/SETTINGS_BTN.png) no-repeat center center',
                  backgroundSize: 'contain',
                  color: 'transparent',
                  border: 'none',
                  padding: '6px 12px',
                  width: '120px',
                  height: '40px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  filter: 'brightness(1)',
                  transform: 'scale(1)',
                  transition: 'all 0.2s ease'
                }}
              >
              </button>
            </div>
          </div>
        )}
        {/* interactives */}
        {stickyNotes.map((note) => (
          <InteractiveItem
            key={note.id}
            id={note.id}
            type="sticky"
            initialPosition={note.position}
            initialSize={note.size}
            initialRotation={note.rotation}
            zIndex={note.zIndex}
            isAtBack={note.isAtBack}
            onPositionChange={(position) => updateStickyNote(note.id, 'position', position)}
            onSizeChange={(size) => updateStickyNote(note.id, 'size', size)}
            onRotationChange={(rotation) => updateStickyNote(note.id, 'rotation', rotation)}
            onZIndexChange={(action) => handleZIndexChange(note.id, 'note', action)}
            onDuplicate={() => duplicateStickyNote(note.id)}
            onDelete={() => deleteStickyNote(note.id)}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <img
                src="/corkboard/boardpin2.png"
                alt="pin"
                style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '20%',
                  transform: 'translateX(-50%)',
                  width: '30px',
                  height: '30px',
                  zIndex: 25,
                  pointerEvents: 'none'
                }}
              />
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: note.color,
                  border: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: '2px 2px 8px rgba(0,0,0,0.2)',
                  padding: '10px',
                  fontFamily: 'Comic Sans MS, cursive',
                  fontSize: '12px'
                }}
              >
                <textarea
                  value={note.content}
                  placeholder="write write~"
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    color: '#333'
                  }}
                  onChange={(e) => updateStickyNote(note.id, 'content', e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </InteractiveItem>
        ))}

        {/* polaroids */}
        {polaroids.map((polaroid) => (
          <InteractiveItem
            key={polaroid.id}
            id={polaroid.id}
            type="polaroid"
            initialPosition={polaroid.position}
            initialSize={polaroid.size}
            initialRotation={polaroid.rotation}
            zIndex={polaroid.zIndex}
            isAtBack={polaroid.isAtBack}
            onPositionChange={(position) => updatePolaroid(polaroid.id, 'position', position)}
            onSizeChange={(size) => updatePolaroid(polaroid.id, 'size', size)}
            onRotationChange={(rotation) => updatePolaroid(polaroid.id, 'rotation', rotation)}
            onZIndexChange={(action) => handleZIndexChange(polaroid.id, 'polaroid', action)}
            onDuplicate={() => duplicatePolaroid(polaroid.id)}
            onDelete={() => deletePolaroid(polaroid.id)}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <img
                src="/corkboard/boardpin.png"
                alt="pin"
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '20%',
                  transform: 'translateX(-50%)',
                  width: '30px',
                  height: '30px',
                  zIndex: 20,
                  pointerEvents: 'none'
                }}
              />
              <img
                src={polaroid.src}
                alt="polaroid"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </InteractiveItem>
        ))}

        {/* stickers */}
        {stickers.map((sticker) => (
          <InteractiveItem
            key={sticker.id}
            id={sticker.id}
            type="sticker"
            initialPosition={sticker.position}
            initialSize={sticker.size}
            initialRotation={sticker.rotation}
            zIndex={sticker.zIndex}
            isAtBack={sticker.isAtBack}
            onPositionChange={(position) => updateSticker(sticker.id, 'position', position)}
            onSizeChange={(size) => updateSticker(sticker.id, 'size', size)}
            onRotationChange={(rotation) => updateSticker(sticker.id, 'rotation', rotation)}
            onZIndexChange={(action) => handleZIndexChange(sticker.id, 'sticker', action)}
            onDuplicate={() => duplicateSticker(sticker.id)}
            onDelete={() => deleteSticker(sticker.id)}
          >
            <img
              src={sticker.src}
              alt="sticker"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))',
                pointerEvents: 'none'
              }}
            />
          </InteractiveItem>
        ))}
      </div>

      {/* file input for phones*/}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* gallery popup*/}
      {showGallery && (
        <GalleryPopup
          onClose={() => setShowGallery(false)}
          onAddPolaroid={handleAddPolaroid}
        />
      )}

      {/* stickers gallery */}
      {showStickerGallery && (
        <StickerGalleryPopup
          onClose={() => setShowStickerGallery(false)}
          onAddSticker={handleAddSticker}
        />
      )}

      {/* setting popup */}
      {showSettings && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
          onClick={() => setShowSettings(false)}
        >
        <div
          style={{
            background: 'url(/corkboard/buttons/PANEL_SMOL.png) no-repeat center center',
            backgroundSize: '100% 100%',
            border: 'none',
            padding: '25px',
            paddingBottom: '40px',
            width: '320px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
        <h3 style={{ margin: '0 0 15px 0', fontFamily: 'monospace', color: '#3E2B27', textAlign: 'center' }}>
           Settings
        </h3>
      
      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <button
          onClick={toggleMusic}
          onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
          style={{
            background: isPlaying 
              ? 'url(/corkboard/buttons/UNMUTE_BTN.png) no-repeat center center'
              : 'url(/corkboard/buttons/MUTE_BTN.png) no-repeat center center',
            backgroundSize: 'contain',
            color: 'transparent',
            border: 'none',
            padding: '0',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            transition: 'filter 0.2s'
          }}
        >
        </button>
        <span style={{ fontFamily: 'monospace', fontSize: '14px', color: '#3E2B27' }}>
          {isPlaying ? 'Music On' : 'Music Off'}
        </span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '14px', minWidth: '60px', color: '#3E2B27' }}>Volume:</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          style={{
            width: '120px',
            background: `linear-gradient(to right, #8B7355 0%, #8B7355 ${volume * 100}%, #e0e0e0 ${volume * 100}%, #e0e0e0 100%)`,
            borderRadius: '10px',
            outline: 'none',
            WebkitAppearance: 'none',
            height: '6px'
          }}
          onMouseDown={(e) => {
            e.target.style.background = `linear-gradient(to right, #6B553A 0%, #6B553A ${volume * 100}%, #d0d0d0 ${volume * 100}%, #d0d0d0 100%)`;
          }}
          onMouseUp={(e) => {
            e.target.style.background = `linear-gradient(to right, #8B7355 0%, #8B7355 ${volume * 100}%, #e0e0e0 ${volume * 100}%, #e0e0e0 100%)`;
          }}
        />
        <span style={{ fontFamily: 'monospace', fontSize: '12px', minWidth: '30px', color: '#3E2B27' }}>
          {Math.round(volume * 100)}%
        </span>
      </div>
      
      <button
        onClick={() => setShowSettings(false)}
        onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
        style={{
          width: '100%',
          background: 'url(/corkboard/buttons/CLOSE_BTN.png) no-repeat center center',
          backgroundSize: 'contain',
          color: 'transparent',
          border: 'none',
          padding: '0',
          height: '40px',
          cursor: 'pointer',
          fontFamily: 'monospace',
          transition: 'filter 0.2s'
        }}
      >
      </button>
    </div>
  </div>
)}

      {/* saveload popup*/}
      {showSaveLoad && (
        <SaveLoadPopup
        onClose={() => setShowSaveLoad(false)}
        onSave={handleSaveProject}
        onLoad={handleLoadProject}
        onSaveChanges={handleSaveProject}
        savedProjects={savedProjectsCache.length > 0 ? savedProjectsCache : getSavedProjects()}
        currentHasUnsavedChanges={hasUnsavedChanges}
        currentProjectName={currentProjectName}
      />
    )}

      {/* export confirmation*/}
      {showExportConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
          onClick={() => setShowExportConfirm(false)}
        >
          <div
            style={{
              background: 'url(/corkboard/buttons/PANEL_SMOL.png) no-repeat center center',
              backgroundSize: '100% 100%',
              border: 'none',
              padding: '25px',
              paddingBottom: '40px',
              width: '320px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 15px 0', fontFamily: 'monospace', color: '#3E2B27', textAlign: 'center' }}>
              EXPORT?
            </h3>
            <p style={{ fontFamily: 'monospace', fontSize: '14px', marginBottom: '20px', textAlign: 'center', color: '#3E2B27' }}>
              U WANNA SAVE THIS ARTWORK?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleExportConfirm}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                style={{
                  flex: 1,
                  background: 'url(/corkboard/buttons/YES2_BTN.png) no-repeat center center',
                  backgroundSize: 'contain',
                  color: 'transparent',
                  border: 'none',
                  padding: '0',
                  height: '40px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  transition: 'filter 0.2s'
                }}
              >
              </button>
              <button
                onClick={() => setShowExportConfirm(false)}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                style={{
                  flex: 1,
                  background: 'url(/corkboard/buttons/NO2_BTN.png) no-repeat center center',
                  backgroundSize: 'contain',
                  color: 'transparent',
                  border: 'none',
                  padding: '0',
                  height: '40px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  transition: 'filter 0.2s'
                }}
              >
              </button>
            </div>
          </div>
        </div>
      )}

      {/* export success */}
      {showExportSuccess && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
          onClick={() => {
            setShowExportSuccess(false);
            setExportedImageBlob(null);
            setExportedImageFilename('');
          }}
        >
          <div
            style={{
              background: 'url(/corkboard/buttons/PANEL_SMOL.png) no-repeat center center',
              backgroundSize: '100% 100%',
              border: 'none',
              padding: '25px',
              paddingBottom: '40px',
              width: '320px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '40px', marginBottom: '10px', textAlign: 'center' }}></div>
            <h3 style={{ margin: '0 0 8px 0', fontFamily: 'monospace', color: '#3E2B27', fontSize: '16px', textAlign: 'center' }}>
              YAY! exported!!
            </h3>
            <p style={{ fontFamily: 'monospace', fontSize: '12px', marginBottom: '15px', color: '#666', textAlign: 'center' }}>
              ur corkboard is now saved on ur device~
            </p>
            
            {navigator.share && navigator.canShare && (
              <button
                onClick={handleShareFromPopup}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                style={{
                  width: '100%',
                  background: 'url(/corkboard/buttons/SHARE_BTN.png) no-repeat center center',
                  backgroundSize: 'contain',
                  color: 'transparent',
                  border: 'none',
                  padding: '0',
                  height: '40px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  marginBottom: '8px',
                  transition: 'filter 0.2s'
                }}
              >
              </button>
            )}
            
            <button
              onClick={() => {
                setShowExportSuccess(false);
                setExportedImageBlob(null);
                setExportedImageFilename('');
              }}
              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
              style={{
                width: '100%',
                background: 'url(/corkboard/buttons/CLOSE_BTN.png) no-repeat center center',
                backgroundSize: 'contain',
                color: 'transparent',
                border: 'none',
                padding: '0',
                height: '40px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                transition: 'filter 0.2s'
              }}
            >
            </button>
          </div>
        </div>
      )}

      {/* new project asking*/}
      {showNewProjectPopup && (
        <NewProjectPopup
          onConfirm={handleCreateNewProject}
          onCancel={() => setShowNewProjectPopup(false)}
        />
      )}

      {/* unsaved warning*/}
      {showUnsavedWarning && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
          onClick={() => {
            setShowUnsavedWarning(false);
            setShowNewProjectPopup(true);
          }}
        >
          <div
            style={{
              background: 'url(/corkboard/buttons/PANEL_SMOL.png) no-repeat center center',
              backgroundSize: '100% 100%',
              border: 'none',
              padding: '25px',
              paddingBottom: '40px',
              width: '320px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 15px 0', fontFamily: 'monospace', color: '#3E2B27', textAlign: 'center' }}>
              YO WAIT !
            </h3>
            <p style={{ fontFamily: 'monospace', fontSize: '14px', marginBottom: '20px', textAlign: 'center', color: '#3E2B27' }}>
              u have unsaved work! save it first? 
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  setShowUnsavedWarning(false);
                  setShowSaveLoad(true);
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                style={{
                  flex: 1,
                  background: 'url(/corkboard/buttons/SAVEFIRST_BTN.png) no-repeat center center',
                  backgroundSize: 'contain',
                  color: 'transparent',
                  border: 'none',
                  padding: '0',
                  height: '40px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  transition: 'filter 0.2s'
                }}
              >
              </button>
              <button
                onClick={() => {
                  setShowUnsavedWarning(false);
                  setShowNewProjectPopup(true);
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                style={{
                  flex: 1,
                  background: 'url(/corkboard/buttons/NAH_BTN.png) no-repeat center center',
                  backgroundSize: 'contain',
                  color: 'transparent',
                  border: 'none',
                  padding: '0',
                  height: '40px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  transition: 'filter 0.2s'
                }}
              >
              </button>
            </div>
          </div>
        </div>
      )}

      {/* loading confirmation */}
      {showLoadConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
          onClick={() => {
            setShowLoadConfirm(false);
            setLoadProjectName('');
          }}
        >
          <div
            style={{
              background: 'url(/corkboard/buttons/PANEL_SMOL.png) no-repeat center center',
              backgroundSize: '100% 100%',
              border: 'none',
              padding: '25px',
              paddingBottom: '40px',
              width: '320px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 15px 0', fontFamily: 'monospace', color: '#3E2B27', textAlign: 'center' }}>
              open "{loadProjectName}"? 
            </h3>
            <p style={{ fontFamily: 'monospace', fontSize: '14px', marginBottom: '20px', textAlign: 'center', color: '#3E2B27' }}>
              remember that loading this will replace ur current work! 
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => loadProjectDirectly(loadProjectName)}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                style={{
                  flex: 1,
                  background: 'url(/corkboard/buttons/OPEN_BTN.png) no-repeat center center',
                  backgroundSize: 'contain',
                  color: 'transparent',
                  border: 'none',
                  padding: '0',
                  height: '40px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  transition: 'filter 0.2s'
                }}
              >
              </button>
              <button
                onClick={() => {
                  setShowLoadConfirm(false);
                  setLoadProjectName('');
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                style={{
                  flex: 1,
                  background: 'url(/corkboard/buttons/WAIT_BTN.png) no-repeat center center',
                  backgroundSize: 'contain',
                  color: 'transparent',
                  border: 'none',
                  padding: '0',
                  height: '40px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  transition: 'filter 0.2s'
                }}
              >
              </button>
            </div>
          </div>
        </div>
      )}

      {/* delete project conf*/}
      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
          onClick={() => {
            setShowDeleteConfirm(false);
            setDeleteProjectName('');
          }}
        >
          <div
            style={{
              background: 'url(/corkboard/buttons/PANEL_SMOL.png) no-repeat center center',
              backgroundSize: '100% 100%',
              border: 'none',
              padding: '25px',
              paddingBottom: '40px',
              width: '320px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 15px 0', fontFamily: 'monospace', color: '#3E2B27', textAlign: 'center' }}>
              delete project? 
            </h3>
            <p style={{ fontFamily: 'monospace', fontSize: '14px', marginBottom: '20px', textAlign: 'center', color: '#3E2B27' }}>
              really delete "{deleteProjectName}"? cant undo this! 
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleDeleteProjectConfirm}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                style={{
                  flex: 1,
                  background: 'url(/corkboard/buttons/YES_BTN.png) no-repeat center center',
                  backgroundSize: 'contain',
                  color: 'transparent',
                  border: 'none',
                  padding: '0',
                  height: '40px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  transition: 'filter 0.2s'
                }}
              >
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteProjectName('');
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                style={{
                  flex: 1,
                  background: 'url(/corkboard/buttons/NO_BTN.png) no-repeat center center',
                  backgroundSize: 'contain',
                  color: 'transparent',
                  border: 'none',
                  padding: '0',
                  height: '40px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  transition: 'filter 0.2s'
                }}
              >
              </button>
            </div>
          </div>
        </div>
      )}

      {/* success message */}
      {showSuccessMessage && (
        <SuccessPopup
          message={successMessage}
          onClose={() => {
            setShowSuccessMessage(false);
            setSuccessMessage('');
          }}
          closeButtonImage="/corkboard/buttons/YAY_BTN.png" 
        />
      )}
          </div>
        );
      }

export default CorkboardApp;