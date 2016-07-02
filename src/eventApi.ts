import { Promise } from './promise';

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
  getLocalGroups(dateRange?: DateRange): Promise<Array<LocalGroup>>;
  getLocalGroupExtraInfos(dateRange?: DateRange): Promise<Array<ExtraInfo<LocalGroup>>>;
  getLocalGroupExtraSelections(dateRange?: DateRange): Promise<Array<IdMapping<LocalGroup, ExtraSelection>>>
  getLocalGroupPayments(dateRange?: DateRange): Promise<Array<IdMapping<LocalGroup, Payment>>>;
}

export interface EventApiConfiguration {
  endpoint: string;
  eventId: string;
  username: string;
  password: string;
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
  name: string;
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
  memberNumber: string;
  firstName: string;
  lastName: string;
  nickname: string;
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
  group: Id<LocalGroup>;
  subCamp: Id<SubCamp>;
  village: Id<Village>;
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

export interface LocalGroup {
  id: Id<LocalGroup>;
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
