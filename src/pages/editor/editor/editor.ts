import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ArticleService } from '../../../entities/article/api/article.service';
import { NewArticle } from '../../../entities/article/model/article.model';
import { UserStore } from '../../../entities/user/store/user.store';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface ArticleError {
  error?: {
    errors?: Record<string, string[]>;
    message?: string;
  };
}

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './editor.html',
  styleUrl: './editor.css',
})
export class Editor {
  private fb = inject(FormBuilder);
  private articleService = inject(ArticleService);
  private store = inject(UserStore);
  private router = inject(Router);

  articleForm = this.fb.group({
    title: [''],
    description: [''],
    body: [''],
    tagList: [''],
  });

  private _serverErrors = signal<string[]>([]);

  readonly serverErrors = this._serverErrors.asReadonly();
  readonly isLoading = this.store.isLoading;
  readonly authError = this.store.error;

  constructor() {
    effect(() => {
      const error = this.store.error();

      if (error) {
        const errorMessages = this.handleArticleError(
          error as unknown as ArticleError,
        );
        this._serverErrors.set(errorMessages);
      }
    });
  }

  private handleArticleError(error: ArticleError): string[] {
    const errorTypes = {
      hasFieldErrors: () => error.error?.errors !== undefined,
      hasMessageError: () => error.error?.message !== undefined,
    };

    const errorHandlers = {
      handleFieldErrors: () => {
        return Object.entries(error.error!.errors!).map(
          ([field, errors]) => `${field} ${errors}`,
        );
      },
      handleMessageError: () => {
        return [error.error!.message!];
      },
    };

    return errorTypes.hasFieldErrors()
      ? errorHandlers.handleFieldErrors()
      : errorTypes.hasMessageError()
        ? errorHandlers.handleMessageError()
        : [];
  }

  onSubmit(): void {
    if (this.isLoading()) return;

    this._serverErrors.set([]);

    const formValue = this.articleForm.value;
    const articleData: NewArticle = {
      title: formValue.title || '',
      description: formValue.description || '',
      body: formValue.body || '',
      tagList: formValue.tagList ? formValue.tagList.split(',') : [],
    };

    this.articleService.createArticle(articleData);
  }
}
