import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ngf-sidenav',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent { }
