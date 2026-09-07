import { Link } from "react-router-dom";
import {useUser} from "../../../../UserContext";
import {api} from "../../../../utils/api";

export default async function PaymentSuccessPage() {

    const { user } = useUser();

    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (sessionId) {
        await api.post("/stripe/verify-payment", {
            sessionId
        });
    }

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1>Payment Successful</h1>

                <p>
                    Your payment was successfully processed.
                </p>

                <Link
                    to={`/dashboard/${user?.userId}`}
                    style={styles.link}
                >
                    Return to Event
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
