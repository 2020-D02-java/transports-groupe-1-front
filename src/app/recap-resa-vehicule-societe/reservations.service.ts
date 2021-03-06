import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { Reservation } from './reservation.domains';
import { environment } from 'src/environments/environment';
import { ReservationServeur } from './reservationServeur.domains';

const URL_BACKEND = environment.baseUrl + 'reservation/';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  /** Subject contenant les reservations de véhicule de société d'un collègue */
  private subjectReservation = new Subject<Reservation[]>();

  constructor(private http: HttpClient) { }

  /** Effectue une requete pour obtenir la liste des réservations (en cours) de véhicule de société
   * d'un collegue en fonction de son email
   */
  requestGetReservationsEnCours(): Observable<ReservationServeur[]>{
    return this.http.get<ReservationServeur[]>(`${URL_BACKEND}current`);
  }

  /** Effectue une requete pour obtenir la liste des réservations (passées) de véhicule de société
   * d'un collegue en fonction de son email
   */
  requestGetReservationsHisto(): Observable<ReservationServeur[]> {
    return this.http.get<ReservationServeur[]>(`${URL_BACKEND}histo`);
  }

}
