import { Component, input } from '@angular/core';
import { Article } from '../../model/article.model';
import { ArticleMeta } from '../article-meta/article-meta';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'article-preview',
  standalone: true,
  imports: [ArticleMeta, RouterLink],
  templateUrl: './article-preview.html',
  styleUrl: './article-preview.css',
})
export class ArticlePreview {
  article = input<Article | undefined>();
}
