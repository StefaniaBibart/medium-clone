import { Routes } from '@angular/router';
import { Home } from '../pages/home/home';
import { Login } from '../pages/auth/login/login';
import { Register } from '../pages/auth/register/register';
import { Editor } from '../pages/editor/editor/editor';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'editor',
    component: Editor,
  },
];
