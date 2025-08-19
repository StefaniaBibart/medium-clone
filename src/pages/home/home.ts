import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../entities/user/store/user.store';
import { ArticlePreview } from '../../entities/article/ui/article-preview/article-preview';
import { ArticleService } from '../../entities/article/api/article.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ArticlePreview],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private store = inject(UserStore);
  private articleService = inject(ArticleService);
  protected readonly articles = this.articleService.articlesResource;
  protected readonly articlesYourFeed =
    this.articleService.articlesResourceYourFeed;
  protected readonly isAuthenticated = this.store.isAuthenticated;
  protected readonly currentPage = signal(1);

  protected readonly pages = computed(() => {
    const articlesData = this.articles.value();
    if (!articlesData) {
      return [];
    }
    const pagesCount = Math.ceil(
      articlesData.articlesCount / this.articleService.limit(),
    );
    return Array.from({ length: pagesCount }, (_, i) => i + 1);
  });

  onPageChange(page: number) {
    this.currentPage.set(page);
    const offset = (page - 1) * this.articleService.limit();
    this.articleService.offset.set(offset);
  }

  protected readonly currentFeed = signal<'yourFeed' | 'globalFeed'>(
    'globalFeed',
  );

  onFeedChange(feed: 'yourFeed' | 'globalFeed') {
    this.currentFeed.set(feed);
  }
}
