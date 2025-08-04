import {
  patchState,
  signalStore,
  withMethods,
  withState,
  withComputed,
} from '@ngrx/signals';
import { computed } from '@angular/core';

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
    token: computed(() => localStorage.getItem('jwtToken')),
    username: computed(() => store.currentUser()?.username),
  })),
  withMethods((store) => {
    const TOKEN_KEY = 'jwtToken';

    return {
      setCurrentUser(user: User) {
        localStorage.setItem(TOKEN_KEY, user.token);
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
      },
      loadUser(user: User | undefined) {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
          patchState(store, {
            currentUser: null,
            isLoading: false,
            error: null,
          });
          return;
        }

        patchState(store, {
          currentUser: user,
          isLoading: false,
          error: null,
        });
      },
    };
  }),
);
