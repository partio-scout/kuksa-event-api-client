export function getEventApi(configuration: EventApiConfiguration): EventApi {
  return null;
}

export interface EventApiConfiguration {
  endpoint: string;
  eventId: string;
  username: string;
  password: string;
}

export interface Promise<TResult> { }

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
