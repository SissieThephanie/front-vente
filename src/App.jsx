import { useState } from 'react';
import Navbar from './components/Navbar';
import Tableau from './components/Tableau';
import ModalForm from './components/ModalForm';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalmode, setModalMode] = useState("add");

  const handleOpen = (mode) => {
    setModalMode(mode); 
    setIsOpen(true);
  };

  const handleSubmit = () => {
    if (modalmode === "add") {
      console.log("Ajouter une vente");
    } else {
      console.log("Modifier une vente");
    }
    setIsOpen(false);
  };

  return (
    <>
      <Navbar onOpen={() => handleOpen('add')}/>
      <div className="flex flex-col h-2/3 w-2/3 mx-auto mt-10">
        <Tableau handleOpen ={handleOpen} />
        <ModalForm 
          isOpen={isOpen}
          onSubmit={handleSubmit} 
          onClose={() => setIsOpen(false)}
          mode = {modalmode}
        />
      </div>
    </>
  );
}

export default App;