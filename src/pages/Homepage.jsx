import { Link } from "react-router-dom";
import styles from "./Homepage.module.css";
import PageNav from "../components/PageNav";

export default function Homepage() {
    return (
        <main className={styles.homepage}>
            {/* <PageNav /> */}
            <section>
                <h1>
                    Travel the world.
                    <br />
                    Embark on the Ultimate Road Trip Adventure
                </h1>
                <h2>
                    Join exciting road trips hosted by fellow travelers. Explore
                    new routes, plan unforgettable journeys, and share your
                    adventure with a community of like-minded explorers. Start
                    your next adventure now!
                </h2>
                <Link to="/app" className="cta">
                    Start your journey now
                </Link>
            </section>
        </main>
    );
}
