import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FotoService } from 'src/app/services/foto/foto.service';
import { IonSlides } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { MotionService } from 'src/app/services/motion/motion.service';
import { DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';

@Component({
  selector: 'app-feas',
  templateUrl: './feas.page.html',
  styleUrls: ['./feas.page.scss'],
})
export class FeasPage implements OnInit, OnDestroy {
  @ViewChild('slideAux', null) slideAux: IonSlides;
  // tslint:disable: variable-name
  private _analizarMovimiento: Subscription = null;
  private _puedeMover: boolean;

  constructor(
    private _auth: AuthService,
    private _fotoServ: FotoService,
    private _motionServ: MotionService,
  ) { }

  ngOnInit() {
    this._puedeMover = true;

    this._analizarMovimiento = this._motionServ.inizializar().subscribe((acceleration: DeviceMotionAccelerationData) => {
      if (this._puedeMover) {
        if (acceleration.x > 8.0) {
          this._puedeMover = false;
          this.slideAux.slidePrev();
          setTimeout(() => {
            this._puedeMover = true;
          }, 1000);
        } else if (acceleration.x < -8.0) {
          this._puedeMover = false;
          this.slideAux.slideNext();
          setTimeout(() => {
            this._puedeMover = true;
          }, 1000);
        } else if (acceleration.x > -3.0 && acceleration.x < 3.0 && acceleration.y > 9.5) {
          this._motionServ.irHome();
        }
      }
    });
  }

  ngOnDestroy() {
    this._analizarMovimiento.unsubscribe();
  }
}
