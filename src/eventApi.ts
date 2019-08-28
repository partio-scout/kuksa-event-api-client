import * as R from 'runtypes'

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
  getParticipantPaymentStatus(dateRange?: DateRange): Promise<PaymentStatus<Participant>>;
  getLocalGroups(dateRange?: DateRange): Promise<Array<LocalGroup>>;
  getLocalGroupExtraInfos(dateRange?: DateRange): Promise<Array<ExtraInfo<LocalGroup>>>;
  getLocalGroupExtraSelections(dateRange?: DateRange): Promise<Array<IdMapping<LocalGroup, ExtraSelection>>>
  getLocalGroupPayments(dateRange?: DateRange): Promise<Array<IdMapping<LocalGroup, Payment>>>;
}

export const EventApiConfiguration = R.Record({
  endpoint: R.String,
  eventId: R.String,
  username: R.String,
  password: R.String,
  proxy: R.String.Or(R.Undefined),
})
export type EventApiConfiguration = R.Static<typeof EventApiConfiguration>

export const IsoDateTimeString = R.String;

export const DateRange = R.Record({
  startDate: IsoDateTimeString,
  endDate: IsoDateTimeString,
})
export type DateRange = R.Static<typeof DateRange>

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
  se: string | undefined;
  en: string | undefined;
}

export interface SubCamp {
  id: Id<SubCamp>;
  name: string;
}

export interface Village {
  id: Id<Village>;
  subCamp: Id<SubCamp>;
  name: string;
}

export interface QuestionSeries {
  id: Id<QuestionSeries>;
  name: LocalizedString;
}

export interface ExtraInfoField {
  id: Id<ExtraInfoField>;
  questionSeries: Id<QuestionSeries> | undefined;
  name: LocalizedString;
}

export interface ExtraSelectionGroup {
  id: Id<ExtraSelectionGroup>;
  questionSeries: Id<QuestionSeries> | undefined;
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

export interface PaymentStatus<For> {
  for: Id<For>;
  billed: Date | undefined;
  paid: Date | undefined;
}

export interface CampGroup {
  id: Id<CampGroup>;
  subCamp: Id<SubCamp> | undefined;
  village: Id<Village> | undefined;
  name: string;
}

export interface Participant {
  id: Id<Participant>;
  memberNumber: string | undefined;
  firstName: string;
  lastName: string;
  nickname: string | undefined;
  address: Address;
  phoneNumber: string | undefined;
  email: string | undefined;
  diet: string | undefined;
  birthDate: Date | null;
  age: number | undefined;
  signUpDate: Date;
  representedParty: string | undefined;
  districtOfOrganization: string | undefined;
  accommodation: string | undefined;
  accommodationWithLocalGroup: string | undefined;
  accommodationExtraInfo: string | undefined;
  guardian: Guardian;
  group: Id<LocalGroup> | undefined;
  subCamp: Id<SubCamp> | undefined;
  village: Id<Village> | undefined;
  campGroup: Id<CampGroup> | undefined;
  cancelled: boolean;
  participationId: number | undefined;
}

export interface Address {
  street: string | undefined;
  postCode: string | undefined;
  postOffice: string | undefined;
  country: string | undefined;
  extra: string | undefined;
}

export interface Guardian {
  name: string | undefined;
  phoneNumber: string | undefined;
  email: string | undefined;
}

export interface LocalGroup {
  id: Id<LocalGroup>;
  subCamp: Id<SubCamp> | undefined;
  village: Id<Village> | undefined;
  campGroup: Id<CampGroup> | undefined;
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
