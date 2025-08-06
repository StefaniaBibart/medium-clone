import { Injectable, signal, linkedSignal, inject } from '@angular/core';
import { Articles } from '../model/articles.model';
import { httpResource, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserStore } from '../../user/store/user.store';
import { NewArticle } from '../model/article.model';
import { Article } from '../model/article.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private apiUrl = environment.apiUrl;
  private store = inject(UserStore);
  private http = inject(HttpClient);

  limit = signal(20);
  offset = signal(0);

  articlesResource = httpResource<Articles>(
    () =>
      `${this.apiUrl}/articles?limit=${this.limit()}&offset=${this.offset()}`,
  );

  articlesResourceYourFeed = httpResource<Articles>(() => {
    const token = this.store.token();
    if (!token) {
      return undefined;
    }
    return {
      url: `${this.apiUrl}/articles/feed?limit=${this.limit()}&offset=${this.offset()}`,
      headers: {
        Authorization: `Token ${token}`,
      },
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
    this.store.clearError();
    const token = this.store.token();
    const headers = {
      Authorization: `Token ${token}`,
    };
    this.http
      .post<{
        article: Article;
      }>(`${this.apiUrl}/articles`, { article: article }, { headers })
      .pipe(
        map((response) => {
          this.store.setLoading(false);
          return response.article;
        }),
      )
      .subscribe({
        next: (article) => {
          console.log('Article created:', article);
        },
        error: (httpErrorResponse) => {
          this.store.setLoading(false);
          this.store.setError(httpErrorResponse.error.errors);
        },
      });
  }
}
