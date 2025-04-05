export default function Navbar({onOpen ,onSearch}) {
    const handleSearch = (event) => {
        onSearch(event.target.value);
    };
    return (

   <div className="navbar bg-base-100 shadow-md">
    {/* Partie gauche */}
      <div className="navbar-start">
      <a className="text-xl font-bold text-primary">Gestion Ventes</a>
      </div>
    
      <div className="navbar-center">
      <input type="text" placeholder="Search" className="input input-bordered w-80 " onChange={handleSearch}/>
    </div>
  


  {/* Partie droite */}
  <div className="navbar-end">
      <button className="btn btn-primary gap-2" onClick={onOpen}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Ajouter Produit
      </button>
  </div>  
</div>

    )
}