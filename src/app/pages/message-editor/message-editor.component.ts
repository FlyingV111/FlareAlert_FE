import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {LucideAngularModule} from 'lucide-angular';
import {TemplateService} from '../../services/templateService/template.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CreateTemplate, NotificationTemplate} from '../../models/CreateTemplate';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbHighlight, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {UserSearchResult} from '../../models/User';
import {debounceTime, distinctUntilChanged, map, Observable, OperatorFunction, switchMap} from 'rxjs';
import {UserService} from '../../services/user-service/user.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-email-editor',
  imports: [
    LucideAngularModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTypeahead,
    NgbHighlight,
    NgForOf
  ],
  templateUrl: './message-editor.component.html',
  styleUrl: './message-editor.component.css'
})
export class MessageEditorComponent implements OnInit {
  protected currentTemplate = signal<NotificationTemplate | null>(null)
  protected assignedUsers: UserSearchResult[] = [];
  private templateService = inject(TemplateService)
  private userService = inject(UserService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  protected templateForm: FormGroup
  protected userSearchResult: UserSearchResult | null = null
  protected formatter = (user: UserSearchResult) => {
    if (this.userSearchResult) {
      const searchTerm = this.userSearchResult?.username || this.userSearchResult?.email || '';
      if (searchTerm.includes('@')) {
        return user.email.toLowerCase().includes(searchTerm.toLowerCase()) ? user.email : searchTerm;
      } else {
        return user.username.toLowerCase().includes(searchTerm.toLowerCase()) ? user.username : searchTerm;
      }
    }
    return '';
  };
  protected invalidUser: string | null | UserSearchResult = null;

  constructor() {
    this.templateForm = new FormGroup({
      templateName: new FormControl('', Validators.required),
      templateContent: new FormControl('')
    })

    effect(() => {
      this.currentTemplate = this.templateService.currentTemplate
      this.assignedUsers = this.currentTemplate()?.assignedUsers || [];
      this.templateForm.get('templateName')?.setValue(this.currentTemplate()?.templateName);
      this.templateForm.get('templateContent')?.setValue(this.currentTemplate()?.templateContent);
    });
  }

  ngOnInit(): void {
    this.getTemplate()
  }

  get isTemplateNameValid(): boolean {
    return this.templateForm.get('templateName')?.valid ?? false;
  }

  get isAddUserDisabled(): boolean {
    return !this.userSearchResult && (!this.invalidUser || (typeof this.invalidUser === 'string' && !this.invalidUser.includes('@')));
  }

  protected searchUsers: OperatorFunction<string, readonly UserSearchResult[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term) {
          return [];
        }
        const isEmailSearch = term.includes('@');
        return this.userService.searchUsers(term).pipe(
          map(users => users.filter(user =>
            isEmailSearch
              ? user.email.toLowerCase().includes(term.toLowerCase()) // Suche nach E-Mail
              : user.username.toLowerCase().includes(term.toLowerCase()) // Suche nach Benutzername
          ))
        );
      })
    );

  protected addUser(): void {
    if (this.userSearchResult?.username || this.userSearchResult?.email) {
      const user = this.userSearchResult;
      if (!this.assignedUsers.includes(user)) {
        this.assignedUsers.push(user);
      }
      this.userSearchResult = null;
    } else if (typeof this.invalidUser === 'string' && this.invalidUser.includes('@')) {
      if (!this.assignedUsers.some(u => u.email === this.invalidUser)) {
        this.assignedUsers.push({username: 'anonymous', email: this.invalidUser});
      }
      this.userSearchResult = null;
      this.invalidUser = null;
    }
  }

  protected removeUserFromAssigned(user: UserSearchResult): void {
    this.assignedUsers = this.assignedUsers.filter(u => u !== user);
  }

  protected getTemplate() {
    const templateName = this.route.snapshot.queryParamMap.get('templateName');
    if (templateName) {
      this.templateService.getTemplate(templateName);
    }
  }

  protected saveTemplate() {
    if (this.templateForm.valid) {
      const formData: CreateTemplate = this.templateForm.value;
      formData.assignedUsers = this.assignedUsers;
      this.templateService.saveTemplate(formData)
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {templateName: formData.templateName},
        queryParamsHandling: 'merge'
      }).then()
    }
  }
}
