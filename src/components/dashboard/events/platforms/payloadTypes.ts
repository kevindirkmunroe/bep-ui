import {FunCheapPayload, IndyBayPayload, SFStationPayload, VisitOaklandPayload} from "./payloadTypes.interface";

export type PlatformPayload =
    | FunCheapPayload
    | VisitOaklandPayload
    | SFStationPayload
    | IndyBayPayload;
