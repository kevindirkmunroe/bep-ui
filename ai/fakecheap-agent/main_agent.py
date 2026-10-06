import asyncio
import json
from pathlib import Path

from dotenv import load_dotenv

from google.adk.agents import Agent
from google.adk.runners import InMemoryRunner
from google.adk.tools import FunctionTool

from browser_tools import (
    start_browser,
    inspect_form,
    fill_fields,
    select_option,
    finish,
)


load_dotenv(Path(__file__).with_name(".env"))


async def main():

    with open("event.json", "r") as f:
        event = json.load(f)

    await start_browser()

    agent = Agent(
        name="fakecheap_fulfillment_agent",

        model="gemini-3.5-flash-lite",

        instruction=f"""
You are an Airhorn event-promotion fulfillment agent.

You have been given this Airhorn event:

{json.dumps(event, indent=2)}

Your job is to populate the currently open event
submission form using this event data.

RULES:

FIRST call inspect_form().

Then analyze all returned controls.

Then call fill_fields() ONCE with every text field
you can confidently map.

Finally call finish().

Do not submit the form.

Your task ends when the form is ready for human review.
""",

        tools=[
            FunctionTool(inspect_form),
            FunctionTool(fill_fields),
            FunctionTool(select_option),
            FunctionTool(finish),
        ],
    )

    runner = InMemoryRunner(agent=agent)

    print("1. Starting agent")

    response = await runner.run_debug(
        "Fill the FakeCheap event submission form.",
        verbose=True
    )

    print("2. Agent finished")
    print(response)

    # Keep browser open so we can inspect the result.
    input("\nPress Enter to close...")


if __name__ == "__main__":
    asyncio.run(main())
