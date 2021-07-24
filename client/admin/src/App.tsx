import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import CategoryFilter from './components/CategoryFilter';
import SearchRoot from './components/SearchRoot';

function App() {
  const [data, setData] = useState<any[] | undefined>(undefined);

  const handleSearchList = async () => {
    const data = await fetch("/dict");
    const words = await data.json();

    setData(words);
  }

  useEffect(() => {
    if (!data) {
      handleSearchList();
    };
  })

  const getErrorMessage = (query?: string) => {
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
      return (
        <tr key={row.id}>
          <th scope="row">{row.id}</th>
          <td>{row.ar}</td>
          <td>{row.plural}</td>
          <td>{row.masdar}</td>
          <td>{row.valency}</td>
          <td>{row.cs}</td>
          <td>{row.ar_variant}</td>
          <td>{row.norm}</td>
          <td>{row.ar_transcription}</td>
          <td>{row.stem_vowel}</td>
          <td>{row.tags}</td>
          <td>{row.categories}</td>
          <td>{row.root_lat}</td>
          <td>{row.root_ar}</td>
          <td>{row.stem}</td>
        </tr>
      )
    });

    return mapped;
  }

  return (
    <div className="container-fluid">
      <header>
        <h1>Testing table for admin</h1>
      </header>
      <main>
        <SearchRoot setData={setData} />
        <CategoryFilter setData={setData} />
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
        {/* {getErrorMessage(searchRef.current?.value)} */}
        </div>
      </main>
    </div>
  );
}

export default App;
