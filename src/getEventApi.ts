import { request as superagent } from './superagent';
import * as Json from './json';
import * as EventApi from './eventApi';
import * as R from 'runtypes'

const optionalDateRange = EventApi.DateRange.Or(R.Undefined);
type RequestFunc<T> = (dateRange?: EventApi.DateRange) => Promise<T>

export function getEventApi(configuration: EventApi.EventApiConfiguration): EventApi.EventApi {
  EventApi.EventApiConfiguration.check(configuration)

  function createRequestFunc<TInput, TResult>(resource: string, runtype: R.Runtype<TInput>, transformer: (jsonObject: TInput) => TResult): RequestFunc<TResult> {
    return (dateRange?: EventApi.DateRange) => {
      optionalDateRange.check(dateRange);
      console.log('Fetching resource', resource)

      let baseRequest = superagent.get(`${configuration.endpoint}/${resource}`)
        .auth(configuration.username, configuration.password)
        .accept('application/json')
        .query({ Guid: configuration.eventId });

      if (dateRange) {
        baseRequest = baseRequest.query({ Alkupvm: dateRange.startDate, Loppupvm: dateRange.endDate });
      }

      if (configuration.proxy) {
        baseRequest = baseRequest.proxy(configuration.proxy);
      }

      return baseRequest
        .then((response: any) => {
          if (!response.ok) {
            throw new Error('The request failed');
          }
          try {
            return runtype.check(response.body);
          } catch (err) {
            throw new Error(`object: ${JSON.stringify(response.body)}, Validation error: ${JSON.stringify(err)}`);
          }
        })
        .then(transformer);
    }
  }

  function createCollectionRequestFunc<TSingleInput, TSingleResult>(resource: string, runtype: R.Runtype<TSingleInput>, transformer: (jsonObject: any) => TSingleResult): RequestFunc<TSingleResult[]> {
    return createRequestFunc<TSingleInput[], TSingleResult[]>(resource, R.Array(runtype), (result: any) => result.map(transformer));
  }

  return {
    getEventInfo: createRequestFunc('Tapahtuma', Json.TapahtumaTiedot, mapEventInfo),
    getSubCamps: createCollectionRequestFunc('TapahtumaAlaleirit', Json.TapahtumaAlaleiri, mapSubCamp),
    getVillages: createCollectionRequestFunc('TapahtumaKylat', Json.TapahtumaKyla, mapVillage),
    getQuestionSeries: createCollectionRequestFunc('TapahtumaKysymyssarjat', Json.TapahtumaKysymyssarja, mapQuestionSeries),
    getExtraInfoFields: createCollectionRequestFunc('TapahtumaLisatietokentat', Json.TapahtumaLisatietokentta, mapExtraInfoField),
    getExtraSelectionGroups: createCollectionRequestFunc('TapahtumaLisavalinnanPaaryhmat', Json.TapahtumaLisavalinnanPaaryhma, mapExtraSelectionGroup),
    getExtraSelections: createCollectionRequestFunc('TapahtumaLisavalinnat', Json.TapahtumaLisavalinta, mapExtraSelection),
    getPaymentGroups: createCollectionRequestFunc('TapahtumaMaksunPaaryhmat', Json.TapahtumaMaksunPaaryhma, mapPaymentGroup),
    getPayments: createCollectionRequestFunc('TapahtumaMaksut', Json.TapahtumaMaksu, mapPayment),
    getCampGroups: createCollectionRequestFunc('Leirilippukunnat', Json.Leirilippukunta, mapCampGroup),
    getCampGroupExtraInfos: createCollectionRequestFunc('LeirilippukunnatLisatietokentat', Json.LeirilippukuntaLisatietokentta, mapCampGroupExtraInfo),
    getCampGroupExtraSelections: createCollectionRequestFunc('LeirilippukunnatLisavalinnat', Json.LeirilippukuntaLisavalinta, mapCampGroupExtraSelection),
    getCampGroupPayments: createCollectionRequestFunc('LeirilippukunnatMaksut', Json.LeirilippukuntaMaksu, mapCampGroupPayment),
    getParticipants: createCollectionRequestFunc('Osallistujat', Json.Osallistuja, mapParticipant),
    getParticipantExtraInfos: createCollectionRequestFunc('OsallistujatLisatietokentat', Json.OsallistujaLisatietokentta, mapParticipantExtraInfo),
    getParticipantExtraSelections: createCollectionRequestFunc('OsallistujatLisavalinnat', Json.OsallistujaLisavalinta, mapParticipantExtraSelection),
    getParticipantPayments: createCollectionRequestFunc('OsallistujatMaksut', Json.OsallistujaMaksu, mapParticipantPayment),
    getParticipantPaymentStatus: createCollectionRequestFunc('OsallistujatMaksunTila', Json.OsallistujatMaksunTila, mapParticipantPaymentStatus),
    getLocalGroups: createCollectionRequestFunc('Ryhmat', Json.Ryhma, mapLocalGroup),
    getLocalGroupExtraInfos: createCollectionRequestFunc('RyhmatLisatietokentat', Json.RyhmaLisatietokentta, mapLocalGroupExtraInfo),
    getLocalGroupExtraSelections: createCollectionRequestFunc('RyhmatLisavalinnat', Json.RyhmaLisavalinta, mapLocalGroupExtraSelection),
    getLocalGroupPayments: createCollectionRequestFunc('RyhmatMaksut', Json.RyhmaMaksu, mapLocalGroupPayment),
  };
}

function getName(jsonObject: Json.LokalisoidullaNimella): EventApi.LocalizedString {
  return {
    fi: jsonObject.Nimi,
    se: jsonObject.NimiSE || undefined,
    en: jsonObject.NimiEN || undefined,
  };
}

function mapEventInfo(result: Json.TapahtumaTiedot): EventApi.EventInfo {
  return {
    startDate: new Date(result.Alkupvm),
    endDate: new Date(result.Loppupvm),
    name: getName(result),
  };
}

function mapSubCamp(result: Json.TapahtumaAlaleiri): EventApi.SubCamp {
  return {
    id: result.Id,
    name: result.Nimi,
  };
}

function mapVillage(result: Json.TapahtumaKyla): EventApi.Village {
  return {
    id: result.Id,
    subCamp: result.AlaleiriId,
    name: result.Nimi,
  };
}

function mapQuestionSeries(result: Json.TapahtumaKysymyssarja): EventApi.QuestionSeries{
  return {
    id: result.Id,
    name: getName(result),
  };
}

function mapExtraInfoField(result: Json.TapahtumaLisatietokentta): EventApi.ExtraInfoField {
  return {
    id: result.Id,
    questionSeries: result.KysymyssarjaId || undefined,
    name: getName(result),
  };
}

function mapExtraSelectionGroup(result: Json.TapahtumaLisavalinnanPaaryhma): EventApi.ExtraSelectionGroup {
  return {
    id: result.Id,
    questionSeries: result.KysymyssarjaId || undefined,
    name: getName(result),
  };
}

function mapExtraSelection(result: Json.TapahtumaLisavalinta): EventApi.ExtraSelection {
  return {
    id: result.Id,
    extraSelectionGroup: result.PaaryhmaId,
    name: getName(result),
  };
}

function mapPaymentGroup(result: Json.TapahtumaMaksunPaaryhma): EventApi.PaymentGroup {
  return {
    id: result.Id,
    name: getName(result),
  };
}

function mapPayment(result: Json.TapahtumaMaksu): EventApi.Payment {
  return {
    id: result.Id,
    paymentGroup: result.PaaryhmaId,
    name: getName(result),
  };
}

function mapCampGroup(result: Json.Leirilippukunta): EventApi.CampGroup {
  return {
    id: result.Id,
    subCamp: result.AlaleiriId || undefined,
    village: result.KylaId || undefined,
    name: result.Nimi,
  };
}

function mapCampGroupExtraInfo(result: Json.LeirilippukuntaLisatietokentta): EventApi.ExtraInfo<EventApi.CampGroup> {
  return {
    for: result.LeirilippukuntaId,
    extraInfoField: result.LisatietokenttaId,
    value: result.Lisatiedot,
  };
}

function mapCampGroupExtraSelection(result: Json.LeirilippukuntaLisavalinta): EventApi.IdMapping<EventApi.CampGroup, EventApi.ExtraSelection> {
  return {
    from: result.LeirilippukuntaId,
    to: result.LisavalintaId,
  };
}

function mapCampGroupPayment(result: Json.LeirilippukuntaMaksu): EventApi.IdMapping<EventApi.CampGroup, EventApi.Payment> {
  return {
    from: result.LeirilippukuntaId,
    to: result.MaksuId,
  };
}

function mapParticipant(result: Json.Osallistuja): EventApi.Participant {
  return {
    id: result.Id,
    memberNumber: result.Jasennro ? String(result.Jasennro) : undefined,
    firstName: result.Etunimi,
    lastName: result.Sukunimi,
    nickname: result.Partionimi || undefined,
    address: {
      street: result.Katuosoite || undefined,
      postCode: result.Postinumero || undefined,
      postOffice: result.Postitoimipaikka || undefined,
      country: result.Postimaa || undefined,
      extra: result.Lisaosoite || undefined,
    },
    phoneNumber: result.Puhelinnumero || undefined,
    email: result.Email || undefined,
    diet: result.Erityisruokavalio || undefined,
    birthDate: result.Syntymaaika ? new Date(result.Syntymaaika) : null,
    age: result.Ika || undefined,
    signUpDate: new Date(result.Ilmoittautumispvm),
    representedParty: result.TahoJotaEdustaa || undefined,
    districtOfOrganization: result.EdustusorganisaationPiiri || undefined,
    accommodation: result.Majoittuminen || undefined,
    accommodationWithLocalGroup: result.MajoittuuLippukunnassa || undefined,
    accommodationExtraInfo: result.MajoittumisenLisatiedot || undefined,
    guardian: {
      name: result.HuoltajanNimi || undefined,
      phoneNumber: result.HuoltajanPuhelinnumero || undefined,
      email: result.HuoltajanEmail || undefined,
    },
    group: result.RyhmaId || undefined,
    subCamp: result.AlaleiriId || undefined,
    village: result.KylaId || undefined,
    campGroup: result.LeirilippukuntaId || undefined,
    cancelled: result.Perunut,
    participationId: undefined,
  };
}

function mapParticipantExtraInfo(result: Json.OsallistujaLisatietokentta): EventApi.ExtraInfo<EventApi.Participant> {
  return {
    for: result.OsallistujaId,
    extraInfoField: result.LisatietokenttaId,
    value: result.Lisatiedot,
  };
}

function mapParticipantExtraSelection(result: Json.OsallistujaLisavalinta): EventApi.IdMapping<EventApi.Participant, EventApi.ExtraSelection> {
  return {
    from: result.OsallistujaId,
    to: result.LisavalintaId,
  };
}

function mapParticipantPayment(result: Json.OsallistujaMaksu): EventApi.IdMapping<EventApi.Participant, EventApi.Payment> {
  return {
    from: result.OsallistujaId,
    to: result. MaksuId,
  };
}

function mapParticipantPaymentStatus(result: Json.OsallistujatMaksunTila): EventApi.PaymentStatus<EventApi.Participant> {
  return {
    for: result.OsallistuminenId,
    billed: result.Laskutettu ? new Date(result.Laskutettu) : undefined,
    paid: result.Maksettu ? new Date(result.Maksettu) : undefined,
  };
}

function mapLocalGroup(result: Json.Ryhma): EventApi.LocalGroup {
  return {
    id: result.Id,
    subCamp: result.AlaleiriId || undefined,
    village: result.KylaId || undefined,
    campGroup: result.LeirilippukuntaId || undefined,
    name: result.Nimi,
    scoutOrganization: result.Partiojarjesto,
    locality: result.Paikkakunta,
    country: result.Maa,
    countryCode: result.Maakoodi,
  };
}

function mapLocalGroupExtraInfo(result: Json.RyhmaLisatietokentta): EventApi.ExtraInfo<EventApi.LocalGroup> {
  return {
    for: result.RyhmaId,
    extraInfoField: result.LisatietokenttaId,
    value: result.Lisatiedot,
  };
}

function mapLocalGroupExtraSelection(result: Json.RyhmaLisavalinta): EventApi.IdMapping<EventApi.LocalGroup, EventApi.ExtraSelection> {
  return {
    from: result.RyhmaId,
    to: result.LisavalintaId,
  };
}

function mapLocalGroupPayment(result: Json.RyhmaMaksu): EventApi.IdMapping<EventApi.LocalGroup, EventApi.Payment> {
  return {
    from: result.RyhmaId,
    to: result. MaksuId,
  };
}
