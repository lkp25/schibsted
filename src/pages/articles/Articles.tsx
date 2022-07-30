const Counter = () => {
  return (
    <>
      <div>
        <h1>Schibsted Articles</h1>
        <div>data sources</div>

        <ul>
          <li>
            <label htmlFor="fashion_checkbox">
              <input
                type="checkbox"
                name="articles_filter"
                id="fashion_checkbox"
              />
              Fashion
            </label>
          </li>
          <li>
            <label htmlFor="sport_checkbox">
              <input
                type="checkbox"
                name="articles_filter"
                id="sport_checkbox"
              />
            </label>
            Sport
          </li>
        </ul>
      </div>
      <div>
        <label htmlFor="date_select">
          Sort by date:
          <select name="date_select" id="date_select">
            <option value="ascending">newest first</option>
            <option value="descending">oldest first</option>
          </select>
        </label>
      </div>
    </>
  );
};

export default Counter;
