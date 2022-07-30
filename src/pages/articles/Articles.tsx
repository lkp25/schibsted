import { FC, useState, useEffect } from 'react';
import Article from '../../components/article';

interface Article {
  id: number;
  date: string;
  image: string;
  category: string;
  title: string;
  preamble: string;
}

const fetchArticles = (categories: string[]): Article[] => {
  const articlesToDisplay = [];
  categories.forEach(async (category) => {
    const response = await window.fetch(
      `http://localhost:6010/articles/${category}`,
    );
    const data = await response.json();
    console.log(data);
  });
  return [];
};

const Articles: FC = () => {
  const [categories, setCategories] = useState<string[]>(['sport']);
  const [articlesToDisplay, setArticlesToDisplay] = useState<Article[]>([]);

  useEffect(() => {
    fetchArticles(categories);
  }, [categories]);

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
      <section>
        <Article />
        <Article />
        <Article />
      </section>
    </>
  );
};

export default Articles;
