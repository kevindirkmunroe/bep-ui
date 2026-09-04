import { useEffect, useState } from "react";
import { api } from "../../utils/api";

interface InviteRequest {
    request_id: number;
    email: string;
    name?: string;
    status: string;
    requested_at: string;
    invite_code: string;
}

interface ProOrder {
    order_id: string;
    event_id: string;
    created_at: string;
    payment_completed_at: string;
    order_fulfilled_at: string;
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

    const onMarkFulfilled = async (order: ProOrder) => {
        await api.put("/users/fulfill-order", {
            order_id: order.order_id,
        });
    };

    return (
        <div style={{padding: "30px", textAlign: "left"}}>
            <h1><strong>Admin </strong></h1>

            <h2>/ Invite Requests</h2>
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse"
                }}
            >
                <thead>
                <tr>
                    <th>Email</th>
                    <th>Name</th>
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
            <h2>/ PRO Orders</h2>
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse"
                }}
            >
                <thead>
                <tr>
                    <th>Event ID</th>
                    <th>Order ID</th>
                    <th>Create Date</th>
                    <th>Paid?</th>
                    <th>Fulfill Date</th>
                </tr>
                </thead>

                <tbody>
                {proOrders && proOrders.map(order => (
                    <tr style={{backgroundColor: order.order_fulfilled_at ? '' : "lightyellow"}}
                        key={order.event_id}>

                        <td>{order.event_id}</td>
                        <td>{order.order_id}</td>

                        <td>{order.created_at ?? ""}</td>
                        <td>{order.payment_completed_at ? "YES" : "NO"}</td>

                        <td>
                            {order.order_fulfilled_at ? new Date(
                                order.order_fulfilled_at
                            ).toLocaleString() : "---"}
                        </td>
                        <td>
                            {!order.order_fulfilled_at ? (
                                <button
                                    disabled={!order.payment_completed_at}
                                    onClick={() => onMarkFulfilled(order)}
                                >
                                    🤝&nbsp;Fulfill
                                </button>
                            ) : (<>---</>)
                            }
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {inviteRequests.length === 0 && (
                <p>No pending Orders to fulfill.</p>
            )}
        </div>
    );
}
