import { request as superagent } from './superagent';
import { Promise } from './promise';
import * as Json from './json';
import * as EventApi from './eventApi';

export function getEventApi(configuration: EventApi.EventApiConfiguration): EventApi.EventApi {
  function request<TResult>(resource: string, dateRange: EventApi.DateRange, transformer: (jsonObject: any) => TResult): Promise<TResult> {
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

  function createRequestFunc<TResult>(resource: string, transformer: (jsonObject: any) => TResult): (dateRange?: EventApi.DateRange) => Promise<TResult> {
    return (dateRange?: EventApi.DateRange) => request(resource, dateRange, transformer);
  }

  function createCollectionRequestFunc<TSingleResult>(resource: string, transformer: (jsonObject: any) => TSingleResult): (dateRange?: EventApi.DateRange) => Promise<Array<TSingleResult>> {
    return createRequestFunc<Array<TSingleResult>>(resource, (result: any) => result.map(transformer));
  }

  return {
    getEventInfo: createRequestFunc<EventApi.EventInfo>('Tapahtuma', mapEventInfo),
    getSubCamps: createCollectionRequestFunc<EventApi.SubCamp>('TapahtumaAlaleirit', mapSubCamp),
    getVillages: createCollectionRequestFunc<EventApi.Village>('TapahtumaKylat', mapVillage),
    getQuestionSeries: createCollectionRequestFunc<EventApi.QuestionSeries>('TapahtumaKysymyssarjat', mapQuestionSeries),
    getExtraInfoFields: createCollectionRequestFunc<EventApi.ExtraInfoField>('TapahtumaLisatietokentat', mapExtraInfoField),
    getExtraSelectionGroups: createCollectionRequestFunc<EventApi.ExtraSelectionGroup>('TapahtumaLisavalinnanPaaryhmat', mapExtraSelectionGroup),
    getExtraSelections: createCollectionRequestFunc<EventApi.ExtraSelection>('TapahtumaLisavalinnat', mapExtraSelection),
    getPaymentGroups: createCollectionRequestFunc<EventApi.PaymentGroup>('TapahtumaMaksunPaaryhmat', mapPaymentGroup),
    getPayments: createCollectionRequestFunc<EventApi.Payment>('TapahtumaMaksut', mapPayment),
    getCampGroups: createCollectionRequestFunc<EventApi.CampGroup>('Leirilippukunnat', mapCampGroup),
    getCampGroupExtraInfos: createCollectionRequestFunc<EventApi.ExtraInfo<EventApi.CampGroup>>('LeirilippukunnatLisatietokentat', mapCampGroupExtraInfo),
    getCampGroupExtraSelections: createCollectionRequestFunc<EventApi.IdMapping<EventApi.CampGroup, EventApi.ExtraSelection>>('LeirilippukunnatLisavalinnat', mapCampGroupExtraSelection),
    getCampGroupPayments: createCollectionRequestFunc<EventApi.IdMapping<EventApi.CampGroup, EventApi.Payment>>('LeirilippukunnatMaksut', mapCampGroupPayment),
    getParticipants: createCollectionRequestFunc<EventApi.Participant>('Osallistujat', mapParticipant),
    getParticipantExtraInfos: createCollectionRequestFunc<EventApi.ExtraInfo<EventApi.Participant>>('OsallistujatLisatietokentat', mapParticipantExtraInfo),
    getParticipantExtraSelections: createCollectionRequestFunc<EventApi.IdMapping<EventApi.Participant, EventApi.ExtraSelection>>('OsallistujatLisavalinnat', mapParticipantExtraSelection),
    getParticipantPayments: createCollectionRequestFunc<EventApi.IdMapping<EventApi.Participant, EventApi.Payment>>('OsallistujatMaksut', mapParticipantPayment),
    getLocalGroups: createCollectionRequestFunc<EventApi.LocalGroup>('Ryhmat', mapLocalGroup),
    getLocalGroupExtraInfos: createCollectionRequestFunc<EventApi.ExtraInfo<EventApi.LocalGroup>>('RyhmatLisatietokentat', mapLocalGroupExtraInfo),
    getLocalGroupExtraSelections: createCollectionRequestFunc<EventApi.IdMapping<EventApi.LocalGroup, EventApi.ExtraSelection>>('RyhmatLisavalinnat', mapLocalGroupExtraSelection),
    getLocalGroupPayments: createCollectionRequestFunc<EventApi.IdMapping<EventApi.LocalGroup, EventApi.Payment>>('RyhmatMaksut', mapLocalGroupPayment),
  };
}

function getName(jsonObject: Json.LokalisoidullaNimella): EventApi.LocalizedString {
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
    village: result.KylaId,
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

function mapLocalGroup(result: Json.Ryhma) {
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

function mapLocalGroupExtraInfo(result: Json.RyhmaLisatietokentta) {
  return {
    for: result.RyhmaId,
    extraInfoField: result.LisatietokenttaId,
    value: result.Lisatiedot,
  };
}

function mapLocalGroupExtraSelection(result: Json.RyhmaLisavalinta) {
  return {
    from: result.RyhmaId,
    to: result.LisavalintaId,
  };
}

function mapLocalGroupPayment(result: Json.RyhmaMaksu) {
  return {
    from: result.RyhmaId,
    to: result. MaksuId,
  };
}
