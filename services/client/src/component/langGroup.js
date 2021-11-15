import React from "react";
import Form from "react-bootstrap/Form";
import CardGroup from "react-bootstrap/CardGroup";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const LangGroup = ({
	allLang,
	selectLangHandler,
	selectLevelHandler,
	form = {
		user_offer_lang: [
			{
				lang_name: "Chinese",
				level: 3
			},
			{
				lang_name: "Swedish",
				level: 6
			},
			{
				lang_name: "Danish",
				level: 6
			}
		],
		user_acpt_lang: [
			{
				lang_name: "Chinese",
				level: 3
			},
			{
				lang_name: "Swedish",
				level: 3
			},
			{
				lang_name: "Arabic",
				level: 3
			}
		]
	}
}) => {
	return (
		<>
			<Row className="mb-3">
				<Card.Subtitle className="text-left b-b-default mb-3">
					Accepting Languages
				</Card.Subtitle>
				<Form.Group as={Col}>
					<Form.Select
						className="mr-2"
						onChange={e =>
							selectLangHandler({
								index: 0,
								name: e.target.value,
								type: "acpt"
							})
						}>
						{allLang.map(el => (
							<option
								value={el.name}
								selected={
									el.name === form.user_acpt_lang[0].lang_name
								}
								disabled={
									el.name ===
										form.user_acpt_lang[1].lang_name ||
									el.name === form.user_acpt_lang[2].lang_name
								}
								key={`${el.code}-0`}>
								{el.name}
							</option>
						))}
					</Form.Select>
				</Form.Group>
				<Form.Group as={Col}>
					<Form.Control
						value={form.user_acpt_lang[0].level}
						onChange={e =>
							selectLevelHandler({
								type: "acpt",
								index: 0,
								level: e.target.value
							})
						}
						type="number"
						min={1}
						max={10}
						placeholder="Enter language level 1-10"
					/>
				</Form.Group>
				<Form.Group as={Col}>
					<Form.Select
						className="mr-2"
						onChange={e =>
							selectLangHandler({
								index: 1,
								name: e.target.value,
								type: "acpt"
							})
						}>
						{allLang.map(el => (
							<option
								selected={
									el.name === form.user_acpt_lang[1].lang_name
								}
								disabled={
									el.name ===
										form.user_acpt_lang[0].lang_name ||
									el.name === form.user_acpt_lang[2].lang_name
								}
								key={`${el.code}-1`}>
								{el.name}
							</option>
						))}
					</Form.Select>
				</Form.Group>
				<Form.Group as={Col}>
					<Form.Control
						value={form.user_acpt_lang[1].level}
						onChange={e =>
							selectLevelHandler({
								type: "acpt",
								index: 1,
								level: e.target.value
							})
						}
						min={1}
						max={10}
						type="number"
						placeholder="Enter language level 1-10"
					/>
				</Form.Group>
				<Form.Group as={Col}>
					<Form.Select
						className="mr-2"
						onChange={e =>
							selectLangHandler({
								index: 2,
								name: e.target.value,
								type: "acpt"
							})
						}>
						{allLang.map(el => {
							return (
								<option
									selected={
										el.name ===
										form.user_acpt_lang[2].lang_name
									}
									disabled={
										el.name ===
											form.user_acpt_lang[0].lang_name ||
										el.name ===
											form.user_acpt_lang[1].lang_name
									}
									key={`${el.code}-2`}>
									{el.name}
								</option>
							);
						})}
					</Form.Select>
				</Form.Group>
				<Form.Group as={Col}>
					<Form.Control
						value={form.user_acpt_lang[2].level}
						onChange={e =>
							selectLevelHandler({
								type: "acpt",
								index: 2,
								level: e.target.value
							})
						}
						min={1}
						max={10}
						type="number"
						placeholder="Enter language level 1-10"
					/>
				</Form.Group>
			</Row>
			<Row className="mb-3">
				<Card.Subtitle className="text-left b-b-default mb-3">
					Offering Languages
				</Card.Subtitle>

				<Form.Group as={Col}>
					<Form.Select
						className="mr-2"
						onChange={e =>
							selectLangHandler({
								index: 0,
								name: e.target.value,
								type: "offer"
							})
						}>
						{allLang.map(el => {
							return (
								<option
									selected={
										el.name ===
										form.user_offer_lang[0].lang_name
									}
									disabled={
										el.name ===
											form.user_offer_lang[1].lang_name ||
										el.name ===
											form.user_offer_lang[2].lang_name
									}
									key={`${el.code}-2`}>
									{el.name}
								</option>
							);
						})}
					</Form.Select>
				</Form.Group>
				<Form.Group as={Col}>
					<Form.Control
						value={form.user_offer_lang[0].level}
						onChange={e =>
							selectLevelHandler({
								type: "offer",
								index: 0,
								level: e.target.value
							})
						}
						type="number"
						min={1}
						max={10}
						placeholder="Enter language level 1-10"
					/>
				</Form.Group>
				<Form.Group as={Col}>
					<Form.Select
						className="mr-2"
						onChange={e =>
							selectLangHandler({
								index: 1,
								name: e.target.value,
								type: "offer"
							})
						}>
						{allLang.map(el => {
							return (
								<option
									selected={
										el.name ===
										form.user_offer_lang[1].lang_name
									}
									disabled={
										el.name ===
											form.user_offer_lang[2].lang_name ||
										el.name ===
											form.user_offer_lang[0].lang_name
									}
									key={`${el.code}-2`}>
									{el.name}
								</option>
							);
						})}
					</Form.Select>
				</Form.Group>
				<Form.Group as={Col}>
					<Form.Control
						value={form.user_offer_lang[1].level}
						onChange={e =>
							selectLevelHandler({
								type: "offer",
								index: 1,
								level: e.target.value
							})
						}
						min={1}
						max={10}
						type="number"
						placeholder="Enter language level 1-10"
					/>
				</Form.Group>
				<Form.Group as={Col}>
					<Form.Select
						className="mr-2"
						onChange={e =>
							selectLangHandler({
								index: 2,
								name: e.target.value,
								type: "offer"
							})
						}>
						{allLang.map(el => {
							return (
								<option
									selected={
										el.name ===
										form.user_offer_lang[2].lang_name
									}
									disabled={
										el.name ===
											form.user_offer_lang[0].lang_name ||
										el.name ===
											form.user_offer_lang[1].lang_name
									}
									key={`${el.code}-2`}>
									{el.name}
								</option>
							);
						})}
					</Form.Select>
				</Form.Group>
				<Form.Group as={Col}>
					<Form.Control
						value={form.user_offer_lang[2].level}
						onChange={e =>
							selectLevelHandler({
								type: "offer",
								index: 2,
								level: e.target.value
							})
						}
						min={1}
						max={10}
						type="number"
						placeholder="Enter language level 1-10"
					/>
				</Form.Group>
			</Row>
		</>
	);
};

export default LangGroup;
