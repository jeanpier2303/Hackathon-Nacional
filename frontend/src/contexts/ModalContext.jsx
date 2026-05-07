import React, { createContext, useContext, useState, useCallback } from 'react';

const ModalContext = createContext(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [contractId, setContractId] = useState(null);

  const openContractModal = useCallback((id) => {
    setContractId(id);
    setModalOpen(true);
  }, []);

  const closeContractModal = useCallback(() => {
    setModalOpen(false);
    setContractId(null);
  }, []);

  return (
    <ModalContext.Provider value={{ openContractModal, closeContractModal, modalOpen, contractId }}>
      {children}
    </ModalContext.Provider>
  );
};