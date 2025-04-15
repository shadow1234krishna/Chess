import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Spinner, Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { URL } from '../Utils/Config';
import UserContext from '../../context/UserContext';
import ChessBG from '../../assets/chess_bg_1.jpg';

function UserProfile(props) {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [validUser, setValidUser] = useState(false);
    const [stats, setStats] = useState({
        totalGames: 0,
        wins: 0,
        losses: 0,
        draws: 0
    });

    const User = useContext(UserContext);
    const userId = props.match.params.userId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${URL}/u/getUserWithMatches`, { params: { userId: props.match.params.userId } });
                
                // Calculate game statistics
                const matches = res.data.matches || [];
                const stats = {
                    totalGames: matches.length,
                    wins: matches.filter(match => {
                        if (match.winner === 'white') return match.whitePlayer._id === userId;
                        if (match.winner === 'black') return match.blackPlayer._id === userId;
                        return false;
                    }).length,
                    losses: matches.filter(match => {
                        if (match.winner === 'white') return match.blackPlayer._id === userId;
                        if (match.winner === 'black') return match.whitePlayer._id === userId;
                        return false;
                    }).length,
                    draws: matches.filter(match => match.winner === 'draw').length
                };

                setStats(stats);
                setUser(res.data);
                setIsLoading(false);
                setValidUser(true);
            } catch (error) {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [props.match.params.userId]);

    if (isLoading) {
        return (
            <div className='Spinner'>
                <Spinner animation='border' variant='primary' />
            </div>
        );
    }

    if (!validUser) {
        return <Alert variant='warning'>404 User Not Found</Alert>;
    }

    return (
        <Container className="mt-4">
            <div className="mb-4">
                <ul className='nav nav-tabs'>
                    <li className='nav-item'>
                        <Link className='nav-link active profile-active-tab' aria-current='page' to={`/u/${userId}`}>
                            Profile
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link className='nav-link' to={`/u/${userId}/matches`}>
                            Match History
                        </Link>
                    </li>
                    {userId == User.user.id && (
                        <li className='nav-item'>
                            <Link className='nav-link' to='/u/updateProfile'>
                                Update Profile
                            </Link>
                        </li>
                    )}
                </ul>
            </div>

            <Card className="profile-card">
                <Card.Body>
                    <Row>
                        <Col md={4} className="text-center">
                            <div className="profile-picture-container mb-3">
                                <img src={ChessBG} alt='user profile' className="profile-picture" />
                            </div>
                            <h3>{user.username}</h3>
                            <div className="rating-badge">
                                Rating: {user.rating || 1000}
                            </div>
                        </Col>
                        <Col md={8}>
                            <h4 className="mb-4">Game Statistics</h4>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <Card className="stat-card">
                                        <Card.Body>
                                            <h5>Total Games</h5>
                                            <h3>{stats.totalGames}</h3>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Card className="stat-card">
                                        <Card.Body>
                                            <h5>Wins</h5>
                                            <h3>{stats.wins}</h3>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Card className="stat-card">
                                        <Card.Body>
                                            <h5>Losses</h5>
                                            <h3>{stats.losses}</h3>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <Card className="stat-card">
                                        <Card.Body>
                                            <h5>Draws</h5>
                                            <h3>{stats.draws}</h3>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default UserProfile;
