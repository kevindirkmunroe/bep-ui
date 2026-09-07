import { Link } from "react-router-dom";
import axios from "axios";
import {useUser} from "../../../../UserContext";
import {api} from "../../../../utils/api";
import {useEffect, useState} from "react";

export default function PaymentSuccessPage() {

    const { user } = useUser();
    const [errorMessage, setErrorMessage] = useState("");
    const [msgHeader, setMsgHeader] = useState("");
    const [msgDetail, setMsgDetail] = useState("");


    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    useEffect(() => {

        const verifyPayment = async () => {
            try {
                const response = await api.post("/payments/stripe/verify-payment", {
                    sessionId
                });

                // success
                console.log(response.data);
                setMsgHeader( "Payment Successful");
                setMsgDetail("Your payment was successfully processed.");
            } catch (error) {

                if (axios.isAxiosError(error)) {
                    const data = error.response?.data;

                    const message =
                        data?.error ??
                        (data?.paymentStatus
                            ? `Payment status: ${data.paymentStatus}`
                            : "Payment verification failed.");

                    setErrorMessage(message);

                } else {
                    setErrorMessage("Unexpected error.");
                }
            }
        }

        verifyPayment();
    }, []); // <-- important

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1>{msgHeader}</h1>

                <p>
                    { errorMessage ? `${errorMessage}\n${msgDetail}` : `${msgDetail}` }
                </p>

                <Link
                    to={`/dashboard/${user?.userId}`}
                    style={styles.link}
                >
                    Return to Events
                </Link>
            </div>
        </div>
    );
}

const styles = {
    page: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh"
    },

    card: {
        textAlign: "center" as const,
        padding: "40px",
        maxWidth: "500px"
    },

    link: {
        display: "inline-block",
        marginTop: "20px"
    }
};
