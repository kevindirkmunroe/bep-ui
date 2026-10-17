import {
    DoTheBayPayload,
    FunCheapPayload,
    IndyBayPayload,
    SFStationPayload,
    VisitOaklandPayload,
    SFWeeklyPayload,
    CitySparkPayload, PatchPayload
} from "./payloadTypes.interface";

export type PlatformPayload =
    DoTheBayPayload
    | IndyBayPayload
    | FunCheapPayload
    | SFStationPayload
    | VisitOaklandPayload
    | SFWeeklyPayload
    | CitySparkPayload
    | PatchPayload
