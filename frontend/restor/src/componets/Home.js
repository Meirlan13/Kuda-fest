import Restaurants from "./Restaurants";
import Contacts from "./Contacts";
import Welcome from "./Welcome";
// import FAQ from "./FAQ";
// import AnotherComponent from "./AnotherComponent"; // Дополнительный компонент

function Home() {
    return (
        <div>
            <Welcome />
            <section id="restaurants-section">
                <Restaurants />
            </section>
            <section id="contact-section">
                <Contacts />
            </section>

        </div>
    );
}

export default Home;
