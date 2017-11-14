import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ngf-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntroductionPageComponent {}
