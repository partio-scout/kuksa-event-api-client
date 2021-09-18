import * as R from 'runtypes'

export type RequestFunc<T> = (dateRange?: ReadonlyDateRange) => Promise<T>

export interface EventApi {
  readonly getEventInfo: RequestFunc<EventInfo>
  readonly getSubCamps: RequestFunc<Array<SubCamp>>
  readonly getVillages: RequestFunc<Array<Village>>
  readonly getQuestionSeries: RequestFunc<Array<QuestionSeries>>
  readonly getExtraInfoFields: RequestFunc<Array<ExtraInfoField>>
  readonly getExtraSelectionGroups: RequestFunc<Array<ExtraSelectionGroup>>
  readonly getExtraSelections: RequestFunc<Array<ExtraSelection>>
  readonly getPaymentGroups: RequestFunc<Array<PaymentGroup>>
  readonly getPayments: RequestFunc<Array<Payment>>
  readonly getCampGroups: RequestFunc<Array<CampGroup>>
  readonly getCampGroupExtraInfos: RequestFunc<Array<ExtraInfo<CampGroup>>>
  readonly getCampGroupExtraSelections: RequestFunc<
    Array<IdMapping<CampGroup, ExtraSelection>>
  >
  readonly getCampGroupPayments: RequestFunc<
    Array<IdMapping<CampGroup, Payment>>
  >
  readonly getParticipants: RequestFunc<Array<Participant>>
  readonly getParticipantExtraInfos: RequestFunc<Array<ExtraInfo<Participant>>>
  readonly getParticipantExtraSelections: RequestFunc<
    Array<IdMapping<Participant, ExtraSelection>>
  >
  readonly getParticipantPayments: RequestFunc<
    Array<IdMapping<Participant, Payment>>
  >
  readonly getParticipantPaymentStatus: RequestFunc<
    Array<PaymentStatus<Participant>>
  >
  readonly getLocalGroups: RequestFunc<Array<LocalGroup>>
  readonly getLocalGroupExtraInfos: RequestFunc<Array<ExtraInfo<LocalGroup>>>
  readonly getLocalGroupExtraSelections: RequestFunc<
    Array<IdMapping<LocalGroup, ExtraSelection>>
  >
  readonly getLocalGroupPayments: RequestFunc<
    Array<IdMapping<LocalGroup, Payment>>
  >
}

export const EventApiConfiguration = R.Record({
  endpoint: R.String,
  eventId: R.String,
  username: R.String,
  password: R.String,
  proxy: R.String.Or(R.Undefined),
}).asReadonly()
export type EventApiConfiguration = R.Static<typeof EventApiConfiguration>

export const IsoDateTimeString = R.String

export const DateRange = R.Record({
  startDate: IsoDateTimeString,
  endDate: IsoDateTimeString,
})
export type DateRange = R.Static<typeof DateRange>

export const ReadonlyDateRange = DateRange.asReadonly()
export type ReadonlyDateRange = R.Static<typeof ReadonlyDateRange>

export type Id<T> = number

export interface IdMapping<From, To> {
  from: Id<From>
  to: Id<To>
}

export interface EventInfo {
  name: LocalizedString
  startDate: Date
  endDate: Date
}

export interface LocalizedString {
  fi: string
  se: string | undefined
  en: string | undefined
}

export interface SubCamp {
  id: Id<SubCamp>
  name: string
}

export interface Village {
  id: Id<Village>
  subCamp: Id<SubCamp>
  name: string
}

export interface QuestionSeries {
  id: Id<QuestionSeries>
  name: LocalizedString
}

export interface ExtraInfoField {
  id: Id<ExtraInfoField>
  questionSeries: Id<QuestionSeries> | undefined
  name: LocalizedString
}

export interface ExtraSelectionGroup {
  id: Id<ExtraSelectionGroup>
  questionSeries: Id<QuestionSeries> | undefined
  name: LocalizedString
}

export interface ExtraSelection {
  id: Id<ExtraSelection>
  extraSelectionGroup: Id<ExtraSelectionGroup>
  name: LocalizedString
}

export interface PaymentGroup {
  id: Id<PaymentGroup>
  name: LocalizedString
}

export interface Payment {
  id: Id<Payment>
  paymentGroup: Id<PaymentGroup>
  name: LocalizedString
}

export interface PaymentStatus<For> {
  for: Id<For>
  billed: Date | undefined
  paid: Date | undefined
}

export interface CampGroup {
  id: Id<CampGroup>
  subCamp: Id<SubCamp> | undefined
  village: Id<Village> | undefined
  name: string
}

export interface Participant {
  id: Id<Participant>
  memberNumber: string | undefined
  firstName: string
  lastName: string
  nickname: string | undefined
  address: Address
  phoneNumber: string | undefined
  email: string | undefined
  diet: string | undefined
  birthDate: Date | null
  age: number | undefined
  signUpDate: Date
  representedParty: string | undefined
  districtOfOrganization: string | undefined
  accommodation: string | undefined
  accommodationWithLocalGroup: string | undefined
  accommodationExtraInfo: string | undefined
  guardian: Guardian
  group: Id<LocalGroup> | undefined
  subCamp: Id<SubCamp> | undefined
  village: Id<Village> | undefined
  campGroup: Id<CampGroup> | undefined
  cancelled: boolean
  participationId: number | undefined
}

export interface Address {
  street: string | undefined
  postCode: string | undefined
  postOffice: string | undefined
  country: string | undefined
  extra: string | undefined
}

export interface Guardian {
  name: string | undefined
  phoneNumber: string | undefined
  email: string | undefined
}

export interface LocalGroup {
  id: Id<LocalGroup>
  subCamp: Id<SubCamp> | undefined
  village: Id<Village> | undefined
  campGroup: Id<CampGroup> | undefined
  name: string
  scoutOrganization: string
  locality: string
  country: string
  countryCode: string
}

export interface ExtraInfo<For> {
  for: Id<For>
  extraInfoField: Id<ExtraInfoField>
  value: string
}
