import { FC, useState, useEffect } from 'react';
import SortIcon from '../../assets/icons/SortIcon';
import ArticlePreview from '../../components/articlePreview';
import ErrorMessage from '../../components/errorMessage';
import InfoMessage from '../../components/infoMessage';
import Loader from '../../components/loader';
import { getDateInMiliseconds } from '../../utils';
import './Articles.css';

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
      <h1 className="articles__title">Schibsted Articles</h1>

      <section className="articles__container">
        <div className="articles__data_sources">
          <span className="span_bold">Data sources</span>:
          <ul>
            {/* dynamically display checkboxes for all categories */}
            {KNOWN_CATEGORIES.map((category) => {
              return (
                <li key={category}>
                  <div className="custom_checkbox_container">
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
                    {/* label must be after input for custom styling to work */}
                    <label htmlFor={`${category}_checkbox`}> {category}</label>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="articles__date_sorting">
          <span className="span_bold"> Sort by date: </span>
          <br />
          <div className="custom_select_container">
            <select
              className="custom_select"
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
            <span className="custom_select_arrow">
              <SortIcon />
            </span>
          </div>
        </div>

        {/* display loader, api error, info msg  or successfully fetched articles */}
        {isLoading ? (
          <Loader />
        ) : apiResponseError ? (
          <ErrorMessage message={apiResponseError} />
        ) : articlesToDisplay.length < 1 ? (
          <InfoMessage message="please select which categories you want to see articles from" />
        ) : (
          <div className="articles__list">
            {articlesToDisplay.sort(getSortMethod()).map((article) => {
              return <ArticlePreview key={article.id} article={article} />;
            })}
          </div>
        )}
      </section>
    </>
  );
};

export default Articles;
