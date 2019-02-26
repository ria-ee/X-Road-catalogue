import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MethodListComponent } from './method-list/method-list.component';
import { SubsystemComponent } from './subsystem/subsystem.component';

const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  { path: 'list', component: MethodListComponent },
  { path: 'subsystem/:id', component: SubsystemComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}