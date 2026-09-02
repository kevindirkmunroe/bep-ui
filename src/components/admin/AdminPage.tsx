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

export default function AdminPage() {

    const [requests, setRequests] = useState<InviteRequest[]>([]);

    const loadRequests = async () => {
        const { data } = await api.get<InviteRequest[]>(
            "/admin/invite-requests"
        );

        setRequests(data);
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const onApprove = async (request: InviteRequest) => {

        await api.post("/users/approve", {
            request_id: request.request_id,
            name: request.name,
            email: request.email,
            invite_code: request.invite_code
        });

        // Remove approved request from the pending list
        setRequests(current =>
            current.filter(
                r => r.request_id !== request.request_id
            )
        );
    };

    return (
        <div style={{ padding: "30px", textAlign: "left" }}>

            <h1><strong>Admin </strong>/&nbsp;Invite Requests</h1>

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
                {requests.map(request => (
                    <tr style={{backgroundColor: request.status !== 'approved' ? 'lightyellow' : ""}} key={request.request_id}>

                        <td>{request.email}</td>

                        <td>{request.name ?? ""}</td>
                        <td>{request.status}</td>

                        <td>
                            {new Date(
                                request.requested_at
                            ).toLocaleString()}
                        </td>

                        <td>
                            { request.status !== 'approved' ? (
                            <button
                                onClick={() => onApprove(request)}
                            >
                                ✅&nbsp;Approve
                            </button>
                            ) : ( <>---</>)
                            }
                        </td>

                    </tr>
                ))}
                </tbody>
            </table>

            {requests.length === 0 && (
                <p>No pending invite requests.</p>
            )}

        </div>
    );
}
