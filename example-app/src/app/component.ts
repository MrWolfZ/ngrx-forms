import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ngf-app',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent { }
