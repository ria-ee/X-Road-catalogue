import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubsystemListComponent } from './subsystem-list/subsystem-list.component';
import { SubsystemComponent } from './subsystem/subsystem.component';

const routes: Routes = [
  { path: '', component: SubsystemListComponent },
  { path: ':instance', component: SubsystemListComponent },
  { path: ':instance/:class/:member/:subsystem', component: SubsystemComponent },
  // Redirecting old catalogue app links
  { path: ':instance', redirectTo: '/:instance', pathMatch: 'prefix' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}