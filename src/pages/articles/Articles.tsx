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
interface SuccessfulApiResponse {
  articles: Article[];
}

const Articles: FC = () => {
  const [categories, setCategories] = useState<string[]>(['sport', 'fashion']);
  const [articlesToDisplay, setArticlesToDisplay] = useState<Article[]>([]);
  const [apiResponseError, setApiResponseError] = useState<string | null>(null);

  useEffect(() => {
    if (categories.length > 0) {
      fetchArticles(categories);
    }
  }, [categories]);

  const fetchArticles = (categories: string[]): void => {
    let articlesToDisplay: Article[] = [];

    //create a separate request for every chosen category of articles:
    const arrayOfRequests = categories.map((category) => {
      return window
        .fetch(`http://localhost:6010/articles/${category}`)
        .then((res) => {
          if (res.status === 404) {
            throw new Error(`category ${category} not found`);
          }
          if (res.status === 500) {
            throw new Error(
              'at least one of the categories could not be fetched from server. Please refresh to try again',
            );
          }
          return res.json();
        })
        .then((data: SuccessfulApiResponse) => {
          articlesToDisplay = [...articlesToDisplay, ...data.articles];
          console.log(articlesToDisplay);
        });
    });

    //Execute all requests
    Promise.all(arrayOfRequests)
      .then(() => {
        setArticlesToDisplay(articlesToDisplay);
      })
      .catch((err) => {
        setApiResponseError(err.message);
      });
  };

  return (
    <>
      {articlesToDisplay.length > 0 ? (
        <div>articles fetched sucessfully</div>
      ) : null}
      {apiResponseError ? <div>{apiResponseError}</div> : null}
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
