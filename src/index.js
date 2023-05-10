import { program, InvalidArgumentError } from 'commander';
import { Configuration, OpenAIApi } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

program
	.requiredOption('-a, --animal <animal name>', 'animal name')
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
const { animal, temperature } = program.opts();

const generatePrompt = (animalName) => {
	const capitalizedAnimal =
		animalName[0].toUpperCase() + animalName.slice(1).toLowerCase();
	return `Suggest three names for an animal that is a superhero.
  
  Animal: Cat
  Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
  Animal: Dog
  Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
  Animal: ${capitalizedAnimal}
  Names:`;
};

try {
	const completion = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt: generatePrompt(animal),
		temperature: temperature || 0
	});
	console.log(completion.data.choices[0].text);
} catch (error) {
	if (error.response) {
		console.error(error.response.status, error.response.data);
	} else {
		console.error(`Error with OpenAI API request: ${error.message}`);
	}
}
