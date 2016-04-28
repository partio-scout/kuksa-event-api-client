import { request as superagent } from './superagent';

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

  function getName(jsonObject: any): LocalizedString {
    return {
      fi: jsonObject.Nimi,
      se: jsonObject.NimiSE,
      en: jsonObject.NimiEN,
    };
  }

  function createRequestFunc<TResult>(resource: string, transformer: (jsonObject: any) => TResult): (dateRange?: DateRange) => Promise<TResult> {
    return (dateRange?: DateRange) => request(resource, dateRange, transformer);
  }

  function createCollectionRequestFunc<TSingleResult>(resource: string, transformer: (jsonObject: any) => TSingleResult): (dateRange?: DateRange) => Promise<Array<TSingleResult>> {
    return createRequestFunc<Array<TSingleResult>>(resource, (result: any) => result.map(transformer));
  }

  return {
    getEventInfo: createRequestFunc<EventInfo>('Tapahtuma', (result: any) => ({ startDate: new Date(result.Alkupvm), endDate: new Date(result.Loppupvm), name: getName(result) })),
    getSubCamps: createCollectionRequestFunc<SubCamp>('TapahtumaAlaleirit', (result: any) => ({ id: result.Id, name: result.Name })),
    getVillages: createCollectionRequestFunc<Village>('TapahtumaKylat', (result: any) => ({ id: result.Id, subCamp: result.AlaleiriId, name: result.Nimi })),
    getQuestionSeries: createCollectionRequestFunc<QuestionSeries>('TapahtumaKysymyssarjat', (result: any) => ({ id: result.Id, name: getName(result) })),
    getExtraInfoFields: createCollectionRequestFunc<ExtraInfoField>('TapahtumaLisatietokentat', (result: any) => ({ id: result.Id, questionSeries: result.KysymyssarjaId, name: getName(result) })),
    getExtraSelectionGroups: createCollectionRequestFunc<ExtraSelectionGroup>('TapahtumaLisavalinnanPaaryhmat', (result: any) => ({ id: result.Id, questionSeries: result.KysymyssarjaId, name: getName(result) })),
    getExtraSelections: createCollectionRequestFunc<ExtraSelection>('TapahtumaLisavalinnat', (result: any) => ({ id: result.Id, extraSelectionGroup: result.PaaryhmaId, name: getName(result) })),
    getPaymentGroups: createCollectionRequestFunc<PaymentGroup>('TapahtumaMaksunPaaryhmat', (result: any) => ({ id: result.Id, name: getName(result) })),
    getPayments: createCollectionRequestFunc<Payment>('TapahtumaMaksut', (result: any) => ({ id: result.Id, paymentGroup: result.PaaryhmaId, name: getName(result) })),
    getCampGroups: createCollectionRequestFunc<CampGroup>('Leirilippukunnat', (result: any) => ({ id: result.Id, subCamp: result.AlaleiriId, village: result.KylaId, name: result.Nimi })),
    getCampGroupExtraInfos: createCollectionRequestFunc<ExtraInfo<CampGroup>>('LeirilippukunnatLisatietokentat', (result: any) => ({ for: result.LeirilippukuntaId, extraInfoField: result.LisatietokenttaId, value: result.Lisatiedot })),
    getCampGroupExtraSelections: createCollectionRequestFunc<IdMapping<CampGroup, ExtraSelection>>('LeirilippukunnatLisavalinnat', (result: any) => ({ from: result.LeirilippukuntaId, to: result.LisavalintaId })),
    getCampGroupPayments: createCollectionRequestFunc<IdMapping<CampGroup, Payment>>('LeirilippukunnatMaksut', (result: any) => ({ from: result.LeirilippukuntaId, to: result.MaksuId })),
    getParticipants: createCollectionRequestFunc<Participant>('Osallistujat', (result: any) => ({
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
      diet: result.Erikoisruokavalio,
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
    })),
    getParticipantExtraInfos: createCollectionRequestFunc<ExtraInfo<Participant>>('OsallistujatLisatietokentat', (result: any) => ({ for: result.OsallistujaId, extraInfoField: result.LisatietokenttaId, value: result.Lisatiedot })),
    getParticipantExtraSelections: createCollectionRequestFunc<IdMapping<Participant, ExtraSelection>>('OsallistujatLisavalinnat', (result: any) => ({ from: result.OsallistujaId, to: result.LisavalintaId })),
    getParticipantPayments: createCollectionRequestFunc<IdMapping<Participant, Payment>>('OsallistujatMaksut', (result: any) => ({ from: result.OsallistujaId, to: result. MaksuId })),
    getGroups: createCollectionRequestFunc<Group>('Ryhmat', (result: any) => ({
      id: result.Id,
      subCamp: result.AlaleiriId,
      village: result.KylaId,
      campGroup: result.LeirilippukuntaId,
      name: result.Nimi,
      scoutOrganization: result.Partiojärjestö,
      locality: result.Paikkakunta,
      country: result.Maa,
      countryCode: result.Maakoodi,
    })),
    getGroupExtraInfos: createCollectionRequestFunc<ExtraInfo<Group>>('RyhmatLisatietokentat', (result: any) => ({ for: result.RyhmaId, extraInfoField: result.LisatietokenttaId, value: result.Lisatiedot })),
    getGroupExtraSelections: createCollectionRequestFunc<IdMapping<Group, ExtraSelection>>('RyhmatLisavalinnat', (result: any) => ({ from: result.RyhmaId, to: result.LisavalintaId })),
    getGroupPayments: createCollectionRequestFunc<IdMapping<Group, Payment>>('RyhmatMaksut', (result: any) => ({ from: result.RyhmaId, to: result. MaksuId })),
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
