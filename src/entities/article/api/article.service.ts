import { Injectable, signal, linkedSignal, inject } from '@angular/core';
import { Articles } from '../model/articles.model';
import { httpResource, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserStore } from '../../user/store/user.store';
import { NewArticle } from '../model/article.model';
import { Article } from '../model/article.model';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private store = inject(UserStore);
  private http = inject(HttpClient);

  public readonly limit = signal(20);
  public readonly offset = signal(0);

  public readonly articlesResource = httpResource<Articles>(
    () => `/articles?limit=${this.limit()}&offset=${this.offset()}`,
  );

  public readonly articlesResourceYourFeed = httpResource<Articles>(() => {
    const token = this.store.token();
    if (!token) {
      return undefined;
    }
    return {
      url: `/articles/feed?limit=${this.limit()}&offset=${this.offset()}`,
    };
  });

  // ???TODO: use linkedSignal to filter for a tag array or use endpoint
  // filteredArticles = linkedSignal(() => {
  //   const articles = this.articlesResource.value();
  //   if (!articles) {
  //     return [];
  //   }
  //   return articles.articles.filter((article) =>
  //     article.tagList.includes('angular'),
  //   );
  // });

  createArticle(article: NewArticle): void {
    this.store.setLoading(true);
    this.store.clearErrors();
    this.http
      .post<{
        article: Article;
      }>(`/articles`, { article: article })
      .pipe(
        map((response) => {
          return response.article;
        }),
        catchError((error) => {
          this.store.setErrors(error.error.errors.body);
          return of(null);
        }),
      )
      .subscribe({
        next: (article) => {
          if (article) {
            // TODO: redirect to article page
            console.log('Article created:', article);
          }
          this.store.setLoading(false);
        },
      });
  }
}
