import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import {PlatformData} from "../dashboard/events/platforms/platformTypes.interface";
import OrderFulfillmentPanel from "./OrderFulfillmentPage";
import {EventDetail} from "../dashboard/events/eventDetailTypes.interface";

interface InviteRequest {
    request_id: number;
    email: string;
    name?: string;
    status: string;
    requested_at: string;
    invite_code: string;
}

export interface ProOrder {
    email: string;
    order_id: string;
    image: string;
    event_id: string;
    title: string;
    created_at: string;
    payment_completed_at: string;
    order_fulfilled_at: string;
    platforms: PlatformData[];
}

export default function AdminPage() {

    const [inviteRequests, setInviteRequests] = useState<InviteRequest[]>([]);
    const [proOrders, setProOrders] = useState<ProOrder[]>([]);

    const loadInviteRequests = async () => {
        const { data } = await api.get<InviteRequest[]>(
            `/admin/invite-requests`
        );
        setInviteRequests(data);
    };

    const loadProOrders = async () => {
        try {
            const {data} = await api.get<ProOrder[]>(
                `/admin/pro-orders`
            );
            setProOrders(data);
        }catch(err){
            console.log(`[AdminPage] err loading proOrders: ${err}`);
        }
    };

    useEffect(() => {
        loadInviteRequests();
        loadProOrders();
    }, []);

    const onApprove = async (request: InviteRequest) => {

        await api.post("/users/approve", {
            request_id: request.request_id,
            name: request.name,
            email: request.email,
            invite_code: request.invite_code
        });

        // Remove approved request from the pending list
        setInviteRequests(current =>
            current.filter(
                r => r.request_id !== request.request_id
            )
        );
    };

    return (
        <div style={{padding: "30px", textAlign: "left"}}>
            <h2 style={{backgroundColor: "#E5E5E5"}}>/ Invite Requests</h2>
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse"
                }}
            >
                <thead>
                <tr>
                    <th>User Email</th>
                    <th>User Name</th>
                    <th>Status</th>
                    <th>Requested</th>
                    <th></th>
                </tr>
                </thead>

                <tbody>
                {inviteRequests?.map(request => (
                    <tr style={{backgroundColor: request.status !== 'approved' ? 'lightyellow' : ""}}
                        key={request.request_id}>

                        <td>{request.email}</td>

                        <td>{request.name ?? ""}</td>
                        <td>{request.status}</td>

                        <td>
                            {new Date(
                                request.requested_at
                            ).toLocaleString()}
                        </td>

                        <td>
                            {request.status !== 'approved' ? (
                                <button
                                    onClick={() => onApprove(request)}
                                >
                                    ✅&nbsp;Approve
                                </button>
                            ) : (<>---</>)
                            }
                        </td>

                    </tr>
                ))}
                </tbody>
            </table>

            <br/>
            <h2 style={{backgroundColor: "#E5E5E5"}}>/ PRO Orders</h2>
            <OrderFulfillmentPanel orders={proOrders} />

            {inviteRequests?.length === 0 && (
                <p>No pending Orders to fulfill.</p>
            )}
        </div>
    );
}
