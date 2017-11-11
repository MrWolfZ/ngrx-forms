import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ngf-introduction',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntroductionPageComponent {}
