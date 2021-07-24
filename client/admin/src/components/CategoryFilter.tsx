import React from 'react'

interface Props {
  setData: (args: any[]) => void;
}

const CategoryFilter: React.FC<Props> = (props: Props) => {
  const { setData } = props;

  const handleFilterCategory = async (e: React.ChangeEvent<HTMLSelectElement>) => {    
    const query = e.target.value;

    const data = await fetch(`/cat/${query}`);
    const words = await data.json();

    setData(words);
  }

  return (
    <form>
      <div className="mb-3">
        <label htmlFor="category-select" className="form-label">Slovní druhy</label>
        <select className="form-select" id="category-select" aria-label="Default select example" onChange={handleFilterCategory}>
          <option value="all">Zobrazit vše</option>
          <option value="uncategorized">Bez kategorie</option>
          <option value="4">Slovesa</option>
          <option value="6">Substantiva</option>
          <option value="9">Adjektiva</option>
          <option value="5">Adverbia</option>
          <option value="2">Fráze</option>
          <option value="3">Prepozice</option>
          <option value="8">Spojky</option>
          <option value="1">Číslovky</option>
          <option value="7">Zájmena</option>
          <option value="10">Částice</option>
        </select>
      </div>
    </form>
  )
}

export default CategoryFilter
