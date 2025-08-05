import { Component, input } from '@angular/core';
import { Article } from '../../model/article.model';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'article-meta',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './article-meta.html',
  styleUrls: ['./article-meta.css'],
})
export class ArticleMeta {
  article = input<Article | undefined>();
}
