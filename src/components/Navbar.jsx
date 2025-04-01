export default function Navbar({onOpen}) {
    return (

 <div className="navbar bg-base-50">
  <div className="navbar-start">
    <a className="text-xl ext-white">Vente</a>
  </div>
  <div className="flex gap-2">
    <input type="text" placeholder="Search" className="input input-bordered w-80 " />
  </div>
  <div className="navbar-end">
    <a className="btn btn-primary" onClick={onOpen}>Ajout produit</a>
    </div> 
   
</div>

    )
}