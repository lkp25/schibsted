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
interface ErrorApiResponse {
  message: string;
}

const Articles: FC = () => {
  //two categories are known for now, more can easily be added in the future
  const KNOWN_CATEGORIES = ['sport', 'fashion'];
  const [categories, setCategories] = useState<string[]>([]);
  const [articlesToDisplay, setArticlesToDisplay] = useState<Article[]>([]);
  const [apiResponseError, setApiResponseError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setApiResponseError(null);
    fetchArticles(categories);
  }, [categories]);

  const fetchArticles = (categories: string[]): void => {
    let articlesToDisplay: Article[] = [];
    setIsLoading(true);
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

    //Execute all requests - if any of them fails, show error msg to the user
    Promise.all(arrayOfRequests)
      .then(() => {
        setArticlesToDisplay(articlesToDisplay);
        setIsLoading(false);
      })
      .catch((err: ErrorApiResponse) => {
        setApiResponseError(err.message);
        setIsLoading(false);
      });
  };

  return (
    <>
      {/* add a CSS spinner here */}
      {isLoading ? <div>loading</div> : null}

      <div>
        <h1>Schibsted Articles</h1>
        <div>data sources</div>

        {/* dynamically display checkboxes for all categories */}
        <ul>
          {KNOWN_CATEGORIES.map((category) => {
            return (
              <li key={category}>
                <label htmlFor={`${category}_checkbox`}>
                  <input
                    value={category}
                    onChange={(event) => {
                      const currentCategory = event.target.value;
                      setCategories(
                        categories.includes(currentCategory)
                          ? categories.filter(
                              (category) => category !== currentCategory,
                            )
                          : [...categories, currentCategory],
                      );
                    }}
                    type="checkbox"
                    name="categories_filter"
                    id={`${category}_checkbox`}
                  />
                  {category}
                </label>
              </li>
            );
          })}
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
