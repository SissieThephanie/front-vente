import axios from "axios";
import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Tableau({ handleOpen, searchTerm, ventes, onDeleteSuccess }) {
    const [error, setError] = useState(null);

    // Calculs des statistiques
    const totalMontant = ventes.reduce((total, v) => total + (v.prix * v.quantite), 0);
    const maxPrice = ventes.length ? Math.max(...ventes.map(v => v.prix)) : 0;
    const minPrice = ventes.length ? Math.min(...ventes.map(v => v.prix)) : 0;

    // Données pour les graphiques
    const topProduits = [...ventes]
        .sort((a, b) => (b.prix * b.quantite) - (a.prix * a.quantite))
        .slice(0, 5);

    const barData = {
        labels: topProduits.map(v => v.design),
        datasets: [
            {
                label: 'Montant par produit',
                data: topProduits.map(v => v.prix * v.quantite),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const pieData = {
        labels: ['Prix Min', 'Prix Max', 'Montant Total'],
        datasets: [
            {
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
            },
        ],
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

    const handleDelete = async (numproduit) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette vente ?")) {
            try {
                await axios.delete(`http://localhost:3000/api/ventes/${numproduit}`);
                onDeleteSuccess(numproduit);
            } catch (error) {
                console.error("Erreur suppression vente:", error);
                setError(error);
            }
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-150px)]">
            {/* Message d'erreur */}
            {error && <div className="alert alert-error mb-4">{error.message}</div>}
            
            {/* Contenu principal (tableau + graphiques) */}
            <div className="flex flex-1 min-h-0">
                {/* Tableau avec défilement */}
                <div className="flex-1 overflow-y-auto pr-4">
                    <table className="table w-full relative">
                        <thead>
                            <tr>
                                <th className="sticky top-0 bg-base-100 z-10">ID</th>
                                <th className="sticky top-0 bg-base-100 z-10">Design</th>
                                <th className="sticky top-0 bg-base-100 z-10">Prix</th>
                                <th className="sticky top-0 bg-base-100 z-10">Quantité</th>
                                <th className="sticky top-0 bg-base-100 z-10">Montant</th>
                                <th className="sticky top-0 bg-base-100 z-10">Actions</th>
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
                                            <button 
                                                className="btn btn-sm btn-accent mr-2" 
                                                onClick={() => handleOpen('edit', vente)}
                                            >
                                                Modifier
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-error" 
                                                onClick={() => handleDelete(vente.numproduit)}
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-8">
                                        Aucune donnée disponible
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Graphiques à droite - pas de scroll */}
                <div className="w-1/3 flex flex-col gap-4 pl-4 border-l">
                    <div className="bg-base-100 p-4 rounded-lg shadow">
                        <h3 className="font-bold text-lg mb-2">Top 5 produits</h3>
                        <div className="h-64">
                            <Bar 
                                data={barData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    <div className="bg-base-100 p-4 rounded-lg shadow">
                        <h3 className="font-bold text-lg mb-2">Répartition</h3>
                        <div className="h-64">
                            <Pie 
                                data={pieData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'right',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer des statistiques - toujours visible */}
            <div className="stats shadow bg-base-100 border-t mt-auto">
                <div className="stat">
                    <div className="stat-title">Prix Maximum</div>
                    <div className="stat-value text-primary">{maxPrice}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Prix Minimum</div>
                    <div className="stat-value text-secondary">{minPrice}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Montant Total</div>
                    <div className="stat-value text-accent">{totalMontant}</div>
                </div>
            </div>
        </div>
    );
}