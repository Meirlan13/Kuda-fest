import React, { useState } from "react";

function Search() {
  const [selected, setSelected] = useState("");

  return (
    <div>
      <label htmlFor="options">Что хотите покушать?</label>
      <select
        id="options"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="">Выбрать...</option>
        <option value="option1">Курицу</option>
        <option value="option2">Пиццу</option>
        <option value="option3">Лапшу</option>
      </select>
      {selected && <p>Вы выбрали: {selected}</p>}
    </div>
  );
};

export default Search;
