import React, { createContext, useContext, useState } from 'react';

// Création du contexte
const AlertContext = createContext();

// Hook personnalisé pour utiliser le contexte d'alerte
export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts doit être utilisé à l\'intérieur d\'un AlertProvider');
  }
  return context;
};

// Provider du contexte
export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  
  // Ajouter une alerte
  const addAlert = (type, message, duration = 3000) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, message }]);
    
    // Supprimer automatiquement après la durée spécifiée
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, duration);
    
    return id;
  };
  
  // Supprimer une alerte
  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };
  
  // Afficher les alertes
  const AlertsContainer = () => (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {alerts.map((alert) => (
        <div key={alert.id} className={`alert alert-${alert.type} shadow-lg w-80`}>
          <span>{alert.message}</span>
          <button 
            className="btn btn-sm btn-circle btn-ghost" 
            onClick={() => removeAlert(alert.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
  
  const value = {
    alerts,
    addAlert,
    removeAlert,
    AlertsContainer
  };
  
  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};