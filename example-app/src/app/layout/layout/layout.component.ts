import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ngf-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent { }
