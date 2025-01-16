import { Container, Row, Col, Card } from 'react-bootstrap';
import './LukasBingo.css';

const Players = () => {
    const saltyTeam = {
        "Team": 'Mong and the Salties',
        "Captain": 'Mong Salty',
        "Players": ["Iron Tofi", "High Bonsai", "A Sqrd", "Muumin", "Zapu Japu", "Kish Cantpvm", "AbusiveTunaa", "Arrazha", "L1l Yachty", "Ninef", "Bid Whist", "Nerding Out", "0018", "Don Corgione",
            "Raevid", "Im Barlow", "Hes Slaying", "Softest IM", "Iron Chkn", "Rat HJ", "Joan of Arf", "Just Jakee", "Zero Rangers", "Capped", "Im Ivar", "Nex Cheeks", "Gipsskruv", "Fastcar384", "Matt93",
            "Wiz Jax", "Misremember"
        ]
    };

    const falaTeam = {
        "Team": 'The Faladorable Guards',
        "Captain": "F aladorable",
        "Players": ["A Sync", "Henryi25", "4 Fingies", "F Aladorable", "Goose World", "Senator Jinx", "B Utterable", "J Mes", "Vorkathchan",
            "Paramecia", "Wiseoldirony", "Slynt", "Astraleos", "Fe Brimstone", "Ags Friend", "Shadz133", "Fatboislimos", "Sapper Crump", "Bathwater30",
            "Sirmixagoose", "Sailor Terry", "I Run East", "You Dosser", "Vyraal", "Gm Goblin", "Un Pez", "Paramexican", "Cu R Ly", "Stick Died", "Sharrav"]
    };

    return (
        <Container className="mt-4">
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="players-card text-center shadow-sm mb-4">
                        <Card.Body>
                            <Card.Title className="text-primary">{saltyTeam.Team}</Card.Title>
                            <Card.Subtitle className="mb-2">Captain: {saltyTeam.Captain}</Card.Subtitle>
                            <Card.Text>
                                <ul className="list-unstyled">
                                    {saltyTeam.Players.map((player, index) => (
                                        <li key={index} className="border-bottom pb-1">{player}</li>
                                    ))}
                                </ul>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="players-card text-center shadow-sm mb-4">
                        <Card.Body>
                            <Card.Title className="text-primary">{falaTeam.Team}</Card.Title>
                            <Card.Subtitle className="mb-2">Captain: {falaTeam.Captain}</Card.Subtitle>
                            <Card.Text>
                                <ul className="list-unstyled">
                                    {falaTeam.Players.map((player, index) => (
                                        <li key={index} className="border-bottom pb-1">{player}</li>
                                    ))}
                                </ul>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Players;
