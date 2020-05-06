import { Collegue } from '../auth/auth.domains';

export default interface CovoitAnnonce {
  id?: number;
  itineraire?: {
    dateDepart?: string;
    dateArrivee?: string;
    lieuDepart?: string;
    lieuDestination?: string;
    dureeTrajet?: number;
    distance?: number
  };
  responceble?: {
    id?: number;
    nom?: string;
    prenom?: string;
    email?: string;
    motDePasse?: string;
    numTelephone?: string;
    roles: {
      id?: number;
      role?: string;
    }
  };
  listPassagers?: Collegue[];
  immatriculation?: string;
  marque?: string;
  modele?: string;
  nbPlace?: number;

}