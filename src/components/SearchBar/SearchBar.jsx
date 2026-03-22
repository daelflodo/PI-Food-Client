import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { searchRecipesByName } from '../../redux/actions/actions';
import style from './SearchBar.module.css';

const SearchBar = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(searchRecipesByName(query.trim()));
      setQuery('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className={style.wrapper}>
      <input
        className={style.input}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        type="search"
        placeholder="Search recipes…"
      />
      <button className={style.btn} onClick={handleSearch} type="button">
        🔍
      </button>
    </div>
  );
};

export default SearchBar;
