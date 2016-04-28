import { request as superagent } from './superagent';
import * as Json from './json';

export function getEventApi(configuration: EventApiConfiguration): EventApi {
  function request<TResult>(resource: string, dateRange: DateRange, transformer: (jsonObject: any) => TResult): Promise<TResult> {
    let baseRequest = superagent.get(`${configuration.endpoint}/${resource}`)
      .auth(configuration.username, configuration.password)
      .accept('application/json')
      .query({ Guid: configuration.eventId });

    if (dateRange) {
      baseRequest = baseRequest.query({ Alkupvm: dateRange.startDate, Loppupvm: dateRange.endDate });
    }

    return baseRequest
      .then((response: any) => {
        if (!response.ok) {
          throw new Error('The request failed');
        }
        return response;
      })
      .then((response: any) => transformer(response.body));
  }

  function createRequestFunc<TResult>(resource: string, transformer: (jsonObject: any) => TResult): (dateRange?: DateRange) => Promise<TResult> {
    return (dateRange?: DateRange) => request(resource, dateRange, transformer);
  }

  function createCollectionRequestFunc<TSingleResult>(resource: string, transformer: (jsonObject: any) => TSingleResult): (dateRange?: DateRange) => Promise<Array<TSingleResult>> {
    return createRequestFunc<Array<TSingleResult>>(resource, (result: any) => result.map(transformer));
  }

  return {
    getEventInfo: createRequestFunc<EventInfo>('Tapahtuma', mapEventInfo),
    getSubCamps: createCollectionRequestFunc<SubCamp>('TapahtumaAlaleirit', mapSubCamp),
    getVillages: createCollectionRequestFunc<Village>('TapahtumaKylat', mapVillage),
    getQuestionSeries: createCollectionRequestFunc<QuestionSeries>('TapahtumaKysymyssarjat', mapQuestionSeries),
    getExtraInfoFields: createCollectionRequestFunc<ExtraInfoField>('TapahtumaLisatietokentat', mapExtraInfoField),
    getExtraSelectionGroups: createCollectionRequestFunc<ExtraSelectionGroup>('TapahtumaLisavalinnanPaaryhmat', mapExtraSelectionGroup),
    getExtraSelections: createCollectionRequestFunc<ExtraSelection>('TapahtumaLisavalinnat', mapExtraSelection),
    getPaymentGroups: createCollectionRequestFunc<PaymentGroup>('TapahtumaMaksunPaaryhmat', mapPaymentGroup),
    getPayments: createCollectionRequestFunc<Payment>('TapahtumaMaksut', mapPayment),
    getCampGroups: createCollectionRequestFunc<CampGroup>('Leirilippukunnat', mapCampGroup),
    getCampGroupExtraInfos: createCollectionRequestFunc<ExtraInfo<CampGroup>>('LeirilippukunnatLisatietokentat', mapCampGroupExtraInfo),
    getCampGroupExtraSelections: createCollectionRequestFunc<IdMapping<CampGroup, ExtraSelection>>('LeirilippukunnatLisavalinnat', mapCampGroupExtraSelection),
    getCampGroupPayments: createCollectionRequestFunc<IdMapping<CampGroup, Payment>>('LeirilippukunnatMaksut', mapCampGroupPayment),
    getParticipants: createCollectionRequestFunc<Participant>('Osallistujat', mapParticipant),
    getParticipantExtraInfos: createCollectionRequestFunc<ExtraInfo<Participant>>('OsallistujatLisatietokentat', mapParticipantExtraInfo),
    getParticipantExtraSelections: createCollectionRequestFunc<IdMapping<Participant, ExtraSelection>>('OsallistujatLisavalinnat', mapParticipantExtraSelection),
    getParticipantPayments: createCollectionRequestFunc<IdMapping<Participant, Payment>>('OsallistujatMaksut', mapParticipantPayment),
    getGroups: createCollectionRequestFunc<Group>('Ryhmat', mapGroup),
    getGroupExtraInfos: createCollectionRequestFunc<ExtraInfo<Group>>('RyhmatLisatietokentat', mapGroupExtraInfo),
    getGroupExtraSelections: createCollectionRequestFunc<IdMapping<Group, ExtraSelection>>('RyhmatLisavalinnat', mapGroupExtraSelection),
    getGroupPayments: createCollectionRequestFunc<IdMapping<Group, Payment>>('RyhmatMaksut', mapGroupPayment),
  };
}

function getName(jsonObject: Json.LokalisoidullaNimella): LocalizedString {
  return {
    fi: jsonObject.Nimi,
    se: jsonObject.NimiSE,
    en: jsonObject.NimiEN,
  };
}

function mapEventInfo(result: Json.TapahtumaTiedot) {
  return {
    startDate: new Date(result.Alkupvm),
    endDate: new Date(result.Loppupvm),
    name: getName(result),
  };
}

function mapSubCamp(result: Json.TapahtumaAlaleiri) {
  return {
    id: result.Id,
    name: result.Nimi,
  };
}

function mapVillage(result: Json.TapahtumaKyla) {
  return {
    id: result.Id,
    subCamp: result.AlaleiriId,
    name: result.Nimi,
  };
}

function mapQuestionSeries(result: Json.TapahtumaKysymyssarja) {
  return {
    id: result.Id,
    name: getName(result),
  };
}

function mapExtraInfoField(result: Json.TapahtumaLisatietokentta) {
  return {
    id: result.Id,
    questionSeries: result.KysymyssarjaId,
    name: getName(result),
  };
}

function mapExtraSelectionGroup(result: Json.TapahtumaLisavalinnanPaaryhma) {
  return {
    id: result.Id,
    questionSeries: result.KysymyssarjaId,
    name: getName(result),
  };
}

function mapExtraSelection(result: Json.TapahtumaLisavalinta) {
  return {
    id: result.Id,
    extraSelectionGroup: result.PaaryhmaId,
    name: getName(result),
  };
}

function mapPaymentGroup(result: Json.TapahtumaMaksunPaaryhma) {
  return {
    id: result.Id,
    name: getName(result),
  };
}

function mapPayment(result: Json.TapahtumaMaksu) {
  return {
    id: result.Id,
    paymentGroup: result.PaaryhmaId,
    name: getName(result),
  };
}

function mapCampGroup(result: Json.Leirilippukunta) {
  return {
    id: result.Id,
    subCamp: result.AlaleiriId,
    village: result.KylaId,
    name: result.Nimi,
  };
}

function mapCampGroupExtraInfo(result: Json.LeirilippukuntaLisatietokentta) {
  return {
    for: result.LeirilippukuntaId,
    extraInfoField: result.LisatietokenttaId,
    value: result.Lisatiedot,
  };
}

function mapCampGroupExtraSelection(result: Json.LeirilippukuntaLisavalinta) {
  return {
    from: result.LeirilippukuntaId,
    to: result.LisavalintaId,
  };
}

function mapCampGroupPayment(result: Json.LeirilippukuntaMaksu) {
  return {
    from: result.LeirilippukuntaId,
    to: result.MaksuId,
  };
}

function mapParticipant(result: Json.Osallistuja) {
  return {
    id: result.Id,
    firstName: result.Etunimi,
    lastName: result.Sukunimi,
    address: {
      street: result.Katuosoite,
      postCode: result.Postinumero,
      postOffice: result.Postitoimipaikka,
      country: result.Postimaa,
      extra: result.Lisaosoite,
    },
    phoneNumber: result.Puhelinnumero,
    email: result.Email,
    diet: result.Erityisruokavalio,
    birthDate: new Date(result.Syntymaaika),
    age: result.Ika,
    signUpDate: new Date(result.Ilmoittautumispvm),
    representedParty: result.TahoJotaEdustaa,
    districtOfOrganization: result.EdustusorganisaationPiiri,
    accommodation: result.Majoittuminen,
    accommodationWithLocalGroup: result.MajoittuuLippukunnassa,
    accommodationExtraInfo: result.MajoittumisenLisatiedot,
    guardian: {
      name: result.HuoltajanNimi,
      phoneNumber: result.HuoltajanPuhelinnumero,
      email: result.HuoltajanEmail,
    },
    group: result.RyhmaId,
    subCamp: result.AlaleiriId,
    campGroup: result.LeirilippukuntaId,
    cancelled: result.Perunut,
  };
}

function mapParticipantExtraInfo(result: Json.OsallistujaLisatietokentta) {
  return {
    for: result.OsallistujaId,
    extraInfoField: result.LisatietokenttaId,
    value: result.Lisatiedot,
  };
}

function mapParticipantExtraSelection(result: Json.OsallistujaLisavalinta) {
  return {
    from: result.OsallistujaId,
    to: result.LisavalintaId,
  };
}

function mapParticipantPayment(result: Json.OsallistujaMaksu) {
  return {
    from: result.OsallistujaId,
    to: result. MaksuId,
  };
}

function mapGroup(result: Json.Ryhma) {
  return {
    id: result.Id,
    subCamp: result.AlaleiriId,
    village: result.KylaId,
    campGroup: result.LeirilippukuntaId,
    name: result.Nimi,
    scoutOrganization: result.Partiojarjesto,
    locality: result.Paikkakunta,
    country: result.Maa,
    countryCode: result.Maakoodi,
  };
}

function mapGroupExtraInfo(result: Json.RyhmaLisatietokentta) {
  return {
    for: result.RyhmaId,
    extraInfoField: result.LisatietokenttaId,
    value: result.Lisatiedot,
  };
}

function mapGroupExtraSelection(result: Json.RyhmaLisavalinta) {
  return {
    from: result.RyhmaId,
    to: result.LisavalintaId,
  };
}

function mapGroupPayment(result: Json.RyhmaMaksu) {
  return {
    from: result.RyhmaId,
    to: result. MaksuId,
  };
}

export interface EventApiConfiguration {
  endpoint: string;
  eventId: string;
  username: string;
  password: string;
}

export type Promise<TResult> = any

export interface EventApi {
  getEventInfo(dateRange?: DateRange): Promise<EventInfo>;
  getSubCamps(dateRange?: DateRange): Promise<Array<SubCamp>>;
  getVillages(dateRange?: DateRange): Promise<Array<Village>>;
  getQuestionSeries(dateRange?: DateRange): Promise<Array<QuestionSeries>>;
  getExtraInfoFields(dateRange?: DateRange): Promise<Array<ExtraInfoField>>;
  getExtraSelectionGroups(dateRange?: DateRange): Promise<Array<ExtraSelectionGroup>>;
  getExtraSelections(dateRange?: DateRange): Promise<Array<ExtraSelection>>;
  getPaymentGroups(dateRange?: DateRange): Promise<Array<PaymentGroup>>;
  getPayments(dateRange?: DateRange): Promise<Array<Payment>>;
  getCampGroups(dateRange?: DateRange): Promise<Array<CampGroup>>;
  getCampGroupExtraInfos(dateRange?: DateRange): Promise<Array<ExtraInfo<CampGroup>>>;
  getCampGroupExtraSelections(dateRange?: DateRange): Promise<Array<IdMapping<CampGroup, ExtraSelection>>>;
  getCampGroupPayments(dateRange?: DateRange): Promise<Array<IdMapping<CampGroup, Payment>>>;
  getParticipants(dateRange?: DateRange): Promise<Array<Participant>>;
  getParticipantExtraInfos(dateRange?: DateRange): Promise<Array<ExtraInfo<Participant>>>;
  getParticipantExtraSelections(dateRange?: DateRange): Promise<Array<IdMapping<Participant, ExtraSelection>>>
  getParticipantPayments(dateRange?: DateRange): Promise<Array<IdMapping<Participant, Payment>>>;
  getGroups(dateRange?: DateRange): Promise<Array<Group>>;
  getGroupExtraInfos(dateRange?: DateRange): Promise<Array<ExtraInfo<Group>>>;
  getGroupExtraSelections(dateRange?: DateRange): Promise<Array<IdMapping<Group, ExtraSelection>>>
  getGroupPayments(dateRange?: DateRange): Promise<Array<IdMapping<Group, Payment>>>;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export type Id<T> = number;

export interface IdMapping<From, To> {
  from: Id<From>;
  to: Id<To>;
}

export interface EventInfo {
  name: LocalizedString;
  startDate: Date;
  endDate: Date;
}

export interface LocalizedString {
  fi: string;
  se: string;
  en: string;
}

export interface SubCamp {
  id: Id<SubCamp>;
  name: string;
}

export interface Village {
  id: Id<Village>;
  subCamp: Id<SubCamp>;
}

export interface QuestionSeries {
  id: Id<QuestionSeries>;
  name: LocalizedString;
}

export interface ExtraInfoField {
  id: Id<ExtraInfoField>;
  questionSeries: Id<QuestionSeries>;
  name: LocalizedString;
}

export interface ExtraSelectionGroup {
  id: Id<ExtraSelectionGroup>;
  questionSeries: Id<QuestionSeries>;
  name: LocalizedString;
}

export interface ExtraSelection {
  id: Id<ExtraSelection>;
  extraSelectionGroup: Id<ExtraSelectionGroup>;
  name: LocalizedString;
}

export interface PaymentGroup {
  id: Id<PaymentGroup>;
  name: LocalizedString;
}

export interface Payment {
  id: Id<Payment>;
  paymentGroup: Id<PaymentGroup>;
  name: LocalizedString;
}

export interface CampGroup {
  id: Id<CampGroup>;
  subCamp: Id<SubCamp>;
  village: Id<Village>;
  name: string;
}

export interface Participant {
  id: Id<Participant>;
  firstName: string;
  lastName: string;
  address: Address;
  phoneNumber: string;
  email: string;
  diet: string;
  birthDate: Date;
  age: number;
  signUpDate: Date;
  representedParty: string;
  districtOfOrganization: string;
  accommodation: string;
  accommodationWithLocalGroup: string;
  accommodationExtraInfo: string;
  guardian: Guardian;
  group: Id<Group>;
  subCamp: Id<SubCamp>;
  campGroup: Id<CampGroup>;
  cancelled: boolean;
}

export interface Address {
  street: string;
  postCode: string;
  postOffice: string;
  country: string;
  extra: string;
}

export interface Guardian {
  name: string;
  phoneNumber: string;
  email: string;
}

export interface Group {
  id: Id<Group>;
  subCamp: Id<SubCamp>;
  village: Id<Village>;
  campGroup: Id<CampGroup>;
  name: string;
  scoutOrganization: string;
  locality: string;
  country: string;
  countryCode: string;
}

export interface ExtraInfo<For> {
  for: Id<For>;
  extraInfoField: Id<ExtraInfoField>;
  value: string;
}
