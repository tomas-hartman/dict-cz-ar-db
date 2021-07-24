import React, { useRef } from 'react'

interface Props {
  setData: (args: any[]) => void;
}

const SearchRoot = (props: Props) => {
  const {setData} = props;
  const searchRef = useRef<HTMLInputElement | null>(null);

  const handleSearchRoot = async (e: React.MouseEvent) => {
    const query = searchRef.current?.value;

    const data = await fetch(`/q/${query}`);
    const words = await data.json();

    setData(words);
  }

  return (
    <form>
          <div className="mb-3">
            <label htmlFor="search-input" className="form-label">Search</label>
            
            <div className="input-group mb-3">
              <input type="search" className="form-control" id="search-input" ref={searchRef} />
              <button className="btn btn-primary" type="button" onClick={handleSearchRoot}>Search root</button>
            </div>
          </div>
        </form>
  )
}

export default SearchRoot
