export interface Leirilippukunta {
  Id: number;
  AlaleiriId: number;
  KylaId: number;
  Nimi: string;
}

export interface LeirilippukuntaLisatietokentta {
  LeirilippukuntaId: number;
  LisatietokenttaId: number;
  Lisatiedot: string;
}

export interface LeirilippukuntaLisavalinta {
  LeirilippukuntaId: number;
  LisavalintaId: number;
}

export interface LeirilippukuntaMaksu {
  LeirilippukuntaId: number;
  MaksuId: number;
}

export interface Osallistuja {
  Id: number;
  Jasennro: string;
  Etunimi: string;
  Sukunimi: string;
  Partionimi: string;
  Lisaosoite: string;
  Katuosoite: string;
  Postinumero: string;
  Postitoimipaikka: string;
  Postimaa: string;
  Puhelinnumero: string;
  Email: string;
  Erityisruokavalio: string;
  Syntymaaika: string;
  Ika: number;
  Ilmoittautumispvm: string;
  TahoJotaEdustaa: string;
  EdustusorganisaationPiiri: string;
  Majoittuminen: string;
  MajoittuuLippukunnassa: string;
  MajoittumisenLisatiedot: string;
  HuoltajanNimi: string;
  HuoltajanPuhelinnumero: string;
  HuoltajanEmail: string;
  RyhmaId: number;
  AlaleiriId: number;
  KylaId: number;
  LeirilippukuntaId: number;
  Perunut: boolean;
}

export interface OsallistujaLisatietokentta {
  OsallistujaId: number;
  LisatietokenttaId: number;
  Lisatiedot: string;
}

export interface OsallistujaLisavalinta {
  OsallistujaId: number;
  LisavalintaId: number;
}

export interface OsallistujaMaksu {
  OsallistujaId: number;
  MaksuId: number;
}

export interface OsallistujatMaksunTila {
  OsallistuminenId: number;
  TilaisuusId: number;
  Laskutettu: string;
  Maksettu: string;
}

export interface Ryhma {
  Id: number;
  AlaleiriId: number;
  KylaId: number;
  LeirilippukuntaId: number;
  Nimi: string;
  Partiojarjesto: string;
  Paikkakunta: string;
  Maa: string;
  Maakoodi: string;
}

export interface RyhmaLisatietokentta {
  RyhmaId: number;
  LisatietokenttaId: number;
  Lisatiedot: string;
}

export interface RyhmaLisavalinta {
  RyhmaId: number;
  LisavalintaId: number;
}

export interface RyhmaMaksu {
  RyhmaId: number;
  MaksuId: number;
}

export interface TapahtumaTiedot extends LokalisoidullaNimella {
  Alkupvm: string;
  Loppupvm: string;
}

export interface TapahtumaAlaleiri {
  Id: number;
  Nimi: string;
}

export interface TapahtumaKyla {
  Id: number;
  AlaleiriId: number;
  Nimi: string;
}

export interface TapahtumaKysymyssarja extends LokalisoidullaNimella {
  Id: number;
}

export interface TapahtumaLisatietokentta extends LokalisoidullaNimella {
  Id: number;
  KysymyssarjaId: number;
}

export interface TapahtumaLisavalinnanPaaryhma extends LokalisoidullaNimella {
  Id: number;
  KysymyssarjaId: number
}

export interface TapahtumaLisavalinta extends LokalisoidullaNimella {
  Id: number;
  PaaryhmaId: number;
}

export interface TapahtumaMaksunPaaryhma extends LokalisoidullaNimella {
  Id: number;
}

export interface TapahtumaMaksu extends LokalisoidullaNimella {
  Id: number;
  PaaryhmaId: number;
}

export interface LokalisoidullaNimella {
  Nimi: string;
  NimiSE: string;
  NimiEN: string;
}
