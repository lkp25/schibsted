import { FC } from 'react';
import { Article } from '../../pages/articles/Articles';
import './ArticlePreview.css';

interface ArticlePreviewProps {
  article: Article;
}
const ArticlePreview: FC<ArticlePreviewProps> = ({ article }) => {
  return (
    <div className="article_preview_container">
      <img
        className="article_preview_img"
        loading="lazy"
        alt={article.title}
        src={article.image}
      />
      <div className="article_preview_texts_container">
        <h2 className="article_preview_title">{article.title}</h2>
        <h3 className="article_preview_date">{article.date}</h3>
        {/* optional preamble, will render on small mobile screens only */}
        {/* This will not appear/disappear when window is being resized, but its fine here */}
        {window.matchMedia(`all and (max-width: 576px)`).matches ? null : (
          <p className="article_preview_preamble">{article.preamble}</p>
        )}
      </div>
    </div>
  );
};

export default ArticlePreview;
