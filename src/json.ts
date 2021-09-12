import * as R from 'runtypes'

export const Leirilippukunta = R.Record({
  Id: R.Number,
  AlaleiriId: R.Number.Or(R.Null),
  KylaId: R.Number.Or(R.Null),
  Nimi: R.String,
})
export type Leirilippukunta = R.Static<typeof Leirilippukunta>

export const LeirilippukuntaLisatietokentta = R.Record({
  LeirilippukuntaId: R.Number,
  LisatietokenttaId: R.Number,
  Lisatiedot: R.String,
})
export type LeirilippukuntaLisatietokentta = R.Static<
  typeof LeirilippukuntaLisatietokentta
>

export const LeirilippukuntaLisavalinta = R.Record({
  LeirilippukuntaId: R.Number,
  LisavalintaId: R.Number,
})
export type LeirilippukuntaLisavalinta = R.Static<
  typeof LeirilippukuntaLisavalinta
>

export const LeirilippukuntaMaksu = R.Record({
  LeirilippukuntaId: R.Number,
  MaksuId: R.Number,
})
export type LeirilippukuntaMaksu = R.Static<typeof LeirilippukuntaMaksu>

const isoDateRegex = /^(\d{4})-(\d{2})-(\d{2})$/
const isoDateTimeRegex = /^(\d{4})-(\d{2})-(\d{2}(T\d{2}:\d{2}:\d{2})?)$/

export const IsoDateString = R.String.withConstraint((x) =>
  isoDateRegex.test(x),
)
export const IsoDateTimeString = R.String.withConstraint((x) =>
  isoDateTimeRegex.test(x),
)

export const Osallistuja = R.Record({
  Id: R.Number,
  Jasennro: R.Number.Or(R.Null),
  Etunimi: R.String,
  Sukunimi: R.String,
  Partionimi: R.String.Or(R.Null),
  Lisaosoite: R.String.Or(R.Null),
  Katuosoite: R.String.Or(R.Null),
  Postinumero: R.String.Or(R.Null),
  Postitoimipaikka: R.String.Or(R.Null),
  Postimaa: R.String.Or(R.Null),
  Puhelinnumero: R.String.Or(R.Null),
  Email: R.String.Or(R.Null),
  Erityisruokavalio: R.String.Or(R.Null),
  Syntymaaika: IsoDateString.Or(IsoDateTimeString).Or(R.Null),
  Ika: R.Number.Or(R.Null),
  Ilmoittautumispvm: R.String,
  TahoJotaEdustaa: R.String.Or(R.Null),
  EdustusorganisaationPiiri: R.String.Or(R.Null),
  Majoittuminen: R.String.Or(R.Null),
  MajoittuuLippukunnassa: R.String.Or(R.Null),
  MajoittumisenLisatiedot: R.String.Or(R.Null),
  HuoltajanNimi: R.String.Or(R.Null),
  HuoltajanPuhelinnumero: R.String.Or(R.Null),
  HuoltajanEmail: R.String.Or(R.Null),
  RyhmaId: R.Number.Or(R.Null),
  AlaleiriId: R.Number.Or(R.Null),
  KylaId: R.Number.Or(R.Null),
  LeirilippukuntaId: R.Number.Or(R.Null),
  Perunut: R.Boolean,
})
export type Osallistuja = R.Static<typeof Osallistuja>

export const OsallistujaLisatietokentta = R.Record({
  OsallistujaId: R.Number,
  LisatietokenttaId: R.Number,
  Lisatiedot: R.String,
})
export type OsallistujaLisatietokentta = R.Static<
  typeof OsallistujaLisatietokentta
>

export const OsallistujaLisavalinta = R.Record({
  OsallistujaId: R.Number,
  LisavalintaId: R.Number,
})
export type OsallistujaLisavalinta = R.Static<typeof OsallistujaLisavalinta>

export const OsallistujaMaksu = R.Record({
  OsallistujaId: R.Number,
  MaksuId: R.Number,
})
export type OsallistujaMaksu = R.Static<typeof OsallistujaMaksu>

export const OsallistujatMaksunTila = R.Record({
  OsallistuminenId: R.Number,
  TilaisuusId: R.Number,
  Laskutettu: R.String.Or(R.Null),
  Maksettu: R.String.Or(R.Null),
})
export type OsallistujatMaksunTila = R.Static<typeof OsallistujatMaksunTila>

export const Ryhma = R.Record({
  Id: R.Number,
  AlaleiriId: R.Number.Or(R.Null),
  KylaId: R.Number.Or(R.Null),
  LeirilippukuntaId: R.Number.Or(R.Null),
  Nimi: R.String,
  Partiojarjesto: R.String,
  Paikkakunta: R.String,
  Maa: R.String,
  Maakoodi: R.String,
})
export type Ryhma = R.Static<typeof Ryhma>

export const RyhmaLisatietokentta = R.Record({
  RyhmaId: R.Number,
  LisatietokenttaId: R.Number,
  Lisatiedot: R.String,
})
export type RyhmaLisatietokentta = R.Static<typeof RyhmaLisatietokentta>

export const RyhmaLisavalinta = R.Record({
  RyhmaId: R.Number,
  LisavalintaId: R.Number,
})
export type RyhmaLisavalinta = R.Static<typeof RyhmaLisavalinta>

export const RyhmaMaksu = R.Record({
  RyhmaId: R.Number,
  MaksuId: R.Number,
})
export type RyhmaMaksu = R.Static<typeof RyhmaMaksu>

export const LokalisoidullaNimella = R.Record({
  Nimi: R.String,
  NimiSE: R.String.Or(R.Null),
  NimiEN: R.String.Or(R.Null),
})
export type LokalisoidullaNimella = R.Static<typeof LokalisoidullaNimella>

export const TapahtumaTiedot = LokalisoidullaNimella.And(
  R.Record({
    Alkupvm: R.String,
    Loppupvm: R.String,
  }),
)
export type TapahtumaTiedot = R.Static<typeof TapahtumaTiedot>

export const TapahtumaAlaleiri = R.Record({
  Id: R.Number,
  Nimi: R.String,
})
export type TapahtumaAlaleiri = R.Static<typeof TapahtumaAlaleiri>

export const TapahtumaKyla = R.Record({
  Id: R.Number,
  AlaleiriId: R.Number,
  Nimi: R.String,
})
export type TapahtumaKyla = R.Static<typeof TapahtumaKyla>

export const TapahtumaKysymyssarja = LokalisoidullaNimella.And(
  R.Record({
    Id: R.Number,
  }),
)
export type TapahtumaKysymyssarja = R.Static<typeof TapahtumaKysymyssarja>

export const TapahtumaLisatietokentta = LokalisoidullaNimella.And(
  R.Record({
    Id: R.Number,
    KysymyssarjaId: R.Number.Or(R.Null),
  }),
)
export type TapahtumaLisatietokentta = R.Static<typeof TapahtumaLisatietokentta>

export const TapahtumaLisavalinnanPaaryhma = LokalisoidullaNimella.And(
  R.Record({
    Id: R.Number,
    KysymyssarjaId: R.Number.Or(R.Null),
  }),
)
export type TapahtumaLisavalinnanPaaryhma = R.Static<
  typeof TapahtumaLisavalinnanPaaryhma
>

export const TapahtumaLisavalinta = LokalisoidullaNimella.And(
  R.Record({
    Id: R.Number,
    PaaryhmaId: R.Number,
  }),
)
export type TapahtumaLisavalinta = R.Static<typeof TapahtumaLisavalinta>

export const TapahtumaMaksunPaaryhma = LokalisoidullaNimella.And(
  R.Record({
    Id: R.Number,
  }),
)
export type TapahtumaMaksunPaaryhma = R.Static<typeof TapahtumaMaksunPaaryhma>

export const TapahtumaMaksu = LokalisoidullaNimella.And(
  R.Record({
    Id: R.Number,
    PaaryhmaId: R.Number,
  }),
)
export type TapahtumaMaksu = R.Static<typeof TapahtumaMaksu>
