import {
    DoTheBayPayload,
    FunCheapPayload,
    IndyBayPayload,
    SFStationPayload,
    VisitOaklandPayload,
    SFWeeklyPayload
} from "./payloadTypes.interface";

export type PlatformPayload =
    DoTheBayPayload
    | IndyBayPayload
    | FunCheapPayload
    | SFStationPayload
    | VisitOaklandPayload
    | SFWeeklyPayload
