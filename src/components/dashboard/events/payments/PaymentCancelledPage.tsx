import { Link, useParams } from "react-router-dom";
import {useUser} from "../../../../UserContext";

export default function PaymentCancelledPage() {
    const { user } = useUser();

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1>Payment Canceled</h1>

                <p>
                    Your payment was canceled. You have not been charged.
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
