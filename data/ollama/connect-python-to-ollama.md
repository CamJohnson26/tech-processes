# Connect Python to Ollama

- Add the following dependencies to your `requirements.txt` file:
  ```
  ollama==0.1.5
  ```
- Install the dependencies:
  ```bash
  pip3 install -r requirements.txt
  ```
- Add to .env.production and .env.sample
  ```
  OLLAMA_API_ENDPOINT=http://SERVER_IP:11434
  ```
- Create an `ollama_apis` directory in your project:
  ```bash
  mkdir -p ollama_apis
  ```
- Create `run_prompt.py`
```python
import os

from dotenv import load_dotenv
from ollama import Client

load_dotenv()

DEFAULT_MODEL = 'llama3.1'  # Change to your preferred model

client = Client(
  host=os.environ.get("OLLAMA_API_ENDPOINT"),
)

def chat(prompt):
    response = client.chat(model=DEFAULT_MODEL, messages=[
      {
        'role': 'user',
        'content': prompt,
      },
    ])
    return response['message']['content']

def embed(prompt, model=DEFAULT_MODEL):
    try:
        return client.embed(model=model, input=prompt).embeddings[0]
    except Exception as e:
        print('Error calculating embeddings:', e)
        raise e
```
- Create `prompts.py`
```python
# Define your prompt templates here
# Summarization prompt
SUMMARIZATION_PROMPT = '''
Only perform this task, don't comment or say anything other than the raw answer.
Provide a concise summary of the following text:

{text}
'''
```
- Create `chain_prompt.py`
```python
from ollama_apis.run_prompt import chat

CHAR_LIMIT = 5000

def summarize_long_text_recursive(text, prompt, char_limit=CHAR_LIMIT):
    summary = ''
    for i in range(0, len(text), char_limit):
        print(f'Summarize. Processing {i+1} of {len(text)}')
        subtext = text[i:i+char_limit]
        new_summary = chat(prompt + '\n' + subtext)
        summary += '\n' + new_summary
    if len(summary) > char_limit:
        print('Still too long, going again')
        summarize_long_text_recursive(summary, prompt, char_limit=char_limit)
    return summary
```
- Use in your application
```python
from ollama_apis.run_prompt import chat
from ollama_apis.chain_prompt import SUMMARIZATION_PROMPT

# Format the prompt with the text
prompt = SUMMARIZATION_PROMPT.format(text=text)

# Get summary from Ollama
summary = chat(prompt)
```