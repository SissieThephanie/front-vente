import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Tableau from './components/Tableau';
import Modal from './components/Modal';
import { AlertProvider, useAlerts } from './components/AlertContext';
import axios from 'axios';

// Composant principal enrobé dans le provider
function AppWithAlerts() {
  const { addAlert, AlertsContainer } = useAlerts();
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [searchTerm, setSearchTerm] = useState("");
  const [ventes, setVentes] = useState([]);
  const [selectedVente, setSelectedVente] = useState(null);
  
  const fetchVentes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/ventes');
      setVentes(response.data.sort((a, b) => a.numproduit - b.numproduit));
    } catch (error) {
      console.error("Erreur lors de la récupération des ventes:", error);
      addAlert("error", "Erreur lors de la récupération des ventes");
    }
  };

  const handleDeleteSuccess = (numproduit) => {
    setVentes(prev => prev.filter(vente => vente.numproduit !== numproduit));
    addAlert("success", "Vente supprimée avec succès");
  };

  useEffect(() => {
    fetchVentes();
  }, []);

  const handleOpen = (mode, vente = null) => {
    setModalMode(mode);
    setSelectedVente(vente);
    setIsOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (modalMode === "add") {
        const response = await axios.post('http://localhost:3000/api/ventes', formData);
        setVentes(prev => [...prev, response.data]);
        addAlert("success", "Vente ajoutée avec succès");
      } else {
        const response = await axios.put(
          `http://localhost:3000/api/ventes/${selectedVente.numproduit}`, 
          formData
        );
        setVentes(prev =>
          prev.map(vente => 
            vente.numproduit === selectedVente.numproduit ? response.data : vente
          )
        );
         addAlert("success", "Vente modifiée avec succès");
      }
      setIsOpen(false);
      fetchVentes();
    } catch (error) {
      console.error(`Erreur ${modalMode === "add" ? "d'ajout" : "de modification"} vente:`, error);
      // addAlert("error", `Erreur lors de ${modalMode === "add" ? "l'ajout" : "la modification"} de la vente`);
    }
  };

  return (
    <>
      <Navbar 
        onOpen={() => handleOpen('add')} 
        onSearch={(term) => setSearchTerm(term)}
      />
      
      <div className="flex flex-col h-2/3 w-2/3 mx-auto mt-10">
        {/* Composant qui affiche les alertes */}
        <AlertsContainer />

        <Tableau 
          onDeleteSuccess={handleDeleteSuccess}
          handleOpen={handleOpen} 
          searchTerm={searchTerm}
          ventes={ventes}
        />
        
        <Modal 
          isOpen={isOpen}
          onSubmit={handleSubmit} 
          onClose={() => setIsOpen(false)}
          mode={modalMode}
          selectedVente={selectedVente}
        />
      </div>
    </>
  );
}

// Composant racine avec le provider
function App() {
  return (
    <AlertProvider>
      <AppWithAlerts />
    </AlertProvider>
  );
}

export default App;