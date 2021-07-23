import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    if(!data) {
      (async () => {
        const data = await fetch("/dict");
        const words = await data.json();

        setData(words);
      })()
    };
  })

  const getRows = (innerData: any[] | undefined) => {
    if(!innerData) return;

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
      <table className="table">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">AR</th>
            <th scope="col">plural</th>
            <th scope="col">masdar</th>
            <th scope="col">val</th>
            <th scope="col">CS</th>
            <th scope="col">ar_variant</th>
            <th scope="col">norm</th>
            <th scope="col">AR Transcription</th>
            <th scope="col">Stem vowel</th>
            <th scope="col">Tags</th>
            <th scope="col">Categories</th>
            <th scope="col">Root Latin</th>
            <th scope="col">Root Arabic</th>
            <th scope="col">Stem</th>
          </tr>
        </thead>
        <tbody>
          {data && getRows(data)}
        </tbody>
      </table>
    </div>
  );
}

export default App;
