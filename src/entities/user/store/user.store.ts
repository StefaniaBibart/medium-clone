import {
  patchState,
  signalStore,
  withMethods,
  withState,
  withComputed,
} from '@ngrx/signals';
import { computed, effect, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

import { User } from '../model/user.model';

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: Record<string, string[]> | null;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isAuthenticated: computed(() => store.currentUser() !== null),
    token: computed(() => store.currentUser()?.token),
    username: computed(() => store.currentUser()?.username),
  })),
  withMethods((store) => {
    const TOKEN_KEY = 'jwtToken';

    effect(() => {
      const token = store.token();
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      }
    });

    const tokenSignal = signal<string | undefined>(undefined);

    return {
      setCurrentUser(user: User) {
        patchState(store, { currentUser: user, isLoading: false, error: null });
      },
      setLoading(loading: boolean) {
        patchState(store, { isLoading: loading });
      },
      setError(error: Record<string, string[]> | null) {
        patchState(store, { error, isLoading: false });
      },
      clearError() {
        patchState(store, { error: null });
      },
      logout() {
        patchState(store, { currentUser: null, isLoading: false, error: null });
        localStorage.removeItem(TOKEN_KEY);
        tokenSignal.set(undefined);
      },
      loadUser() {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
          patchState(store, {
            currentUser: null,
            isLoading: false,
            error: null,
          });
          return;
        }

        const decodedToken: {
          id: string;
          username: string;
          admin: boolean;
        } = jwtDecode(token);

        const user: User = {
          token,
          username: decodedToken.username,
          admin: decodedToken.admin,
        };

        patchState(store, {
          currentUser: user,
          isLoading: false,
          error: null,
        });

        tokenSignal.set(token);
      },
    };
  }),
);
