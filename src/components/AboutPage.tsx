export function AboutPage(){

    return (
        <div className="about-div" style={{
            objectFit: "cover",
            height: "100vh",
            objectPosition: "top",
            fontWeight: 800,
            fontSize: "30px",
            borderRadius: "4px",
            font: "bold",
            color: "white",
            display: "flex",
            alignContent: "left",
            alignItems: "left",
            justifyContent: "top",
            marginBottom: "10px"
        }}>
            <div className="text-highlight" style={{marginLeft: "4px", marginTop: "16px", fontFamily: "Inter, sans-serif", color: "white"}}>
                <div style={{fontSize: "50px", padding: "20px", color: "#D2492C"}}>About LocalBuzz</div>
                <br/>Our Mission
                <p style={{fontSize: "18px", marginTop: "10px", paddingLeft: "100px", paddingRight: "100px"}}>
                    LocalBuzz helps event organizers, venues, and small businesses promote events more efficiently.
                    Our goal is simple: make it easier for local events to reach local audiences by reducing the time
                    and effort required to publish events across multiple promotion platforms.
                </p>

                <br/>Our Story
                <p style={{fontSize: "18px", marginTop: "10px", paddingLeft: "100px", paddingRight: "100px"}}>
                    LocalBuzz was born from firsthand experience promoting events in the Bay Area hospitality industry.

                    While helping organize and promote recurring events at a wine bar, we discovered that event promotion often meant re-entering the same information across multiple event calendars and community websites. Each platform had different forms, categories, and submission requirements, turning what should have been a simple task into hours of repetitive work every week.

                    LocalBuzz was created to streamline that process. By creating an event once and reusing that information across multiple platforms, organizers can spend less time on administrative work and more time creating successful events.
                </p>

                <br/>Why It Matters
                <p style={{fontSize: "18px", marginTop: "10px", paddingLeft: "100px", paddingRight: "100px"}}>
                    Local events strengthen communities. Whether it's a concert, fundraiser, workshop, food festival, networking event, or neighborhood gathering, every event depends on people discovering it.

                    We believe small businesses and community organizers should have access to the same efficiency tools that larger organizations use. By reducing friction in the promotion process, LocalBuzz helps more events get discovered and attended.
                </p>

                <br/>About the Founder
                <p style={{fontSize: "18px", marginTop: "10px", paddingLeft: "100px", paddingRight: "100px"}}>LocalBuzz was founded by Kevin Munroe, a software engineer with more than 20 years of experience building web applications, data systems, and workflow automation tools. The company combines technical expertise with firsthand experience promoting events in the Bay Area hospitality industry</p>

                <br/>
                <p style={{fontSize: "18px", marginTop: "10px", paddingLeft: "100px", paddingRight: "100px"}}>We're building LocalBuzz in the Bay Area and working closely with local businesses, venues, and event organizers to make event promotion simpler and more effective.</p>
            </div>
        </div>
    )
}
