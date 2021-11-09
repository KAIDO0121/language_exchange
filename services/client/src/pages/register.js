import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import { registerUser, getAllLang, checkEmail, checkUserName } from "../api";

const Register = () => {
	const navigate = useNavigate();

	const [form, setForm] = useState({
		offer_lang: [
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
		acpt_lang: [
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
				const update = prev.acpt_lang;

				update[index] = {
					lang_name: update[index].lang_name,
					level
				};

				return {
					...prev,
					acpt_lang: update
				};
			});
		} else {
			setForm(prev => {
				const update = prev.offer_lang;

				update[index] = {
					lang_name: update[index].lang_name,
					level
				};

				return {
					...prev,
					offer_lang: update
				};
			});
		}
	};

	const selectLangHandler = ({ type, index, name }) => {
		if (type === "acpt") {
			setForm(prev => {
				//  保留acpt_lang的其餘屬性，只改變acpt_lang[1].level
				const update = prev.acpt_lang;

				update[index] = {
					lang_name: name,
					level: update[index].level
				};

				return {
					...prev,
					acpt_lang: update
				};
			});
		} else {
			setForm(prev => {
				const update = prev.offer_lang;

				update[index] = {
					lang_name: name,
					level: update[index].level
				};

				return {
					...prev,
					offer_lang: update
				};
			});
		}
	};

	const validateCol = async ({ type, value }) => {
		if (type === "email") {
			try {
				const response = await checkEmail(value);
				if (errorCode !== 0) {
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
				}
			} catch (error) {
				console.error(error);
				setMsg("Server error");
			}
		} else if (type === "username") {
			try {
				const response = await checkUserName(value);
				if (errorCode !== 0) {
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
				}
			} catch (error) {
				console.error(error);
				setMsg("Server error");
			}
		} else {
			const passwordRegx =
				/^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,15}$/;
			if (!passwordRegx.test(value)) {
				setStatus(prev => ({
					...prev,
					username: {
						status: false,
						msg: "Password must be 6-15 characters, contain both alphanumeric and a special characters (!@#$%^&*)."
					}
				}));
			} else {
				setStatus(prev => ({
					...prev,
					username: {
						status: true,
						msg: "Password is available."
					}
				}));
			}
		}
	};

	const submit = async () => {
		try {
			const response = await registerUser(form);

			if (response.data.errorCode === 0) {
				navigate("/uploadAvatar");
			} else {
				console.error("Server error");
			}
		} catch (error) {
			console.error(error);
			setMsg("Server error");
		}
	};

	return (
		<div className="home-bg">
			<Card className="text-center">
				<Card.Body>
					<Form>
						<Form.Group className="mb-3">
							<Form.Control
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
								<Form.Text danger>{status.email.msg}</Form.Text>
							)}
							{status.email.status === true && (
								<Form.Text primary>
									{status.email.msg}
								</Form.Text>
							)}
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Control
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
								<Form.Text danger>
									{status.password.msg}
								</Form.Text>
							)}
							{status.password.status === true && (
								<Form.Text primary>
									{status.password.msg}
								</Form.Text>
							)}
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Control
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
								<Form.Text danger>
									{status.username.msg}
								</Form.Text>
							)}
							{status.username.status === true && (
								<Form.Text primary>
									{status.username.msg}
								</Form.Text>
							)}
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Control
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
						<Form.Group className="mb-3">
							<DropdownButton
								title={form.acpt_lang[0].name}
								className="mr-2">
								{allLang.map(el => {
									if (
										!form.acpt_lang.find(
											lang => lang.name === el.name
										)
									) {
										return (
											<Dropdown.Item
												key={`${el.code}-0`}
												onClick={e =>
													selectLangHandler({
														index: 0,
														name: e.target.value,
														type: "acpt"
													})
												}>
												{el.name}
											</Dropdown.Item>
										);
									}
								})}
							</DropdownButton>
							<Form.Control
								value={form.acpt_lang[0].level}
								onChange={e =>
									selectLevelHandler({
										type: "acpt",
										index: 0,
										level: e.target.value
									})
								}
								type="number"
								min="0"
								max="10"
								placeholder="Enter language level 1-10"
							/>

							<DropdownButton
								title={form.acpt_lang[1].name}
								className="mr-2">
								{allLang.map(el => {
									if (
										!form.acpt_lang.find(
											lang => lang.name === el.name
										)
									) {
										return (
											<Dropdown.Item
												key={`${el.code}-1`}
												onClick={e =>
													selectLangHandler({
														index: 1,
														name: e.target.value,
														type: "acpt"
													})
												}>
												{el.name}
											</Dropdown.Item>
										);
									}
								})}
							</DropdownButton>
							<Form.Control
								value={form.acpt_lang[1].level}
								onChange={e =>
									selectLevelHandler({
										type: "acpt",
										index: 1,
										level: e.target.value
									})
								}
								min="0"
								max="10"
								type="number"
								placeholder="Enter language level 1-10"
							/>

							<DropdownButton
								title={form.acpt_lang[2].name}
								className="mr-2">
								{allLang.map(el => {
									if (
										!form.acpt_lang.find(
											lang => lang.name === el.name
										)
									) {
										return (
											<Dropdown.Item
												key={`${el.code}-2`}
												onClick={e =>
													selectLangHandler({
														index: 2,
														name: e.target.value,
														type: "acpt"
													})
												}>
												{el.name}
											</Dropdown.Item>
										);
									}
								})}
							</DropdownButton>
							<Form.Control
								value={form.acpt_lang[2].level}
								onChange={e =>
									selectLevelHandler({
										type: "acpt",
										index: 2,
										level: e.target.value
									})
								}
								min="0"
								max="10"
								type="number"
								placeholder="Enter language level 1-10"
							/>
						</Form.Group>
						<Form.Group className="mb-3">
							<DropdownButton
								title={form.offer_lang[0].name}
								className="mr-2">
								{allLang.map(el => {
									if (
										!form.offer_lang.find(
											lang => lang.name === el.name
										)
									) {
										return (
											<Dropdown.Item
												key={`${el.code}-0`}
												onClick={e =>
													selectLangHandler({
														index: 0,
														name: e.target.value,
														type: "of"
													})
												}>
												{el.name}
											</Dropdown.Item>
										);
									}
								})}
							</DropdownButton>
							<Form.Control
								value={form.offer_lang[0].level}
								onChange={e =>
									selectLevelHandler({
										type: "acpt",
										index: 0,
										level: e.target.value
									})
								}
								type="number"
								min="0"
								max="10"
								placeholder="Enter language level 1-10"
							/>
							<DropdownButton
								title={form.offer_lang[1].name}
								className="mr-2">
								{allLang.map(el => {
									if (
										!form.offer_lang.find(
											lang => lang.name === el.name
										)
									) {
										return (
											<Dropdown.Item
												key={`${el.code}-1`}
												onClick={e =>
													selectLangHandler({
														index: 1,
														name: e.target.value,
														type: "of"
													})
												}>
												{el.name}
											</Dropdown.Item>
										);
									}
								})}
							</DropdownButton>
							<Form.Control
								value={form.offer_lang[1].level}
								onChange={e =>
									selectLevelHandler({
										type: "offer",
										index: 1,
										level: e.target.value
									})
								}
								type="number"
								min="0"
								max="10"
								placeholder="Enter language level 1-10"
							/>
							<DropdownButton
								title={form.offer_lang[2].name}
								className="mr-2">
								{allLang.map(el => {
									if (
										!form.offer_lang.find(
											lang => lang.name === el.name
										)
									) {
										return (
											<Dropdown.Item
												key={`${el.code}-2`}
												onClick={e =>
													selectLangHandler({
														index: 2,
														name: e.target.value,
														type: "of"
													})
												}>
												{el.name}
											</Dropdown.Item>
										);
									}
								})}
							</DropdownButton>
							<Form.Control
								value={form.offer_lang[2].level}
								onChange={e =>
									selectLevelHandler({
										type: "offer",
										index: 2,
										level: e.target.value
									})
								}
								type="number"
								min="0"
								max="10"
								placeholder="Enter language level 1-10"
							/>
						</Form.Group>
						<Button onClick={submit} variant="light" type="button">
							Submit
						</Button>
						{msg && (
							<Form.Text id="passwordHelpBlock" danger>
								{msg}
							</Form.Text>
						)}
					</Form>
				</Card.Body>
			</Card>
		</div>
	);
};

export default Register;
