import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ngf-nav-item',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavItemComponent {
  @Input() hint = '';
  @Input() routerLink: string | any[] = '/';
}
