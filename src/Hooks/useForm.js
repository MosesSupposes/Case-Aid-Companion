import React from "react";

/**
 * This function takes an array of objects with this shape:
 * {name: string, value: string}
 * and returns a single state object that embodies and keeps track
 * of that array of objects.
 * @param {array(object)} fields
 */
export default function useForm(fields = []) {
	// This state value is a single object that embodies all of the key-value pairs from the
	// fields input (which is an array of objects).
	const [formValues, setFormValues] = React.useState(
		Object.assign(
			{},
			...fields.map(field => ({
				[field.name]: field.value
			}))
		)
	);

	const handleChange = event =>
		setFormValues({ ...formValues, [event.target.name]: event.target.value });

	return { formValues, setFormValues, handleChange };
}
