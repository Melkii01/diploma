import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import {MainComponent} from "./main.component";
import {CarouselComponent} from "./carousel/carousel.component";
import {InfoComponent} from "./info/info.component";
import {ServicesComponent} from "./services/services.component";
import {SharedModule} from "../../shared/shared.module";
import {CarouselModule} from "primeng/carousel";


@NgModule({
  declarations: [
    MainComponent,
    CarouselComponent,
    InfoComponent,
    ServicesComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,

    SharedModule,
    CarouselModule,
  ]
})
export class MainModule { }
