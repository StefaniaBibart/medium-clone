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
  errors: string[];
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  errors: [],
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
        patchState(store, {
          currentUser: user,
          isLoading: false,
          errors: [],
        });
      },
      setLoading(loading: boolean) {
        patchState(store, { isLoading: loading });
      },
      setErrors(errors: string[]) {
        patchState(store, { errors, isLoading: false });
      },
      clearErrors() {
        patchState(store, { errors: [] });
      },
      logout() {
        patchState(store, {
          currentUser: null,
          isLoading: false,
          errors: [],
        });
        localStorage.removeItem(TOKEN_KEY);
      },
      loadUser(user: User | undefined) {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
          patchState(store, {
            currentUser: null,
            isLoading: false,
            errors: [],
          });
          return;
        }

        patchState(store, {
          currentUser: user,
          isLoading: false,
          errors: [],
        });
      },
    };
  }),
);
