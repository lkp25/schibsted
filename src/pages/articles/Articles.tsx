import { FC, useState, useEffect } from 'react';
import ArticlePreview from '../../components/articlePreview';
import ErrorMessage from '../../components/errorMessage';
import { getDateInMiliseconds } from '../../utils';

export interface Article {
  id: number;
  date: string;
  image: string;
  category: string;
  title: string;
  preamble: string;
}
interface ArticleWithDateInMs extends Article {
  dateInMs: number;
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
  const [articlesToDisplay, setArticlesToDisplay] = useState<
    ArticleWithDateInMs[]
  >([]);
  const [apiResponseError, setApiResponseError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sortState, setSortState] = useState<string>('desc');

  useEffect(() => {
    setApiResponseError(null);
    fetchArticles(categories);
  }, [categories]);

  const fetchArticles = (categories: string[]): void => {
    let articlesToDisplay: ArticleWithDateInMs[] = [];
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
          // combine previous articles with ones from this API call and
          // add dateInMs property to each article to allow easy sorting by date
          // and perform default descending sort (from newest to oldest)
          articlesToDisplay = [...articlesToDisplay, ...data.articles].map(
            (art) => {
              return {
                ...art,
                dateInMs: getDateInMiliseconds(art.date),
              };
            },
          );
        });
    });

    //Execute all requests
    Promise.all(arrayOfRequests)
      .then(() => {
        //all successful - sort them
        setArticlesToDisplay(articlesToDisplay);
        setIsLoading(false);
      })
      //- if any of the requests fails, show error msg to the user
      .catch((err: ErrorApiResponse) => {
        setApiResponseError(err.message);
        setIsLoading(false);
      });
  };

  const getSortMethod = () => {
    if (sortState === 'asc') {
      return (a: ArticleWithDateInMs, b: ArticleWithDateInMs) =>
        b.dateInMs - a.dateInMs;
    } else {
      return (a: ArticleWithDateInMs, b: ArticleWithDateInMs) =>
        a.dateInMs - b.dateInMs;
    }
  };

  return (
    <>
      <h1>Schibsted Articles</h1>

      <div>
        <div>data sources:</div>
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
          <select
            defaultValue={'desc'}
            name="date_select"
            id="date_select"
            onChange={(event) => {
              setSortState(event.target.value);
            }}
          >
            <option value="asc">newest first</option>
            <option value="desc">oldest first</option>
          </select>
        </label>
      </div>

      {/* add a CSS spinner here */}
      {isLoading ? (
        <div>loading</div>
      ) : apiResponseError ? (
        <ErrorMessage message={apiResponseError} />
      ) : (
        <>
          {articlesToDisplay.sort(getSortMethod()).map((article) => {
            return <ArticlePreview key={article.id} article={article} />;
          })}
        </>
      )}
    </>
  );
};

export default Articles;
