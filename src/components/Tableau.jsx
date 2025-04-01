export default function Tableau({handleOpen}) {
    const ventes = [
        {
            id: 1,
            design: "Seedap",
            prix: 2000,
            quantité: 20,
            montant: 2000 * 20, // Calculé directement
            action: true,
        },
        {
            id: 2,
            design: "Extra",
            prix: 300, // Changé en nombre
            quantité: 24, // Changé en nombre
            montant: 300 * 24, // Calculé directement
            action: true,
        }
    ];

    return (
        <>
            <div className="overflow-x-auto mt-10">
                <table className="table">
                    {/* head */}
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
                    <tbody className="hover">
                        {ventes.map((vente,) => (
                            <tr>
                                <td>{vente.id}</td>
                                <td>{vente.design}</td>
                                <td>{vente.prix}</td>
                                <td>{vente.quantité}</td>
                                <td>{vente.montant}</td>
                                <td>
                                    <button className="btn btn-soft btn-accent btn-sm mr-5" onClick={ ()=> handleOpen('edit')}>Modifier</button>
                                    <button className="btn btn-soft btn-error btn-sm">Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}