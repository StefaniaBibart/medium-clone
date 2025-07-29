import { Component, Input, Signal, inject, input, signal } from '@angular/core';
import { User } from '../../../user/model/user.model';
import { ArticleMeta } from '../article-meta/article-meta';

@Component({
  selector: 'article-preview',
  standalone: true,
  imports: [ArticleMeta],
  templateUrl: './article-preview.html',
  styleUrl: './article-preview.css',
})
export class ArticlePreview {
  username = input<string | undefined>(undefined);
  currentUser = input<User | null | undefined>(undefined);
}
