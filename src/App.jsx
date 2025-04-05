import { useState , useEffect} from 'react';
import Navbar from './components/Navbar';
import Tableau from './components/Tableau';
import Modal from './components/Modal';
import axios from 'axios';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [searchTerm, setSearchTerm] = useState("");
  const [ventes, setVentes] = useState([]); // Nouvel état pour stocker les ventes
  const [selectedVente, setSelectedVente] = useState(null); // Pour le mode édition

  
  const fetchVentes = async () => {
    const response = await axios.get('http://localhost:3000/api/ventes');
  setVentes(response.data.sort((a, b) => a.numproduit - b.numproduit));
  };

  const handleDeleteSuccess = (numproduit) => {
    setVentes(prev => prev.filter(vente => vente.numproduit !== numproduit));
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
      } else {
        const response = await axios.put(
          `http://localhost:3000/api/ventes/${selectedVente.numproduit}`, 
          formData );
        setVentes(prev =>
          prev.map(vente => 
            vente.numproduit === selectedVente.numproduit ? response.data : vente
          )
        );
      }
      setIsOpen(false);
      fetchVentes();
    } catch (error) {
      console.error(`Erreur ${modalMode === "add" ? "d'ajout" : "de modification"} vente:`, error);
    }
  };

  return (
    <>
      <Navbar 
        onOpen={() => handleOpen('add')} 
        onSearch={(term) => setSearchTerm(term)}
      />
      
      <div className="flex flex-col h-2/3 w-2/3 mx-auto mt-10">
        <Tableau 
          onDeleteSuccess={handleDeleteSuccess}
          handleOpen={handleOpen} 
          searchTerm={searchTerm}
          ventes={ventes} // Passe les ventes au tableau
        />
        
        <Modal 
          isOpen={isOpen}
          onSubmit={handleSubmit} 
          onClose={() => setIsOpen(false)}
          mode={modalMode}
          selectedVente={selectedVente} // Passe la vente sélectionnée
        />
      </div>
    </>
  );
}

export default App;