# Rasa Integration — StoryBoard

Plug your open-source chatbot brain (Rasa) straight into the StoryBoard pipeline.

---

## ⚡ Quickconnect

1. **Install Rasa:**
[Official instructions](https://rasa.com/docs/rasa/installation/)

2. **Define your storybot’s custom action:**
In your Rasa project’s `actions.py`:

```python
# actions.py
import requests
from rasa_sdk import Action

class ActionSendToStoryboard(Action):
def name(self):
return "action_send_to_storyboard"

def run(self, dispatcher, tracker, domain):
prompt = tracker.latest_message.get("text", "")
response = requests.post(
"http://localhost:3141/storyboard",
json={ "prompt": prompt }
)
output = response.json().get("output", "")
dispatcher.utter_message(text=output)
return []
Register Action:
Add action_send_to_storyboard to your domain.yml under actions:
Use as an action in your stories or rules.
🛠️ Next Level
Send richer video params to /video
Handle images/media in your Rasa bot replies
Build a full creative chat-driven storyboard UI
All open, all expandable.

For a full pipeline, make sure your Node server & Python scripts are running before calling!
