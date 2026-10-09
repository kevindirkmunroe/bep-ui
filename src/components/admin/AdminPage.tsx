import React, { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { api } from "../../utils/api";
import {PlatformData} from "../dashboard/events/platforms/platformTypes.interface";
import OrderFulfillmentPanel from "./OrderFulfillmentPanel";
import"./adminPage.css";
import PlatformClicksChart from "../PlatformClicksChart";
import EventClicksChart from "../EventClicksChart";

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
    first_name: string;
    last_name: string;
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
    const [unfulfilledOnly, setUnfulfilledOnly] = useState(true);
    const [ tabValue, setTabValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };
    const visibleOrders = unfulfilledOnly
        ? proOrders.filter(order => !order.order_fulfilled_at)
        : proOrders;

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

            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={tabValue}>
                    <TabList
                        onChange={handleChange}
                        aria-label="lab tabs"
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab label="/📦 $PRO Order$" value="1" style={{fontSize: "18px", color: "black", fontWeight: "bold"}} />
                        <Tab label="/📈 Metrics" value="2" style={{fontSize: "18px", color: "black", fontWeight: "bold"}} />
                        <Tab label="/✉️ Invite Requests" value="3" style={{fontSize: "18px", color: "black", fontWeight: "bold"}}/>
                    </TabList>
                    <TabPanel value="1" tabIndex={0}>
                        <h2 style={{backgroundColor: "#E5E5E5"}}>/ PRO Orders</h2>
                        <button
                            type="button"
                            className={`filter-toggle ${unfulfilledOnly ? "active" : ""}`}
                            onClick={() => setUnfulfilledOnly(prev => !prev)}
                        >
                            Unfulfilled Only
                        </button>
                        &nbsp;({visibleOrders.length})
                        <OrderFulfillmentPanel orders={visibleOrders}/>

                        {inviteRequests?.length === 0 && (
                            <p>No pending Orders to fulfill.</p>
                        )}
                    </TabPanel>
                    <TabPanel value="2" tabIndex={0}>
                        <h2 style={{backgroundColor: "#E5E5E5"}}>Platform Performance</h2>
                        <PlatformClicksChart title={"Clicks By Platform (Last 30 Days)"} window={30}/>
                        <EventClicksChart />
                        <PlatformClicksChart title={"Clicks By Platform (All Time)"}/>
                    </TabPanel>
                    <TabPanel value="3" tabIndex={0}>
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
                    </TabPanel>
                </TabContext>
            </Box>

        </div>
    );
}
