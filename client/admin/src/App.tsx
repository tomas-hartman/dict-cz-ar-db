import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState<any[] | undefined>(undefined);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const handleSearchList = async () => {
    const data = await fetch("/dict");
    const words = await data.json();

    setData(words);
  }

  const handleSearchRoot = async (e: React.MouseEvent) => {
    const query = searchRef.current?.value;

    const data = await fetch(`/q/${query}`);
    const words = await data.json();

    setData(words);
  }

  useEffect(() => {
    if (!data) {
      handleSearchList();
    };
  })

  const getErrorMessage = (query?: string) => {
    console.log(data);
    if(data && data.length >= 1) return;

    return (
      <div className="error-message-wrapper">
        <p>{`Nothing was found for ${query}`}</p>
      </div>
    )
  } 

  const getRows = (innerData: any[] | undefined) => {
    if (!innerData) return;

    const mapped = innerData.map((row) => {
      const {
        ar, ar_transcription, ar_variant, categories, cs, id, masdar, norm, plural, root_ar, root_lat, stem, stem_vowel, tags, valency
      } = row;

      return (
        <tr key={id}>
          <th scope="row">{id}</th>
          <td>{ar}</td>
          <td>{plural}</td>
          <td>{masdar}</td>
          <td>{valency}</td>
          <td>{cs}</td>
          <td>{ar_variant}</td>
          <td>{norm}</td>
          <td>{ar_transcription}</td>
          <td>{stem_vowel}</td>
          <td>{tags}</td>
          <td>{categories}</td>
          <td>{root_lat}</td>
          <td>{root_ar}</td>
          <td>{stem}</td>
        </tr>
      )
    });

    return mapped;
  }

  return (
    <div className="container-fluid">
      <header>
        <h1>Testing admin for table</h1>
      </header>
      <main>
        <form>
          <div className="mb-3">
            <label htmlFor="search-input" className="form-label">Search</label>
            <input type="search" className="form-control" id="search-input" ref={searchRef} />
          </div>
          <button className="btn btn-primary" type="button" onClick={handleSearchRoot}>Search root</button>
        </form>
        <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">id</th>
              <th scope="col">عربي</th>
              <th scope="col">Plurál</th>
              <th scope="col">Masdar</th>
              <th scope="col">Valence</th>
              <th scope="col">Česky</th>
              <th scope="col">ar_variant</th>
              <th scope="col">norm</th>
              <th scope="col">Transkripce z AR</th>
              <th scope="col">Kořenový vokál</th>
              <th scope="col">Tagy</th>
              <th scope="col">Slovní druh(y)</th>
              <th scope="col">Kořen (latinka)</th>
              <th scope="col">Kořen (arabsky)</th>
              <th scope="col">Kmen</th>
            </tr>
          </thead>
          <tbody>
            {data && getRows(data)}
          </tbody>
        </table>
        {getErrorMessage(searchRef.current?.value)}
        </div>
      </main>
    </div>
  );
}

export default App;
