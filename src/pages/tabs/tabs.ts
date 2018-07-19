import { Component } from '@angular/core';

import { ChoresPage } from '../chores/chores';
import { RemindersPage } from '../reminders/reminders';
import { GroceriesPage } from '../groceries/groceries';
import { MorePage } from '../more/more';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ChoresPage;
  tab2Root = RemindersPage;
  tab3Root = GroceriesPage;
  tab4Root = MorePage;

  constructor() {

  }
}
