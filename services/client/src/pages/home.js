import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const Home = () => {
	return (
		<div className="home-bg">
			<div className="center">
				<h1 className="title">Find your learning partner here</h1>
				<Card className="text-center opacity">
					<Card.Body>
						<Button variant="outline-secondary " className="m-2">
							<Link to="/register">Register</Link>
						</Button>
						<Button variant="outline-secondary " className="m-2">
							<Link to="/login">Login</Link>
						</Button>
						<Button variant="outline-secondary " className="m-2">
							<Link to="/search">Visit</Link>
						</Button>
					</Card.Body>
				</Card>
			</div>
		</div>
	);
};

export default Home;
