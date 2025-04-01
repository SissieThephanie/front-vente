import { useState, useEffect } from 'react';

export default function ModalForm({ isOpen, onClose, mode, onSubmit, selectedVente }) {
  // États pour les champs du formulaire
  const [formData, setFormData] = useState({
    numproduit: '',
    design: '',
    prix: '',
    quantité: ''
  });

  // Met à jour les champs quand selectedVente change
  useEffect(() => {
    if (mode === 'edit' && selectedVente) {
      setFormData({
        numproduit: selectedVente.id || '',
        design: selectedVente.design || '',
        prix: selectedVente.prix || '',
        quantité: selectedVente.quantité || ''
      });
    } else {
      // Réinitialise pour l'ajout
      setFormData({
        numproduit: '',
        design: '',
        prix: '',
        quantité: ''
      });
    }
  }, [selectedVente, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Envoie les données du formulaire
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <div className="flex flex-col gap-1 ml-12">
          <h3 className="font-bold text-lg py-4">
            {mode === "edit" ? "Modifier vente" : "Ajouter vente"}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={onClose}
            >
              ✕
            </button>

            <div className="mb-5">
              <label className="floating-label">
                <span>Numéro du produit</span>
                <input
                  type="text"
                  name="numproduit"
                  placeholder="Numéro du produit"
                  className="input input-md"
                  value={formData.numproduit}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="mb-5">
              <label className="floating-label">
                <span>Design</span>
                <input
                  type="text"
                  name="design"
                  placeholder="Design"
                  className="input input-md"
                  value={formData.design}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="mb-5">
              <label className="floating-label">
                <span>Prix unitaire</span>
                <input
                  type="text"
                  name="prix"
                  placeholder="Prix unitaire"
                  className="input input-md"
                  value={formData.prix}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="mb-5">
              <label className="floating-label">
                <span>Quantité</span>
                <input
                  type="text"
                  name="quantité"
                  placeholder="Quantité"
                  className="input input-md"
                  value={formData.quantité}
                  onChange={handleChange}
                />
              </label>
            </div>

            <button type="submit" className="btn btn-success">
              {mode === "edit" ? "Sauvegarder" : "Ajouter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
