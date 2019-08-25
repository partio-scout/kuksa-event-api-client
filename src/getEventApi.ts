import { request as superagent } from './superagent';
import { Promise } from './promise';
import * as Json from './json';
import * as EventApi from './eventApi';

export function getEventApi(configuration: EventApi.EventApiConfiguration): EventApi.EventApi {
  function request<TResult>(resource: string, dateRange: EventApi.DateRange | undefined, transformer: (jsonObject: any) => TResult): Promise<TResult> {
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
        return response;
      })
      .then((response: any) => transformer(response.body));
  }

  type RequestFunc<T> = (dateRange?: EventApi.DateRange) => Promise<T>

  function createRequestFunc<TResult>(resource: string, transformer: (jsonObject: any) => TResult): RequestFunc<TResult> {
    return (dateRange?: EventApi.DateRange) => request(resource, dateRange, transformer);
  }

  function createCollectionRequestFunc<TSingleResult>(resource: string, transformer: (jsonObject: any) => TSingleResult): RequestFunc<TSingleResult> {
    return createRequestFunc<Array<TSingleResult>>(resource, (result: any) => result.map(transformer));
  }

  return {
    getEventInfo: createRequestFunc('Tapahtuma', mapEventInfo),
    getSubCamps: createCollectionRequestFunc('TapahtumaAlaleirit', mapSubCamp),
    getVillages: createCollectionRequestFunc('TapahtumaKylat', mapVillage),
    getQuestionSeries: createCollectionRequestFunc('TapahtumaKysymyssarjat', mapQuestionSeries),
    getExtraInfoFields: createCollectionRequestFunc('TapahtumaLisatietokentat', mapExtraInfoField),
    getExtraSelectionGroups: createCollectionRequestFunc('TapahtumaLisavalinnanPaaryhmat', mapExtraSelectionGroup),
    getExtraSelections: createCollectionRequestFunc('TapahtumaLisavalinnat', mapExtraSelection),
    getPaymentGroups: createCollectionRequestFunc('TapahtumaMaksunPaaryhmat', mapPaymentGroup),
    getPayments: createCollectionRequestFunc('TapahtumaMaksut', mapPayment),
    getCampGroups: createCollectionRequestFunc('Leirilippukunnat', mapCampGroup),
    getCampGroupExtraInfos: createCollectionRequestFunc('LeirilippukunnatLisatietokentat', mapCampGroupExtraInfo),
    getCampGroupExtraSelections: createCollectionRequestFunc('LeirilippukunnatLisavalinnat', mapCampGroupExtraSelection),
    getCampGroupPayments: createCollectionRequestFunc('LeirilippukunnatMaksut', mapCampGroupPayment),
    getParticipants: createCollectionRequestFunc('Osallistujat', mapParticipant),
    getParticipantExtraInfos: createCollectionRequestFunc('OsallistujatLisatietokentat', mapParticipantExtraInfo),
    getParticipantExtraSelections: createCollectionRequestFunc('OsallistujatLisavalinnat', mapParticipantExtraSelection),
    getParticipantPayments: createCollectionRequestFunc('OsallistujatMaksut', mapParticipantPayment),
    getParticipantPaymentStatus: createCollectionRequestFunc('OsallistujatMaksunTila', mapParticipantPaymentStatus),
    getLocalGroups: createCollectionRequestFunc('Ryhmat', mapLocalGroup),
    getLocalGroupExtraInfos: createCollectionRequestFunc('RyhmatLisatietokentat', mapLocalGroupExtraInfo),
    getLocalGroupExtraSelections: createCollectionRequestFunc('RyhmatLisavalinnat', mapLocalGroupExtraSelection),
    getLocalGroupPayments: createCollectionRequestFunc('RyhmatMaksut', mapLocalGroupPayment),
  };
}

function getName(jsonObject: Json.LokalisoidullaNimella): EventApi.LocalizedString {
  return {
    fi: jsonObject.Nimi,
    se: jsonObject.NimiSE,
    en: jsonObject.NimiEN,
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
    questionSeries: result.KysymyssarjaId,
    name: getName(result),
  };
}

function mapExtraSelectionGroup(result: Json.TapahtumaLisavalinnanPaaryhma): EventApi.ExtraSelectionGroup {
  return {
    id: result.Id,
    questionSeries: result.KysymyssarjaId,
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
    subCamp: result.AlaleiriId,
    village: result.KylaId,
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
    memberNumber: result.Jasennro,
    firstName: result.Etunimi,
    lastName: result.Sukunimi,
    nickname: result.Partionimi,
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
    village: result.KylaId,
    campGroup: result.LeirilippukuntaId,
    cancelled: result.Perunut,
    participationId: result.TapahtumaId,
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
