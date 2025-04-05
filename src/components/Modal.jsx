import { useState, useEffect } from 'react';

export default function Modal({ isOpen, onClose, mode, onSubmit, selectedVente }) {
  const [formData, setFormData] = useState({
    design: '',
    prix: '0', 
    quantite: '1'
  });
  console.log("Modal reçoit:", { selectedVente, mode, isOpen });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && selectedVente) {
        setFormData({
          design: selectedVente.design || '',
          prix: selectedVente.prix?.toString() || '0',
          quantite: selectedVente.quantite?.toString() || '1'
        });
      } else {
        setFormData({
          design: '',
          prix: '0',
          quantite: '1'
        });
      }
    }
  }, [isOpen, mode, selectedVente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit({
        design: formData.design,
        prix: parseFloat(formData.prix),
        quantite: parseInt(formData.quantite)
      });
      onClose(); // Fermer seulement après succès
    } catch (error) {
      console.error("Erreur soumission:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box relative">
        <button 
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-2 top-2"
        >
          ✕
        </button>
        
        <h3 className="text-lg font-bold mb-4">
          {mode === "edit" ? "Modifier vente" : "Nouvelle vente"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Designation*</span>
            </label>
            <input
              type="text"
              name="design"
              value={formData.design}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Prix unitaire*</span>
            </label>
            <input
              type="number"
              name="prix"
              value={formData.prix}
              onChange={handleChange}
              className="input input-bordered w-full"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Quantité*</span>
            </label>
            <input
              type="number"
              name="quantite"
              value={formData.quantite}
              onChange={handleChange}
              className="input input-bordered w-full"
              min="1"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-6">
            {mode === "edit" ? "Enregistrer" : "Créer"}
          </button>
        </form>
      </div>
    </div>
  );
}