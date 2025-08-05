import { Injectable, signal, linkedSignal, inject } from '@angular/core';
import { Articles } from '../model/articles.model';
import { httpResource } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserStore } from '../../user/store/user.store';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private apiUrl = environment.apiUrl;
  private store = inject(UserStore);

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
}
