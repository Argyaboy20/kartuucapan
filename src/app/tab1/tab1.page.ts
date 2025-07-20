import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  hearts: number[] = [];

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    // Create arrays for generating multiple elements
    this.hearts = Array(20).fill(0).map((_, i) => i);
  }

  goToTab2() {
    this.navCtrl.navigateForward('/confirmation');
  }
}