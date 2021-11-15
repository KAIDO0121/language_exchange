import React, { useState, useEffect, useContext } from "react";
import { PopBoxCxt } from "../component/contexts";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import {
	registerUser,
	getAllLang,
	checkEmail,
	checkUserName,
	userLogin
} from "../api";
import { useSelLang } from "../component/hook";

const Register = () => {
	const navigate = useNavigate();

	// const { allLang, selectLevelHandler, selectLangHandler, selLang } =
	// 	useSelLang();
	const { setPopbox } = useContext(PopBoxCxt);
	const [form, setForm] = useState({
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
		],
		username: "",
		password: "",
		email: ""
	});

	const [status, setStatus] = useState({
		username: {
			status: null,
			msg: ""
		},
		password: {
			status: null,
			msg: ""
		},
		email: {
			status: null,
			msg: ""
		}
	});

	const [allLang, setAllLang] = useState([]);

	useEffect(() => {
		getAllLang()
			.then(res => {
				setAllLang(res.data);
			})
			.catch(error => {
				console.error(error);
			});
	}, []);

	const selectLevelHandler = ({ type, index, level }) => {
		if (type === "acpt") {
			setForm(prev => {
				//  保留acpt_lang的其餘屬性，只改變acpt_lang[1].level
				const update = prev.user_acpt_lang;

				update[index] = {
					lang_name: update[index].lang_name,
					level
				};

				return {
					...prev,
					user_acpt_lang: update
				};
			});
		} else {
			setForm(prev => {
				const update = prev.user_offer_lang;

				update[index] = {
					lang_name: update[index].lang_name,
					level
				};

				return {
					...prev,
					user_offer_lang: update
				};
			});
		}
	};

	const selectLangHandler = ({ type, index, name }) => {
		if (type === "acpt") {
			setForm(prev => {
				//  保留acpt_lang的其餘屬性，只改變acpt_lang[1].level
				const update = prev.user_acpt_lang;

				update[index] = {
					lang_name: name,
					level: update[index].level
				};

				return {
					...prev,
					user_acpt_lang: update
				};
			});
		} else {
			setForm(prev => {
				const update = prev.user_offer_lang;

				update[index] = {
					lang_name: name,
					level: update[index].level
				};

				return {
					...prev,
					user_offer_lang: update
				};
			});
		}
	};

	const validateCol = async ({ type, value }) => {
		if (type === "email") {
			try {
				const response = await checkEmail(value);
				if (response.data.errorCode !== 0) {
					setStatus(prev => ({
						...prev,
						email: {
							status: false,
							msg: response.data.message
						}
					}));
				} else {
					setStatus(prev => ({
						...prev,
						email: {
							status: true,
							msg: response.data.message
						}
					}));
					return true;
				}
			} catch (error) {
				console.error(error);
				setPopbox({
					isShow: true,
					content: "Server error"
				});
			}
		} else if (type === "username") {
			try {
				const response = await checkUserName(value);
				if (response.data.errorCode !== 0) {
					setStatus(prev => ({
						...prev,
						username: {
							status: false,
							msg: response.data.message
						}
					}));
				} else {
					setStatus(prev => ({
						...prev,
						username: {
							status: true,
							msg: response.data.message
						}
					}));
					return true;
				}
			} catch (error) {
				console.error(error);
				setPopbox({
					isShow: true,
					content: "Server error"
				});
			}
		} else {
			const passwordRegx =
				/^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,15}$/;
			if (!passwordRegx.test(value)) {
				setStatus(prev => ({
					...prev,
					password: {
						status: false,
						msg: "Password must be 6-15 characters, contain both alphanumeric and a special characters (!@#$%^&*)."
					}
				}));
			} else {
				setStatus(prev => ({
					...prev,
					password: {
						status: true,
						msg: "Password is available."
					}
				}));
				return true;
			}
		}
	};

	const submit = async () => {
		const validateAllCol = await Promise.all([
			validateCol({ type: "email", value: form.email }),
			validateCol({ type: "username", value: form.username }),
			validateCol({ type: "password", value: form.password })
		]);

		if (validateAllCol.includes(undefined)) return;
		try {
			const response = await registerUser(form);

			if (response.data.errorCode === 0) {
				const loginRes = await userLogin({
					username: form.username,
					password: form.password
				});
				if (loginRes.data.errorCode === 0) {
					localStorage.setItem(
						"access_token",
						loginRes.data.access_token
					);
					localStorage.setItem(
						"refresh_token",
						loginRes.data.refresh_token
					);
				}
				navigate("/uploadAvatar");
			} else {
				setPopbox({
					isShow: true,
					content: "Server error"
				});
			}
		} catch (error) {
			console.error(error);
			setPopbox({
				isShow: true,
				content: "Server error"
			});
		}
	};

	return (
		<div className="home-bg">
			<Container>
				<Card className="text-center center register">
					<Card.Header>Register</Card.Header>
					<Card.Body>
						<Form>
							<Form.Group className="mb-3">
								<InputGroup hasValidation>
									<Form.Control
										isValid={status.email.status === true}
										isInvalid={
											status.email.status === false
										}
										value={form.email}
										onChange={e =>
											setForm(prev => ({
												...prev,
												email: e.target.value
											}))
										}
										onBlur={e =>
											validateCol({
												type: "email",
												value: e.target.value
											})
										}
										type="email"
										placeholder="Enter email"
									/>

									{status.email.status === false && (
										<Form.Control.Feedback type="invalid">
											{status.email.msg}
										</Form.Control.Feedback>
									)}
								</InputGroup>
							</Form.Group>
							<Form.Group className="mb-3">
								<InputGroup hasValidation>
									<Form.Control
										isValid={
											status.password.status === true
										}
										isInvalid={
											status.password.status === false
										}
										value={form.password}
										onChange={e =>
											setForm(prev => ({
												...prev,
												password: e.target.value
											}))
										}
										onBlur={e =>
											validateCol({
												type: "password",
												value: e.target.value
											})
										}
										type="password"
										placeholder="Password"
									/>
									{status.password.status === false && (
										<Form.Control.Feedback type="invalid">
											{status.password.msg}
										</Form.Control.Feedback>
									)}
								</InputGroup>
							</Form.Group>
							<Form.Group className="mb-3">
								<InputGroup hasValidation>
									<Form.Control
										isValid={
											status.username.status === true
										}
										isInvalid={
											status.username.status === false
										}
										value={form.username}
										onChange={e =>
											setForm(prev => ({
												...prev,
												username: e.target.value
											}))
										}
										onBlur={e =>
											validateCol({
												type: "username",
												value: e.target.value
											})
										}
										type="text"
										placeholder="Your username"
									/>
									{status.username.status === false && (
										<Form.Control.Feedback type="invalid">
											{status.username.msg}
										</Form.Control.Feedback>
									)}
								</InputGroup>
							</Form.Group>
							<Form.Group className="mb-3">
								<Form.Control
									className="bio"
									as="textarea"
									rows={3}
									value={form.bio}
									onChange={e =>
										setForm(prev => ({
											...prev,
											bio: e.target.value
										}))
									}
									placeholder="Your Bio"
								/>
							</Form.Group>
							<Row className="mb-1">
								<Form.Label className="text-left">
									Please select your accepting languages.
								</Form.Label>
							</Row>

							<Row className="mb-3">
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
													el.name ===
													form.user_acpt_lang[0]
														.lang_name
												}
												disabled={
													el.name ===
														form.user_acpt_lang[1]
															.lang_name ||
													el.name ===
														form.user_acpt_lang[2]
															.lang_name
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
													el.name ===
													form.user_acpt_lang[1]
														.lang_name
												}
												disabled={
													el.name ===
														form.user_acpt_lang[0]
															.lang_name ||
													el.name ===
														form.user_acpt_lang[2]
															.lang_name
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
														form.user_acpt_lang[2]
															.lang_name
													}
													disabled={
														el.name ===
															form
																.user_acpt_lang[0]
																.lang_name ||
														el.name ===
															form
																.user_acpt_lang[1]
																.lang_name
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

							<Row className="mb-1">
								<Form.Label className="text-left">
									Please select your offering languages.
								</Form.Label>
							</Row>

							<Row className="mb-3">
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
														form.user_offer_lang[0]
															.lang_name
													}
													disabled={
														el.name ===
															form
																.user_offer_lang[1]
																.lang_name ||
														el.name ===
															form
																.user_offer_lang[2]
																.lang_name
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
														form.user_offer_lang[1]
															.lang_name
													}
													disabled={
														el.name ===
															form
																.user_offer_lang[2]
																.lang_name ||
														el.name ===
															form
																.user_offer_lang[0]
																.lang_name
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
														form.user_offer_lang[2]
															.lang_name
													}
													disabled={
														el.name ===
															form
																.user_offer_lang[0]
																.lang_name ||
														el.name ===
															form
																.user_offer_lang[1]
																.lang_name
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

							<Button
								onClick={submit}
								variant="light"
								type="button">
								Submit
							</Button>
						</Form>
					</Card.Body>
				</Card>
			</Container>
		</div>
	);
};

export default Register;
