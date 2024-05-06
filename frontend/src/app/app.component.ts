import { Component } from '@angular/core';
import {ErrorResponseService} from "./shared/services/error-response.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ErrorResponseService]
})
export class AppComponent {
  title = 'ITStorm';
}
