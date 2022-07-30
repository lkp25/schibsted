import { FC } from 'react';
import { Article } from '../../pages/articles/Articles';

interface ArticlePreviewProps {
  article: Article;
}
const ArticlePreview: FC<ArticlePreviewProps> = ({ article }) => {
  return (
    <>
      <h2>{article.title}</h2>
      <h3>{article.date}</h3>
      <img loading="lazy" alt={article.title} src={article.image} />

      {/* optional */}
      <div> preamble</div>
    </>
  );
};

export default ArticlePreview;
