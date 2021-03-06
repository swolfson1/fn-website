import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import API from '../../api/API';
import {
	validateEmail,
	validatePassword,
	validatePasswords,
	validateIsNonEmtpy,
	formParams
} from '../../lib/js/formHelpers';
import Button from '../Button';
import Label from '../Label';

import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
	form: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		alignItems: 'center'
	},
	singleRowForm: {
		display: 'flex'
	},
	multiRowFormElement: {
		display: 'flex',
		flexDirection: 'column',
		width: '250px',
		margin: '20px 0px 20px 0'
	},
	singleRowInput:{
		padding: '15px 111px 15px 17px',
		borderRadius: '100px'
	}
});

export default function Auth({
	data,
	formId,
	showPlaceholder = false,
	showLabel = true,
	actionLabel = 'Submit',
	displayType = 'multiRow'
}) {
	const classes = useStyles();
	const [ form, setValues ] = useState(data);
	const [ isLoading, setIsLoading ] = useState({});
	const [ errors, setErrors ] = useState({});

	const formRowClassName = displayType === 'multiRow' ? classes.multiRowFormElement : '';
	const formInputClassName = displayType === 'singleRow' ? classes.singleRowInput: '' ;

	function validateForm() {
		const isValid = (key) => formParams[key]['isValid'](form);
		return Object.keys(data).every(isValid);
	}

	function handleFieldChange(e) {
		const value = e.target.value;
		setValues({
			...form,
			[e.target.name]: e.target.value
		});
	}

	function handleSubmit(event) {
		event.preventDefault();
		const isValid = validateForm();
		if (!isValid) return;
		try {
			API.auth(formId, form).then().catch((e) => console.log(e));
		} catch (error) {
			console.log(error);
		}
	}
	function RenderInputValue(inputKey, index) {
		const formInputValue = form[inputKey];
		const { label, type } = formParams[inputKey];
		let autofocus = false;
		let placeholder = showPlaceholder ? label : '';

		if (index === 0) autofocus = true;
		return (
			<div key={inputKey} className={formRowClassName}>
				{showLabel && <Label label={label} value={inputKey} htmlFor={inputKey} />}
				{type ? (
					<input
						value={formInputValue}
						name={inputKey}
						type={inputKey}
						onChange={handleFieldChange}
						autoFocus={autofocus}
						placeholder={label}
						className={formInputClassName}
					/>
				) : (
					<input
						value={formInputValue}
						name={inputKey}
						onChange={handleFieldChange}
						autoFocus={autofocus}
						placeholder={label}
						className={formInputClassName}
					/>
				)}
			</div>
		);
	}

	const listItems = Object.keys(data).map(RenderInputValue);
	const formClassName = displayType === 'multiRow' ? classes.singleform : classes.singleRowForm;

	return (
		<form onSubmit={handleSubmit} className={formClassName}>
			{listItems}
			<Button type="secondary" isDisabled={!validateForm()} isLoading={isLoading} label={actionLabel} />
		</form>
	);
}
