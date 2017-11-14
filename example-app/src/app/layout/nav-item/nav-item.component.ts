import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ngf-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavItemComponent {
  @Input() hint = '';
  @Input() routerLink: string | any[] = '/';
}
