import { useState, useEffect } from 'react';

export default function Modal({ isOpen, onClose, mode, onSubmit, selectedVente }) {
  const [formData, setFormData] = useState({
    design: '',
    prix: '0', 
    quantite: '1'
  });
  
  const [isValid, setIsValid] = useState(false);
  
  console.log("Modal reçoit:", { selectedVente, mode, isOpen });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && selectedVente) {
        const newFormData = {
          design: selectedVente.design || '',
          prix: selectedVente.prix?.toString() || '0',
          quantite: selectedVente.quantite?.toString() || '1'
        };
        setFormData(newFormData);
        validateForm(newFormData); // Valider après avoir défini les données
      } else {
        const newFormData = {
          design: '',
          prix: '0',
          quantite: '1'
        };
        setFormData(newFormData);
        validateForm(newFormData); // Valider après avoir défini les données
      }
    }
  }, [isOpen, mode, selectedVente]);

  // Fonction pour valider le formulaire
  const validateForm = (data) => {
    const designValid = data.design.trim() !== '';
    const prixValid = parseFloat(data.prix) > 0;
    const quantiteValid = parseInt(data.quantite) > 0;
    
    setIsValid(designValid && prixValid && quantiteValid);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    validateForm(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérification supplémentaire
    if (!isValid) return;
  
    const design = formData.design.trim();
    const prix = parseFloat(formData.prix);
    const quantite = parseInt(formData.quantite);
  
    try {
      await onSubmit({ design, prix, quantite });
      onClose(); // Fermer seulement après succès
    } catch (error) {
      console.error("Erreur soumission:", error);
    }
  };
  
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
              className={`input input-bordered w-full ${formData.design.trim() === '' ? 'input-error' : ''}`}
              required
            />
            {formData.design.trim() === '' && (
              <label className="label">
                <span className="label-text-alt text-error">La désignation est requise</span>
              </label>
            )}
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
              className={`input input-bordered w-full ${parseFloat(formData.prix) <= 0 ? 'input-error' : ''}`}
              min="0.01"
              step="0.01"
              required
            />
            {parseFloat(formData.prix) <= 0 && (
              <label className="label">
                <span className="label-text-alt text-error">Le prix doit être supérieur à 0</span>
              </label>
            )}
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
              className={`input input-bordered w-full ${parseInt(formData.quantite) <= 0 ? 'input-error' : ''}`}
              min="1"
              required
            />
            {parseInt(formData.quantite) <= 0 && (
              <label className="label">
                <span className="label-text-alt text-error">La quantité doit être au moins 1</span>
              </label>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full mt-6"
            disabled={!isValid}
          >
            {mode === "edit" ? "Enregistrer" : "Créer"}
          </button>
        </form>
      </div>
    </div>
  );
}