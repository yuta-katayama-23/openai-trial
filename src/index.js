import { program, InvalidArgumentError } from 'commander';
import { Configuration, OpenAIApi } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

program
	.option(
		'-t, --temperature [temperature]',
		'temperature',
		// eslint-disable-next-line no-unused-vars
		(value, dummyPrevious) => {
			const parsedValue = parseInt(value, 10);
			if (Number.isNaN(parsedValue))
				throw new InvalidArgumentError('Not a number.');
			return parsedValue;
		}
	)
	.parse(process.argv);
const { temperature } = program.opts();

const generateMessages = () => [
	{ role: 'system', content: 'You are a helpful assistant.' },
	{ role: 'user', content: 'Who won the world series in 2020?' },
	{
		role: 'assistant',
		content: 'The Los Angeles Dodgers won the World Series in 2020.'
	},
	{ role: 'user', content: 'Where was it played?' }
];

try {
	const completion = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: generateMessages(),
		temperature: temperature || 0
	});
	console.log(completion.data.choices[0]);
} catch (error) {
	if (error.response) {
		console.error(error.response.status, error.response.data);
	} else {
		console.error(`Error with OpenAI API request: ${error.message}`);
	}
}
