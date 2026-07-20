import {
    DoTheBayPayload,
    FunCheapPayload,
    IndyBayPayload,
    SFStationPayload,
    VisitOaklandPayload
} from "./payloadTypes.interface";

export type PlatformPayload =
    DoTheBayPayload
    | IndyBayPayload
    | FunCheapPayload
    | SFStationPayload
    | VisitOaklandPayload
