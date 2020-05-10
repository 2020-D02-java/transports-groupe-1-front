import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { faCalendarAlt, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { GetVehiculeService } from './service/get-vehicule.service';
import { Vechicule } from './domains/vehiculeSociete.domains';
import { timeInterval } from 'rxjs/operators';
import { Periode } from './domains/periode.domains';
import { DisponibiliteVehicule } from './domains/disponibiliteVehicule.domains';

@Component({
  selector: 'app-reserver-vehicule-societe',
  templateUrl: './reserver-vehicule-societe.component.html',
  styleUrls: ['./reserver-vehicule-societe.component.scss']
})
export class ReserverVehiculeSocieteComponent implements OnInit {

  // dateTime
  dateTimeDepart: {
    date: NgbDateStruct;
    time: NgbTimeStruct;
  };

  dateTimeArivee: {
    date: NgbDateStruct;
    time: NgbTimeStruct;
  };

  // timepicker
  hourStep = 1;
  minuteStep = 10;

  // fontawesome
  faCalendarAlt = faCalendarAlt;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  // vehicules
  vehicules: Vechicule[];
  indexVehiculeCourant = 0;
  dispoVehicules: Map<number, boolean> = new Map();

  // verification
  periodeValide = false;
  dateDepartValide = false;
  dateAriveeValide = false;

  constructor(private vehiculeService: GetVehiculeService) { }

  /** Recuperation de tous les véhicules */
  public getAllVehicule() {
    this.vehiculeService.getAllVehicule().subscribe(
      vehiculesServeur => this.vehicules = vehiculesServeur.map(vehiculeServeur => new Vechicule(vehiculeServeur)),
      error => console.log('Oups'), // TODO gestion via alert
    );
  }

  /** Recuperation des disponibilités de tous les véhicules */
  public getAllDispo(dTDepart: { date: NgbDateStruct; time: NgbTimeStruct }, dTArivee: { date: NgbDateStruct; time: NgbTimeStruct }) {

    const periode = new Periode(dTDepart, dTArivee);

    this.vehiculeService.getDispoAllVehicules(periode).subscribe(
      disposServeurs => {
        for (const dispo of disposServeurs) {
          this.dispoVehicules.set(dispo.id, dispo.disponibilite);
        }
      },
      error => console.log('Oups'), // TODO gestion via alert
    );
  }

  /** Affichage du véhicule suivant */
  public nextVehicule() {
    if (this.indexVehiculeCourant + 1 >= this.vehicules.length) {
      this.indexVehiculeCourant = 0;
    } else {
      this.indexVehiculeCourant++;
    }
  }

  /** Affichage du véhicule précédent */
  public prevVehicule() {
    if (this.indexVehiculeCourant - 1 < 0) {
      this.indexVehiculeCourant = this.vehicules.length - 1;
    } else {
      this.indexVehiculeCourant--;
    }
  }

  /** Indique si une date/heure est postérieure à la date/heure actuelle */
  private validerDateTime(dateTime: { date: NgbDateStruct; time: NgbTimeStruct }) {

    return dateTime != null
      && new Date() < new Date(dateTime.date.year, dateTime.date.month - 1, dateTime.date.day, dateTime.time.hour, dateTime.time.minute);
  }

  /** Indique si une date/heure de retour est postérieure à une date/heure de départ */
  private apresDateTimeDepart(dTDepart: { date: NgbDateStruct; time: NgbTimeStruct },
                              dTArivee: { date: NgbDateStruct; time: NgbTimeStruct }) {

    return dTDepart != null && dTArivee != null
      && new Date(dTDepart.date.year, dTDepart.date.month - 1, dTDepart.date.day, dTDepart.time.hour, dTDepart.time.minute)
      < new Date(dTArivee.date.year, dTArivee.date.month - 1, dTArivee.date.day, dTArivee.time.hour, dTArivee.time.minute);
  }

  /** Vérifie que la période est valide et lance la rechercher de disponibilité */
  public validerPeriode(dTDepart: { date: NgbDateStruct; time: NgbTimeStruct },
                        dTArivee: { date: NgbDateStruct; time: NgbTimeStruct }) {

    this.dateDepartValide = this.validerDateTime(dTDepart);
    this.dateAriveeValide = this.apresDateTimeDepart(dTDepart, dTArivee);
    this.periodeValide = this.dateDepartValide && this.dateAriveeValide;

    if (this.periodeValide) {
      this.getAllDispo(dTDepart, dTArivee);
    }

  }

  ngOnInit(): void {
    // time picker initialisation
    this.dateTimeDepart = { date: { year: 0, month: 1, day: 1 }, time: { hour: 12, minute: 0, second: 0 } };
    this.dateTimeArivee = { date: { year: 0, month: 1, day: 1 }, time: { hour: 12, minute: 0, second: 0 } };

    this.getAllVehicule();
  }

}
