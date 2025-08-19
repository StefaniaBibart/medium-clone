import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { UserStore } from '../../entities/user/store/user.store';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userStore = inject(UserStore);
  const token = userStore.token();

  const isApiRequest = !req.url.startsWith('http');

  if (isApiRequest) {
    req = req.clone({
      url: `${environment.apiUrl}${req.url}`,
    });
  }

  if (token && isApiRequest) {
    req = req.clone({
      setHeaders: {
        Authorization: `Token ${token}`,
      },
    });
  }

  return next(req);
};
