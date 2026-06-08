const SearchBar = ({ setDni }) => {

    const handleSubmit = (e) => {
        e.preventDefault();
    }

  return (

    <>
    
    <form>
        <input 
          type="text" 
          placeholder="Buscar paciente..." 
          onSubmit={handleSubmit}
          onChange={(e) => setDni(e.target.value)}
        />
    </form>
    
    </>


  )
};

export default SearchBar;