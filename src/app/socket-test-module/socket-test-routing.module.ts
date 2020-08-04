import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PrincipalViewComponent} from './princial-view/principal-view.component';

const routes: Routes = [
  { path: '', component: PrincipalViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocketTestRoutingModule { }
