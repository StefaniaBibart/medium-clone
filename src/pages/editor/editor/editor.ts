import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ArticleService } from '../../../entities/article/api/article.service';
import { NewArticle } from '../../../entities/article/model/article.model';
import { UserStore } from '../../../entities/user/store/user.store';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  private _errorMessages = signal<string[] | null>(null);
  readonly errorMessages = this._errorMessages.asReadonly();
  readonly isLoading = this.store.isLoading;
  readonly authError = this.store.error;

  constructor() {
    effect(() => {
      this._errorMessages.set(this.store.error()?.['body'] || null);
    });
  }

  onSubmit(): void {
    if (this.isLoading()) return;

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
