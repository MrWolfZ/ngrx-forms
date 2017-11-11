import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ngf-layout',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent { }
