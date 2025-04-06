import axios from "axios";
import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Tableau({ handleOpen, searchTerm, ventes, onDeleteSuccess }) {
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduit, setSelectedProduit] = useState(null);

    // Ouvre la modale
    const confirmDelete = (numproduit) => {
        setSelectedProduit(numproduit);
        setShowModal(true);
    };

    // Supprime le produit après confirmation
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/ventes/${selectedProduit}`);
            onDeleteSuccess(selectedProduit);
            setShowModal(false);
            setSelectedProduit(null);
        } catch (error) {
            console.error("Erreur suppression vente:", error);
            setError(error);
        }
    };

    // Statistiques
    const totalMontant = ventes.reduce((total, v) => total + (v.prix * v.quantite), 0);
    const maxPrice = ventes.length ? Math.max(...ventes.map(v => v.prix)) : 0;
    const minPrice = ventes.length ? Math.min(...ventes.map(v => v.prix)) : 0;

    const topProduits = [...ventes]
        .sort((a, b) => (b.prix * b.quantite) - (a.prix * a.quantite))
        .slice(0, 5);

    const barData = {
        labels: topProduits.map(v => v.design),
        datasets: [{
            label: 'Montant par produit',
            data: topProduits.map(v => v.prix * v.quantite),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        }],
    };

    const pieData = {
        labels: ['Prix Min', 'Prix Max', 'Montant Total'],
        datasets: [{
            data: [minPrice, maxPrice, totalMontant],
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(75, 192, 192, 0.5)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
        }],
    };

    const filterData = ventes.filter(vente => {
        if (!searchTerm) return true;
        const montant = vente.prix * vente.quantite;
        return (
            vente.design?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vente.numproduit?.toString().includes(searchTerm) ||
            vente.prix?.toString().includes(searchTerm) ||
            vente.quantite?.toString().includes(searchTerm) ||
            montant.toString().includes(searchTerm)
        );
    });

    return (
        <div className="flex flex-col h-[calc(100vh-150px)]">
            {error && <div className="alert alert-error mb-4">{error.message}</div>}

            {/* Tableau */}
            <div className="flex flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto pr-4">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Design</th>
                                <th>Prix</th>
                                <th>Quantité</th>
                                <th>Montant</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterData.length > 0 ? (
                                filterData.map(vente => (
                                    <tr key={vente.numproduit}>
                                        <td>{vente.numproduit}</td>
                                        <td>{vente.design}</td>
                                        <td>{vente.prix}</td>
                                        <td>{vente.quantite}</td>
                                        <td>{vente.prix * vente.quantite}</td>
                                        <td>
                                            <button className="btn btn-sm btn-accent mr-2" onClick={() => handleOpen('edit', vente)}>Modifier</button>
                                            <button className="btn btn-sm btn-error" onClick={() => confirmDelete(vente.numproduit)}>Supprimer</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6" className="text-center">Aucune donnée disponible</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Graphiques */}
                <div className="w-1/3 flex flex-col gap-4 pl-4 border-l">
                    <div className="bg-base-100 p-4 rounded-lg shadow">
                        <h3 className="font-bold text-lg mb-2">Top 5 produits</h3>
                        <div className="h-64"><Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
                    </div>
                    <div className="bg-base-100 p-4 rounded-lg shadow">
                        <h3 className="font-bold text-lg mb-2">Répartition</h3>
                        <div className="h-64"><Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
                    </div>
                </div>
            </div>

            {/* Statistiques */}
            <div className="stats shadow bg-base-100 border-t mt-auto">
                <div className="stat"><div className="stat-title">Prix Max</div><div className="stat-value">{maxPrice}</div></div>
                <div className="stat"><div className="stat-title">Prix Min</div><div className="stat-value">{minPrice}</div></div>
                <div className="stat"><div className="stat-title">Montant Total</div><div className="stat-value">{totalMontant}</div></div>
            </div>

            {/*MODALE DE CONFIRMATION */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-neutral-800 p-6 rounded-lg shadow-md w-96">
                        <h3 className="text-lg font-bold mb-2">Confirmation</h3>
                        <p className="mb-4">Êtes-vous sûr de vouloir supprimer cette vente ?</p>
                        <div className="flex justify-end gap-2">
                            <button className="btn btn-sm btn-error" onClick={handleDelete}>Oui, Supprimer</button>
                            <button className="btn btn-sm btn-outline" onClick={() => setShowModal(false)}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
